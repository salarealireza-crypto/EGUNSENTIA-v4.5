from pathlib import Path


def replace_once(path: Path, old: str, new: str, label: str) -> bool:
    if not path.is_file():
        raise SystemExit(f"Refusing to patch: {path} is missing")
    source = path.read_text(encoding="utf-8")
    if new in source:
        print(f"Already applied: {label}")
        return False
    count = source.count(old)
    if count != 1:
        raise SystemExit(
            f"Refusing to patch {path}: expected exactly one target for {label}, found {count}"
        )
    path.write_text(source.replace(old, new, 1), encoding="utf-8")
    print(f"Applied: {label}")
    return True


# The finally block is retained as a safety net so the composer is unlocked
# even when the server/provider request throws.
play = Path("src/lib/game/play.ts")
source = play.read_text(encoding="utf-8") if play.is_file() else ""
finally_marker = "// Always release the composer after a failed provider/server request too."
if finally_marker not in source:
    old_finally = '''  } catch (err) {
    console.error("[play]", err);
    useGame.getState().setError("The line to the Hall went dead.");
    useGame.getState().setFailedAction(text);
    useGame.getState().markLastPlayerFailed(true);
    useGame.getState().pushNote("The line to the Hall went dead. Try the action again.");
  }
}

/** Generate another narrative answer'''
    new_finally = '''  } catch (err) {
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
    replace_once(play, old_finally, new_finally, "release composer after failed AL request")
else:
    print("Already applied: release composer after failed AL request")

# A failure while compacting campaign state happens before playTurn() reaches
# the server. Previously it only changed an internal error field and left no
# visible explanation in the conversation.
old_preflight = '''  } catch {
    useGame.getState().setBusy(false);
    useGame.getState().setError("The current campaign state could not be compressed safely. Your saved campaign remains unchanged.");
    useGame.getState().setFailedAction(text);
    useGame.getState().markLastPlayerFailed(true);
    return;
  }

  try {
    const result = await playTurn'''
new_preflight = '''  } catch (err) {
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
  }

  try {
    const result = await playTurn'''
replace_once(play, old_preflight, new_preflight, "show campaign preflight failures in the game")

# When a second action is tapped while one is still processing, explain why it
# was ignored instead of silently returning from the input handler.
action_bar = Path("src/components/game/ActionBar.tsx")
old_send = '''  const send = async (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    setValue("");
    playSfx("click");
    await submitAction(t);
  };'''
new_send = '''  const send = async (text: string) => {
    const t = text.trim();
    if (!t) return;
    if (busy) {
      useGame.getState().setNotice(
        "The Hall is still processing the previous action. Wait for its reply before sending another.",
      );
      return;
    }
    setValue("");
    playSfx("click");
    await submitAction(t);
  };'''
replace_once(action_bar, old_send, new_send, "show why an action was blocked while busy")
