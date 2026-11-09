import test from "node:test";
import assert from "node:assert/strict";
import { attachSaveLifecycle } from "../src/lib/game/save-lifecycle.ts";

function makeTarget() {
  const target = new EventTarget();
  return target;
}

const dispatch = (target, name) => target.dispatchEvent(new Event(name));

test("account save retries when connectivity returns or a visible tab resumes online", async () => {
  const windowTarget = makeTarget();
  const documentTarget = makeTarget();
  let online = false;
  let visibilityState = "visible";
  Object.defineProperty(documentTarget, "visibilityState", { get: () => visibilityState });
  let attempts = 0;
  const cleanup = attachSaveLifecycle(
    windowTarget,
    documentTarget,
    async () => { attempts += 1; },
    () => online,
  );

  online = true;
  dispatch(windowTarget, "online");
  assert.equal(attempts, 1);

  visibilityState = "hidden";
  dispatch(documentTarget, "visibilitychange");
  assert.equal(attempts, 2);

  online = false;
  visibilityState = "visible";
  dispatch(documentTarget, "visibilitychange");
  assert.equal(attempts, 2, "a visible offline tab must not start a futile retry");

  online = true;
  dispatch(documentTarget, "visibilitychange");
  assert.equal(attempts, 3);

  dispatch(windowTarget, "pagehide");
  assert.equal(attempts, 4);

  cleanup();
  dispatch(windowTarget, "online");
  dispatch(documentTarget, "visibilitychange");
  assert.equal(attempts, 4, "cleanup removes all lifecycle listeners");
});

test("a rejected lifecycle save does not prevent a later reconnect retry", async () => {
  const windowTarget = makeTarget();
  const documentTarget = makeTarget();
  Object.defineProperty(documentTarget, "visibilityState", { value: "visible" });
  let attempts = 0;
  const cleanup = attachSaveLifecycle(windowTarget, documentTarget, async () => {
    attempts += 1;
    if (attempts === 1) throw new Error("offline");
  }, () => true);

  dispatch(windowTarget, "online");
  await new Promise((resolve) => setImmediate(resolve));
  dispatch(windowTarget, "online");
  await new Promise((resolve) => setImmediate(resolve));
  cleanup();
  assert.equal(attempts, 2);
});
