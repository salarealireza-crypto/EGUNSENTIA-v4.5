#!/usr/bin/env python3
"""Read-only EGUNSENTIA Stage 47 Round 2 audit helper.

Reads existing Canon cards, Private Relations roster, and Red Claw household
registry. It does not mutate game data, saves, or Canon and never promotes
PROPOSED_EXPANSION material.
"""
from __future__ import annotations
import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

cards = json.loads((ROOT / "src/lib/canon/cards.json").read_text(encoding="utf-8"))
registry = json.loads((ROOT / "src/lib/canon/red-claw-household.json").read_text(encoding="utf-8"))
source = (ROOT / "src/lib/game/sim/private-relations.ts").read_text(encoding="utf-8")
start = source.index("const WOMEN = [")
end = source.index("] as const;", start)
chunk = source[start:end]
pattern = r'\{ id: "([^"]+)", card: "([^"]+)", name: "([^"]+)", age: (\d+), category: "([^"]+)", status: "([^"]+)", eligible: (true|false), power: (true|false)(?:, visibility: "([^"]+)"|)(?:, sourceStatus: "([^"]+)"|) \}'
rows = re.findall(pattern, chunk)
assert len(rows) == 37, f"Expected 25 core + 12 proposed rows; got {len(rows)}"
core, proposed = rows[:25], rows[25:]
card_map = {card["name"]: card for card in cards}
for row in core:
    assert row[1] in card_map, f"Core PR character card missing: {row[1]}"

fields = ["LOOK", "BODY", "VOICE", "TELLS", "IN CRISIS", "HANDLE", "WANTS", "FEARS", "DAY", "NEVER", "SAMPLE LINES", "SECRET", "KNOWS", "RELATIONS", "HOOKS"]
coverage = Counter()
full_profiles = 0
body_present = 0
for row in core:
    present = {key for key, value in card_map[row[1]]["fields"].items() if str(value).strip()}
    for field in fields:
        if field in present:
            coverage[field] += 1
    full_profiles += len(present.intersection(fields)) == len(fields)
    body_present += "BODY" in present

additional = ["COUNTESS SERAPHINE VON ASCHEN, 33", "DELEGATE JOHANNA WEISS, 38"]
for name in additional:
    assert name in card_map, f"Additional adult-woman Canon card missing: {name}"

all_women = [row[1] for row in core] + additional
expanded_complete = 0
expanded_body_present = 0
for card_name in all_women:
    present = {key for key, value in card_map[card_name]["fields"].items() if str(value).strip()}
    expanded_complete += len(present.intersection(fields)) == len(fields)
    expanded_body_present += "BODY" in present

reg_cards = registry["cards"]
reg_map = {card["id"]: card for card in reg_cards}
status_counts = Counter(card.get("sourceStatus", "UNLABELLED") for card in reg_cards)
dangling = []
reciprocal = []
for card in reg_cards:
    cid = card["id"]
    for parent in card.get("parents") or []:
        if parent not in reg_map:
            dangling.append((cid, "parent", parent))
        elif cid not in (reg_map[parent].get("childIds") or []):
            reciprocal.append((cid, "parent-child", parent))
    for child in card.get("childIds") or []:
        if child not in reg_map:
            dangling.append((cid, "child", child))
        elif cid not in (reg_map[child].get("parents") or []):
            reciprocal.append((cid, "child-parent", child))
    for spouse in card.get("spouseIds") or []:
        if spouse not in reg_map:
            dangling.append((cid, "spouse", spouse))
        elif cid not in (reg_map[spouse].get("spouseIds") or []):
            reciprocal.append((cid, "spouse", spouse))
    for sibling in card.get("siblings") or []:
        if sibling not in reg_map:
            dangling.append((cid, "sibling", sibling))
        elif cid not in (reg_map[sibling].get("siblings") or []):
            reciprocal.append((cid, "sibling", sibling))

print(f"compiled_cards={len(cards)}")
print(f"private_relations_rows={len(rows)} core={len(core)} proposed={len(proposed)}")
print(f"female_adult_cards_in_audit_scope={len(core) + len(additional)} (25 core + 2 outside core roster)")
print(f"core_15_field_complete={full_profiles}/25 body_present={body_present}/25")
print(f"audited_27_15_field_complete={expanded_complete}/27 body_present={expanded_body_present}/27")
print(f"red_claw_registry_cards={len(reg_cards)} unique_ids={len(reg_map)} unique_names={len({x.get('name') for x in reg_cards})}")
print(f"source_status={dict(status_counts)}")
print(f"graph_dangling_references={len(dangling)}")
print(f"graph_reciprocity_mismatches={len(reciprocal)}")
if dangling or reciprocal:
    raise SystemExit(1)
print("ROUND2_READ_ONLY_AUDIT=PASS (structural checks only; not Canon-edge verification)")
