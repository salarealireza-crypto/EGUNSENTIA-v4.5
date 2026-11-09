import test from "node:test";
import assert from "node:assert/strict";
import { isAllowedRequestMetadata } from "../src/lib/auth/request-isolation.mjs";

test("allows non-browser and same-origin requests", () => {
  assert.equal(isAllowedRequestMetadata({ site: null, mode: null, dest: null, method: "POST" }), true);
  assert.equal(isAllowedRequestMetadata({ site: "same-origin", mode: "cors", dest: "empty", method: "POST" }), true);
  assert.equal(isAllowedRequestMetadata({ site: "none", mode: "navigate", dest: "document", method: "GET" }), true);
});

test("allows cross-site top-level GET navigation for OAuth and page loads", () => {
  assert.equal(isAllowedRequestMetadata({ site: "cross-site", mode: "navigate", dest: "document", method: "GET" }), true);
});

test("rejects cross-site and same-site scripted requests", () => {
  for (const site of ["cross-site", "same-site"]) {
    assert.equal(isAllowedRequestMetadata({ site, mode: "cors", dest: "empty", method: "POST" }), false);
    assert.equal(isAllowedRequestMetadata({ site, mode: "no-cors", dest: "empty", method: "GET" }), false);
  }
});

test("rejects non-document embedded navigation", () => {
  assert.equal(isAllowedRequestMetadata({ site: "cross-site", mode: "navigate", dest: "object", method: "GET" }), false);
  assert.equal(isAllowedRequestMetadata({ site: "cross-site", mode: "navigate", dest: "embed", method: "GET" }), false);
});

test("does not treat cross-site POST navigation as safe", () => {
  assert.equal(isAllowedRequestMetadata({ site: "cross-site", mode: "navigate", dest: "document", method: "POST" }), false);
});
