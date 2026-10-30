import assert from "node:assert/strict";
import test from "node:test";
import { applyImageOrder } from "../src/utils/propertyImageOrder";
import { removePropertyPhoto } from "../../front/lib/propertyPhotos";

const image = (url: string, position = 0) => ({ url, publicId: url, position });

test("removing a reordered upload and adding another keeps file indexes aligned on save", () => {
  const next = removePropertyPhoto([image("a"), image("b"), image("c")], ["new:2", "existing:1", "new:0", "new:1"], "new:0");
  assert.deepEqual(next.imageOrder, ["new:1", "existing:1", "new:0"]);
  const files = [...next.files, image("d")];
  const order = [...next.imageOrder, `new:${next.files.length}`];
  assert.deepEqual(applyImageOrder([image("old-cover"), image("saved")], files, JSON.stringify(order)), [image("c"), image("saved", 1), image("b", 2), image("d", 3)]);
});

test("removing saved photos preserves original saved references and clearing all drops uploads", () => {
  const next = removePropertyPhoto([image("new")], ["existing:0", "new:0", "existing:2"], "existing:0");
  assert.deepEqual(next.imageOrder, ["new:0", "existing:2"]);
  assert.deepEqual(next.files, [image("new")]);
  assert.deepEqual(removePropertyPhoto(next.files, ["new:0"], "new:0"), { files: [], imageOrder: [] });
});

test("saving a removed cover promotes the next photo and keeps the requested order", () => {
  const existing = [image("cover"), image("second", 1), image("third", 2)];
  assert.deepEqual(applyImageOrder(existing, [], '["existing:2","existing:1"]'), [image("third"), image("second", 1)]);
  assert.equal(existing.length, 3);
  assert.equal(existing[0].url, "cover");
});

test("editing can remove all saved photos or replace them with new photos", () => {
  assert.deepEqual(applyImageOrder([image("old")], [], "[]"), []);
  assert.deepEqual(applyImageOrder([image("old")], [image("new")], '["new:0"]'), [image("new")]);
});

test("mixed saved and new photos retain order and sequential positions", () => {
  assert.deepEqual(applyImageOrder([image("old")], [image("first"), image("second")], '["new:1","existing:0","new:0"]'), [image("second"), image("old", 1), image("first", 2)]);
});

test("creating a property preserves the requested order and legacy requests still append", () => {
  assert.deepEqual(applyImageOrder([], [image("a"), image("b")], '["new:1","new:0"]'), [image("b"), image("a", 1)]);
  assert.deepEqual(applyImageOrder([image("a")], [image("b")], undefined), [image("a"), image("b", 1)]);
});

test("invalid, duplicate and missing upload references are rejected", () => {
  for (const order of ['{', '{}', '[null]', '["existing:5"]', '["existing:0","existing:0"]', '[]']) {
    assert.throws(() => applyImageOrder([image("old")], [image("new")], order));
  }
});

test("the 12 photo limit applies to the final selection including saved photos", () => {
  const existing = Array.from({ length: 12 }, (_, index) => image(String(index), index));
  const keys = existing.map((_, index) => `existing:${index}`);
  assert.equal(applyImageOrder(existing, [], JSON.stringify(keys)).length, 12);
  assert.throws(() => applyImageOrder(existing, [image("new")], JSON.stringify([...keys, "new:0"])));
  assert.throws(() => applyImageOrder(existing, [image("new")], undefined));
  assert.equal(applyImageOrder(existing, [image("new")], JSON.stringify([...keys.slice(1), "new:0"])).length, 12);
});
