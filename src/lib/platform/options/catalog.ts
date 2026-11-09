import { materializeCatalog } from "./effects";

const RAW_CATALOG = {
  "10": [
    {
      "id": "10-OPT-01",
      "panelId": "10",
      "title": "Read the forty-two line index",
      "summary": "Prerequisite: Captain Jarek Novak's map is current. Engineering: forty-two lines, and only the mapped ones are real.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The tunnel index is read and no line is redrawn."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.tunnels",
        "animationId": "map.pulse"
      },
      "sfx": "confirm",
      "advisorId": "Engineering"
    },
    {
      "id": "10-OPT-02",
      "panelId": "10",
      "title": "Send Jarek Novak down Line West",
      "summary": "Prerequisite: a scout team is free of other posts. Engineering: Jarek walks it. The map waits.",
      "category": "Order",
      "costs": {
        "marks": 90,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "A west-line scout is ordered and not yet returned."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.tunnels",
        "animationId": "map.pulse"
      },
      "sfx": "confirm",
      "advisorId": "Engineering"
    },
    {
      "id": "10-OPT-03",
      "panelId": "10",
      "title": "Mark the collapsed stair",
      "summary": "Prerequisite: a collapse was reported and not yet mapped. Engineering: a mark is not a repair.",
      "category": "Delegate",
      "costs": {
        "marks": 40,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The stair is marked closed until a second look."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.tunnels",
        "animationId": "map.pulse"
      },
      "sfx": "confirm",
      "advisorId": "Engineering"
    },
    {
      "id": "10-OPT-04",
      "panelId": "10",
      "title": "Hold traffic on the south rail spur",
      "summary": "Prerequisite: the domestic spur is inside the tunnels. Engineering: the south rail feeds us. It does not leave the city.",
      "category": "Invest",
      "costs": {
        "marks": 60,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "Spur traffic waits; the northern external rail is untouched."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.tunnels",
        "animationId": "map.pulse"
      },
      "sfx": "confirm",
      "advisorId": "Engineering"
    },
    {
      "id": "10-OPT-05",
      "panelId": "10",
      "title": "Compare the tunnel account to Stores",
      "summary": "Prerequisite: both ledgers are in the room. Engineering: if Stores and the tunnel disagree, both stay on the page.",
      "category": "Investigate",
      "costs": {
        "marks": 20,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The two counts are set side by side without a forced match."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.tunnels",
        "animationId": "map.pulse"
      },
      "sfx": "confirm",
      "advisorId": "Engineering"
    }
  ],
  "11": [
    {
      "id": "11-OPT-01",
      "panelId": "11",
      "title": "Read the northern three-line rail note",
      "summary": "Prerequisite: the external rail report is filed. Treasury Minister: three lines north. Nothing else leaves.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The only outside rail is read as it stands."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.projects",
        "animationId": "queue.flow"
      },
      "sfx": "confirm",
      "advisorId": "Treasury Minister"
    },
    {
      "id": "11-OPT-02",
      "panelId": "11",
      "title": "Fund a Mark IV repair berth",
      "summary": "Prerequisite: Hans Kessler has a suit waiting on the rack. Treasury Minister: suits are repaired. They are never multiplied.",
      "category": "Order",
      "costs": {
        "marks": 200,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "Marks are set aside for one berth, not a new suit."
        ],
        "unknownEffects": []
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.projects",
        "animationId": "queue.flow"
      },
      "sfx": "confirm",
      "advisorId": "Treasury Minister"
    },
    {
      "id": "11-OPT-03",
      "panelId": "11",
      "title": "Ask Florian Kessler about the energy circle",
      "summary": "Prerequisite: the circle is staffed today. Treasury Minister: Florian sells hours, not miracles.",
      "category": "Delegate",
      "costs": {
        "marks": 40,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Coil time is requested, not seized."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.projects",
        "animationId": "queue.flow"
      },
      "sfx": "confirm",
      "advisorId": "Treasury Minister"
    },
    {
      "id": "11-OPT-04",
      "panelId": "11",
      "title": "Price ash-iron against Stores",
      "summary": "Prerequisite: a quote is requested and not forced. Treasury Minister: ash-iron moves when both sides name it.",
      "category": "Invest",
      "costs": {
        "marks": 30,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A price is asked; the shelf is not emptied."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.projects",
        "animationId": "queue.flow"
      },
      "sfx": "confirm",
      "advisorId": "Treasury Minister"
    },
    {
      "id": "11-OPT-05",
      "panelId": "11",
      "title": "Trace a missing trade crate",
      "summary": "Prerequisite: the manifest names a crate that did not arrive. Treasury Minister: lost is not the same as stolen.",
      "category": "Investigate",
      "costs": {
        "marks": 25,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The missing crate is traced, not written off as theft yet."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.projects",
        "animationId": "queue.flow"
      },
      "sfx": "confirm",
      "advisorId": "Treasury Minister"
    },
    {
      "id": "11-OPT-06",
      "panelId": "11",
      "title": "Wait on the Grotsen caravan window",
      "summary": "Prerequisite: the Dominion has named a day. Treasury Minister: Grotsen time is theirs until they are late.",
      "category": "Wait",
      "costs": {
        "marks": 0,
        "hours": 7,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "No counter is sent before their window."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": true,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.projects",
        "animationId": "queue.flow"
      },
      "sfx": "confirm",
      "advisorId": "Treasury Minister"
    },
    {
      "id": "11-OPT-07",
      "panelId": "11",
      "title": "Open talks with Countess Seraphine",
      "summary": "Prerequisite: Monarchia is the lawful channel. Treasury Minister: Seraphine speaks for houses, not for grain.",
      "category": "Negotiate",
      "costs": {
        "marks": 80,
        "hours": 8,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "A talk is opened; no treaty is signed."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.projects",
        "animationId": "queue.flow"
      },
      "sfx": "confirm",
      "advisorId": "Treasury Minister"
    },
    {
      "id": "11-OPT-08",
      "panelId": "11",
      "title": "Review the treasury seal with the minister",
      "summary": "Prerequisite: the minister is present. Treasury Minister: the seal stays in this room.",
      "category": "Order",
      "costs": {
        "marks": 10,
        "hours": 9,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The seal is checked and not loaned out."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.projects",
        "animationId": "queue.flow"
      },
      "sfx": "confirm",
      "advisorId": "Treasury Minister"
    }
  ],
  "12": [
    {
      "id": "12-OPT-01",
      "panelId": "12",
      "title": "Read the standing order board",
      "summary": "Prerequisite: the board is posted and current. Command Staff: what is posted is what the gates obey.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Standing orders are read, not amended."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.orders",
        "animationId": "queue.flow"
      },
      "sfx": "confirm",
      "advisorId": "Command Staff"
    },
    {
      "id": "12-OPT-02",
      "panelId": "12",
      "title": "Amend the North Gate watch order",
      "summary": "Prerequisite: the gate captain can hear the change. Command Staff: the North Gate is our door to the living.",
      "category": "Order",
      "costs": {
        "marks": 40,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The North Gate order changes only in the written line."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.orders",
        "animationId": "queue.flow"
      },
      "sfx": "confirm",
      "advisorId": "Command Staff"
    },
    {
      "id": "12-OPT-03",
      "panelId": "12",
      "title": "Delegate East Gate relief to Rask",
      "summary": "Prerequisite: Marshal Gerhard Rask is in the city. Command Staff: Rask takes the gate, not the Fist.",
      "category": "Delegate",
      "costs": {
        "marks": 50,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Relief is delegated; command is not surrendered."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.orders",
        "animationId": "queue.flow"
      },
      "sfx": "confirm",
      "advisorId": "Command Staff"
    },
    {
      "id": "12-OPT-04",
      "panelId": "12",
      "title": "Stock the gate kits from Stores",
      "summary": "Prerequisite: Stores can spare a kit. Command Staff: a gate without kits is a speech.",
      "category": "Invest",
      "costs": {
        "marks": 70,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "Kits are drawn against the Stores count."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.orders",
        "animationId": "queue.flow"
      },
      "sfx": "confirm",
      "advisorId": "Command Staff"
    },
    {
      "id": "12-OPT-05",
      "panelId": "12",
      "title": "Check which order names a dead post",
      "summary": "Prerequisite: a post is vacant on the board. Command Staff: a dead name on a board is a lie.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Vacant posts are listed and not quietly refilled."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.orders",
        "animationId": "queue.flow"
      },
      "sfx": "confirm",
      "advisorId": "Command Staff"
    }
  ],
  "13": [
    {
      "id": "13-OPT-01",
      "panelId": "13",
      "title": "Read the Iron Guard night book",
      "summary": "Prerequisite: Elara has closed the watch. Elara Red: five names. If a sixth appears, it is a forgery.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The night book is read under her seal."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.blacklayer",
        "animationId": "redact.reveal"
      },
      "sfx": "confirm",
      "advisorId": "Elara Red"
    },
    {
      "id": "13-OPT-02",
      "panelId": "13",
      "title": "Task Mira Voss to the gallery",
      "summary": "Prerequisite: Mira is not on a close post. Elara Red: Mira shoots when the order is already written.",
      "category": "Order",
      "costs": {
        "marks": 60,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "A gallery watch is tasked, not a public hunt."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.blacklayer",
        "animationId": "redact.reveal"
      },
      "sfx": "confirm",
      "advisorId": "Elara Red"
    },
    {
      "id": "13-OPT-03",
      "panelId": "13",
      "title": "Send Sigrid Falk with the Fist's route",
      "summary": "Prerequisite: a movement is already planned. Elara Red: Sigrid walks where you walk. She does not choose the walk.",
      "category": "Delegate",
      "costs": {
        "marks": 40,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Close protection is assigned to a real route."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.blacklayer",
        "animationId": "redact.reveal"
      },
      "sfx": "confirm",
      "advisorId": "Elara Red"
    },
    {
      "id": "13-OPT-04",
      "panelId": "13",
      "title": "Buy a whisper in the Underrows",
      "summary": "Prerequisite: a named speaker is already known. Elara Red: paid words are not witnesses.",
      "category": "Invest",
      "costs": {
        "marks": 90,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "One whisper is bought and tagged as paid speech."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.blacklayer",
        "animationId": "redact.reveal"
      },
      "sfx": "confirm",
      "advisorId": "Elara Red"
    },
    {
      "id": "13-OPT-05",
      "panelId": "13",
      "title": "Compare two contradictory scout lines",
      "summary": "Prerequisite: both lines are already filed. Elara Red: two stories mean we do not have one yet.",
      "category": "Investigate",
      "costs": {
        "marks": 20,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The contradiction is marked and neither line is deleted."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.blacklayer",
        "animationId": "redact.reveal"
      },
      "sfx": "confirm",
      "advisorId": "Elara Red"
    }
  ],
  "14": [
    {
      "id": "14-OPT-01",
      "panelId": "14",
      "title": "Inspect a Mark IV on the rack",
      "summary": "Prerequisite: Hans Kessler has the suit keyed to the bench. Master Armorer: the Mark IV on the rack is the one we have.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "One suit is inspected; none are copied."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.tech",
        "animationId": "gear.turn"
      },
      "sfx": "confirm",
      "advisorId": "Master Armorer"
    },
    {
      "id": "14-OPT-02",
      "panelId": "14",
      "title": "Order a seal replacement",
      "summary": "Prerequisite: a cracked seal is on the bench. Master Armorer: a new seal is not a new warrior.",
      "category": "Order",
      "costs": {
        "marks": 150,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "A replacement seal is ordered for that suit alone."
        ],
        "unknownEffects": []
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.tech",
        "animationId": "gear.turn"
      },
      "sfx": "confirm",
      "advisorId": "Master Armorer"
    },
    {
      "id": "14-OPT-03",
      "panelId": "14",
      "title": "Ask Florian Kessler for coil time",
      "summary": "Prerequisite: the energy circle has a free bench. Master Armorer: Florian's coils keep the racks alive.",
      "category": "Delegate",
      "costs": {
        "marks": 80,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Coil time is requested from the circle."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.tech",
        "animationId": "gear.turn"
      },
      "sfx": "confirm",
      "advisorId": "Master Armorer"
    },
    {
      "id": "14-OPT-04",
      "panelId": "14",
      "title": "Queue the suits already in repair",
      "summary": "Prerequisite: the repair list is written. Master Armorer: what is already broken gets the hours.",
      "category": "Invest",
      "costs": {
        "marks": 40,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The existing repair queue is ordered, not expanded by invention."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.tech",
        "animationId": "gear.turn"
      },
      "sfx": "confirm",
      "advisorId": "Master Armorer"
    },
    {
      "id": "14-OPT-05",
      "panelId": "14",
      "title": "Hear Ulrich Venn's survey",
      "summary": "Prerequisite: the Survey Circle has a sheet. Master Armorer: Venn measures. He does not promise ore.",
      "category": "Investigate",
      "costs": {
        "marks": 20,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The survey is heard before any dig is ordered."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.tech",
        "animationId": "gear.turn"
      },
      "sfx": "confirm",
      "advisorId": "Master Armorer"
    },
    {
      "id": "14-OPT-06",
      "panelId": "14",
      "title": "Wait on furnace heat for the weld",
      "summary": "Prerequisite: Ludek Prask has not cleared the heat. Master Armorer: cold metal does not take a lie.",
      "category": "Wait",
      "costs": {
        "marks": 0,
        "hours": 7,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The weld waits on the furnace, not on a speech."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": true,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.tech",
        "animationId": "gear.turn"
      },
      "sfx": "confirm",
      "advisorId": "Master Armorer"
    },
    {
      "id": "14-OPT-07",
      "panelId": "14",
      "title": "Bargain with Stores for spare plate",
      "summary": "Prerequisite: Ilona Brandt can release plate. Master Armorer: plate that feeds no one still has to be paid for.",
      "category": "Negotiate",
      "costs": {
        "marks": 100,
        "hours": 8,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "Plate is bargained, not seized from the ration shelf."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.tech",
        "animationId": "gear.turn"
      },
      "sfx": "confirm",
      "advisorId": "Master Armorer"
    },
    {
      "id": "14-OPT-08",
      "panelId": "14",
      "title": "Review who may inherit a suit",
      "summary": "Prerequisite: an heir is near the age when elders hand armor down. Master Armorer: elders hand the suit. The rack does not grow.",
      "category": "Order",
      "costs": {
        "marks": 15,
        "hours": 9,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Inheritance is reviewed against the living roll."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.tech",
        "animationId": "gear.turn"
      },
      "sfx": "confirm",
      "advisorId": "Master Armorer"
    }
  ],
  "15": [
    {
      "id": "15-OPT-01",
      "panelId": "15",
      "title": "Read the Latch report",
      "summary": "Prerequisite: Ansgar Red has sent a surface note. Ansgar Red: the Latch is a door. Treat it like one.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The Latch report is read as a surface claim."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "surface.latch",
        "animationId": "latch.seal"
      },
      "sfx": "confirm",
      "advisorId": "Ansgar Red"
    },
    {
      "id": "15-OPT-02",
      "panelId": "15",
      "title": "Seal the North Gate collar",
      "summary": "Prerequisite: a surface alarm is already active. Ansgar Red: shut the collar before you debate the ash.",
      "category": "Order",
      "costs": {
        "marks": 80,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "The collar is ordered shut against the alarm."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "surface.latch",
        "animationId": "latch.seal"
      },
      "sfx": "confirm",
      "advisorId": "Ansgar Red"
    },
    {
      "id": "15-OPT-03",
      "panelId": "15",
      "title": "Send Ilka Red to redraw the ash map",
      "summary": "Prerequisite: Ilka is free to scout. Ansgar Red: Ilka draws what she walks, not what we fear.",
      "category": "Delegate",
      "costs": {
        "marks": 70,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "A redraw is ordered; the old map stays until she returns."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "surface.latch",
        "animationId": "latch.seal"
      },
      "sfx": "confirm",
      "advisorId": "Ansgar Red"
    },
    {
      "id": "15-OPT-04",
      "panelId": "15",
      "title": "Stock cleanser kits with Maren Red",
      "summary": "Prerequisite: Maren has named a shortage. Ansgar Red: Maren counts radiation. Believe the count.",
      "category": "Invest",
      "costs": {
        "marks": 90,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "Cleanser kits are drawn for the surface watch."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "surface.latch",
        "animationId": "latch.seal"
      },
      "sfx": "confirm",
      "advisorId": "Ansgar Red"
    },
    {
      "id": "15-OPT-05",
      "panelId": "15",
      "title": "Log monster pressure without a hunt",
      "summary": "Prerequisite: a sighting is already reported. Ansgar Red: a sighting is not a season.",
      "category": "Investigate",
      "costs": {
        "marks": 15,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Pressure is logged and no hunt is declared."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "surface.latch",
        "animationId": "latch.seal"
      },
      "sfx": "confirm",
      "advisorId": "Ansgar Red"
    }
  ],
  "16": [
    {
      "id": "16-OPT-01",
      "panelId": "16",
      "title": "Read Adelheid's Monarchia brief",
      "summary": "Prerequisite: she has written the brief. Adelheid von Moren: Monarchia hears tone before it hears terms.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The brief is read before any reply is sent."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.diplomacy",
        "animationId": "paper.unfold"
      },
      "sfx": "confirm",
      "advisorId": "Adelheid von Moren"
    },
    {
      "id": "16-OPT-02",
      "panelId": "16",
      "title": "Answer Countess Seraphine von Aschen",
      "summary": "Prerequisite: a letter with her seal is on the desk. Adelheid von Moren: Seraphine collects slights the way others collect grain.",
      "category": "Order",
      "costs": {
        "marks": 40,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A reply is drafted and not yet a promise."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.diplomacy",
        "animationId": "paper.unfold"
      },
      "sfx": "confirm",
      "advisorId": "Adelheid von Moren"
    },
    {
      "id": "16-OPT-03",
      "panelId": "16",
      "title": "Ask Bettina to seat the envoy",
      "summary": "Prerequisite: Bettina is on hospitality. Adelheid von Moren: Bettina knows which chair is an insult.",
      "category": "Delegate",
      "costs": {
        "marks": 20,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Seating is asked, not a treaty."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.diplomacy",
        "animationId": "paper.unfold"
      },
      "sfx": "confirm",
      "advisorId": "Adelheid von Moren"
    },
    {
      "id": "16-OPT-04",
      "panelId": "16",
      "title": "Offer a vault gift, not a concession",
      "summary": "Prerequisite: the gift is already in the personal vault. Adelheid von Moren: a gift ends a sentence. It does not end a border.",
      "category": "Invest",
      "costs": {
        "marks": 120,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "A gift leaves the vault; no border moves."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.diplomacy",
        "animationId": "paper.unfold"
      },
      "sfx": "confirm",
      "advisorId": "Adelheid von Moren"
    },
    {
      "id": "16-OPT-05",
      "panelId": "16",
      "title": "Check Grotsen wording with Vera",
      "summary": "Prerequisite: Vera Grotsen can read Dominion phrasing. Adelheid von Moren: Vera hears Grotsen in the commas.",
      "category": "Investigate",
      "costs": {
        "marks": 10,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Wording is checked with the third wife before it is sent."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.diplomacy",
        "animationId": "paper.unfold"
      },
      "sfx": "confirm",
      "advisorId": "Adelheid von Moren"
    },
    {
      "id": "16-OPT-06",
      "panelId": "16",
      "title": "Wait for Johanna Weiss of the Demos",
      "summary": "Prerequisite: no Forum reply has come. Adelheid von Moren: the Forum's delay is still an answer of a kind.",
      "category": "Wait",
      "costs": {
        "marks": 0,
        "hours": 7,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The desk waits; no false reply is invented."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": true,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.diplomacy",
        "animationId": "paper.unfold"
      },
      "sfx": "confirm",
      "advisorId": "Adelheid von Moren"
    },
    {
      "id": "16-OPT-07",
      "panelId": "16",
      "title": "Open a corridor talk with Envoy Bohdan",
      "summary": "Prerequisite: the Survivors asked for a table. Adelheid von Moren: Bohdan wants a road. We have not given him one.",
      "category": "Negotiate",
      "costs": {
        "marks": 60,
        "hours": 8,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "A corridor talk is opened, not a recognition."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.diplomacy",
        "animationId": "paper.unfold"
      },
      "sfx": "confirm",
      "advisorId": "Adelheid von Moren"
    },
    {
      "id": "16-OPT-08",
      "panelId": "16",
      "title": "Review feud language before it is spoken",
      "summary": "Prerequisite: Adelheid has flagged a phrase. Adelheid von Moren: one word can seat a feud.",
      "category": "Order",
      "costs": {
        "marks": 15,
        "hours": 9,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The phrase is reviewed and may be cut."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.diplomacy",
        "animationId": "paper.unfold"
      },
      "sfx": "confirm",
      "advisorId": "Adelheid von Moren"
    }
  ],
  "17": [
    {
      "id": "17-OPT-01",
      "panelId": "17",
      "title": "Sit with Dagmar before the frontier brief",
      "summary": "Prerequisite: the First Wife is in the house. Dagmar Red: the border does not care which chair I take.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The brief is heard in private and not yet posted."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.house",
        "animationId": "ambient.lamps"
      },
      "sfx": "confirm",
      "advisorId": "Dagmar Red"
    },
    {
      "id": "17-OPT-02",
      "panelId": "17",
      "title": "Hear Liese's library question",
      "summary": "Prerequisite: Liese is out of lessons. Dagmar Red: Liese may ask. The frontier may not answer her.",
      "category": "Order",
      "costs": {
        "marks": 10,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "A child's question is heard and not entered as policy."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.house",
        "animationId": "ambient.lamps"
      },
      "sfx": "confirm",
      "advisorId": "Dagmar Red"
    },
    {
      "id": "17-OPT-03",
      "panelId": "17",
      "title": "Send Konrad to Karin Voss's drill",
      "summary": "Prerequisite: Captain Karin Voss is taking cadets. Dagmar Red: he is a cadet. Say so.",
      "category": "Delegate",
      "costs": {
        "marks": 30,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Konrad is sent to drill, not to a gate command."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.house",
        "animationId": "ambient.lamps"
      },
      "sfx": "confirm",
      "advisorId": "Dagmar Red"
    },
    {
      "id": "17-OPT-04",
      "panelId": "17",
      "title": "Ask Wilhelmina who speaks for the House",
      "summary": "Prerequisite: the grandmother is in residence. Dagmar Red: Wilhelmina speaks the House. I speak the border.",
      "category": "Invest",
      "costs": {
        "marks": 0,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "House voice is asked, not seized."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.house",
        "animationId": "ambient.lamps"
      },
      "sfx": "confirm",
      "advisorId": "Dagmar Red"
    },
    {
      "id": "17-OPT-05",
      "panelId": "17",
      "title": "Note Luka's place without a public ruling",
      "summary": "Prerequisite: Elara has not asked for a hall judgment. Dagmar Red: acknowledged is not the same as seated at council.",
      "category": "Investigate",
      "costs": {
        "marks": 15,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Luka's place is noted in the house book only."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.house",
        "animationId": "ambient.lamps"
      },
      "sfx": "confirm",
      "advisorId": "Dagmar Red"
    }
  ],
  "18": [
    {
      "id": "18-OPT-01",
      "panelId": "18",
      "title": "Inspect the East Gate collar",
      "summary": "Prerequisite: the East Gate report is current. Dagmar Red: look at the iron before you promise it will hold.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The collar is inspected and its condition is written down."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.borders",
        "animationId": "alarm.pulse"
      },
      "sfx": "confirm",
      "advisorId": "Dagmar Red"
    },
    {
      "id": "18-OPT-02",
      "panelId": "18",
      "title": "Reinforce gate",
      "summary": "Prerequisite: a breach or weak collar is already reported. Dagmar Red: reinforcement is timber, plate, and people. Not a word.",
      "category": "Order",
      "costs": {
        "marks": 80,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "The gate is ordered reinforced and the watch stays on it."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.borders",
        "animationId": "alarm.pulse"
      },
      "sfx": "confirm",
      "advisorId": "Dagmar Red"
    },
    {
      "id": "18-OPT-03",
      "panelId": "18",
      "title": "Open a North Gate convoy window",
      "summary": "Prerequisite: the northern rail has a clear hour. Dagmar Red: the North Gate lets the living in. Count them.",
      "category": "Delegate",
      "costs": {
        "marks": 40,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A convoy window opens and closes on the clock."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.borders",
        "animationId": "alarm.pulse"
      },
      "sfx": "confirm",
      "advisorId": "Dagmar Red"
    },
    {
      "id": "18-OPT-04",
      "panelId": "18",
      "title": "Order West Gate plate repair",
      "summary": "Prerequisite: Hans Kessler can spare plate. Dagmar Red: the West Gate rusts quietly. That is how it fails.",
      "category": "Invest",
      "costs": {
        "marks": 100,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "Plate repair is ordered for the West Gate alone."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.borders",
        "animationId": "alarm.pulse"
      },
      "sfx": "confirm",
      "advisorId": "Dagmar Red"
    },
    {
      "id": "18-OPT-05",
      "panelId": "18",
      "title": "Ask Brand Hessler for the ash line",
      "summary": "Prerequisite: the garrison point man has reported in. Dagmar Red: Hessler stands in it. Believe his boots first.",
      "category": "Investigate",
      "costs": {
        "marks": 20,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The ash line is taken as a garrison report."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.borders",
        "animationId": "alarm.pulse"
      },
      "sfx": "confirm",
      "advisorId": "Dagmar Red"
    },
    {
      "id": "18-OPT-06",
      "panelId": "18",
      "title": "Wait on the southern rail's return",
      "summary": "Prerequisite: the domestic train is not yet due. Dagmar Red: the south rail comes home or it does not. Wait for the bell.",
      "category": "Wait",
      "costs": {
        "marks": 0,
        "hours": 7,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "No search party is spent before the rail is late."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": true,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.borders",
        "animationId": "alarm.pulse"
      },
      "sfx": "confirm",
      "advisorId": "Dagmar Red"
    },
    {
      "id": "18-OPT-07",
      "panelId": "18",
      "title": "Treat with a Survivor party at the Latch",
      "summary": "Prerequisite: a party is actually at the Latch. Dagmar Red: the Latch is not a throne room.",
      "category": "Negotiate",
      "costs": {
        "marks": 70,
        "hours": 8,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "Words are offered at the Latch, not recognition of a state."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.borders",
        "animationId": "alarm.pulse"
      },
      "sfx": "confirm",
      "advisorId": "Dagmar Red"
    },
    {
      "id": "18-OPT-08",
      "panelId": "18",
      "title": "Review Rask's border watch",
      "summary": "Prerequisite: Marshal Gerhard Rask has filed the watch. Dagmar Red: if Rask's list names the dead, strike them.",
      "category": "Order",
      "costs": {
        "marks": 15,
        "hours": 9,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The watch list is reviewed against the living roster."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.borders",
        "animationId": "alarm.pulse"
      },
      "sfx": "confirm",
      "advisorId": "Dagmar Red"
    }
  ],
  "19": [
    {
      "id": "19-OPT-01",
      "panelId": "19",
      "title": "Read the quest board pins",
      "summary": "Prerequisite: the board is in the command room. Samer Vogt: a pin is a task, not a victory.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Pins are read; none are declared complete."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.quests",
        "animationId": "board.pin"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "19-OPT-02",
      "panelId": "19",
      "title": "Advance the west cistern task",
      "summary": "Prerequisite: Tomas Hesse's warning is already filed. Samer Vogt: the cistern does not fill because we pinned it.",
      "category": "Order",
      "costs": {
        "marks": 30,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The cistern task moves one step and the water is unchanged until work is done."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.quests",
        "animationId": "board.pin"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "19-OPT-03",
      "panelId": "19",
      "title": "Hand the Sixth Carrier question to Elara",
      "summary": "Prerequisite: the carrier file is open. Samer Vogt: Elara keeps the questions that bite.",
      "category": "Delegate",
      "costs": {
        "marks": 20,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The question is handed over, not answered."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.quests",
        "animationId": "board.pin"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "19-OPT-04",
      "panelId": "19",
      "title": "Fund a Pathwalker kit for the Latch",
      "summary": "Prerequisite: Surface Watch has asked for a kit. Samer Vogt: Pathwalkers spend boots, not stories.",
      "category": "Invest",
      "costs": {
        "marks": 90,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "A kit is funded for a real walk, not a legend."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.quests",
        "animationId": "board.pin"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "19-OPT-05",
      "panelId": "19",
      "title": "Re-read a clue before calling it fact",
      "summary": "Prerequisite: the clue is filed and not yet known. Samer Vogt: one slip is not a case.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The clue stays a clue until a second support exists."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.quests",
        "animationId": "board.pin"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "19-OPT-06",
      "panelId": "19",
      "title": "Let the Ironday beat arrive unforced",
      "summary": "Prerequisite: no emergency is on the clock. Samer Vogt: do not invent a crisis to feel busy.",
      "category": "Wait",
      "costs": {
        "marks": 0,
        "hours": 7,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The board waits for the next witnessed beat."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": true,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.quests",
        "animationId": "board.pin"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "19-OPT-07",
      "panelId": "19",
      "title": "Bargain a quest step with the Demos",
      "summary": "Prerequisite: Johanna Weiss has left a channel open. Samer Vogt: the Demos trade words. Pay in words.",
      "category": "Negotiate",
      "costs": {
        "marks": 50,
        "hours": 8,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "A step is bargained; the Forum is not joined."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.quests",
        "animationId": "board.pin"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "19-OPT-08",
      "panelId": "19",
      "title": "Review which quest lacks a witness",
      "summary": "Prerequisite: the board shows an unwitnessed pin. Samer Vogt: no witness, no done.",
      "category": "Order",
      "costs": {
        "marks": 10,
        "hours": 9,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Unwitnessed pins are marked, not completed."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.quests",
        "animationId": "board.pin"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    }
  ],
  "20": [
    {
      "id": "20-OPT-01",
      "panelId": "20",
      "title": "Read Karin Voss's drill roll",
      "summary": "Prerequisite: the Training Office has posted it. Training Office: Karin drills who is written. No extras.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The drill roll is read against the living names."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.population",
        "animationId": "counter.roll"
      },
      "sfx": "confirm",
      "advisorId": "Training Office"
    },
    {
      "id": "20-OPT-02",
      "panelId": "20",
      "title": "Assign cadet Konrad Red to the line",
      "summary": "Prerequisite: Konrad is free of house lessons. Training Office: the line teaches. It does not promote.",
      "category": "Order",
      "costs": {
        "marks": 25,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A cadet assignment is made, not a command."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.population",
        "animationId": "counter.roll"
      },
      "sfx": "confirm",
      "advisorId": "Training Office"
    },
    {
      "id": "20-OPT-03",
      "panelId": "20",
      "title": "Ask who still lacks a mentor",
      "summary": "Prerequisite: the mentor board has a blank. Training Office: a trainee without a mentor does not go to the field.",
      "category": "Delegate",
      "costs": {
        "marks": 0,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The blank is named and not filled by rumor."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.population",
        "animationId": "counter.roll"
      },
      "sfx": "confirm",
      "advisorId": "Training Office"
    },
    {
      "id": "20-OPT-04",
      "panelId": "20",
      "title": "Set aside rations for the trainee hall",
      "summary": "Prerequisite: Stores can spare a trainee draw. Training Office: hungry drills teach the wrong lesson.",
      "category": "Invest",
      "costs": {
        "marks": 40,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Rations are reserved, not double-issued."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.population",
        "animationId": "counter.roll"
      },
      "sfx": "confirm",
      "advisorId": "Training Office"
    },
    {
      "id": "20-OPT-05",
      "panelId": "20",
      "title": "Check that no child is listed for a suit",
      "summary": "Prerequisite: the armor roll is open. Training Office: armor waits for the age the House already keeps.",
      "category": "Investigate",
      "costs": {
        "marks": 10,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Children are confirmed off the suit list."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.population",
        "animationId": "counter.roll"
      },
      "sfx": "confirm",
      "advisorId": "Training Office"
    }
  ],
  "21": [
    {
      "id": "21-OPT-01",
      "panelId": "21",
      "title": "Read the west cistern gauge",
      "summary": "Prerequisite: Tomas Hesse has logged the gauge. Tomas Hesse: the gauge lies only when we tap it.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The gauge is read and not adjusted on paper."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.water",
        "animationId": "cistern.level"
      },
      "sfx": "confirm",
      "advisorId": "Tomas Hesse"
    },
    {
      "id": "21-OPT-02",
      "panelId": "21",
      "title": "Send Tomas Hesse to the west cistern",
      "summary": "Prerequisite: he is not already on another fault. Tomas Hesse: I will tell you what the seam is doing.",
      "category": "Order",
      "costs": {
        "marks": 40,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Hesse is sent to look, not to promise a full tank."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.water",
        "animationId": "cistern.level"
      },
      "sfx": "confirm",
      "advisorId": "Tomas Hesse"
    },
    {
      "id": "21-OPT-03",
      "panelId": "21",
      "title": "Cut a nonessential draw until Wellday",
      "summary": "Prerequisite: a nonessential draw is named. Tomas Hesse: cut the baths before you cut the cups.",
      "category": "Delegate",
      "costs": {
        "marks": 30,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "One named draw is cut; drinking water is not the cut."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.water",
        "animationId": "cistern.level"
      },
      "sfx": "confirm",
      "advisorId": "Tomas Hesse"
    },
    {
      "id": "21-OPT-04",
      "panelId": "21",
      "title": "Fund a patch on the cistern seam",
      "summary": "Prerequisite: the seam is the named fault. Tomas Hesse: a patch is lead and time. Not a rite.",
      "category": "Invest",
      "costs": {
        "marks": 140,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "Marks are set for a patch, which still has to be welded."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.water",
        "animationId": "cistern.level"
      },
      "sfx": "confirm",
      "advisorId": "Tomas Hesse"
    },
    {
      "id": "21-OPT-05",
      "panelId": "21",
      "title": "Ask whether the Water Rite can wait",
      "summary": "Prerequisite: Wilhelmina has the rite on the calendar. Tomas Hesse: a rite on an empty cistern is a louder problem.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The question is asked; the rite is not cancelled here."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.water",
        "animationId": "cistern.level"
      },
      "sfx": "confirm",
      "advisorId": "Tomas Hesse"
    }
  ],
  "22": [
    {
      "id": "22-OPT-01",
      "panelId": "22",
      "title": "Read the northern rail manifest",
      "summary": "Prerequisite: the manifest is in from the North Gate. Treasury Minister: the north rail is the list. Believe the list.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The manifest is read before any crate is released."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.logistics",
        "animationId": "route.flow"
      },
      "sfx": "confirm",
      "advisorId": "Treasury Minister"
    },
    {
      "id": "22-OPT-02",
      "panelId": "22",
      "title": "Release a Stores crate to the North Gate",
      "summary": "Prerequisite: the crate is on the Stores roll. Treasury Minister: one crate. Write its leaving.",
      "category": "Order",
      "costs": {
        "marks": 50,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "One named crate moves to the gate."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.logistics",
        "animationId": "route.flow"
      },
      "sfx": "confirm",
      "advisorId": "Treasury Minister"
    },
    {
      "id": "22-OPT-03",
      "panelId": "22",
      "title": "Ask to reroute the ash-iron",
      "summary": "Prerequisite: ash-iron is actually on a car. Treasury Minister: ash-iron does not teleport between spurs.",
      "category": "Delegate",
      "costs": {
        "marks": 35,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A reroute is asked and not yet done."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.logistics",
        "animationId": "route.flow"
      },
      "sfx": "confirm",
      "advisorId": "Treasury Minister"
    },
    {
      "id": "22-OPT-04",
      "panelId": "22",
      "title": "Pay porters for the Barracks haul",
      "summary": "Prerequisite: the haul is finished and unpaid. Treasury Minister: unpaid porters become tomorrow's shortage.",
      "category": "Invest",
      "costs": {
        "marks": 45,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Porter pay is ordered against a finished haul."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.logistics",
        "animationId": "route.flow"
      },
      "sfx": "confirm",
      "advisorId": "Treasury Minister"
    },
    {
      "id": "22-OPT-05",
      "panelId": "22",
      "title": "Trace a crate that never reached Stores",
      "summary": "Prerequisite: the gate signed it out and Stores did not sign it in. Treasury Minister: the tunnel ate it or someone did. We do not guess which.",
      "category": "Investigate",
      "costs": {
        "marks": 20,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "The gap between gate and Stores is traced."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.logistics",
        "animationId": "route.flow"
      },
      "sfx": "confirm",
      "advisorId": "Treasury Minister"
    }
  ],
  "23": [
    {
      "id": "23-OPT-01",
      "panelId": "23",
      "title": "Read Marshal Rask's posture",
      "summary": "Prerequisite: the War Ministry has his note. War Ministry: Rask's posture is a stance, not a battle.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Posture is read, not escalated."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.military",
        "animationId": "counter.roll"
      },
      "sfx": "confirm",
      "advisorId": "War Ministry"
    },
    {
      "id": "23-OPT-02",
      "panelId": "23",
      "title": "Set the Iron Guard relief with Elara",
      "summary": "Prerequisite: Elara is available to name the relief. War Ministry: Elara names the relief. We do not add a sixth.",
      "category": "Order",
      "costs": {
        "marks": 40,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Relief is set inside the five-woman guard, not beyond it."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.military",
        "animationId": "counter.roll"
      },
      "sfx": "confirm",
      "advisorId": "War Ministry"
    },
    {
      "id": "23-OPT-03",
      "panelId": "23",
      "title": "Ask the War Ministry for the gate roster",
      "summary": "Prerequisite: the roster is due. War Ministry: a roster with blanks is a hole in the wall.",
      "category": "Delegate",
      "costs": {
        "marks": 10,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The roster is requested as a document."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.military",
        "animationId": "counter.roll"
      },
      "sfx": "confirm",
      "advisorId": "War Ministry"
    },
    {
      "id": "23-OPT-04",
      "panelId": "23",
      "title": "Draw plate from Kessler's rack",
      "summary": "Prerequisite: the armorer has spare plate that is not a suit. War Ministry: plate is armor's cousin, not its corpse.",
      "category": "Invest",
      "costs": {
        "marks": 80,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "Plate is drawn; no suit is broken for scrap without his word."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.military",
        "animationId": "counter.roll"
      },
      "sfx": "confirm",
      "advisorId": "War Ministry"
    },
    {
      "id": "23-OPT-05",
      "panelId": "23",
      "title": "Hear Otto Klein before a field punishment",
      "summary": "Prerequisite: a field punishment is proposed. War Ministry: the field does not invent a penalty.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "No punishment is served before Klein is heard."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.military",
        "animationId": "counter.roll"
      },
      "sfx": "confirm",
      "advisorId": "War Ministry"
    }
  ],
  "24": [
    {
      "id": "24-OPT-01",
      "panelId": "24",
      "title": "Read the Ironday council slate",
      "summary": "Prerequisite: the nine ministers have filed. Council: Ironday is for hearing, then for the stamp.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The slate is read before any decree."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "ministry.war",
        "animationId": "meter.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Council"
    },
    {
      "id": "24-OPT-02",
      "panelId": "24",
      "title": "Stamp a bounded council decree",
      "summary": "Prerequisite: the decree text is already drafted. Council: the stamp spends marks and time. It does not rewrite yesterday.",
      "category": "Order",
      "costs": {
        "marks": 60,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A bounded decree is stamped through the catalog order."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "ministry.war",
        "animationId": "meter.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Council"
    },
    {
      "id": "24-OPT-03",
      "panelId": "24",
      "title": "Hand the water brief to Tomas Hesse",
      "summary": "Prerequisite: the cistern warning is on the slate. Council: Hesse owns the cistern. Let him speak first.",
      "category": "Delegate",
      "costs": {
        "marks": 15,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The brief is handed to the water deputy."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "ministry.war",
        "animationId": "meter.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Council"
    },
    {
      "id": "24-OPT-04",
      "panelId": "24",
      "title": "Fund the Repair Ministry's week",
      "summary": "Prerequisite: the repair list is priced. Council: cracks grow while we debate them.",
      "category": "Invest",
      "costs": {
        "marks": 160,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "A week's repair fund is set aside."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "ministry.war",
        "animationId": "meter.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Council"
    },
    {
      "id": "24-OPT-05",
      "panelId": "24",
      "title": "Inspect which ministry missed Watchday",
      "summary": "Prerequisite: Watchday reports are in. Council: absence from Watchday is a fact.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "A missing report is noted, not punished yet."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "ministry.war",
        "animationId": "meter.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Council"
    },
    {
      "id": "24-OPT-06",
      "panelId": "24",
      "title": "Hold new decrees until the next Ironday",
      "summary": "Prerequisite: no emergency decree is required. Council: not every hour is Ironday.",
      "category": "Wait",
      "costs": {
        "marks": 0,
        "hours": 7,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "New decrees wait for the next Council day."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": true,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "ministry.war",
        "animationId": "meter.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Council"
    },
    {
      "id": "24-OPT-07",
      "panelId": "24",
      "title": "Negotiate a Stores release with Ilona",
      "summary": "Prerequisite: Ilona Brandt is at the table. Council: Ilona will not spend the shelf for a speech.",
      "category": "Negotiate",
      "costs": {
        "marks": 50,
        "hours": 8,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "A release is negotiated against the ration line."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "ministry.war",
        "animationId": "meter.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Council"
    },
    {
      "id": "24-OPT-08",
      "panelId": "24",
      "title": "Review Ludek Prask's furnace report",
      "summary": "Prerequisite: the furnace deputy has filed. Council: Ludek measures heat. Hear the measure.",
      "category": "Order",
      "costs": {
        "marks": 10,
        "hours": 9,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The furnace report is reviewed as energy, not as omen."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "ministry.war",
        "animationId": "meter.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Council"
    }
  ],
  "25": [
    {
      "id": "25-OPT-01",
      "panelId": "25",
      "title": "Read the commoner housing roll",
      "summary": "Prerequisite: the Housing Office has posted the districts. Housing Office: the districts are full of names. Do not add imaginary rooms.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The roll is read and no one is moved."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.housing",
        "animationId": "meter.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Housing Office"
    },
    {
      "id": "25-OPT-02",
      "panelId": "25",
      "title": "Open a sealed quarter by the Barracks",
      "summary": "Prerequisite: the quarter is sealed and the key is here. Housing Office: sealed means a reason. Ask it before the door.",
      "category": "Order",
      "costs": {
        "marks": 80,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "The quarter is ordered opened after a safety look."
        ],
        "unknownEffects": []
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.housing",
        "animationId": "meter.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Housing Office"
    },
    {
      "id": "25-OPT-03",
      "panelId": "25",
      "title": "Send the Housing Office into the Underrows",
      "summary": "Prerequisite: Brun Maurer will walk with them. Housing Office: the Underrows are quarters, not a rumor.",
      "category": "Delegate",
      "costs": {
        "marks": 30,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A walk is ordered, not a clearance."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.housing",
        "animationId": "meter.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Housing Office"
    },
    {
      "id": "25-OPT-04",
      "panelId": "25",
      "title": "Pay for lamp oil in the lower wards",
      "summary": "Prerequisite: Stores has oil that is not ration grain. Housing Office: dark stairs make their own accidents.",
      "category": "Invest",
      "costs": {
        "marks": 40,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Lamp oil is paid for the lower wards only."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.housing",
        "animationId": "meter.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Housing Office"
    },
    {
      "id": "25-OPT-05",
      "panelId": "25",
      "title": "Check overcrowding without posting names",
      "summary": "Prerequisite: the count exists and names stay off the board. Housing Office: count the beds. Leave the gossip.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Overcrowding is noted as a condition, not a list of targets."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.housing",
        "animationId": "meter.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Housing Office"
    }
  ],
  "26": [
    {
      "id": "26-OPT-01",
      "panelId": "26",
      "title": "Read the household duty board",
      "summary": "Prerequisite: the board is in the personnel room. Personnel Office: the board is the day. Mood is not a column.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Duties are read as posted."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.personnel",
        "animationId": "graph.edge.pulse"
      },
      "sfx": "confirm",
      "advisorId": "Personnel Office"
    },
    {
      "id": "26-OPT-02",
      "panelId": "26",
      "title": "Reassign Freja Dorn to the medic post",
      "summary": "Prerequisite: Freja is free of a mobile guard task. Personnel Office: Freja stitches. Put her where the blood is.",
      "category": "Order",
      "costs": {
        "marks": 35,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "One medic post is filled by a named guard."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.personnel",
        "animationId": "graph.edge.pulse"
      },
      "sfx": "confirm",
      "advisorId": "Personnel Office"
    },
    {
      "id": "26-OPT-03",
      "panelId": "26",
      "title": "Ask Personnel who still lacks a mentor",
      "summary": "Prerequisite: the mentor column has a blank. Personnel Office: no mentor, no field.",
      "category": "Delegate",
      "costs": {
        "marks": 0,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The blank is reported, not filled by guess."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.personnel",
        "animationId": "graph.edge.pulse"
      },
      "sfx": "confirm",
      "advisorId": "Personnel Office"
    },
    {
      "id": "26-OPT-04",
      "panelId": "26",
      "title": "Set aside pay for the five attendants",
      "summary": "Prerequisite: Jana, Mila, Alena, Bettina, and Katya are the active roster. Personnel Office: five names. Hanne is retired from that roster.",
      "category": "Invest",
      "costs": {
        "marks": 50,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Pay is reserved for the five attendants Hanne no longer leads."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.personnel",
        "animationId": "graph.edge.pulse"
      },
      "sfx": "confirm",
      "advisorId": "Personnel Office"
    },
    {
      "id": "26-OPT-05",
      "panelId": "26",
      "title": "Hear Piotr's mechanic grievance",
      "summary": "Prerequisite: Piotr has asked to be heard. Personnel Office: the foreman speaks. That is not a verdict.",
      "category": "Investigate",
      "costs": {
        "marks": 20,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A grievance is heard and not yet granted."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.personnel",
        "animationId": "graph.edge.pulse"
      },
      "sfx": "confirm",
      "advisorId": "Personnel Office"
    },
    {
      "id": "26-OPT-06",
      "panelId": "26",
      "title": "Hold house moves until Ashday ends",
      "summary": "Prerequisite: Ashday rest is in force. Personnel Office: Ashday is not a transfer day.",
      "category": "Wait",
      "costs": {
        "marks": 0,
        "hours": 7,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Staff are not reshuffled during the rest rite."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": true,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.personnel",
        "animationId": "graph.edge.pulse"
      },
      "sfx": "confirm",
      "advisorId": "Personnel Office"
    },
    {
      "id": "26-OPT-07",
      "panelId": "26",
      "title": "Speak with Hanne about the young roster",
      "summary": "Prerequisite: Hanne Brauer is in the house. Personnel Office: she remembers the old six. We keep the new five.",
      "category": "Negotiate",
      "costs": {
        "marks": 10,
        "hours": 8,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Hanne is consulted as memory, not as the active steward of the five."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.personnel",
        "animationId": "graph.edge.pulse"
      },
      "sfx": "confirm",
      "advisorId": "Personnel Office"
    },
    {
      "id": "26-OPT-08",
      "panelId": "26",
      "title": "Review whether Ewald's post stays vacant",
      "summary": "Prerequisite: the cousin's case is still open. Personnel Office: an open treason file is not a promotion list.",
      "category": "Order",
      "costs": {
        "marks": 15,
        "hours": 9,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "The post stays vacant while the case is open."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.personnel",
        "animationId": "graph.edge.pulse"
      },
      "sfx": "confirm",
      "advisorId": "Personnel Office"
    }
  ],
  "27": [
    {
      "id": "27-OPT-01",
      "panelId": "27",
      "title": "Read the cistern dependency chain",
      "summary": "Prerequisite: Engineering has drawn the chain. Engineering: the seam waits on heat, plate, and Hesse. In that order.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The chain is read before any new work is stacked on it."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.dependencies",
        "animationId": "route.trace"
      },
      "sfx": "confirm",
      "advisorId": "Engineering"
    },
    {
      "id": "27-OPT-02",
      "panelId": "27",
      "title": "Order the seam weld before the rail spur",
      "summary": "Prerequisite: both jobs are asking for the same crew. Engineering: water before ore. Say it once.",
      "category": "Order",
      "costs": {
        "marks": 70,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "The weld is ordered ahead of the spur."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.dependencies",
        "animationId": "route.trace"
      },
      "sfx": "confirm",
      "advisorId": "Engineering"
    },
    {
      "id": "27-OPT-03",
      "panelId": "27",
      "title": "Ask Ulrich Venn which survey blocks the dig",
      "summary": "Prerequisite: the Survey Circle has an unfinished sheet. Engineering: Venn's blank is a closed tunnel.",
      "category": "Delegate",
      "costs": {
        "marks": 20,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The blocking survey is named."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.dependencies",
        "animationId": "route.trace"
      },
      "sfx": "confirm",
      "advisorId": "Engineering"
    },
    {
      "id": "27-OPT-04",
      "panelId": "27",
      "title": "Buy coil time from the energy circle",
      "summary": "Prerequisite: Florian Kessler has hours to sell. Engineering: Florian's bench is not a public well.",
      "category": "Invest",
      "costs": {
        "marks": 90,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "Coil time is bought, not commandeered."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.dependencies",
        "animationId": "route.trace"
      },
      "sfx": "confirm",
      "advisorId": "Engineering"
    },
    {
      "id": "27-OPT-05",
      "panelId": "27",
      "title": "Find which project still waits on Stores",
      "summary": "Prerequisite: the project list and Stores roll are both here. Engineering: a project without Stores is a drawing.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The waiting project is identified, not fed."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.dependencies",
        "animationId": "route.trace"
      },
      "sfx": "confirm",
      "advisorId": "Engineering"
    },
    {
      "id": "27-OPT-06",
      "panelId": "27",
      "title": "Let the furnace cool before the next weld",
      "summary": "Prerequisite: Ludek Prask has called the heat spent. Engineering: hot iron lies about its strength.",
      "category": "Wait",
      "costs": {
        "marks": 0,
        "hours": 7,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The next weld waits on a cooled furnace."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": true,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.dependencies",
        "animationId": "route.trace"
      },
      "sfx": "confirm",
      "advisorId": "Engineering"
    },
    {
      "id": "27-OPT-07",
      "panelId": "27",
      "title": "Trade a survey day with Florian Kessler",
      "summary": "Prerequisite: both deputies can spare a day. Engineering: a trade of days is still a debt.",
      "category": "Negotiate",
      "costs": {
        "marks": 40,
        "hours": 8,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A day is traded, not a ministry."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.dependencies",
        "animationId": "route.trace"
      },
      "sfx": "confirm",
      "advisorId": "Engineering"
    },
    {
      "id": "27-OPT-08",
      "panelId": "27",
      "title": "Review the dome pulse dependency",
      "summary": "Prerequisite: the pulse log is beside the project board. Engineering: the dome eats coil time whether we like the poem or not.",
      "category": "Order",
      "costs": {
        "marks": 15,
        "hours": 9,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The dome's dependency is reviewed, not tuned."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.dependencies",
        "animationId": "route.trace"
      },
      "sfx": "confirm",
      "advisorId": "Engineering"
    }
  ],
  "28": [
    {
      "id": "28-OPT-01",
      "panelId": "28",
      "title": "Read the Repair Ministry crack log",
      "summary": "Prerequisite: the log is this week's. Repair Ministry: a crack written down is still a crack.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Cracks are read. None are declared fixed."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.infrastructure",
        "animationId": "weld.spark"
      },
      "sfx": "confirm",
      "advisorId": "Repair Ministry"
    },
    {
      "id": "28-OPT-02",
      "panelId": "28",
      "title": "Order a weld on the lower stair",
      "summary": "Prerequisite: the lower stair is the named fault. Repair Ministry: one stair. Write which.",
      "category": "Order",
      "costs": {
        "marks": 110,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "A weld is ordered for that stair alone."
        ],
        "unknownEffects": []
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.infrastructure",
        "animationId": "weld.spark"
      },
      "sfx": "confirm",
      "advisorId": "Repair Ministry"
    },
    {
      "id": "28-OPT-03",
      "panelId": "28",
      "title": "Send a crew to Anselm Frey's cables",
      "summary": "Prerequisite: Keeper Anselm Frey has asked. Repair Ministry: Frey hears the cable. Send hands, not a speech.",
      "category": "Delegate",
      "costs": {
        "marks": 60,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The elevator cables get a crew, not a new shaft."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.infrastructure",
        "animationId": "weld.spark"
      },
      "sfx": "confirm",
      "advisorId": "Repair Ministry"
    },
    {
      "id": "28-OPT-04",
      "panelId": "28",
      "title": "Draw grease and plate from Stores",
      "summary": "Prerequisite: Stores has both and the ration line is untouched. Repair Ministry: grease is a material. Log it.",
      "category": "Invest",
      "costs": {
        "marks": 45,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Grease and plate are drawn against the shelf."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.infrastructure",
        "animationId": "weld.spark"
      },
      "sfx": "confirm",
      "advisorId": "Repair Ministry"
    },
    {
      "id": "28-OPT-05",
      "panelId": "28",
      "title": "Walk the Barracks Lines with Anselm",
      "summary": "Prerequisite: he is free to walk. Repair Ministry: if we did not see it, it is not in the log.",
      "category": "Investigate",
      "costs": {
        "marks": 10,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "A walk is taken. No new fault is invented on the page."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.infrastructure",
        "animationId": "weld.spark"
      },
      "sfx": "confirm",
      "advisorId": "Repair Ministry"
    }
  ],
  "29": [
    {
      "id": "29-OPT-01",
      "panelId": "29",
      "title": "Read the provenance audit",
      "summary": "Prerequisite: the audit sheet is generated from the vault index. System: provenance says where a thing was. It does not teleport it.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The audit is read. No item is moved."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.audit",
        "animationId": "scan.sweep"
      },
      "sfx": "confirm",
      "advisorId": "System"
    },
    {
      "id": "29-OPT-02",
      "panelId": "29",
      "title": "Flag a duplicated unique claim",
      "summary": "Prerequisite: two records name one unique item. System: two homes for one suit is a lie until proven otherwise.",
      "category": "Order",
      "costs": {
        "marks": 20,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "The duplicate claim is flagged for a human check."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.audit",
        "animationId": "scan.sweep"
      },
      "sfx": "confirm",
      "advisorId": "System"
    },
    {
      "id": "29-OPT-03",
      "panelId": "29",
      "title": "Ask the Archive Office for the serial",
      "summary": "Prerequisite: a serial is already on the item card. System: if the serial is blank, say blank.",
      "category": "Delegate",
      "costs": {
        "marks": 0,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The serial is requested from the archive, not invented."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.audit",
        "animationId": "scan.sweep"
      },
      "sfx": "confirm",
      "advisorId": "System"
    },
    {
      "id": "29-OPT-04",
      "panelId": "29",
      "title": "Recheck the vault index",
      "summary": "Prerequisite: both vaults are closed and listed. System: the index is not the vault.",
      "category": "Invest",
      "costs": {
        "marks": 15,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The index is rechecked against the doors."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.audit",
        "animationId": "scan.sweep"
      },
      "sfx": "confirm",
      "advisorId": "System"
    },
    {
      "id": "29-OPT-05",
      "panelId": "29",
      "title": "Compare two records of the same suit",
      "summary": "Prerequisite: Hans Kessler's rack card and the vault card differ. System: disagreement is a finding. It is not a repair.",
      "category": "Investigate",
      "costs": {
        "marks": 25,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "The two records are set side by side."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.audit",
        "animationId": "scan.sweep"
      },
      "sfx": "confirm",
      "advisorId": "System"
    }
  ],
  "30": [
    {
      "id": "30-OPT-01",
      "panelId": "30",
      "title": "Read the dome pulse rings",
      "summary": "Prerequisite: Engineering has the night's rings. Engineering: the dome pulses. We do not worship the needle.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The rings are read as measures."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.dome",
        "animationId": "pulse.rings"
      },
      "sfx": "confirm",
      "advisorId": "Engineering"
    },
    {
      "id": "30-OPT-02",
      "panelId": "30",
      "title": "Order a damp on the loud ring",
      "summary": "Prerequisite: a ring is louder than the last Ashday. Engineering: damp the ring. Do not darken the city to feel serious.",
      "category": "Order",
      "costs": {
        "marks": 50,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "A damp is ordered, not a shutdown of the dome."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.dome",
        "animationId": "pulse.rings"
      },
      "sfx": "confirm",
      "advisorId": "Engineering"
    },
    {
      "id": "30-OPT-03",
      "panelId": "30",
      "title": "Ask Florian to sit the night watch",
      "summary": "Prerequisite: Florian Kessler can be spared. Engineering: Florian hears coils. Put him on the loud hour.",
      "category": "Delegate",
      "costs": {
        "marks": 40,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A night watch is asked of the energy circle."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.dome",
        "animationId": "pulse.rings"
      },
      "sfx": "confirm",
      "advisorId": "Engineering"
    },
    {
      "id": "30-OPT-04",
      "panelId": "30",
      "title": "Fund a coil for the pulse bench",
      "summary": "Prerequisite: the bench is the named load. Engineering: a coil is bought. It does not arrive by hope.",
      "category": "Invest",
      "costs": {
        "marks": 120,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "One coil is funded for the bench."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.dome",
        "animationId": "pulse.rings"
      },
      "sfx": "confirm",
      "advisorId": "Engineering"
    },
    {
      "id": "30-OPT-05",
      "panelId": "30",
      "title": "Log whether the ring matches the cistern draw",
      "summary": "Prerequisite: both logs are in the room. Engineering: match is not cause. Write match or no match.",
      "category": "Investigate",
      "costs": {
        "marks": 10,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A comparison is logged without a causal verdict."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.dome",
        "animationId": "pulse.rings"
      },
      "sfx": "confirm",
      "advisorId": "Engineering"
    },
    {
      "id": "30-OPT-06",
      "panelId": "30",
      "title": "Wait through one quiet hour",
      "summary": "Prerequisite: no alarm is sounding. Engineering: quiet is data.",
      "category": "Wait",
      "costs": {
        "marks": 0,
        "hours": 7,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "An hour is watched before any new order."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": true,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.dome",
        "animationId": "pulse.rings"
      },
      "sfx": "confirm",
      "advisorId": "Engineering"
    },
    {
      "id": "30-OPT-07",
      "panelId": "30",
      "title": "Bargain furnace time with Ludek Prask",
      "summary": "Prerequisite: the furnace deputy is present. Engineering: Ludek's heat has other mouths.",
      "category": "Negotiate",
      "costs": {
        "marks": 35,
        "hours": 8,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Furnace time is bargained for the dome bench."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.dome",
        "animationId": "pulse.rings"
      },
      "sfx": "confirm",
      "advisorId": "Engineering"
    },
    {
      "id": "30-OPT-08",
      "panelId": "30",
      "title": "Review the pulse against last Ashday",
      "summary": "Prerequisite: last Ashday's ring is filed. Engineering: if Ashday was not written, we do not remember a number for it.",
      "category": "Order",
      "costs": {
        "marks": 0,
        "hours": 9,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The comparison is made to a real prior record."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.dome",
        "animationId": "pulse.rings"
      },
      "sfx": "confirm",
      "advisorId": "Engineering"
    }
  ],
  "31": [
    {
      "id": "31-OPT-01",
      "panelId": "31",
      "title": "Read who whispers on the stairwell",
      "summary": "Prerequisite: a stairwell note is already filed. Samer Vogt: a stairwell has echoes. Echoes are not witnesses.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The whisper is read as rumor until witnessed."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.whispers",
        "animationId": "spread.ripple"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "31-OPT-02",
      "panelId": "31",
      "title": "Trace a whisper to Lenka's kitchen",
      "summary": "Prerequisite: Lenka is the bound-labor cook on the roll. Samer Vogt: Lenka feeds people. That does not make her a source.",
      "category": "Order",
      "costs": {
        "marks": 30,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "The trace is ordered and tagged as unpaid-or-paid speech, not proof."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.whispers",
        "animationId": "spread.ripple"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "31-OPT-03",
      "panelId": "31",
      "title": "Ask Mila what the library heard",
      "summary": "Prerequisite: Mila is on quiet service. Samer Vogt: Mila hears pages. Ask which page.",
      "category": "Delegate",
      "costs": {
        "marks": 10,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A library report is taken as hearsay."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.whispers",
        "animationId": "spread.ripple"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "31-OPT-04",
      "panelId": "31",
      "title": "Pay a runner to repeat nothing",
      "summary": "Prerequisite: Jana or another runner is available. Samer Vogt: silence that is paid for should be written as paid.",
      "category": "Invest",
      "costs": {
        "marks": 20,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A runner is paid to carry silence, and the pay is logged."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.whispers",
        "animationId": "spread.ripple"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "31-OPT-05",
      "panelId": "31",
      "title": "Separate rumor from a witnessed line",
      "summary": "Prerequisite: both a rumor and a witness exist. Samer Vogt: do not let the whisper wear the witness's coat.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The two are marked apart."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.whispers",
        "animationId": "spread.ripple"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    }
  ],
  "32": [
    {
      "id": "32-OPT-01",
      "panelId": "32",
      "title": "Read the Red Ledger's open page",
      "summary": "Prerequisite: the treasury book is open. Treasury Minister: red ink is still ink. It is not a mood.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The open page is read and not amended."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.redledger",
        "animationId": "ledger.stamp"
      },
      "sfx": "confirm",
      "advisorId": "Treasury Minister"
    },
    {
      "id": "32-OPT-02",
      "panelId": "32",
      "title": "Enter a fine Otto Klein already ordered",
      "summary": "Prerequisite: the fine is on the magistrate's roll. Treasury Minister: we record the fine. We do not invent the offense.",
      "category": "Order",
      "costs": {
        "marks": 25,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The fine is entered because Klein ordered it."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.redledger",
        "animationId": "ledger.stamp"
      },
      "sfx": "confirm",
      "advisorId": "Treasury Minister"
    },
    {
      "id": "32-OPT-03",
      "panelId": "32",
      "title": "Ask the minister to initial a transfer",
      "summary": "Prerequisite: the transfer lines are written. Treasury Minister: my initial is a hand, not a stamp you borrow.",
      "category": "Delegate",
      "costs": {
        "marks": 15,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "An initial is asked, not forged."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.redledger",
        "animationId": "ledger.stamp"
      },
      "sfx": "confirm",
      "advisorId": "Treasury Minister"
    },
    {
      "id": "32-OPT-04",
      "panelId": "32",
      "title": "Set aside marks for the Water Rite",
      "summary": "Prerequisite: Wilhelmina has named the rite costs. Treasury Minister: a rite with no marks is a speech in an empty hall.",
      "category": "Invest",
      "costs": {
        "marks": 40,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Marks are reserved for the rite, not spent twice."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.redledger",
        "animationId": "ledger.stamp"
      },
      "sfx": "confirm",
      "advisorId": "Treasury Minister"
    },
    {
      "id": "32-OPT-05",
      "panelId": "32",
      "title": "Hunt a ledger line that misses Stores",
      "summary": "Prerequisite: the Stores count and the ledger disagree. Treasury Minister: if Stores did not see it, the ledger may be dreaming.",
      "category": "Investigate",
      "costs": {
        "marks": 20,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "The disagreeing line is hunted, not balanced by invention."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.redledger",
        "animationId": "ledger.stamp"
      },
      "sfx": "confirm",
      "advisorId": "Treasury Minister"
    }
  ],
  "33": [
    {
      "id": "33-OPT-01",
      "panelId": "33",
      "title": "Open the Evening Hall lamps",
      "summary": "Prerequisite: Wilhelmina has called the hall. Wilhelmina Red: light the hall. Do not announce a feast we did not plan.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The lamps are ordered lit for the hall that exists."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.hall",
        "animationId": "lamp.flicker"
      },
      "sfx": "confirm",
      "advisorId": "Wilhelmina Red"
    },
    {
      "id": "33-OPT-02",
      "panelId": "33",
      "title": "Seat Dagmar at the first chair",
      "summary": "Prerequisite: Dagmar is in the house tonight. Wilhelmina Red: Dagmar's chair is not a negotiation.",
      "category": "Order",
      "costs": {
        "marks": 10,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The First Wife's chair is set as the House already orders it."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.hall",
        "animationId": "lamp.flicker"
      },
      "sfx": "confirm",
      "advisorId": "Wilhelmina Red"
    },
    {
      "id": "33-OPT-03",
      "panelId": "33",
      "title": "Ask Alena to lay the short table",
      "summary": "Prerequisite: Alena is on food and hospitality. Wilhelmina Red: Alena feeds the House. She does not seat envoys.",
      "category": "Delegate",
      "costs": {
        "marks": 20,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A short table is laid, not a state banquet."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.hall",
        "animationId": "lamp.flicker"
      },
      "sfx": "confirm",
      "advisorId": "Wilhelmina Red"
    },
    {
      "id": "33-OPT-04",
      "panelId": "33",
      "title": "Hold a quiet hour for Liese",
      "summary": "Prerequisite: lessons are done and the hall is not in council. Wilhelmina Red: the child may sit. The city may not.",
      "category": "Invest",
      "costs": {
        "marks": 0,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "An hour is held. No policy is made of it."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.hall",
        "animationId": "lamp.flicker"
      },
      "sfx": "confirm",
      "advisorId": "Wilhelmina Red"
    },
    {
      "id": "33-OPT-05",
      "panelId": "33",
      "title": "Note who is missing from the hall",
      "summary": "Prerequisite: the household roll is in the room. Wilhelmina Red: missing is a fact. Reason comes later, if at all.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Absences are noted without a motive."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.hall",
        "animationId": "lamp.flicker"
      },
      "sfx": "confirm",
      "advisorId": "Wilhelmina Red"
    },
    {
      "id": "33-OPT-06",
      "panelId": "33",
      "title": "Wait until the lamps are steady",
      "summary": "Prerequisite: the lamps are still being lit. Wilhelmina Red: a flickering hall makes bad promises.",
      "category": "Wait",
      "costs": {
        "marks": 0,
        "hours": 7,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Nothing is announced over a half-lit hall."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": true,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.hall",
        "animationId": "lamp.flicker"
      },
      "sfx": "confirm",
      "advisorId": "Wilhelmina Red"
    },
    {
      "id": "33-OPT-07",
      "panelId": "33",
      "title": "Invite Adelheid to speak second",
      "summary": "Prerequisite: Adelheid is present. Wilhelmina Red: second wife, second word. The order is old.",
      "category": "Negotiate",
      "costs": {
        "marks": 15,
        "hours": 8,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Speaking order is offered, not a foreign policy."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.hall",
        "animationId": "lamp.flicker"
      },
      "sfx": "confirm",
      "advisorId": "Wilhelmina Red"
    },
    {
      "id": "33-OPT-08",
      "panelId": "33",
      "title": "Review the hall against Feastmonth",
      "summary": "Prerequisite: Feastmonth seating was already planned. Wilhelmina Red: do not spend Feastmonth's chairs on a weeknight.",
      "category": "Order",
      "costs": {
        "marks": 10,
        "hours": 9,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Tonight is checked against the later feast plan."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.hall",
        "animationId": "lamp.flicker"
      },
      "sfx": "confirm",
      "advisorId": "Wilhelmina Red"
    }
  ],
  "34": [
    {
      "id": "34-OPT-01",
      "panelId": "34",
      "title": "Open the night chronicle",
      "summary": "Prerequisite: the house archive book is out. House Archive: night gets what was witnessed after dark.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The night page is opened blank of inventions."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.night",
        "animationId": "film.grain"
      },
      "sfx": "confirm",
      "advisorId": "House Archive"
    },
    {
      "id": "34-OPT-02",
      "panelId": "34",
      "title": "Record the Evening Hall as it happened",
      "summary": "Prerequisite: someone who was there can speak. House Archive: if you did not see the chair, do not describe it.",
      "category": "Order",
      "costs": {
        "marks": 10,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The hall is recorded from a witness, not from hope."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.night",
        "animationId": "film.grain"
      },
      "sfx": "confirm",
      "advisorId": "House Archive"
    },
    {
      "id": "34-OPT-03",
      "panelId": "34",
      "title": "File a quiet margin for Ashday",
      "summary": "Prerequisite: Ashday has passed or is named. House Archive: rest days are short pages. That is correct.",
      "category": "Delegate",
      "costs": {
        "marks": 0,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "A margin is reserved. No false rite is described."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.night",
        "animationId": "film.grain"
      },
      "sfx": "confirm",
      "advisorId": "House Archive"
    },
    {
      "id": "34-OPT-04",
      "panelId": "34",
      "title": "Ask Mila for the library's last lamp",
      "summary": "Prerequisite: Mila closed the library. House Archive: Mila's lamp is a time, not a poem.",
      "category": "Invest",
      "costs": {
        "marks": 15,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The last lamp is asked, not assumed."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.night",
        "animationId": "film.grain"
      },
      "sfx": "confirm",
      "advisorId": "House Archive"
    },
    {
      "id": "34-OPT-05",
      "panelId": "34",
      "title": "Seal the night page before dawn",
      "summary": "Prerequisite: dawn has not been called. House Archive: do not backdate the dark.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The page seals. Later facts go on the next page."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.night",
        "animationId": "film.grain"
      },
      "sfx": "confirm",
      "advisorId": "House Archive"
    }
  ],
  "35": [
    {
      "id": "35-OPT-01",
      "panelId": "35",
      "title": "Read the relic index",
      "summary": "Prerequisite: Emmerich Kolb has the index. Science Ministry: Kolb's index is a list of things that exist.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The index is read. No relic is moved."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": true
      },
      "visual": {
        "artId": "hero.relic",
        "animationId": "scan.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Science Ministry"
    },
    {
      "id": "35-OPT-02",
      "panelId": "35",
      "title": "Ask Tobiah Red where the last find sits",
      "summary": "Prerequisite: Tobiah has returned from a hunt. Science Ministry: Tobiah hunts. The archive keeps.",
      "category": "Order",
      "costs": {
        "marks": 30,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A location is asked. The find is not declared safe."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": true
      },
      "visual": {
        "artId": "hero.relic",
        "animationId": "scan.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Science Ministry"
    },
    {
      "id": "35-OPT-03",
      "panelId": "35",
      "title": "Send a scan request to the Survey Circle",
      "summary": "Prerequisite: Ulrich Venn can take the sheet. Science Ministry: we measure a relic. We do not wake it for sport.",
      "category": "Delegate",
      "costs": {
        "marks": 40,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "A scan is requested, not a claim of function."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": true
      },
      "visual": {
        "artId": "hero.relic",
        "animationId": "scan.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Science Ministry"
    },
    {
      "id": "35-OPT-04",
      "panelId": "35",
      "title": "Fund a safe drawer in the archive",
      "summary": "Prerequisite: the archive has a drawer free. Science Ministry: a drawer is wood and lock, not a story.",
      "category": "Invest",
      "costs": {
        "marks": 70,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A drawer is funded. The relic stays put until the drawer exists."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": true
      },
      "visual": {
        "artId": "hero.relic",
        "animationId": "scan.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Science Ministry"
    },
    {
      "id": "35-OPT-05",
      "panelId": "35",
      "title": "Compare two provenance cards",
      "summary": "Prerequisite: both cards name the same object. Science Ministry: two stories, one object. Do not pick the prettier.",
      "category": "Investigate",
      "costs": {
        "marks": 20,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "The cards are compared and the disagreement is kept."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": true
      },
      "visual": {
        "artId": "hero.relic",
        "animationId": "scan.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Science Ministry"
    },
    {
      "id": "35-OPT-06",
      "panelId": "35",
      "title": "Wait for Maren's cleanser note",
      "summary": "Prerequisite: a relic may carry surface dust. Science Ministry: Maren clears the dust or we do not touch it.",
      "category": "Wait",
      "costs": {
        "marks": 0,
        "hours": 7,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Handling waits on the radiation medic's note."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": true,
        "reputation": false,
        "chronicle": false,
        "provenance": true
      },
      "visual": {
        "artId": "hero.relic",
        "animationId": "scan.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Science Ministry"
    },
    {
      "id": "35-OPT-07",
      "panelId": "35",
      "title": "Bargain coil time to test a dead tool",
      "summary": "Prerequisite: Florian has said the tool is inert. Science Ministry: dead means no heat. We still do not guess a use.",
      "category": "Negotiate",
      "costs": {
        "marks": 80,
        "hours": 8,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "A test is bargained under the inert claim."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": true,
        "provenance": true
      },
      "visual": {
        "artId": "hero.relic",
        "animationId": "scan.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Science Ministry"
    },
    {
      "id": "35-OPT-08",
      "panelId": "35",
      "title": "Review what must never be duplicated",
      "summary": "Prerequisite: the unique list is in the vault rules. Science Ministry: unique means one. The rule is older than this test.",
      "category": "Order",
      "costs": {
        "marks": 0,
        "hours": 9,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The unique list is reviewed. Nothing is copied."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": true
      },
      "visual": {
        "artId": "hero.relic",
        "animationId": "scan.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Science Ministry"
    }
  ],
  "36": [
    {
      "id": "36-OPT-01",
      "panelId": "36",
      "title": "Read the cast roll aloud",
      "summary": "Prerequisite: the personnel roll matches the known household. Personnel Office: if they are not on the card, they are not in the hall.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Names are read. No one is added."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.cast",
        "animationId": "graph.edge.pulse"
      },
      "sfx": "confirm",
      "advisorId": "Personnel Office"
    },
    {
      "id": "36-OPT-02",
      "panelId": "36",
      "title": "Confirm the three wives' order",
      "summary": "Prerequisite: Dagmar, Adelheid, and Vera are the active wives. Personnel Office: three wives. Marta is not an active wife of this Fist.",
      "category": "Order",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The order is confirmed. No fourth wife is entered."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.cast",
        "animationId": "graph.edge.pulse"
      },
      "sfx": "confirm",
      "advisorId": "Personnel Office"
    },
    {
      "id": "36-OPT-03",
      "panelId": "36",
      "title": "Note Elara's five Iron Guard",
      "summary": "Prerequisite: the five names are on Elara's book. Personnel Office: Sigrid, Mira, Anja, Freja, and the fifth she names. Not a crowd.",
      "category": "Delegate",
      "costs": {
        "marks": 10,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The five are noted. A sixth is not created."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.cast",
        "animationId": "graph.edge.pulse"
      },
      "sfx": "confirm",
      "advisorId": "Personnel Office"
    },
    {
      "id": "36-OPT-04",
      "panelId": "36",
      "title": "Ask where Luka stands on the roll",
      "summary": "Prerequisite: the roll already acknowledges him. Personnel Office: acknowledged son is the phrase we already use.",
      "category": "Invest",
      "costs": {
        "marks": 15,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "His acknowledgment is read, not expanded into a title."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.cast",
        "animationId": "graph.edge.pulse"
      },
      "sfx": "confirm",
      "advisorId": "Personnel Office"
    },
    {
      "id": "36-OPT-05",
      "panelId": "36",
      "title": "Check the retired against the active",
      "summary": "Prerequisite: Hanne's retirement is the question on the sheet. Personnel Office: retired is not missing. It is written.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Retired names are checked off the active roster."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.cast",
        "animationId": "graph.edge.pulse"
      },
      "sfx": "confirm",
      "advisorId": "Personnel Office"
    }
  ],
  "37": [
    {
      "id": "37-OPT-01",
      "panelId": "37",
      "title": "Read the chapel clock against the calendar",
      "summary": "Prerequisite: the chapel clock runs and the calendar is posted. Samer Vogt: the chapel clock tells the hour. It does not tell a private plot.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Clock and calendar are compared. No secret schedule is revealed."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.clocks",
        "animationId": "clock.tick"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "37-OPT-02",
      "panelId": "37",
      "title": "Set the log to Ironday's open",
      "summary": "Prerequisite: today is Ironday or the slate says so. Samer Vogt: Ironday starts when the slate says, not when we feel late.",
      "category": "Order",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The log is set to the council day's open."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.clocks",
        "animationId": "clock.tick"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "37-OPT-03",
      "panelId": "37",
      "title": "Ask the Time Office which weekday was skipped",
      "summary": "Prerequisite: a skip is alleged in the book. Samer Vogt: a missing day is a missing page. Find the page.",
      "category": "Delegate",
      "costs": {
        "marks": 20,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "A skipped weekday is investigated as a clerical error."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.clocks",
        "animationId": "clock.tick"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "37-OPT-04",
      "panelId": "37",
      "title": "Hold announcements through Ashday",
      "summary": "Prerequisite: Ashday is the rest day named. Samer Vogt: Ashday keeps its quiet.",
      "category": "Invest",
      "costs": {
        "marks": 10,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Announcements wait out the rest rite."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.clocks",
        "animationId": "clock.tick"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "37-OPT-05",
      "panelId": "37",
      "title": "Mark the approach of the Dead Days",
      "summary": "Prerequisite: Endmonth is on the calendar. Samer Vogt: five dead days come after Endmonth. We do not invent a sixth.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The approach is marked. The days are not skipped in advance."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.clocks",
        "animationId": "clock.tick"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    }
  ],
  "38": [
    {
      "id": "38-OPT-01",
      "panelId": "38",
      "title": "Read the household attention slate",
      "summary": "Prerequisite: the Household Office has written who asked for time. Household Office: people ask for time. We do not score them.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The slate of requests is read. No private measure is shown."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.household",
        "animationId": "memory.fade"
      },
      "sfx": "confirm",
      "advisorId": "Household Office"
    },
    {
      "id": "38-OPT-02",
      "panelId": "38",
      "title": "Sit an hour with Dagmar",
      "summary": "Prerequisite: she has asked or the slate names her. Household Office: the First Wife's hour is not a negotiation.",
      "category": "Order",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "An hour is given. No policy is attached."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.household",
        "animationId": "memory.fade"
      },
      "sfx": "confirm",
      "advisorId": "Household Office"
    },
    {
      "id": "38-OPT-03",
      "panelId": "38",
      "title": "Give Liese the library hour",
      "summary": "Prerequisite: lessons are done. Household Office: Liese's hour is a book, not a council.",
      "category": "Delegate",
      "costs": {
        "marks": 10,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "A library hour is granted."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.household",
        "animationId": "memory.fade"
      },
      "sfx": "confirm",
      "advisorId": "Household Office"
    },
    {
      "id": "38-OPT-04",
      "panelId": "38",
      "title": "Ask Adelheid if the envoy hour can wait",
      "summary": "Prerequisite: an envoy and the household both want the evening. Household Office: Adelheid can say which hour is the House's.",
      "category": "Invest",
      "costs": {
        "marks": 15,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The question is asked. The envoy is not insulted by silence alone."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.household",
        "animationId": "memory.fade"
      },
      "sfx": "confirm",
      "advisorId": "Household Office"
    },
    {
      "id": "38-OPT-05",
      "panelId": "38",
      "title": "Note a missed meal without a judgment",
      "summary": "Prerequisite: a meal was missed and the reason is unstated. Household Office: a missed meal is a fact. Kindness is not a number.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The miss is noted. No motive is written."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.household",
        "animationId": "memory.fade"
      },
      "sfx": "confirm",
      "advisorId": "Household Office"
    }
  ],
  "39": [
    {
      "id": "39-OPT-01",
      "panelId": "39",
      "title": "Open the personal vault index",
      "summary": "Prerequisite: the vault is locked and the index is here. Archive Office: the index is not the key.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The index is opened. Nothing leaves the vault."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "vault.personal",
        "animationId": "vault.open"
      },
      "sfx": "confirm",
      "advisorId": "Archive Office"
    },
    {
      "id": "39-OPT-02",
      "panelId": "39",
      "title": "Withdraw the named ceremonial gift",
      "summary": "Prerequisite: the gift is on the index and Adelheid asked. Archive Office: it leaves when a hand signs, not when a wish does.",
      "category": "Order",
      "costs": {
        "marks": 40,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "One named gift is withdrawn and the line is struck only when it leaves."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "vault.personal",
        "animationId": "vault.open"
      },
      "sfx": "confirm",
      "advisorId": "Archive Office"
    },
    {
      "id": "39-OPT-03",
      "panelId": "39",
      "title": "Refuse a loan of a unique piece",
      "summary": "Prerequisite: someone has asked to borrow a unique item. Archive Office: unique does not go walking.",
      "category": "Delegate",
      "costs": {
        "marks": 0,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The loan is refused. The piece stays."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "vault.personal",
        "animationId": "vault.open"
      },
      "sfx": "confirm",
      "advisorId": "Archive Office"
    },
    {
      "id": "39-OPT-04",
      "panelId": "39",
      "title": "Ask Kolb to witness a deposit",
      "summary": "Prerequisite: Emmerich Kolb can attend. Archive Office: Kolb's eyes are the second lock.",
      "category": "Invest",
      "costs": {
        "marks": 20,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A deposit is witnessed."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "vault.personal",
        "animationId": "vault.open"
      },
      "sfx": "confirm",
      "advisorId": "Archive Office"
    },
    {
      "id": "39-OPT-05",
      "panelId": "39",
      "title": "Compare the index to the shelf",
      "summary": "Prerequisite: both can be seen today. Archive Office: if the shelf is empty, do not draw a twin.",
      "category": "Investigate",
      "costs": {
        "marks": 15,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "Index and shelf are compared. Missing is reported, not replaced."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "vault.personal",
        "animationId": "vault.open"
      },
      "sfx": "confirm",
      "advisorId": "Archive Office"
    }
  ],
  "40": [
    {
      "id": "40-OPT-01",
      "panelId": "40",
      "title": "Open the faction vault door log",
      "summary": "Prerequisite: the door log is today's. Archive Office: a log is a memory of the door.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The log is read. The door is not opened by the reading."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "vault.faction",
        "animationId": "vault.door"
      },
      "sfx": "confirm",
      "advisorId": "Archive Office"
    },
    {
      "id": "40-OPT-02",
      "panelId": "40",
      "title": "Deposit a Red Claw charter copy",
      "summary": "Prerequisite: the copy is already certified. Archive Office: a copy is labeled copy.",
      "category": "Order",
      "costs": {
        "marks": 30,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A copy is deposited. The original is not implied to move."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "vault.faction",
        "animationId": "vault.door"
      },
      "sfx": "confirm",
      "advisorId": "Archive Office"
    },
    {
      "id": "40-OPT-03",
      "panelId": "40",
      "title": "Ask who last signed the faction shelf",
      "summary": "Prerequisite: the sign-out line is incomplete. Archive Office: no signature, no story about who took it.",
      "category": "Delegate",
      "costs": {
        "marks": 10,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The last signature is asked for."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "vault.faction",
        "animationId": "vault.door"
      },
      "sfx": "confirm",
      "advisorId": "Archive Office"
    },
    {
      "id": "40-OPT-04",
      "panelId": "40",
      "title": "Fund a second lock for the faction shelf",
      "summary": "Prerequisite: the shelf is the named one. Archive Office: a lock on order is not a lock on the door.",
      "category": "Invest",
      "costs": {
        "marks": 80,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "A lock is funded. It is not yet fitted."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "vault.faction",
        "animationId": "vault.door"
      },
      "sfx": "confirm",
      "advisorId": "Archive Office"
    },
    {
      "id": "40-OPT-05",
      "panelId": "40",
      "title": "Flag a faction item with two owners",
      "summary": "Prerequisite: two factions' cards name one object. Archive Office: two owners is a dispute, not a fact we pick.",
      "category": "Investigate",
      "costs": {
        "marks": 25,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "The double claim is flagged."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "vault.faction",
        "animationId": "vault.door"
      },
      "sfx": "confirm",
      "advisorId": "Archive Office"
    }
  ],
  "41": [
    {
      "id": "41-OPT-01",
      "panelId": "41",
      "title": "Open the Lore Atlas at the gates",
      "summary": "Prerequisite: the atlas page for the four gates is unlocked. Archive Office: North, East, West, South. Do not add a fifth.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The gate pages are opened as written."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.atlas",
        "animationId": "map.pulse"
      },
      "sfx": "confirm",
      "advisorId": "Archive Office"
    },
    {
      "id": "41-OPT-02",
      "panelId": "41",
      "title": "Read the forty-two lines page",
      "summary": "Prerequisite: the tunnel page is in the atlas. Archive Office: forty-two is the count we inherited.",
      "category": "Order",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The tunnel page is read without new lines."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.atlas",
        "animationId": "map.pulse"
      },
      "sfx": "confirm",
      "advisorId": "Archive Office"
    },
    {
      "id": "41-OPT-03",
      "panelId": "41",
      "title": "Ask for the Catastrophe entry's state",
      "summary": "Prerequisite: the entry exists as known, partial, or unknown. Archive Office: unknown stays unknown until a source arrives.",
      "category": "Delegate",
      "costs": {
        "marks": 10,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The entry's state is asked, not upgraded by desire."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.atlas",
        "animationId": "map.pulse"
      },
      "sfx": "confirm",
      "advisorId": "Archive Office"
    },
    {
      "id": "41-OPT-04",
      "panelId": "41",
      "title": "Pin the pre-war film place as a question",
      "summary": "Prerequisite: the film card is only a question. Archive Office: where the film was shot is not a discovery until someone stands there.",
      "category": "Invest",
      "costs": {
        "marks": 15,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The place stays a question."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.atlas",
        "animationId": "map.pulse"
      },
      "sfx": "confirm",
      "advisorId": "Archive Office"
    },
    {
      "id": "41-OPT-05",
      "panelId": "41",
      "title": "Correct an atlas line that contradicts a witness",
      "summary": "Prerequisite: a witness contradicts the page. Archive Office: the atlas changes by evidence, not by taste.",
      "category": "Investigate",
      "costs": {
        "marks": 20,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "The correction is proposed beside the old line."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.atlas",
        "animationId": "map.pulse"
      },
      "sfx": "confirm",
      "advisorId": "Archive Office"
    }
  ],
  "42": [
    {
      "id": "42-OPT-01",
      "panelId": "42",
      "title": "Warm the radio booth",
      "summary": "Prerequisite: Samer is assigned to the booth. Samer Vogt: heat first. Words second.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The booth is warmed. Nothing is broadcast."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "radio.booth",
        "animationId": "radio.dial"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "42-OPT-02",
      "panelId": "42",
      "title": "Cut a short Voice of the Fist note",
      "summary": "Prerequisite: the note is approved. Samer Vogt: short enough to be true.",
      "category": "Order",
      "costs": {
        "marks": 20,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A short note is cut for broadcast."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "radio.booth",
        "animationId": "radio.dial"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "42-OPT-03",
      "panelId": "42",
      "title": "Ask Ilse Wern for a surface check",
      "summary": "Prerequisite: the garrison radio hand can answer. Samer Vogt: if Ilse does not answer, we have silence, not news.",
      "category": "Delegate",
      "costs": {
        "marks": 30,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "A check is asked. Static is not a message."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "radio.booth",
        "animationId": "radio.dial"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "42-OPT-04",
      "panelId": "42",
      "title": "Spend coil time on the transmitter",
      "summary": "Prerequisite: Florian has cleared a short draw. Samer Vogt: the coil is the voice's blood. Log it.",
      "category": "Invest",
      "costs": {
        "marks": 50,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "Transmitter time is spent from a cleared draw."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "radio.booth",
        "animationId": "radio.dial"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "42-OPT-05",
      "panelId": "42",
      "title": "Hold the Underrows story off the air",
      "summary": "Prerequisite: the story is only a whisper. Samer Vogt: we do not broadcast a kitchen echo.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The story stays off the air."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "radio.booth",
        "animationId": "radio.dial"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "42-OPT-06",
      "panelId": "42",
      "title": "Wait for the Voiceday hour",
      "summary": "Prerequisite: Voiceday is the public address day. Samer Vogt: the city knows which day I speak.",
      "category": "Wait",
      "costs": {
        "marks": 0,
        "hours": 7,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The booth waits for Voiceday."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": true,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "radio.booth",
        "animationId": "radio.dial"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "42-OPT-07",
      "panelId": "42",
      "title": "Offer the Demos a printed transcript",
      "summary": "Prerequisite: Johanna Weiss asked for words on paper. Samer Vogt: I will not send a speech I did not give.",
      "category": "Negotiate",
      "costs": {
        "marks": 25,
        "hours": 8,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A transcript is offered after the words were actually spoken."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "radio.booth",
        "animationId": "radio.dial"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "42-OPT-08",
      "panelId": "42",
      "title": "Review the booth log against the chronicle",
      "summary": "Prerequisite: both books are here. Samer Vogt: if they disagree, the air and the page both stay.",
      "category": "Order",
      "costs": {
        "marks": 10,
        "hours": 9,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The log and the chronicle are compared."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "radio.booth",
        "animationId": "radio.dial"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    }
  ],
  "43": [
    {
      "id": "43-OPT-01",
      "panelId": "43",
      "title": "Thread the projector",
      "summary": "Prerequisite: the projector is in the archive and has a lamp. House Archive: a projector is a machine. The film is the question.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The projector is threaded. No film is declared authentic."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.projector",
        "animationId": "projector.flicker"
      },
      "sfx": "confirm",
      "advisorId": "House Archive"
    },
    {
      "id": "43-OPT-02",
      "panelId": "43",
      "title": "Ask Kolb which reel is safe",
      "summary": "Prerequisite: Emmerich Kolb is with the reels. House Archive: Kolb says which reel will not burn.",
      "category": "Order",
      "costs": {
        "marks": 15,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A reel is asked for. It is not screened yet."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.projector",
        "animationId": "projector.flicker"
      },
      "sfx": "confirm",
      "advisorId": "House Archive"
    },
    {
      "id": "43-OPT-03",
      "panelId": "43",
      "title": "Screen for the House only",
      "summary": "Prerequisite: Wilhelmina has allowed a house showing. House Archive: the House may look. The city has not been invited.",
      "category": "Delegate",
      "costs": {
        "marks": 40,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A house screening is set, not a public one."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.projector",
        "animationId": "projector.flicker"
      },
      "sfx": "confirm",
      "advisorId": "House Archive"
    },
    {
      "id": "43-OPT-04",
      "panelId": "43",
      "title": "Fund a lamp for the archive projector",
      "summary": "Prerequisite: Stores or the energy circle can spare it. House Archive: without a lamp the reel is a rumor.",
      "category": "Invest",
      "costs": {
        "marks": 60,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "A lamp is funded."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.projector",
        "animationId": "projector.flicker"
      },
      "sfx": "confirm",
      "advisorId": "House Archive"
    },
    {
      "id": "43-OPT-05",
      "panelId": "43",
      "title": "Mark the pre-war film as unlocated",
      "summary": "Prerequisite: no one has stood at the shooting place. House Archive: unlocated is the honest word.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The film's origin stays unlocated."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.projector",
        "animationId": "projector.flicker"
      },
      "sfx": "confirm",
      "advisorId": "House Archive"
    },
    {
      "id": "43-OPT-06",
      "panelId": "43",
      "title": "Wait for Maren to clear the reel case",
      "summary": "Prerequisite: the case came from the surface. House Archive: ash on a case is not nostalgia.",
      "category": "Wait",
      "costs": {
        "marks": 0,
        "hours": 7,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The case waits on the cleanser."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": true,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.projector",
        "animationId": "projector.flicker"
      },
      "sfx": "confirm",
      "advisorId": "House Archive"
    },
    {
      "id": "43-OPT-07",
      "panelId": "43",
      "title": "Trade a reel copy with the Demos archive",
      "summary": "Prerequisite: they have asked and we have a copy, not the only reel. House Archive: a copy can travel. The only one cannot.",
      "category": "Negotiate",
      "costs": {
        "marks": 80,
        "hours": 8,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "A copy is offered for trade. The sole reel is not."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.projector",
        "animationId": "projector.flicker"
      },
      "sfx": "confirm",
      "advisorId": "House Archive"
    },
    {
      "id": "43-OPT-08",
      "panelId": "43",
      "title": "Review who may sit in the dark",
      "summary": "Prerequisite: the seating list is the House. House Archive: the dark is not a second council.",
      "category": "Order",
      "costs": {
        "marks": 10,
        "hours": 9,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The list is reviewed."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.projector",
        "animationId": "projector.flicker"
      },
      "sfx": "confirm",
      "advisorId": "House Archive"
    }
  ],
  "44": [
    {
      "id": "44-OPT-01",
      "panelId": "44",
      "title": "Read today's event ledger",
      "summary": "Prerequisite: the ledger is open on the archive desk. Archive Office: the ledger takes what was done, in order.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Today's events are read as written."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.ledger",
        "animationId": "ledger.stamp"
      },
      "sfx": "confirm",
      "advisorId": "Archive Office"
    },
    {
      "id": "44-OPT-02",
      "panelId": "44",
      "title": "Enter the gate reinforcement as an event",
      "summary": "Prerequisite: the reinforcement was actually ordered. Archive Office: ordered is not completed.",
      "category": "Order",
      "costs": {
        "marks": 10,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The order is entered as an order, not as a finished repair."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.ledger",
        "animationId": "ledger.stamp"
      },
      "sfx": "confirm",
      "advisorId": "Archive Office"
    },
    {
      "id": "44-OPT-03",
      "panelId": "44",
      "title": "Ask which event still lacks a witness",
      "summary": "Prerequisite: a line has no witness name. Archive Office: no witness, the line stays thin.",
      "category": "Delegate",
      "costs": {
        "marks": 0,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The gap is marked."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.ledger",
        "animationId": "ledger.stamp"
      },
      "sfx": "confirm",
      "advisorId": "Archive Office"
    },
    {
      "id": "44-OPT-04",
      "panelId": "44",
      "title": "Stamp a ledger line into the chronicle",
      "summary": "Prerequisite: the line is already witnessed. Archive Office: the chronicle does not take rumors from this book.",
      "category": "Invest",
      "costs": {
        "marks": 15,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A witnessed line is offered to the chronicle."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.ledger",
        "animationId": "ledger.stamp"
      },
      "sfx": "confirm",
      "advisorId": "Archive Office"
    },
    {
      "id": "44-OPT-05",
      "panelId": "44",
      "title": "Correct an event time against the chapel clock",
      "summary": "Prerequisite: the clock and the line disagree. Archive Office: strike the hour. Do not pretend we always knew.",
      "category": "Investigate",
      "costs": {
        "marks": 10,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The time is corrected and the old time is struck."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.ledger",
        "animationId": "ledger.stamp"
      },
      "sfx": "confirm",
      "advisorId": "Archive Office"
    }
  ],
  "45": [
    {
      "id": "45-OPT-01",
      "panelId": "45",
      "title": "Accept offer",
      "summary": "Prerequisite: an open foreign offer is on the desk. Treasury Minister: accepting spends the offer. It does not invent a second one.",
      "category": "Investigate",
      "costs": {
        "marks": 40,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The open offer is accepted through the trade desk."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": true
      },
      "visual": {
        "artId": "hero.trade",
        "animationId": "scales.balance"
      },
      "sfx": "confirm",
      "advisorId": "Treasury Minister"
    },
    {
      "id": "45-OPT-02",
      "panelId": "45",
      "title": "Counter the Urre-aza price",
      "summary": "Prerequisite: the offer prices Urre-aza or another named food. Treasury Minister: name the crop. Do not haggle a fog.",
      "category": "Order",
      "costs": {
        "marks": 30,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A price counter is sent. The goods stay put."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": true
      },
      "visual": {
        "artId": "hero.trade",
        "animationId": "scales.balance"
      },
      "sfx": "confirm",
      "advisorId": "Treasury Minister"
    },
    {
      "id": "45-OPT-03",
      "panelId": "45",
      "title": "Counter with Chako instead of water",
      "summary": "Prerequisite: water is the leverage and Chako is on the shelf. Treasury Minister: water is leverage. Do not spill it for a compliment.",
      "category": "Delegate",
      "costs": {
        "marks": 50,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "The counter changes goods, not the border."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": true
      },
      "visual": {
        "artId": "hero.trade",
        "animationId": "scales.balance"
      },
      "sfx": "confirm",
      "advisorId": "Treasury Minister"
    },
    {
      "id": "45-OPT-04",
      "panelId": "45",
      "title": "Ask Bohdan for another day",
      "summary": "Prerequisite: Envoy Bohdan's offer has a clock he named. Treasury Minister: a day asked is not a day stolen.",
      "category": "Invest",
      "costs": {
        "marks": 0,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Time is asked. The offer is not rewritten in his absence."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": true
      },
      "visual": {
        "artId": "hero.trade",
        "animationId": "scales.balance"
      },
      "sfx": "confirm",
      "advisorId": "Treasury Minister"
    },
    {
      "id": "45-OPT-05",
      "panelId": "45",
      "title": "Offer a labor-transfer contract",
      "summary": "Prerequisite: both sides already use registered contracts. Treasury Minister: if it is not registered, it is not a contract.",
      "category": "Investigate",
      "costs": {
        "marks": 80,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "A registered contract is offered, not a quiet sale of people."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": true
      },
      "visual": {
        "artId": "hero.trade",
        "animationId": "scales.balance"
      },
      "sfx": "confirm",
      "advisorId": "Treasury Minister"
    },
    {
      "id": "45-OPT-06",
      "panelId": "45",
      "title": "Demand a North Gate guarantee",
      "summary": "Prerequisite: the goods would enter by the northern rail. Treasury Minister: no guarantee, no crate through the North Gate.",
      "category": "Wait",
      "costs": {
        "marks": 20,
        "hours": 7,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "A guarantee is demanded before the crate moves."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": true,
        "reputation": false,
        "chronicle": false,
        "provenance": true
      },
      "visual": {
        "artId": "hero.trade",
        "animationId": "scales.balance"
      },
      "sfx": "confirm",
      "advisorId": "Treasury Minister"
    },
    {
      "id": "45-OPT-07",
      "panelId": "45",
      "title": "Decline Seraphine's house price",
      "summary": "Prerequisite: Countess Seraphine's price is the one on the sheet. Treasury Minister: Monarchia can hear a no.",
      "category": "Negotiate",
      "costs": {
        "marks": 0,
        "hours": 8,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The price is declined politely and the sheet is kept."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": true,
        "provenance": true
      },
      "visual": {
        "artId": "hero.trade",
        "animationId": "scales.balance"
      },
      "sfx": "confirm",
      "advisorId": "Treasury Minister"
    },
    {
      "id": "45-OPT-08",
      "panelId": "45",
      "title": "Inspect the Harrimokodun pens note",
      "summary": "Prerequisite: a livestock note is attached to the offer. Treasury Minister: Harrimokodun do not walk on a promise.",
      "category": "Order",
      "costs": {
        "marks": 15,
        "hours": 9,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The pens note is inspected. Beasts are not moved today."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": true
      },
      "visual": {
        "artId": "hero.trade",
        "animationId": "scales.balance"
      },
      "sfx": "confirm",
      "advisorId": "Treasury Minister"
    }
  ],
  "46": [
    {
      "id": "46-OPT-01",
      "panelId": "46",
      "title": "Read the world clock against Endmonth",
      "summary": "Prerequisite: the calendar is posted. Time Office: Endmonth still has its thirty days.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The date is read. Nothing is skipped."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.time",
        "animationId": "clock.tick"
      },
      "sfx": "confirm",
      "advisorId": "Time Office"
    },
    {
      "id": "46-OPT-02",
      "panelId": "46",
      "title": "Name the next Dead Day aloud",
      "summary": "Prerequisite: the year is near the five dead days. Time Office: First Light follows the five. We do not arrive early.",
      "category": "Order",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The next dead day is named, not jumped."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.time",
        "animationId": "clock.tick"
      },
      "sfx": "confirm",
      "advisorId": "Time Office"
    },
    {
      "id": "46-OPT-03",
      "panelId": "46",
      "title": "Ask why a weekday page is thin",
      "summary": "Prerequisite: a page looks short against the chapel clock. Time Office: a thin day is a clerk's problem until it is a missing day.",
      "category": "Delegate",
      "costs": {
        "marks": 10,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A thin page is questioned."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.time",
        "animationId": "clock.tick"
      },
      "sfx": "confirm",
      "advisorId": "Time Office"
    },
    {
      "id": "46-OPT-04",
      "panelId": "46",
      "title": "Hold the year-turn until the archive seals",
      "summary": "Prerequisite: House Archive has not sealed Endmonth. Time Office: the archive seals the year. We only count it.",
      "category": "Invest",
      "costs": {
        "marks": 0,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The year does not turn in this office alone."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.time",
        "animationId": "clock.tick"
      },
      "sfx": "confirm",
      "advisorId": "Time Office"
    },
    {
      "id": "46-OPT-05",
      "panelId": "46",
      "title": "Set Voiceday on the public board",
      "summary": "Prerequisite: the board still shows the old weekday. Time Office: the city already knows the seven days. Post them anyway.",
      "category": "Investigate",
      "costs": {
        "marks": 5,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Voiceday is posted as the address day."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.time",
        "animationId": "clock.tick"
      },
      "sfx": "confirm",
      "advisorId": "Time Office"
    }
  ],
  "47": [
    {
      "id": "47-OPT-01",
      "panelId": "47",
      "title": "Read a provenance card aloud",
      "summary": "Prerequisite: the card is in the viewer. Archive Office: the card says where it was. Not where we wish it.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The card is read from its own words."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": true
      },
      "visual": {
        "artId": "hero.provenance",
        "animationId": "serial.scan"
      },
      "sfx": "confirm",
      "advisorId": "Archive Office"
    },
    {
      "id": "47-OPT-02",
      "panelId": "47",
      "title": "Trace a Mark IV serial to the rack",
      "summary": "Prerequisite: Hans Kessler's rack card is here. Archive Office: if the rack has no such suit, say so.",
      "category": "Order",
      "costs": {
        "marks": 20,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The serial is traced to a rack, or the trace fails honestly."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": true
      },
      "visual": {
        "artId": "hero.provenance",
        "animationId": "serial.scan"
      },
      "sfx": "confirm",
      "advisorId": "Archive Office"
    },
    {
      "id": "47-OPT-03",
      "panelId": "47",
      "title": "Ask Kolb to confirm a deposit line",
      "summary": "Prerequisite: Emmerich Kolb witnessed or did not. Archive Office: Kolb's no is also an answer.",
      "category": "Delegate",
      "costs": {
        "marks": 10,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Confirmation is asked of the keeper."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": true
      },
      "visual": {
        "artId": "hero.provenance",
        "animationId": "serial.scan"
      },
      "sfx": "confirm",
      "advisorId": "Archive Office"
    },
    {
      "id": "47-OPT-04",
      "panelId": "47",
      "title": "Flag a card with no prior holder",
      "summary": "Prerequisite: the prior-holder line is blank. Archive Office: blank is not 'unknown person.' It is blank.",
      "category": "Invest",
      "costs": {
        "marks": 15,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "The blank is flagged. A holder is not invented."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": true
      },
      "visual": {
        "artId": "hero.provenance",
        "animationId": "serial.scan"
      },
      "sfx": "confirm",
      "advisorId": "Archive Office"
    },
    {
      "id": "47-OPT-05",
      "panelId": "47",
      "title": "Compare the viewer to the faction vault log",
      "summary": "Prerequisite: both are open. Archive Office: a viewer does not outrank the door log.",
      "category": "Investigate",
      "costs": {
        "marks": 20,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "The two records are compared."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": true
      },
      "visual": {
        "artId": "hero.provenance",
        "animationId": "serial.scan"
      },
      "sfx": "confirm",
      "advisorId": "Archive Office"
    }
  ],
  "48": [
    {
      "id": "48-OPT-01",
      "panelId": "48",
      "title": "Read what an NPC may speak of",
      "summary": "Prerequisite: the memory card lists what they know. Personnel Office: they do not know what we forgot to tell them.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Only the written knowledge is treated as speakable."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.memory",
        "animationId": "memory.fade"
      },
      "sfx": "confirm",
      "advisorId": "Personnel Office"
    },
    {
      "id": "48-OPT-02",
      "panelId": "48",
      "title": "Ask Ruth what Lorenz told her",
      "summary": "Prerequisite: Ruth is the physician's assistant. Personnel Office: Ruth remembers the infirmary, not the council.",
      "category": "Order",
      "costs": {
        "marks": 10,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A memory is asked, not planted."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.memory",
        "animationId": "memory.fade"
      },
      "sfx": "confirm",
      "advisorId": "Personnel Office"
    },
    {
      "id": "48-OPT-03",
      "panelId": "48",
      "title": "Note a contradiction in two memories",
      "summary": "Prerequisite: two cards disagree. Personnel Office: disagreement is not a crime.",
      "category": "Delegate",
      "costs": {
        "marks": 0,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The contradiction is noted and neither card is erased."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.memory",
        "animationId": "memory.fade"
      },
      "sfx": "confirm",
      "advisorId": "Personnel Office"
    },
    {
      "id": "48-OPT-04",
      "panelId": "48",
      "title": "File a new witnessed memory",
      "summary": "Prerequisite: a witness is willing to sign. Personnel Office: unwitnessed recollection stays labeled as recollection.",
      "category": "Invest",
      "costs": {
        "marks": 15,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A witnessed memory is filed as witnessed."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.memory",
        "animationId": "memory.fade"
      },
      "sfx": "confirm",
      "advisorId": "Personnel Office"
    },
    {
      "id": "48-OPT-05",
      "panelId": "48",
      "title": "Refuse to backfill a blank mind",
      "summary": "Prerequisite: the card's unknown field is empty. Personnel Office: we do not pour our knowledge into their heads.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The blank stays blank."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.memory",
        "animationId": "memory.fade"
      },
      "sfx": "confirm",
      "advisorId": "Personnel Office"
    }
  ],
  "49": [
    {
      "id": "49-OPT-01",
      "panelId": "49",
      "title": "Read the reputation words on the slate",
      "summary": "Prerequisite: the slate uses words, not private scores. Household Office: say trusted, strained, or unknown. Do not say a figure.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The public words are read."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.reputation",
        "animationId": "bar.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Household Office"
    },
    {
      "id": "49-OPT-02",
      "panelId": "49",
      "title": "Ask how the Underrows speak of the Fist",
      "summary": "Prerequisite: a listener has already reported phrases. Household Office: how they speak is not how they will act.",
      "category": "Order",
      "costs": {
        "marks": 20,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Phrases are collected as rumor."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.reputation",
        "animationId": "bar.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Household Office"
    },
    {
      "id": "49-OPT-03",
      "panelId": "49",
      "title": "Record a courtesy from Seraphine",
      "summary": "Prerequisite: a courtesy was actually paid. Household Office: one courtesy is not a friendship.",
      "category": "Delegate",
      "costs": {
        "marks": 10,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The courtesy is recorded as an act."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.reputation",
        "animationId": "bar.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Household Office"
    },
    {
      "id": "49-OPT-04",
      "panelId": "49",
      "title": "Note a slight at the North Gate",
      "summary": "Prerequisite: a slight was witnessed. Household Office: a slight needs a witness.",
      "category": "Invest",
      "costs": {
        "marks": 15,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "The slight is noted for the desk, not avenged here."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.reputation",
        "animationId": "bar.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Household Office"
    },
    {
      "id": "49-OPT-05",
      "panelId": "49",
      "title": "Separate rumor from a house opinion",
      "summary": "Prerequisite: both exist on the slate. Household Office: the House's view is not the city's view.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Rumor and house opinion are marked apart."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.reputation",
        "animationId": "bar.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Household Office"
    }
  ],
  "50": [
    {
      "id": "50-OPT-01",
      "panelId": "50",
      "title": "Open the Audience Hall doors",
      "summary": "Prerequisite: petitioners are actually waiting. Wilhelmina Red: count the bodies. Do not count hopes.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The doors open on the people who are there."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.audience",
        "animationId": "door.open"
      },
      "sfx": "confirm",
      "advisorId": "Wilhelmina Red"
    },
    {
      "id": "50-OPT-02",
      "panelId": "50",
      "title": "Hear Overseer Brun Maurer first",
      "summary": "Prerequisite: Brun is on the list. Wilhelmina Red: the Underrows get a turn, not the hall.",
      "category": "Order",
      "costs": {
        "marks": 10,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The overseer is heard in order."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.audience",
        "animationId": "door.open"
      },
      "sfx": "confirm",
      "advisorId": "Wilhelmina Red"
    },
    {
      "id": "50-OPT-03",
      "panelId": "50",
      "title": "Give Jana the runner's place by the door",
      "summary": "Prerequisite: Jana is on duty. Wilhelmina Red: Jana carries what you decide. She does not decide.",
      "category": "Delegate",
      "costs": {
        "marks": 0,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The runner stands where messages can leave."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.audience",
        "animationId": "door.open"
      },
      "sfx": "confirm",
      "advisorId": "Wilhelmina Red"
    },
    {
      "id": "50-OPT-04",
      "panelId": "50",
      "title": "Refuse an audience without a name",
      "summary": "Prerequisite: the petitioner will not give a name. Wilhelmina Red: no name, no chair.",
      "category": "Invest",
      "costs": {
        "marks": 0,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Nameless audience is refused."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.audience",
        "animationId": "door.open"
      },
      "sfx": "confirm",
      "advisorId": "Wilhelmina Red"
    },
    {
      "id": "50-OPT-05",
      "panelId": "50",
      "title": "Hear a bound-labor plea",
      "summary": "Prerequisite: the plea is on the slate. Wilhelmina Red: hearing is not pardon.",
      "category": "Investigate",
      "costs": {
        "marks": 20,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The plea is heard and sent to Klein if it is law."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.audience",
        "animationId": "door.open"
      },
      "sfx": "confirm",
      "advisorId": "Wilhelmina Red"
    },
    {
      "id": "50-OPT-06",
      "panelId": "50",
      "title": "Hold the hall through the noon bell",
      "summary": "Prerequisite: the chapel clock has not struck. Wilhelmina Red: the bell ends the hour. Not your patience.",
      "category": "Wait",
      "costs": {
        "marks": 0,
        "hours": 7,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The hall stays open until the bell."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": true,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.audience",
        "animationId": "door.open"
      },
      "sfx": "confirm",
      "advisorId": "Wilhelmina Red"
    },
    {
      "id": "50-OPT-07",
      "panelId": "50",
      "title": "Ask Adelheid to translate a foreign plea",
      "summary": "Prerequisite: the plea is in a Monarchian or Grotsen form. Wilhelmina Red: do not judge a sentence you have not heard in our words.",
      "category": "Negotiate",
      "costs": {
        "marks": 25,
        "hours": 8,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Translation is asked before judgment."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.audience",
        "animationId": "door.open"
      },
      "sfx": "confirm",
      "advisorId": "Wilhelmina Red"
    },
    {
      "id": "50-OPT-08",
      "panelId": "50",
      "title": "Review who was turned away",
      "summary": "Prerequisite: the door list is written. Wilhelmina Red: turned away is not forgotten. It is delayed.",
      "category": "Order",
      "costs": {
        "marks": 10,
        "hours": 9,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The turned-away list is reviewed for a later day."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.audience",
        "animationId": "door.open"
      },
      "sfx": "confirm",
      "advisorId": "Wilhelmina Red"
    }
  ],
  "51": [
    {
      "id": "51-OPT-01",
      "panelId": "51",
      "title": "Read the prison roll with Otto Klein",
      "summary": "Prerequisite: Klein has the roll. Security Guard: the cells hold who the roll names.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The roll is read. No one is added."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.prison",
        "animationId": "ledger.stamp"
      },
      "sfx": "confirm",
      "advisorId": "Security Guard"
    },
    {
      "id": "51-OPT-02",
      "panelId": "51",
      "title": "Order supervised hard labor",
      "summary": "Prerequisite: Klein has already named that penalty. Security Guard: the law names the work. We do not invent a worse one.",
      "category": "Order",
      "costs": {
        "marks": 40,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "Hard labor is ordered only as the written penalty."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.prison",
        "animationId": "ledger.stamp"
      },
      "sfx": "confirm",
      "advisorId": "Security Guard"
    },
    {
      "id": "51-OPT-03",
      "panelId": "51",
      "title": "Hear Ewald Red's ward request",
      "summary": "Prerequisite: the cousin is held and has asked. Security Guard: a request from a cell is not a verdict.",
      "category": "Delegate",
      "costs": {
        "marks": 20,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A request is heard. The case is not closed."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.prison",
        "animationId": "ledger.stamp"
      },
      "sfx": "confirm",
      "advisorId": "Security Guard"
    },
    {
      "id": "51-OPT-04",
      "panelId": "51",
      "title": "Inspect the cell locks",
      "summary": "Prerequisite: Anselm or the guard can walk them. Security Guard: a lock that only looks shut is a rumor with iron.",
      "category": "Invest",
      "costs": {
        "marks": 15,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Locks are inspected."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.prison",
        "animationId": "ledger.stamp"
      },
      "sfx": "confirm",
      "advisorId": "Security Guard"
    },
    {
      "id": "51-OPT-05",
      "panelId": "51",
      "title": "Post the flogging list as written",
      "summary": "Prerequisite: the list is Klein's. Security Guard: if a name is not on his list, it is not on the post.",
      "category": "Investigate",
      "costs": {
        "marks": 10,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The list is posted unchanged."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.prison",
        "animationId": "ledger.stamp"
      },
      "sfx": "confirm",
      "advisorId": "Security Guard"
    },
    {
      "id": "51-OPT-06",
      "panelId": "51",
      "title": "Wait for the magistrate before a release",
      "summary": "Prerequisite: a release is requested and Klein is not here. Security Guard: we keep the door. He keeps the law.",
      "category": "Wait",
      "costs": {
        "marks": 0,
        "hours": 7,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "No release happens in his absence."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": true,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.prison",
        "animationId": "ledger.stamp"
      },
      "sfx": "confirm",
      "advisorId": "Security Guard"
    },
    {
      "id": "51-OPT-07",
      "panelId": "51",
      "title": "Move a laborer back to the Underrows",
      "summary": "Prerequisite: the sentence's labor term is ended on paper. Security Guard: the Underrows are quarters, not a second sentence.",
      "category": "Negotiate",
      "costs": {
        "marks": 30,
        "hours": 8,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "A return is ordered only if the paper says the term ended."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.prison",
        "animationId": "ledger.stamp"
      },
      "sfx": "confirm",
      "advisorId": "Security Guard"
    },
    {
      "id": "51-OPT-08",
      "panelId": "51",
      "title": "Review confiscations against the vault",
      "summary": "Prerequisite: confiscated goods were supposed to be logged. Security Guard: a seized thing that is not in the vault is missing.",
      "category": "Order",
      "costs": {
        "marks": 25,
        "hours": 9,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "Vault and confiscation list are compared."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.prison",
        "animationId": "ledger.stamp"
      },
      "sfx": "confirm",
      "advisorId": "Security Guard"
    }
  ],
  "52": [
    {
      "id": "52-OPT-01",
      "panelId": "52",
      "title": "Read Physician Lorenz's infirmary slate",
      "summary": "Prerequisite: Sabine Lorenz has posted it. Ministry of Medicine: Lorenz writes who is in the beds.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The slate is read. No one is declared cured."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.medical",
        "animationId": "bar.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Ministry of Medicine"
    },
    {
      "id": "52-OPT-02",
      "panelId": "52",
      "title": "Send Freja Dorn to assist Lorenz",
      "summary": "Prerequisite: Freja is not on a gate. Ministry of Medicine: Freja's hands are already known there.",
      "category": "Order",
      "costs": {
        "marks": 30,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A medic guard is sent to the infirmary."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.medical",
        "animationId": "bar.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Ministry of Medicine"
    },
    {
      "id": "52-OPT-03",
      "panelId": "52",
      "title": "Ask Ruth to fetch the fungal medicines",
      "summary": "Prerequisite: Ruth is on duty and the shelf has them. Ministry of Medicine: fungal stock is a shelf, not a miracle.",
      "category": "Delegate",
      "costs": {
        "marks": 20,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Medicines are fetched, not invented."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.medical",
        "animationId": "bar.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Ministry of Medicine"
    },
    {
      "id": "52-OPT-04",
      "panelId": "52",
      "title": "Isolate a fever bed",
      "summary": "Prerequisite: Lorenz has named a bed. Ministry of Medicine: isolation is a door. Write which door.",
      "category": "Invest",
      "costs": {
        "marks": 40,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "One bed is isolated."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.medical",
        "animationId": "bar.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Ministry of Medicine"
    },
    {
      "id": "52-OPT-05",
      "panelId": "52",
      "title": "Stock cleanser salts for Maren Red",
      "summary": "Prerequisite: Maren has asked and Stores can spare them. Ministry of Medicine: Maren treats ash. Give her the salts.",
      "category": "Investigate",
      "costs": {
        "marks": 50,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "Salts are stocked for the radiation medic."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.medical",
        "animationId": "bar.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Ministry of Medicine"
    },
    {
      "id": "52-OPT-06",
      "panelId": "52",
      "title": "Hold surgery until the lamp is steady",
      "summary": "Prerequisite: the infirmary lamp is failing. Ministry of Medicine: we do not cut in a story's darkness.",
      "category": "Wait",
      "costs": {
        "marks": 0,
        "hours": 7,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Surgery waits on light."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": true,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.medical",
        "animationId": "bar.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Ministry of Medicine"
    },
    {
      "id": "52-OPT-07",
      "panelId": "52",
      "title": "Bargain Stores for infirmary rations",
      "summary": "Prerequisite: Ilona can hear the ask. Ministry of Medicine: a sick ward eats. Put it on the slate.",
      "category": "Negotiate",
      "costs": {
        "marks": 35,
        "hours": 8,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Rations are bargained for the beds."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.medical",
        "animationId": "bar.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Ministry of Medicine"
    },
    {
      "id": "52-OPT-08",
      "panelId": "52",
      "title": "Review who is well enough for drill",
      "summary": "Prerequisite: Karin Voss has asked and Lorenz can answer. Ministry of Medicine: the drill line does not diagnose.",
      "category": "Order",
      "costs": {
        "marks": 10,
        "hours": 9,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Fitness for drill is asked of the physician."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.medical",
        "animationId": "bar.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Ministry of Medicine"
    }
  ],
  "53": [
    {
      "id": "53-OPT-01",
      "panelId": "53",
      "title": "Read the school eligibility roll",
      "summary": "Prerequisite: the Education Office has the age roll. Education Office: age is the rule we already keep.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Eligibility is read from the roll."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.education",
        "animationId": "lamp.flicker"
      },
      "sfx": "confirm",
      "advisorId": "Education Office"
    },
    {
      "id": "53-OPT-02",
      "panelId": "53",
      "title": "Send Liese to Mila's library hour",
      "summary": "Prerequisite: lessons allow it and Mila is there. Education Office: Liese reads. That is not a posting.",
      "category": "Order",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "A library hour is set for Liese."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.education",
        "animationId": "lamp.flicker"
      },
      "sfx": "confirm",
      "advisorId": "Education Office"
    },
    {
      "id": "53-OPT-03",
      "panelId": "53",
      "title": "Assign a mentor before field work",
      "summary": "Prerequisite: a trainee is otherwise headed to the field. Education Office: no mentor, no tunnel.",
      "category": "Delegate",
      "costs": {
        "marks": 20,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Field work waits on a mentor."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.education",
        "animationId": "lamp.flicker"
      },
      "sfx": "confirm",
      "advisorId": "Education Office"
    },
    {
      "id": "53-OPT-04",
      "panelId": "53",
      "title": "Fund chalk and lamps for the hall",
      "summary": "Prerequisite: the hall is short and Stores has them. Education Office: a dark hall teaches nothing.",
      "category": "Invest",
      "costs": {
        "marks": 30,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Chalk and lamps are funded."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.education",
        "animationId": "lamp.flicker"
      },
      "sfx": "confirm",
      "advisorId": "Education Office"
    },
    {
      "id": "53-OPT-05",
      "panelId": "53",
      "title": "Check that cadets are not listed as children",
      "summary": "Prerequisite: the rolls disagree. Education Office: a child does not become a cadet by a clerk's slip.",
      "category": "Investigate",
      "costs": {
        "marks": 10,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "The disagreement is checked, not smoothed."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.education",
        "animationId": "lamp.flicker"
      },
      "sfx": "confirm",
      "advisorId": "Education Office"
    },
    {
      "id": "53-OPT-06",
      "panelId": "53",
      "title": "Wait for the instructor's recovery",
      "summary": "Prerequisite: the instructor is marked unfit by Lorenz. Education Office: recovery is part of training. Say so.",
      "category": "Wait",
      "costs": {
        "marks": 0,
        "hours": 7,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Class waits. A substitute is not invented."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": true,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.education",
        "animationId": "lamp.flicker"
      },
      "sfx": "confirm",
      "advisorId": "Education Office"
    },
    {
      "id": "53-OPT-07",
      "panelId": "53",
      "title": "Ask Karin Voss to show a safe drill",
      "summary": "Prerequisite: the drill is not a live gate. Education Office: show the motion. Do not spend a life on it.",
      "category": "Negotiate",
      "costs": {
        "marks": 25,
        "hours": 8,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A safe drill is asked."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.education",
        "animationId": "lamp.flicker"
      },
      "sfx": "confirm",
      "advisorId": "Education Office"
    },
    {
      "id": "53-OPT-08",
      "panelId": "53",
      "title": "Review nursery hours against Ashday",
      "summary": "Prerequisite: Ashday staffing is the question. Education Office: Ashday still needs someone awake with the small ones.",
      "category": "Order",
      "costs": {
        "marks": 5,
        "hours": 9,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Nursery hours are reviewed against the rest day."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.education",
        "animationId": "lamp.flicker"
      },
      "sfx": "confirm",
      "advisorId": "Education Office"
    }
  ],
  "54": [
    {
      "id": "54-OPT-01",
      "panelId": "54",
      "title": "Read the ration slate",
      "summary": "Prerequisite: Stores Ministry has posted Marketday. Stores Ministry: the slate is the ration. The crowd is not.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The slate is read before any release."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.market",
        "animationId": "scales.balance"
      },
      "sfx": "confirm",
      "advisorId": "Stores Ministry"
    },
    {
      "id": "54-OPT-02",
      "panelId": "54",
      "title": "Open the Stores reserve",
      "summary": "Prerequisite: Ilona Brandt holds the reserve key. Stores Ministry: reserve means once. Write why.",
      "category": "Order",
      "costs": {
        "marks": 60,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "The reserve is opened for a named shortfall."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.market",
        "animationId": "scales.balance"
      },
      "sfx": "confirm",
      "advisorId": "Stores Ministry"
    },
    {
      "id": "54-OPT-03",
      "panelId": "54",
      "title": "Price mushroom-hall surplus",
      "summary": "Prerequisite: a surplus is claimed by the halls. Stores Ministry: surplus is a count, then a price.",
      "category": "Delegate",
      "costs": {
        "marks": 15,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A price is asked, not imposed in the hall."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.market",
        "animationId": "scales.balance"
      },
      "sfx": "confirm",
      "advisorId": "Stores Ministry"
    },
    {
      "id": "54-OPT-04",
      "panelId": "54",
      "title": "Hold Urre-aza for the trainee kitchens",
      "summary": "Prerequisite: the crop is in Stores and the kitchens asked. Stores Ministry: Urre-aza does not grow in the ledger.",
      "category": "Invest",
      "costs": {
        "marks": 40,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A hold is placed. It is not a second harvest."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.market",
        "animationId": "scales.balance"
      },
      "sfx": "confirm",
      "advisorId": "Stores Ministry"
    },
    {
      "id": "54-OPT-05",
      "panelId": "54",
      "title": "Investigate a short crate from the north rail",
      "summary": "Prerequisite: the manifest and the shelf disagree. Stores Ministry: short is a number of boxes, said in words: missing.",
      "category": "Investigate",
      "costs": {
        "marks": 20,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "The short crate is investigated."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.market",
        "animationId": "scales.balance"
      },
      "sfx": "confirm",
      "advisorId": "Stores Ministry"
    },
    {
      "id": "54-OPT-06",
      "panelId": "54",
      "title": "Wait until Marketday to post prices",
      "summary": "Prerequisite: today is not Marketday. Stores Ministry: a price posted early becomes a rumor.",
      "category": "Wait",
      "costs": {
        "marks": 0,
        "hours": 7,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Prices wait for the market day."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": true,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.market",
        "animationId": "scales.balance"
      },
      "sfx": "confirm",
      "advisorId": "Stores Ministry"
    },
    {
      "id": "54-OPT-07",
      "panelId": "54",
      "title": "Negotiate a Chako draw with the groves",
      "summary": "Prerequisite: the Chako bushes are in the grove report. Stores Ministry: Chako is a bush, not a wish.",
      "category": "Negotiate",
      "costs": {
        "marks": 30,
        "hours": 8,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A draw is negotiated with the people who tend them."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.market",
        "animationId": "scales.balance"
      },
      "sfx": "confirm",
      "advisorId": "Stores Ministry"
    },
    {
      "id": "54-OPT-08",
      "panelId": "54",
      "title": "Review water rations against Hesse's gauge",
      "summary": "Prerequisite: the gauge note is filed. Stores Ministry: Hesse's gauge outranks the queue.",
      "category": "Order",
      "costs": {
        "marks": 10,
        "hours": 9,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Water rations are reviewed against the cistern, not against thirst speeches."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.market",
        "animationId": "scales.balance"
      },
      "sfx": "confirm",
      "advisorId": "Stores Ministry"
    }
  ],
  "55": [
    {
      "id": "55-OPT-01",
      "panelId": "55",
      "title": "Read the northern three-line timetable",
      "summary": "Prerequisite: the rail office has it. Rail Office: three lines. No fourth is hiding in the margin.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The external timetable is read."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.rail",
        "animationId": "rail.arrive"
      },
      "sfx": "confirm",
      "advisorId": "Rail Office"
    },
    {
      "id": "55-OPT-02",
      "panelId": "55",
      "title": "Hold the domestic south train",
      "summary": "Prerequisite: the south train is the extraction run. Rail Office: south stays inside. That is the rule.",
      "category": "Order",
      "costs": {
        "marks": 20,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The domestic train is held."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.rail",
        "animationId": "rail.arrive"
      },
      "sfx": "confirm",
      "advisorId": "Rail Office"
    },
    {
      "id": "55-OPT-03",
      "panelId": "55",
      "title": "Send a crew to the North Gate platform",
      "summary": "Prerequisite: the platform report names a fault. Rail Office: the North Gate platform is how the outside arrives.",
      "category": "Delegate",
      "costs": {
        "marks": 50,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "A crew is sent to the platform."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.rail",
        "animationId": "rail.arrive"
      },
      "sfx": "confirm",
      "advisorId": "Rail Office"
    },
    {
      "id": "55-OPT-04",
      "panelId": "55",
      "title": "Fund a spur repair inside the tunnels",
      "summary": "Prerequisite: Engineering has priced the spur. Rail Office: the spur is ours. Pay the weld.",
      "category": "Invest",
      "costs": {
        "marks": 140,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "Spur repair is funded."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.rail",
        "animationId": "rail.arrive"
      },
      "sfx": "confirm",
      "advisorId": "Rail Office"
    },
    {
      "id": "55-OPT-05",
      "panelId": "55",
      "title": "Check a manifest against Stores",
      "summary": "Prerequisite: both papers are here. Rail Office: if Stores did not sign, the train's story is unfinished.",
      "category": "Investigate",
      "costs": {
        "marks": 10,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Manifest and Stores are compared."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.rail",
        "animationId": "rail.arrive"
      },
      "sfx": "confirm",
      "advisorId": "Rail Office"
    },
    {
      "id": "55-OPT-06",
      "panelId": "55",
      "title": "Wait for the Grotsen window",
      "summary": "Prerequisite: their caravan day is named and not yet due. Rail Office: Grotsen does not arrive because we are impatient.",
      "category": "Wait",
      "costs": {
        "marks": 0,
        "hours": 7,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The office waits."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": true,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.rail",
        "animationId": "rail.arrive"
      },
      "sfx": "confirm",
      "advisorId": "Rail Office"
    },
    {
      "id": "55-OPT-07",
      "panelId": "55",
      "title": "Bargain priority with the Treasury Minister",
      "summary": "Prerequisite: two cargos want the same hour. Rail Office: one hour, one train. Choose aloud.",
      "category": "Negotiate",
      "costs": {
        "marks": 30,
        "hours": 8,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "Priority is bargained."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.rail",
        "animationId": "rail.arrive"
      },
      "sfx": "confirm",
      "advisorId": "Rail Office"
    },
    {
      "id": "55-OPT-08",
      "panelId": "55",
      "title": "Review who may ride the external line",
      "summary": "Prerequisite: the passenger list is a privilege question. Rail Office: the external line is not a promenade.",
      "category": "Order",
      "costs": {
        "marks": 15,
        "hours": 9,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The ride list is reviewed."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.rail",
        "animationId": "rail.arrive"
      },
      "sfx": "confirm",
      "advisorId": "Rail Office"
    }
  ],
  "56": [
    {
      "id": "56-OPT-01",
      "panelId": "56",
      "title": "Read the Latch expedition note",
      "summary": "Prerequisite: Ansgar has filed it. Surface Watch: the Latch is a door, not a destination we own.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The note is read. The party is not declared home."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": true
      },
      "visual": {
        "artId": "hero.expeditions",
        "animationId": "route.trace"
      },
      "sfx": "confirm",
      "advisorId": "Surface Watch"
    },
    {
      "id": "56-OPT-02",
      "panelId": "56",
      "title": "Send Ilka Red to map one ash street",
      "summary": "Prerequisite: Ilka is equipped and Maren has not forbidden it. Surface Watch: Ilka draws a street. She does not claim a city.",
      "category": "Order",
      "costs": {
        "marks": 80,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "One street is tasked. Not a conquest."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": true
      },
      "visual": {
        "artId": "hero.expeditions",
        "animationId": "route.trace"
      },
      "sfx": "confirm",
      "advisorId": "Surface Watch"
    },
    {
      "id": "56-OPT-03",
      "panelId": "56",
      "title": "Ask Tobiah Red to mark a relic cache",
      "summary": "Prerequisite: he has named a cache he already saw. Surface Watch: mark it. Dragging it home is another order.",
      "category": "Delegate",
      "costs": {
        "marks": 40,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A mark is asked, not a retrieval yet."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": true
      },
      "visual": {
        "artId": "hero.expeditions",
        "animationId": "route.trace"
      },
      "sfx": "confirm",
      "advisorId": "Surface Watch"
    },
    {
      "id": "56-OPT-04",
      "panelId": "56",
      "title": "Fund Pathwalker rations for a short listen",
      "summary": "Prerequisite: Pathwalkers have asked to go briefly. Surface Watch: brief and not far. That is their rule. Write it.",
      "category": "Invest",
      "costs": {
        "marks": 70,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "Rations for a short surface listen are funded."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": true
      },
      "visual": {
        "artId": "hero.expeditions",
        "animationId": "route.trace"
      },
      "sfx": "confirm",
      "advisorId": "Surface Watch"
    },
    {
      "id": "56-OPT-05",
      "panelId": "56",
      "title": "Check cleanser kits before the hatch",
      "summary": "Prerequisite: Maren Red has the kit list. Surface Watch: no kit, no hatch.",
      "category": "Investigate",
      "costs": {
        "marks": 20,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Kits are checked. The hatch stays shut until they pass."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": true
      },
      "visual": {
        "artId": "hero.expeditions",
        "animationId": "route.trace"
      },
      "sfx": "confirm",
      "advisorId": "Surface Watch"
    },
    {
      "id": "56-OPT-06",
      "panelId": "56",
      "title": "Wait out a Haragi-Jalea sighting",
      "summary": "Prerequisite: a sighting is fresh and the hatch is the question. Surface Watch: Haragi-Jalea are not a drill.",
      "category": "Wait",
      "costs": {
        "marks": 0,
        "hours": 7,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The hatch waits out the sighting."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": true,
        "reputation": false,
        "chronicle": false,
        "provenance": true
      },
      "visual": {
        "artId": "hero.expeditions",
        "animationId": "route.trace"
      },
      "sfx": "confirm",
      "advisorId": "Surface Watch"
    },
    {
      "id": "56-OPT-07",
      "panelId": "56",
      "title": "Bargain a joint walk with the Survivors",
      "summary": "Prerequisite: Envoy Bohdan has offered guides, not command. Surface Watch: their guides do not become our officers.",
      "category": "Negotiate",
      "costs": {
        "marks": 90,
        "hours": 8,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "A joint walk is bargained. Command stays ours."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": true,
        "provenance": true
      },
      "visual": {
        "artId": "hero.expeditions",
        "animationId": "route.trace"
      },
      "sfx": "confirm",
      "advisorId": "Surface Watch"
    },
    {
      "id": "56-OPT-08",
      "panelId": "56",
      "title": "Review who came back",
      "summary": "Prerequisite: the return list is in. Surface Watch: missing is said as missing.",
      "category": "Order",
      "costs": {
        "marks": 10,
        "hours": 9,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The return list is reviewed against who left."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": true
      },
      "visual": {
        "artId": "hero.expeditions",
        "animationId": "route.trace"
      },
      "sfx": "confirm",
      "advisorId": "Surface Watch"
    }
  ],
  "57": [
    {
      "id": "57-OPT-01",
      "panelId": "57",
      "title": "Read the monster pressure board",
      "summary": "Prerequisite: Surface Watch has posted sightings. Surface Watch: a board is not a war.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Sightings are read as sightings."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.bestiary",
        "animationId": "pressure.gauge"
      },
      "sfx": "confirm",
      "advisorId": "Surface Watch"
    },
    {
      "id": "57-OPT-02",
      "panelId": "57",
      "title": "Log a Haragi-Jalea approach",
      "summary": "Prerequisite: the approach was seen. Surface Watch: name the creature we actually saw.",
      "category": "Order",
      "costs": {
        "marks": 15,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "The approach is logged."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.bestiary",
        "animationId": "pressure.gauge"
      },
      "sfx": "confirm",
      "advisorId": "Surface Watch"
    },
    {
      "id": "57-OPT-03",
      "panelId": "57",
      "title": "Ask whether the bones were Hezur-Zuria",
      "summary": "Prerequisite: a bone-sign was reported, not confirmed. Surface Watch: Hezur-Zuria is a name for a confirmed sign, not a shiver.",
      "category": "Delegate",
      "costs": {
        "marks": 10,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The question is asked. The species is not confirmed by fear."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.bestiary",
        "animationId": "pressure.gauge"
      },
      "sfx": "confirm",
      "advisorId": "Surface Watch"
    },
    {
      "id": "57-OPT-04",
      "panelId": "57",
      "title": "Stock the gate against Odol-Beltza",
      "summary": "Prerequisite: a black-blood sign is on the board. Surface Watch: stock the gate. Do not parade.",
      "category": "Invest",
      "costs": {
        "marks": 60,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "Stock is moved to the named gate."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.bestiary",
        "animationId": "pressure.gauge"
      },
      "sfx": "confirm",
      "advisorId": "Surface Watch"
    },
    {
      "id": "57-OPT-05",
      "panelId": "57",
      "title": "Treat Harri-Gizona as stone, not rumor",
      "summary": "Prerequisite: a stone-man sign was witnessed. Surface Watch: if it was not witnessed, it stays a rumor.",
      "category": "Investigate",
      "costs": {
        "marks": 20,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "The witnessed sign is filed under that name."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.bestiary",
        "animationId": "pressure.gauge"
      },
      "sfx": "confirm",
      "advisorId": "Surface Watch"
    },
    {
      "id": "57-OPT-06",
      "panelId": "57",
      "title": "Refuse to name Azken-Gizona",
      "summary": "Prerequisite: someone wants the unknown mimic named as fact. Surface Watch: mimicry is not a confirmed species. Say unknown.",
      "category": "Wait",
      "costs": {
        "marks": 0,
        "hours": 7,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Azken-Gizona stays unknown."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": true,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.bestiary",
        "animationId": "pressure.gauge"
      },
      "sfx": "confirm",
      "advisorId": "Surface Watch"
    },
    {
      "id": "57-OPT-07",
      "panelId": "57",
      "title": "Negotiate a no-hunt day with Ansgar",
      "summary": "Prerequisite: a hunt would cross a rite or a thin garrison. Surface Watch: not every sign earns a sortie.",
      "category": "Negotiate",
      "costs": {
        "marks": 0,
        "hours": 8,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "A no-hunt day is set."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.bestiary",
        "animationId": "pressure.gauge"
      },
      "sfx": "confirm",
      "advisorId": "Surface Watch"
    },
    {
      "id": "57-OPT-08",
      "panelId": "57",
      "title": "Review chitin salvage with Kessler",
      "summary": "Prerequisite: monster-chitin was actually brought in. Surface Watch: chitin is material. It is not a trophy speech.",
      "category": "Order",
      "costs": {
        "marks": 30,
        "hours": 9,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Salvage is reviewed with the armorer."
        ],
        "unknownEffects": []
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.bestiary",
        "animationId": "pressure.gauge"
      },
      "sfx": "confirm",
      "advisorId": "Surface Watch"
    }
  ],
  "58": [
    {
      "id": "58-OPT-01",
      "panelId": "58",
      "title": "Read the Red Claws dossier page",
      "summary": "Prerequisite: Adelheid has the page. Adelheid von Moren: the Fist's house is still a faction to everyone else.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Our own page is read without flattery."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.factions",
        "animationId": "flag.wave"
      },
      "sfx": "confirm",
      "advisorId": "Adelheid von Moren"
    },
    {
      "id": "58-OPT-02",
      "panelId": "58",
      "title": "File Monarchia's concord tone",
      "summary": "Prerequisite: Seraphine's last note is the source. Adelheid von Moren: concord is a table of houses, not a marriage of cities.",
      "category": "Order",
      "costs": {
        "marks": 20,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Tone is filed as their tone."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.factions",
        "animationId": "flag.wave"
      },
      "sfx": "confirm",
      "advisorId": "Adelheid von Moren"
    },
    {
      "id": "58-OPT-03",
      "panelId": "58",
      "title": "Note Grotsen Dominion pressure",
      "summary": "Prerequisite: Dreyer's words are the source. Adelheid von Moren: the Dominion calls us a problem. That is not a map.",
      "category": "Delegate",
      "costs": {
        "marks": 20,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Pressure is noted as their claim."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.factions",
        "animationId": "flag.wave"
      },
      "sfx": "confirm",
      "advisorId": "Adelheid von Moren"
    },
    {
      "id": "58-OPT-04",
      "panelId": "58",
      "title": "Ask what the Demos Forum wants written",
      "summary": "Prerequisite: Johanna Weiss has sent phrases. Adelheid von Moren: the Forum wants words. Give them their own.",
      "category": "Invest",
      "costs": {
        "marks": 15,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Their phrases are copied, not adopted."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.factions",
        "animationId": "flag.wave"
      },
      "sfx": "confirm",
      "advisorId": "Adelheid von Moren"
    },
    {
      "id": "58-OPT-05",
      "panelId": "58",
      "title": "Record the Survivors' Rising date",
      "summary": "Prerequisite: the Rising is a known Deepmonth pilgrimage. Adelheid von Moren: the Rising greets the sky. It is not our parade.",
      "category": "Investigate",
      "costs": {
        "marks": 10,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The date is recorded as their rite."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.factions",
        "animationId": "flag.wave"
      },
      "sfx": "confirm",
      "advisorId": "Adelheid von Moren"
    },
    {
      "id": "58-OPT-06",
      "panelId": "58",
      "title": "Wait before calling a bloc broken",
      "summary": "Prerequisite: the last report used a bloc word and nothing new has arrived. Adelheid von Moren: strong, split, or weak. Do not invent a fourth.",
      "category": "Wait",
      "costs": {
        "marks": 0,
        "hours": 7,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "No new bloc word is declared."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": true,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.factions",
        "animationId": "flag.wave"
      },
      "sfx": "confirm",
      "advisorId": "Adelheid von Moren"
    },
    {
      "id": "58-OPT-07",
      "panelId": "58",
      "title": "Open a dossier note on slavery pressure",
      "summary": "Prerequisite: Survivors have pressed the labor question. Adelheid von Moren: write the pressure. Do not confess a crime we have not judged.",
      "category": "Negotiate",
      "costs": {
        "marks": 30,
        "hours": 8,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "The pressure is filed for the desk."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.factions",
        "animationId": "flag.wave"
      },
      "sfx": "confirm",
      "advisorId": "Adelheid von Moren"
    },
    {
      "id": "58-OPT-08",
      "panelId": "58",
      "title": "Review credibility tags on the pile",
      "summary": "Prerequisite: each report already has a tag. Adelheid von Moren: a rumor tag stays a rumor tag.",
      "category": "Order",
      "costs": {
        "marks": 0,
        "hours": 9,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Tags are reviewed, not upgraded for comfort."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.factions",
        "animationId": "flag.wave"
      },
      "sfx": "confirm",
      "advisorId": "Adelheid von Moren"
    }
  ],
  "59": [
    {
      "id": "59-OPT-01",
      "panelId": "59",
      "title": "Host the banquet in the Evening Hall",
      "summary": "Prerequisite: Wilhelmina has allowed the hall and food is set. Adelheid von Moren: a bare table is an insult you chose.",
      "category": "Investigate",
      "costs": {
        "marks": 80,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "A banquet is hosted with the food that exists."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "set.banquet",
        "animationId": "crowd.murmur"
      },
      "sfx": "confirm",
      "advisorId": "Adelheid von Moren"
    },
    {
      "id": "59-OPT-02",
      "panelId": "59",
      "title": "Seat Seraphine away from Dreyer",
      "summary": "Prerequisite: both envoys are actually attending. Adelheid von Moren: those two chairs do not touch.",
      "category": "Order",
      "costs": {
        "marks": 20,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Seating separates the named rivals."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "set.banquet",
        "animationId": "crowd.murmur"
      },
      "sfx": "confirm",
      "advisorId": "Adelheid von Moren"
    },
    {
      "id": "59-OPT-03",
      "panelId": "59",
      "title": "Lay a treaty copy without signing",
      "summary": "Prerequisite: the copy is ready and the hour is not. Adelheid von Moren: paper on a table is not a seal.",
      "category": "Delegate",
      "costs": {
        "marks": 0,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The copy is laid. No signature is forced."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "set.banquet",
        "animationId": "crowd.murmur"
      },
      "sfx": "confirm",
      "advisorId": "Adelheid von Moren"
    },
    {
      "id": "59-OPT-04",
      "panelId": "59",
      "title": "Send a ceremonial gift from the vault",
      "summary": "Prerequisite: the gift was withdrawn or is indexed. Adelheid von Moren: say it is a gift, or do not send it.",
      "category": "Invest",
      "costs": {
        "marks": 60,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A gift is sent as a gift."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "set.banquet",
        "animationId": "crowd.murmur"
      },
      "sfx": "confirm",
      "advisorId": "Adelheid von Moren"
    },
    {
      "id": "59-OPT-05",
      "panelId": "59",
      "title": "Review feud risk in the seating",
      "summary": "Prerequisite: the seating plan is drawn. Adelheid von Moren: a feud starts in a chair.",
      "category": "Investigate",
      "costs": {
        "marks": 10,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The plan is reviewed for insults."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "set.banquet",
        "animationId": "crowd.murmur"
      },
      "sfx": "confirm",
      "advisorId": "Adelheid von Moren"
    },
    {
      "id": "59-OPT-06",
      "panelId": "59",
      "title": "Hold the toasts until the second course",
      "summary": "Prerequisite: the first course is not yet down. Adelheid von Moren: hungry guests hear insults in everything.",
      "category": "Wait",
      "costs": {
        "marks": 0,
        "hours": 7,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Toasts wait."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": true,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "set.banquet",
        "animationId": "crowd.murmur"
      },
      "sfx": "confirm",
      "advisorId": "Adelheid von Moren"
    },
    {
      "id": "59-OPT-07",
      "panelId": "59",
      "title": "Open a side talk with Bohdan",
      "summary": "Prerequisite: he is seated and has asked. Adelheid von Moren: the corridor is not the treaty table.",
      "category": "Negotiate",
      "costs": {
        "marks": 25,
        "hours": 8,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "A side talk is opened."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "set.banquet",
        "animationId": "crowd.murmur"
      },
      "sfx": "confirm",
      "advisorId": "Adelheid von Moren"
    },
    {
      "id": "59-OPT-08",
      "panelId": "59",
      "title": "Ask Vera to hear the Grotsen toast",
      "summary": "Prerequisite: Vera is at the table. Adelheid von Moren: if Vera flinches, stop the toast.",
      "category": "Order",
      "costs": {
        "marks": 10,
        "hours": 9,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Vera is asked to listen for a slight."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "set.banquet",
        "animationId": "crowd.murmur"
      },
      "sfx": "confirm",
      "advisorId": "Adelheid von Moren"
    }
  ],
  "60": [
    {
      "id": "60-OPT-01",
      "panelId": "60",
      "title": "Read the culture codex page on light",
      "summary": "Prerequisite: the codex is open. Culture Office: light is already a rule. Do not decorate it.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The page is read. No new rite is founded."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.culture",
        "animationId": "banner.sway"
      },
      "sfx": "confirm",
      "advisorId": "Culture Office"
    },
    {
      "id": "60-OPT-02",
      "panelId": "60",
      "title": "Confirm the Water Rite's place",
      "summary": "Prerequisite: Wilhelmina's calendar names it. Culture Office: the fourteenth stays the fourteenth.",
      "category": "Order",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The rite's place is confirmed."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.culture",
        "animationId": "banner.sway"
      },
      "sfx": "confirm",
      "advisorId": "Culture Office"
    },
    {
      "id": "60-OPT-03",
      "panelId": "60",
      "title": "Record the Rising as a Survivor rite",
      "summary": "Prerequisite: the date is known and not ours. Culture Office: we do not steal a pilgrimage by describing it.",
      "category": "Delegate",
      "costs": {
        "marks": 10,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Their rite is recorded as theirs."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.culture",
        "animationId": "banner.sway"
      },
      "sfx": "confirm",
      "advisorId": "Culture Office"
    },
    {
      "id": "60-OPT-04",
      "panelId": "60",
      "title": "Fund banners for Feastmonth",
      "summary": "Prerequisite: Feastmonth is planned and cloth is in Stores. Culture Office: cloth is a cost. Write it.",
      "category": "Invest",
      "costs": {
        "marks": 40,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Banners are funded."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.culture",
        "animationId": "banner.sway"
      },
      "sfx": "confirm",
      "advisorId": "Culture Office"
    },
    {
      "id": "60-OPT-05",
      "panelId": "60",
      "title": "Ask which song the radio may air",
      "summary": "Prerequisite: Samer has a song and the codex has a limit. Culture Office: not every old song is safe air.",
      "category": "Investigate",
      "costs": {
        "marks": 15,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A song is asked against the codex."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.culture",
        "animationId": "banner.sway"
      },
      "sfx": "confirm",
      "advisorId": "Culture Office"
    }
  ],
  "61": [
    {
      "id": "61-OPT-01",
      "panelId": "61",
      "title": "Read the district map",
      "summary": "Prerequisite: the City Office map is current. City Office: do not add a district to make the map pretty.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Districts are read as drawn."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "map.districts",
        "animationId": "map.pulse"
      },
      "sfx": "confirm",
      "advisorId": "City Office"
    },
    {
      "id": "61-OPT-02",
      "panelId": "61",
      "title": "Mark the Underrows between the Barracks",
      "summary": "Prerequisite: the map shows the bound-labor quarters. City Office: between the Barracks Lines, flanked by commoner districts.",
      "category": "Order",
      "costs": {
        "marks": 10,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The Underrows are marked where they lie."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "map.districts",
        "animationId": "map.pulse"
      },
      "sfx": "confirm",
      "advisorId": "City Office"
    },
    {
      "id": "61-OPT-03",
      "panelId": "61",
      "title": "Send a clerk to the commoner wards",
      "summary": "Prerequisite: a clerk is free. City Office: a walk corrects a map. A speech does not.",
      "category": "Delegate",
      "costs": {
        "marks": 20,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A clerk walks. The map waits."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "map.districts",
        "animationId": "map.pulse"
      },
      "sfx": "confirm",
      "advisorId": "City Office"
    },
    {
      "id": "61-OPT-04",
      "panelId": "61",
      "title": "Note Mendi's broken districts as surface",
      "summary": "Prerequisite: the atlas already calls them broken. City Office: Mendi's ruins are not apartments.",
      "category": "Invest",
      "costs": {
        "marks": 0,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "They stay surface ruins, not new homes."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "map.districts",
        "animationId": "map.pulse"
      },
      "sfx": "confirm",
      "advisorId": "City Office"
    },
    {
      "id": "61-OPT-05",
      "panelId": "61",
      "title": "Compare the map to Jarek's tunnel index",
      "summary": "Prerequisite: both are on the table. City Office: if the tunnel is not on his index, it is not a street.",
      "category": "Investigate",
      "costs": {
        "marks": 15,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Map and tunnel index are compared."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "map.districts",
        "animationId": "map.pulse"
      },
      "sfx": "confirm",
      "advisorId": "City Office"
    }
  ],
  "62": [
    {
      "id": "62-OPT-01",
      "panelId": "62",
      "title": "Open the house album",
      "summary": "Prerequisite: the album is in the archive. House Archive: only faces we have plates for.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The album is opened. No portrait is invented."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.album",
        "animationId": "moment.kenburns"
      },
      "sfx": "confirm",
      "advisorId": "House Archive"
    },
    {
      "id": "62-OPT-02",
      "panelId": "62",
      "title": "Set Dagmar's portrait in the first sleeve",
      "summary": "Prerequisite: the plate exists. House Archive: order of wives is not a design choice.",
      "category": "Order",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The First Wife's sleeve is set."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.album",
        "animationId": "moment.kenburns"
      },
      "sfx": "confirm",
      "advisorId": "House Archive"
    },
    {
      "id": "62-OPT-03",
      "panelId": "62",
      "title": "Ask Mila to copy a caption",
      "summary": "Prerequisite: a caption is already written. House Archive: pretty captions lie.",
      "category": "Delegate",
      "costs": {
        "marks": 10,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A caption is copied, not improved."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.album",
        "animationId": "moment.kenburns"
      },
      "sfx": "confirm",
      "advisorId": "House Archive"
    },
    {
      "id": "62-OPT-04",
      "panelId": "62",
      "title": "Refuse a portrait of a fourth wife",
      "summary": "Prerequisite: someone has asked. House Archive: three sleeves. The fourth stays empty.",
      "category": "Invest",
      "costs": {
        "marks": 0,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "No fourth wife is added to the album."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.album",
        "animationId": "moment.kenburns"
      },
      "sfx": "confirm",
      "advisorId": "House Archive"
    },
    {
      "id": "62-OPT-05",
      "panelId": "62",
      "title": "File the Feastmonth plate after the feast",
      "summary": "Prerequisite: the feast has happened and a plate was made. House Archive: we do not file a feast that has not occurred.",
      "category": "Investigate",
      "costs": {
        "marks": 15,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The plate is filed after the event."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.album",
        "animationId": "moment.kenburns"
      },
      "sfx": "confirm",
      "advisorId": "House Archive"
    }
  ],
  "63": [
    {
      "id": "63-OPT-01",
      "panelId": "63",
      "title": "Read the save notice",
      "summary": "Prerequisite: a save exists to be described. System: a save is a record. This button does not live your life backward.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The notice is read. The world is not rewound from this option."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.settings",
        "animationId": "counter.roll"
      },
      "sfx": "confirm",
      "advisorId": "System"
    },
    {
      "id": "63-OPT-02",
      "panelId": "63",
      "title": "Export a chronicle excerpt",
      "summary": "Prerequisite: the chronicle has lines. System: excerpt means copy. Not a new history.",
      "category": "Order",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "An excerpt is prepared from existing lines."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.settings",
        "animationId": "counter.roll"
      },
      "sfx": "confirm",
      "advisorId": "System"
    },
    {
      "id": "63-OPT-03",
      "panelId": "63",
      "title": "Check that old saves still normalize",
      "summary": "Prerequisite: the normalize rule is the house rule. System: we add what V4.1 lacked. We do not delete what the Fist did.",
      "category": "Delegate",
      "costs": {
        "marks": 0,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The rule is confirmed: old saves gain missing parts and lose none."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.settings",
        "animationId": "counter.roll"
      },
      "sfx": "confirm",
      "advisorId": "System"
    },
    {
      "id": "63-OPT-04",
      "panelId": "63",
      "title": "Hold a settings change until confirmed",
      "summary": "Prerequisite: a change is proposed. System: proposed is not applied.",
      "category": "Invest",
      "costs": {
        "marks": 0,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Nothing changes until a confirmation exists."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.settings",
        "animationId": "counter.roll"
      },
      "sfx": "confirm",
      "advisorId": "System"
    },
    {
      "id": "63-OPT-05",
      "panelId": "63",
      "title": "Review the text scale note",
      "summary": "Prerequisite: a reader asked. System: the words stay. The size is a tool.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The request is reviewed."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.settings",
        "animationId": "counter.roll"
      },
      "sfx": "confirm",
      "advisorId": "System"
    }
  ],
  "64": [
    {
      "id": "64-OPT-01",
      "panelId": "64",
      "title": "Read the marks ledger",
      "summary": "Prerequisite: the treasury page is open. System: marks buy work. They do not measure a soul.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Marks are read as treasury, not as a private score."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.marks",
        "animationId": "stamp.approve"
      },
      "sfx": "confirm",
      "advisorId": "System"
    },
    {
      "id": "64-OPT-02",
      "panelId": "64",
      "title": "Stamp a receipt for the Stores release",
      "summary": "Prerequisite: a release already happened. System: no release, no stamp.",
      "category": "Order",
      "costs": {
        "marks": 10,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A receipt is stamped for a real release."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.marks",
        "animationId": "stamp.approve"
      },
      "sfx": "confirm",
      "advisorId": "System"
    },
    {
      "id": "64-OPT-03",
      "panelId": "64",
      "title": "Ask the minister why a seal is missing",
      "summary": "Prerequisite: a line lacks the treasury seal. System: a missing seal is a question, not a pardon.",
      "category": "Delegate",
      "costs": {
        "marks": 15,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "The missing seal is asked about."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.marks",
        "animationId": "stamp.approve"
      },
      "sfx": "confirm",
      "advisorId": "System"
    },
    {
      "id": "64-OPT-04",
      "panelId": "64",
      "title": "Set aside marks for the cistern patch",
      "summary": "Prerequisite: Hesse's patch is already priced. System: set aside is not spent.",
      "category": "Invest",
      "costs": {
        "marks": 100,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Marks are set aside, not spent twice."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.marks",
        "animationId": "stamp.approve"
      },
      "sfx": "confirm",
      "advisorId": "System"
    },
    {
      "id": "64-OPT-05",
      "panelId": "64",
      "title": "Refuse an unpriced order",
      "summary": "Prerequisite: the order has no cost. System: if it has no cost, it is not ready.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "An unpriced order is refused."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.marks",
        "animationId": "stamp.approve"
      },
      "sfx": "confirm",
      "advisorId": "System"
    }
  ],
  "65": [
    {
      "id": "65-OPT-01",
      "panelId": "65",
      "title": "Open the year book at 105 AW",
      "summary": "Prerequisite: the book is on the stand. House Archive: 105 AW is the year we are in until the dead days end.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The year is opened as the current year."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.legacy",
        "animationId": "chapter.reveal"
      },
      "sfx": "confirm",
      "advisorId": "House Archive"
    },
    {
      "id": "65-OPT-02",
      "panelId": "65",
      "title": "Draft a legacy line for the cistern",
      "summary": "Prerequisite: the cistern work is witnessed. House Archive: draft is not the year book yet.",
      "category": "Order",
      "costs": {
        "marks": 20,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A draft line waits for the year's seal."
        ],
        "unknownEffects": []
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.legacy",
        "animationId": "chapter.reveal"
      },
      "sfx": "confirm",
      "advisorId": "House Archive"
    },
    {
      "id": "65-OPT-03",
      "panelId": "65",
      "title": "Ask Wilhelmina which names the year must keep",
      "summary": "Prerequisite: she is willing to say. House Archive: a year keeps witnesses, not wishes.",
      "category": "Delegate",
      "costs": {
        "marks": 0,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Names are asked. The book is not filled tonight."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.legacy",
        "animationId": "chapter.reveal"
      },
      "sfx": "confirm",
      "advisorId": "House Archive"
    },
    {
      "id": "65-OPT-04",
      "panelId": "65",
      "title": "Hold the seal until after the Dead Days",
      "summary": "Prerequisite: the five days have not finished. House Archive: First Light is the first page of the next book.",
      "category": "Invest",
      "costs": {
        "marks": 0,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The year is not sealed early."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.legacy",
        "animationId": "chapter.reveal"
      },
      "sfx": "confirm",
      "advisorId": "House Archive"
    },
    {
      "id": "65-OPT-05",
      "panelId": "65",
      "title": "Compare the book to the chronicle",
      "summary": "Prerequisite: both are in the room. House Archive: if they fight, the witnessed chronicle wins.",
      "category": "Investigate",
      "costs": {
        "marks": 10,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Book and chronicle are compared."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.legacy",
        "animationId": "chapter.reveal"
      },
      "sfx": "confirm",
      "advisorId": "House Archive"
    }
  ],
  "01": [
    {
      "id": "01-OPT-01",
      "panelId": "01",
      "title": "Read Jana's stairwell slip",
      "summary": "Prerequisite: an unopened hall-runner note is on the desk. Samer Vogt: read the seal before you answer it.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The slip is read and the written facts stay as they are."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.messages",
        "animationId": "paper.unfold"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "01-OPT-02",
      "panelId": "01",
      "title": "Stamp the Ironday message pile",
      "summary": "Prerequisite: it is Council day and the Fist's seal is at hand. Samer Vogt: Ironday will not wait on a neat stack.",
      "category": "Order",
      "costs": {
        "marks": 20,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The pile is marked received, not rewritten."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.messages",
        "animationId": "paper.unfold"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "01-OPT-03",
      "panelId": "01",
      "title": "Send the Voiceday script to the booth",
      "summary": "Prerequisite: a draft for the Public Address exists. Samer Vogt: I will not speak a line you did not approve.",
      "category": "Delegate",
      "costs": {
        "marks": 40,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The Voice of the Fist receives a dated script and nothing more."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.messages",
        "animationId": "paper.unfold"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "01-OPT-04",
      "panelId": "01",
      "title": "Hold the unsealed Ashday letters",
      "summary": "Prerequisite: Ashday rest has been called and no seal is forged. Samer Vogt: Ashday is not a day for broken wax.",
      "category": "Invest",
      "costs": {
        "marks": 10,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Those letters stay closed until the rite ends."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.messages",
        "animationId": "paper.unfold"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "01-OPT-05",
      "panelId": "01",
      "title": "Trace the Barracks Lines courier",
      "summary": "Prerequisite: a named runner is still on the board. Samer Vogt: follow the boots, not the rumor.",
      "category": "Investigate",
      "costs": {
        "marks": 30,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The courier's route is logged without a charge."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.messages",
        "animationId": "paper.unfold"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "01-OPT-06",
      "panelId": "01",
      "title": "Ask Hanne Brauer who carried the seal",
      "summary": "Prerequisite: Hanne is on duty in the house. Samer Vogt: Hanne remembers hands better than names.",
      "category": "Wait",
      "costs": {
        "marks": 0,
        "hours": 7,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "A servant's memory is recorded as hearsay, not proof."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": true,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.messages",
        "animationId": "paper.unfold"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "01-OPT-07",
      "panelId": "01",
      "title": "File the west cistern warning",
      "summary": "Prerequisite: Tomas Hesse's morning slip is in the pile. Samer Vogt: a low cistern is a fact, not a speech.",
      "category": "Negotiate",
      "costs": {
        "marks": 15,
        "hours": 8,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The water warning is filed with Messages and not yet solved."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.messages",
        "animationId": "paper.unfold"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "01-OPT-08",
      "panelId": "01",
      "title": "Delay the Council packet until Wellday",
      "summary": "Prerequisite: the packet is not yet sworn. Samer Vogt: Wellday can carry what Ironday should not.",
      "category": "Order",
      "costs": {
        "marks": 0,
        "hours": 9,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The packet moves one weekday later and no line is altered."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.messages",
        "animationId": "paper.unfold"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    }
  ],
  "02": [
    {
      "id": "02-OPT-01",
      "panelId": "02",
      "title": "Cut the Voice of the Fist bulletin",
      "summary": "Prerequisite: Samer is at the radio booth. Samer Vogt: the city hears only what we cut.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The bulletin text is settled before it airs."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.news",
        "animationId": "waveform.live"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "02-OPT-02",
      "panelId": "02",
      "title": "Spike the Underrows rumor",
      "summary": "Prerequisite: the rumor is already on the internal board. Samer Vogt: do not feed the Underrows a better story.",
      "category": "Order",
      "costs": {
        "marks": 25,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The rumor is marked untrusted and left unrepeated."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.news",
        "animationId": "waveform.live"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "02-OPT-03",
      "panelId": "02",
      "title": "Read the Marketday board aloud",
      "summary": "Prerequisite: Marketday and a posted slate are both real. Samer Vogt: if it is not on the board, I will not invent it.",
      "category": "Delegate",
      "costs": {
        "marks": 0,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The board is heard; prices and names stay as posted."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.news",
        "animationId": "waveform.live"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "02-OPT-04",
      "panelId": "02",
      "title": "Commission Ilse Wern's garrison note",
      "summary": "Prerequisite: the surface radio link is up. Samer Vogt: Ilse hears static; she does not hear the future.",
      "category": "Invest",
      "costs": {
        "marks": 60,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "A garrison scrap is requested, not treated as proven."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.news",
        "animationId": "waveform.live"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "02-OPT-05",
      "panelId": "02",
      "title": "Bury the furnace-ash shortage line",
      "summary": "Prerequisite: Ludek or Ilona has already spoken the shortage. Samer Vogt: burying a line does not fill a furnace.",
      "category": "Investigate",
      "costs": {
        "marks": 40,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "The line leaves the public board and stays in the house log."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.news",
        "animationId": "waveform.live"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    }
  ],
  "03": [
    {
      "id": "03-OPT-01",
      "panelId": "03",
      "title": "Log the Monarchia concord wire",
      "summary": "Prerequisite: a foreign dispatch is on the desk. Samer Vogt: Monarchia speaks through houses, not through us.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The concord wire is logged with its stated source."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.worldnews",
        "animationId": "paper.unfold"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "03-OPT-02",
      "panelId": "03",
      "title": "File the Grotsen posture note",
      "summary": "Prerequisite: Commissar Anton Dreyer's last note is in hand. Samer Vogt: Grotsen paper is a weapon with manners.",
      "category": "Order",
      "costs": {
        "marks": 20,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Dominion posture is filed as their claim, not our fact."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.worldnews",
        "animationId": "paper.unfold"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "03-OPT-03",
      "panelId": "03",
      "title": "Note the Demos Forum silence",
      "summary": "Prerequisite: Delegate Johanna Weiss has not answered. Samer Vogt: the Forum's quiet is not yet a vote.",
      "category": "Delegate",
      "costs": {
        "marks": 10,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Silence is recorded; no motive is invented."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.worldnews",
        "animationId": "paper.unfold"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "03-OPT-04",
      "panelId": "03",
      "title": "Record Envoy Bohdan's northern route",
      "summary": "Prerequisite: a Survivor letter names the road. Samer Vogt: Bohdan walks where the rail will not.",
      "category": "Invest",
      "costs": {
        "marks": 30,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The route is written down and not yet trusted."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.worldnews",
        "animationId": "paper.unfold"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "03-OPT-05",
      "panelId": "03",
      "title": "Hold the surface-ash weather line",
      "summary": "Prerequisite: Surface Watch has sent a scrap. Samer Vogt: one scrap is weather, not a campaign.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The ash line waits for a second witness."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.worldnews",
        "animationId": "paper.unfold"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    }
  ],
  "04": [
    {
      "id": "04-OPT-01",
      "panelId": "04",
      "title": "Read Otto Klein's penalty roll",
      "summary": "Prerequisite: the magistrate's docket is open. Security Guard: Klein writes the law; we only keep the door.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The roll is read; no sentence is added."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.law",
        "animationId": "ledger.stamp"
      },
      "sfx": "confirm",
      "advisorId": "Security Guard"
    },
    {
      "id": "04-OPT-02",
      "panelId": "04",
      "title": "Draft the confiscation edict",
      "summary": "Prerequisite: a named offense is already charged. Security Guard: confiscation needs his stamp, not our boots.",
      "category": "Order",
      "costs": {
        "marks": 80,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "A draft edict exists and is not yet law."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.law",
        "animationId": "ledger.stamp"
      },
      "sfx": "confirm",
      "advisorId": "Security Guard"
    },
    {
      "id": "04-OPT-03",
      "panelId": "04",
      "title": "Open Ewald Red's treason file",
      "summary": "Prerequisite: the archive holds the cousin's case. Security Guard: Ewald is accused, not already condemned.",
      "category": "Delegate",
      "costs": {
        "marks": 40,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The file is opened for review, not judged in the corridor."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.law",
        "animationId": "ledger.stamp"
      },
      "sfx": "confirm",
      "advisorId": "Security Guard"
    },
    {
      "id": "04-OPT-04",
      "panelId": "04",
      "title": "Post the fine slate in the Underrows",
      "summary": "Prerequisite: Overseer Brun Maurer can post it. Security Guard: the Underrows should see the slate, not a rumor of it.",
      "category": "Invest",
      "costs": {
        "marks": 50,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The posted fines match the docket and add none."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.law",
        "animationId": "ledger.stamp"
      },
      "sfx": "confirm",
      "advisorId": "Security Guard"
    },
    {
      "id": "04-OPT-05",
      "panelId": "04",
      "title": "Review the flogging docket",
      "summary": "Prerequisite: a sentence is written and not yet served. Security Guard: a flogging not on the roll does not happen.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The docket is checked against the written penalty."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.law",
        "animationId": "ledger.stamp"
      },
      "sfx": "confirm",
      "advisorId": "Security Guard"
    },
    {
      "id": "04-OPT-06",
      "panelId": "04",
      "title": "Seal a labor-transfer contract",
      "summary": "Prerequisite: both houses are named on the paper. Security Guard: labor moves on paper before it moves in the tunnels.",
      "category": "Wait",
      "costs": {
        "marks": 120,
        "hours": 7,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "The contract is sealed for later effect, not instant removal."
        ],
        "unknownEffects": []
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": true,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.law",
        "animationId": "ledger.stamp"
      },
      "sfx": "confirm",
      "advisorId": "Security Guard"
    },
    {
      "id": "04-OPT-07",
      "panelId": "04",
      "title": "Hear the bound-labor appeal",
      "summary": "Prerequisite: a laborer has asked to be heard. Security Guard: hearing is not pardon.",
      "category": "Negotiate",
      "costs": {
        "marks": 30,
        "hours": 8,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The appeal is heard and left for Klein to answer."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.law",
        "animationId": "ledger.stamp"
      },
      "sfx": "confirm",
      "advisorId": "Security Guard"
    },
    {
      "id": "04-OPT-08",
      "panelId": "04",
      "title": "Hold the signed warrant unserved",
      "summary": "Prerequisite: the warrant is signed and the watch is here. Security Guard: we can wait an hour. We cannot pretend it is unsigned.",
      "category": "Order",
      "costs": {
        "marks": 15,
        "hours": 9,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Service waits; the warrant is not torn up."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.law",
        "animationId": "ledger.stamp"
      },
      "sfx": "confirm",
      "advisorId": "Security Guard"
    }
  ],
  "05": [
    {
      "id": "05-OPT-01",
      "panelId": "05",
      "title": "Set the Water Rite on the fourteenth",
      "summary": "Prerequisite: the cistern calendar is posted. Wilhelmina Red: the fourteenth is a promise, not a rainfall.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The rite date is set and the cistern is not magically fuller."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.ceremonies",
        "animationId": "lamp.choose"
      },
      "sfx": "confirm",
      "advisorId": "Wilhelmina Red"
    },
    {
      "id": "05-OPT-02",
      "panelId": "05",
      "title": "Name the Ashday house rite",
      "summary": "Prerequisite: Wilhelmina is in the hall. Wilhelmina Red: rest day still belongs to the House.",
      "category": "Order",
      "costs": {
        "marks": 20,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Ashday has a named rite and no new doctrine."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.ceremonies",
        "animationId": "lamp.choose"
      },
      "sfx": "confirm",
      "advisorId": "Wilhelmina Red"
    },
    {
      "id": "05-OPT-03",
      "panelId": "05",
      "title": "Seat Feastmonth for the three wives",
      "summary": "Prerequisite: Dagmar, Adelheid, and Vera are in residence. Wilhelmina Red: three chairs, in the order the House already keeps.",
      "category": "Delegate",
      "costs": {
        "marks": 60,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Seating is planned; no vow is rewritten."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "weeks",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.ceremonies",
        "animationId": "lamp.choose"
      },
      "sfx": "confirm",
      "advisorId": "Wilhelmina Red"
    },
    {
      "id": "05-OPT-04",
      "panelId": "05",
      "title": "Mark Dead Day First Light",
      "summary": "Prerequisite: the year is closing on Endmonth. Wilhelmina Red: the dead days are counted, not skipped.",
      "category": "Invest",
      "costs": {
        "marks": 10,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "First Light is marked on the calendar and nothing else moves."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.ceremonies",
        "animationId": "lamp.choose"
      },
      "sfx": "confirm",
      "advisorId": "Wilhelmina Red"
    },
    {
      "id": "05-OPT-05",
      "panelId": "05",
      "title": "Call Wellday bells for the House",
      "summary": "Prerequisite: the chapel clock still runs. Wilhelmina Red: bells gather the House; they do not decide it.",
      "category": "Investigate",
      "costs": {
        "marks": 15,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The bells are ordered for Wellday only."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.ceremonies",
        "animationId": "lamp.choose"
      },
      "sfx": "confirm",
      "advisorId": "Wilhelmina Red"
    }
  ],
  "06": [
    {
      "id": "06-OPT-01",
      "panelId": "06",
      "title": "Read Ilona Brandt's morning slate",
      "summary": "Prerequisite: the steward has filed today's slate. Steward Office: Ilona counts what is in the room, not what we wish.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The slate is known and no store is touched."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.status",
        "animationId": "meter.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Steward Office"
    },
    {
      "id": "06-OPT-02",
      "panelId": "06",
      "title": "Count Stores against the ration line",
      "summary": "Prerequisite: the Stores key is with the steward. Steward Office: if the line and the shelf disagree, believe the shelf.",
      "category": "Order",
      "costs": {
        "marks": 20,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "A count is taken; rations are not yet cut."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.status",
        "animationId": "meter.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Steward Office"
    },
    {
      "id": "06-OPT-03",
      "panelId": "06",
      "title": "Flag the Underrows labor gap",
      "summary": "Prerequisite: Brun Maurer's roll is on the desk. Steward Office: a missing cook is not a speech.",
      "category": "Delegate",
      "costs": {
        "marks": 30,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The gap is flagged for Ironday, not filled by decree."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.status",
        "animationId": "meter.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Steward Office"
    },
    {
      "id": "06-OPT-04",
      "panelId": "06",
      "title": "Order a Watchday inspection",
      "summary": "Prerequisite: Watchday is the inspection weekday. Steward Office: Watchday is for eyes, not for new laws.",
      "category": "Invest",
      "costs": {
        "marks": 40,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "An inspection is scheduled, not a surprise seizure."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.status",
        "animationId": "meter.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Steward Office"
    },
    {
      "id": "06-OPT-05",
      "panelId": "06",
      "title": "Hold deputy reports until Ironday",
      "summary": "Prerequisite: Council has not yet sat. Steward Office: Ironday is when the slate becomes an order.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "Reports wait; no deputy is silenced forever."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.status",
        "animationId": "meter.sweep"
      },
      "sfx": "confirm",
      "advisorId": "Steward Office"
    }
  ],
  "07": [
    {
      "id": "07-OPT-01",
      "panelId": "07",
      "title": "Open Elara Red's sealed note",
      "summary": "Prerequisite: her seal is intact. Elara Red: if the seal was broken before you, I did not send it.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The note is read by the Fist and filed under shadows."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.special",
        "animationId": "redact.reveal"
      },
      "sfx": "confirm",
      "advisorId": "Elara Red"
    },
    {
      "id": "07-OPT-02",
      "panelId": "07",
      "title": "Cross-check the Sixth Carrier",
      "summary": "Prerequisite: the carrier's answers are already on file. Elara Red: the Sixth Carrier talks. That is not the same as truth.",
      "category": "Order",
      "costs": {
        "marks": 50,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "Answers are compared; none are promoted to fact alone."
        ],
        "unknownEffects": []
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.special",
        "animationId": "redact.reveal"
      },
      "sfx": "confirm",
      "advisorId": "Elara Red"
    },
    {
      "id": "07-OPT-03",
      "panelId": "07",
      "title": "Send Anja Keller along the stairwell",
      "summary": "Prerequisite: Anja is off a current post. Elara Red: Anja looks for doors that should not open.",
      "category": "Delegate",
      "costs": {
        "marks": 80,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "medium",
      "uncertainty": "unknown",
      "forecast": {
        "knownEffects": [
          "A counter-intrusion walk is ordered, not a public arrest."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.special",
        "animationId": "redact.reveal"
      },
      "sfx": "confirm",
      "advisorId": "Elara Red"
    },
    {
      "id": "07-OPT-04",
      "panelId": "07",
      "title": "Redact the Latch rumor",
      "summary": "Prerequisite: the rumor is unconfirmed. Elara Red: redaction hides a line. It does not kill it.",
      "category": "Invest",
      "costs": {
        "marks": 25,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The rumor leaves the open report and stays in the sealed copy."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.special",
        "animationId": "redact.reveal"
      },
      "sfx": "confirm",
      "advisorId": "Elara Red"
    },
    {
      "id": "07-OPT-05",
      "panelId": "07",
      "title": "File the Iron Guard special",
      "summary": "Prerequisite: Elara has signed the cover sheet. Elara Red: five women, one book, no extra names.",
      "category": "Investigate",
      "costs": {
        "marks": 10,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The special report is filed where the hall cannot browse it."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.special",
        "animationId": "redact.reveal"
      },
      "sfx": "confirm",
      "advisorId": "Elara Red"
    }
  ],
  "08": [
    {
      "id": "08-OPT-01",
      "panelId": "08",
      "title": "Enter the Ironday command line",
      "summary": "Prerequisite: the log book is open. Samer Vogt: the log remembers the order, not the mood.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "One command line is entered as spoken."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.command",
        "animationId": "counter.roll"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "08-OPT-02",
      "panelId": "08",
      "title": "Audit last Watchday orders",
      "summary": "Prerequisite: the prior inspection is written. Samer Vogt: if it is not in the log, it did not happen here.",
      "category": "Order",
      "costs": {
        "marks": 15,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Watchday orders are checked against what was done."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.command",
        "animationId": "counter.roll"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "08-OPT-03",
      "panelId": "08",
      "title": "Correct the Barracks Lines entry",
      "summary": "Prerequisite: a wrong gate or floor was logged. Samer Vogt: strike it. Do not pretend it was never written.",
      "category": "Delegate",
      "costs": {
        "marks": 10,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The entry is corrected and the old line remains struck, not erased."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.command",
        "animationId": "counter.roll"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "08-OPT-04",
      "panelId": "08",
      "title": "Seal the log before Ashday",
      "summary": "Prerequisite: Ashday has not begun. Samer Vogt: Ashday does not get a fresh war in the margin.",
      "category": "Invest",
      "costs": {
        "marks": 0,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The log closes clean for the rest day."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.command",
        "animationId": "counter.roll"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    },
    {
      "id": "08-OPT-05",
      "panelId": "08",
      "title": "Ask Command Staff for the missing line",
      "summary": "Prerequisite: a gap sits in the day's log. Samer Vogt: a blank is safer than a lie.",
      "category": "Investigate",
      "costs": {
        "marks": 20,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The gap is queried; no line is invented to fill it."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.command",
        "animationId": "counter.roll"
      },
      "sfx": "confirm",
      "advisorId": "Samer Vogt"
    }
  ],
  "09": [
    {
      "id": "09-OPT-01",
      "panelId": "09",
      "title": "Open the 105 AW chronicle chapter",
      "summary": "Prerequisite: the year book is on the archive stand. House Archive: 105 AW starts where the last sealed page ended.",
      "category": "Investigate",
      "costs": {
        "marks": 0,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The chapter is opened and no past line is rewritten."
        ],
        "unknownEffects": []
      },
      "delay": "instant",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": true,
        "memory": true,
        "reputation": true,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.chronicle",
        "animationId": "chapter.reveal"
      },
      "sfx": "confirm",
      "advisorId": "House Archive"
    },
    {
      "id": "09-OPT-02",
      "panelId": "09",
      "title": "Pin Dagmar's frontier entry",
      "summary": "Prerequisite: a witnessed border report is in hand. House Archive: Dagmar's report is a record, not a song.",
      "category": "Order",
      "costs": {
        "marks": 10,
        "hours": 1,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The frontier line is pinned as witnessed, not as legend."
        ],
        "unknownEffects": []
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.chronicle",
        "animationId": "chapter.reveal"
      },
      "sfx": "confirm",
      "advisorId": "House Archive"
    },
    {
      "id": "09-OPT-03",
      "panelId": "09",
      "title": "Record the Catastrophe margin",
      "summary": "Prerequisite: the atlas page on the Catastrophe is unlocked. House Archive: we do not fill the Catastrophe with guesses.",
      "category": "Delegate",
      "costs": {
        "marks": 0,
        "hours": 4,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "none",
      "uncertainty": "known",
      "forecast": {
        "knownEffects": [
          "The margin notes what is known and leaves the rest blank."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "hours",
      "cooldown": 0,
      "confirm": "none",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.chronicle",
        "animationId": "chapter.reveal"
      },
      "sfx": "confirm",
      "advisorId": "House Archive"
    },
    {
      "id": "09-OPT-04",
      "panelId": "09",
      "title": "Strike a false household line",
      "summary": "Prerequisite: a chronicle line contradicts a witnessed fact. House Archive: erasure is not correction.",
      "category": "Invest",
      "costs": {
        "marks": 20,
        "hours": 5,
        "resources": {},
        "personnel": [],
        "politicalCapital": 1
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "The false line is struck and the correction sits beside it."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": false,
        "rumor": false,
        "memory": false,
        "reputation": false,
        "chronicle": true,
        "provenance": false
      },
      "visual": {
        "artId": "hero.chronicle",
        "animationId": "chapter.reveal"
      },
      "sfx": "confirm",
      "advisorId": "House Archive"
    },
    {
      "id": "09-OPT-05",
      "panelId": "09",
      "title": "Ask Emmerich Kolb about the pre-war film",
      "summary": "Prerequisite: the film card is in the archive. House Archive: the film's place is a question, not a trophy.",
      "category": "Investigate",
      "costs": {
        "marks": 30,
        "hours": 6,
        "resources": {},
        "personnel": [],
        "politicalCapital": 0
      },
      "requires": [],
      "risk": "low",
      "uncertainty": "partly",
      "forecast": {
        "knownEffects": [
          "Kolb is asked; the film is not declared found."
        ],
        "unknownEffects": [
          "Downstream reaction"
        ]
      },
      "delay": "days",
      "cooldown": 0,
      "confirm": "soft",
      "effects": [],
      "hooks": {
        "ledger": true,
        "news": true,
        "rumor": true,
        "memory": false,
        "reputation": true,
        "chronicle": false,
        "provenance": false
      },
      "visual": {
        "artId": "hero.chronicle",
        "animationId": "chapter.reveal"
      },
      "sfx": "confirm",
      "advisorId": "House Archive"
    }
  ]
} as const;

export const OPTION_CATALOG = materializeCatalog(RAW_CATALOG);
export type CatalogOption = (typeof OPTION_CATALOG)[keyof typeof OPTION_CATALOG][number];
