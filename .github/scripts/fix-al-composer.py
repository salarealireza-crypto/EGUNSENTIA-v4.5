from pathlib import Path

path = Path("src/lib/game/play.ts")
if not path.is_file():
    raise SystemExit("Refusing to patch: src/lib/game/play.ts is missing")

source = path.read_text(encoding="utf-8")
marker = "// Always release the composer after a failed provider/server request too."
if marker in source:
    print("AL composer recovery is already present; no change needed.")
    raise SystemExit(0)

old = '''  } catch (err) {
    console.error("[play]", err);
    useGame.getState().setError("The line to the Hall went dead.");
    useGame.getState().setFailedAction(text);
    useGame.getState().markLastPlayerFailed(true);
    useGame.getState().pushNote("The line to the Hall went dead. Try the action again.");
  }
}

/** Generate another narrative answer'''

new = '''  } catch (err) {
    console.error("[play]", err);
    useGame.getState().setError("The line to the Hall went dead.");
    useGame.getState().setFailedAction(text);
    useGame.getState().markLastPlayerFailed(true);
    useGame.getState().pushNote("The line to the Hall went dead. Try the action again.");
  } finally {
    // Always release the composer after a failed provider/server request too.
    // Otherwise busy stays true and the player cannot send or retry another action.
    useGame.getState().setBusy(false);
  }
}

/** Generate another narrative answer'''

count = source.count(old)
if count != 1:
    raise SystemExit(f"Refusing to patch: expected exactly one target block, found {count}")

path.write_text(source.replace(old, new, 1), encoding="utf-8")
print("Applied AL composer recovery: busy is now cleared on success, server error, and thrown request error.")
