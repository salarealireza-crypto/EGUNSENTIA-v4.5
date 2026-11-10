from pathlib import Path


def replace_once(source: str, old: str, new: str, label: str) -> str:
    if new in source:
        print(f"Already applied: {label}")
        return source
    count = source.count(old)
    if count != 1:
        raise SystemExit(
            f"Refusing to patch play.ts: expected exactly one target for {label}, found {count}"
        )
    print(f"Applied: {label}")
    return source.replace(old, new, 1)


play = Path("src/lib/game/play.ts")
if not play.is_file():
    raise SystemExit("Refusing to patch: src/lib/game/play.ts is missing")
source = play.read_text(encoding="utf-8")
original = source

old_import = 'import { getPlayerWomenCanonProfiles, PRIVATE_RELATIONS_ROSTER_GAPS } from "./sim/private-relations.ts";'
new_import = 'import { defaultPrivateRelationsState, getPlayerWomenCanonProfiles, PRIVATE_RELATIONS_ROSTER_GAPS } from "./sim/private-relations.ts";'
source = replace_once(source, old_import, new_import, "import default private-relationship baselines")

old_profile_map = '  const privateProfileById = new Map(privateRoster.map((person) => [person.id, person]));'
new_profile_map = '''  const defaultRelationshipById = new Map(
    defaultPrivateRelationsState().relationships.map((item) => [item.personId, item]),
  );'''
source = replace_once(source, old_profile_map, new_profile_map, "build default relationship lookup")

private_start = source.find('    privateRelations: {\n', source.find("export function compactState()"))
private_end = source.find('\n    pregnancyRecords:', private_start)
if private_start < 0 or private_end < 0:
    raise SystemExit("Refusing to patch play.ts: privateRelations projection boundaries were not found")
old_private_block = source[private_start:private_end]
if 'rosterFormat: "Each roster row:' in old_private_block:
    print("Already applied: compact expanded private-relations projection")
else:
    new_private_block = '''    privateRelations: {
      // The roster is compact but complete; character-card details are retrieved when a person is named.
      rosterFormat: "Each roster row: personId|name|ageYears|category|sourceStatus|relationshipEligible|powerReviewRequired|baseRelationshipStatus|baseVisibility; booleans are 1/0.",
      roster: privateRoster.map((person) => {
        const baseline = defaultRelationshipById.get(person.id);
        return [
          person.id,
          person.name,
          person.ageYears,
          person.category,
          person.sourceStatus ?? "UNKNOWN",
          person.relationshipEligible ? 1 : 0,
          person.powerReviewRequired ? 1 : 0,
          person.relationshipStatus,
          baseline?.visibility ?? "private",
        ].join("|");
      }),
      relationshipPolicy: "Apply relationship override rows over each roster row's base status and visibility.",
      relationshipFields: "personId|status|visibility|lastEventId|note",
      // Source-backed facts are retained as lore only, never as live consent or relationship state.
      canonRelationshipNotes: privateRoster
        .filter((person) => ["dagmar-red", "adelheid-von-moren", "vera-grotsen", "elara-red", "hanne-brauer", "wilhelmina-red"].includes(person.id))
        .map((person) => ({
          personId: person.id,
          name: person.name,
          note: compactText(person.relationships, 110),
          interpretation: "Lore only; never evidence of present consent or relationship status.",
        })),
      rosterGaps: PRIVATE_RELATIONS_ROSTER_GAPS.map((gap) => compactText(gap, 110)),
      // The roster carries baseline status/visibility; preserve every actual deviation compactly.
      relationships: g.privateRelations.relationships
        .filter((item) => {
          const baseline = defaultRelationshipById.get(item.personId);
          return !baseline
            || item.status !== baseline.status
            || item.visibility !== baseline.visibility
            || item.lastEventId !== baseline.lastEventId
            || item.note !== baseline.note;
        })
        .map((item) => [
          item.personId,
          item.status,
          item.visibility,
          item.lastEventId ?? "",
          compactText(item.note, 90).replace(/[|\\r\\n]/g, " "),
        ].join("|")),
      requests: g.privateRelations.requests.slice(-8).map((item) => ({
        id: compactText(item.id, 80),
        personId: item.personId,
        kind: item.kind,
        status: item.status,
        dayIndex: item.dayIndex,
        time: compactText(item.time, 20),
        responseNote: compactText(item.responseNote, 80),
        consentEvidence: compactText(item.consentEvidence, 80),
        freeToDeclineConfirmed: item.freeToDeclineConfirmed,
        independentSafeguard: item.independentSafeguard,
        independentSafeguardEvidence: compactText(item.independentSafeguardEvidence, 80),
      })),
      consequences: g.privateRelations.consequences
        .filter((item) => item.status !== "resolved")
        .slice(0, 8)
        .map((item) => ({
          id: item.id,
          kind: item.kind,
          title: compactText(item.title, 90),
          detail: compactText(item.detail, 130),
          dayIndex: item.dayIndex,
          status: item.status,
          audiences: item.audiences.slice(0, 5),
          requiredReview: compactText(item.requiredReview, 90),
        })),
    },'''
    source = source[:private_start] + new_private_block + source[private_end:]
    print("Applied: compact expanded private-relations projection")

old_catch = '''  } catch (err) {
    console.error("[play] state preparation failed", err);
    const message =
      "The current campaign state could not be prepared for the archive. No AI request was sent; your saved campaign remains unchanged.";
    useGame.getState().setBusy(false);
    useGame.getState().setError(message);
    useGame.getState().setFailedAction(text);
    useGame.getState().markLastPlayerFailed(true);
    useGame.getState().pushNote(message);
    useGame.getState().setNotice(message);
    return;
  }'''
new_catch = '''  } catch (err) {
    console.error("[play] state preparation failed", err);
    const detail = err instanceof Error ? err.message.slice(0, 180) : "Unknown preparation error";
    const message = `The campaign state could not be prepared for the archive (${detail}). No AI request was sent; your saved campaign remains unchanged.`;
    useGame.getState().setBusy(false);
    useGame.getState().setError(message);
    useGame.getState().setFailedAction(text);
    useGame.getState().markLastPlayerFailed(true);
    return;
  }'''
source = replace_once(source, old_catch, new_catch, "show one precise preflight error without duplicate notices")

if source != original:
    play.write_text(source, encoding="utf-8")
    print("Updated src/lib/game/play.ts")
else:
    print("No source changes were needed")
