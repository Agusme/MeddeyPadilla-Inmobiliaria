import assert from "node:assert/strict";
import test from "node:test";
import { applyImageOrder } from "../src/utils/propertyImageOrder";
import { removePropertyPhoto, uniqueNewPropertyPhotos } from "../../front/lib/propertyPhotos";

const image = (url: string, position = 0) => ({ url, publicId: url, position });

test("selecting the same new file twice keeps a single upload in the original order", () => {
  const photo = (name: string, lastModified: number) => new File(["photo"], name, { lastModified, type: "image/jpeg" });
  const existing = photo("casa.jpg", 1);
  const different = photo("casa.jpg", 2);
  const front = photo("frente.jpg", 1);
  assert.deepEqual(
    uniqueNewPropertyPhotos([existing], [photo("casa.jpg", 1), different, front, photo("frente.jpg", 1)]),
    [different, front],
  );
});

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

test("creating accepts 30 photos and rejects 31", () => {
  const photos = Array.from({ length: 30 }, (_, index) => image(String(index)));
  assert.equal(applyImageOrder([], photos, undefined).length, 30);
  assert.throws(() => applyImageOrder([], [...photos, image("extra")], undefined), /hasta 30 imágenes/);
});

test("editing can grow from 12 saved photos to 30 and replace a photo at the limit", () => {
  const existing = Array.from({ length: 12 }, (_, index) => image(String(index), index));
  const added = Array.from({ length: 18 }, (_, index) => image(`added-${index}`));
  const keys = existing.map((_, index) => `existing:${index}`);
  const newKeys = added.map((_, index) => `new:${index}`);
  const saved = applyImageOrder(existing, added, JSON.stringify(["new:0", ...keys, ...newKeys.slice(1)]));
  assert.equal(saved.length, 30);
  assert.equal(saved[0].url, "added-0");
  assert.throws(() => applyImageOrder(existing, [...added, image("extra")], JSON.stringify([...keys, ...newKeys, "new:18"])), /hasta 30 imágenes/);
  assert.throws(() => applyImageOrder(saved, [image("extra")], undefined), /hasta 30 imágenes/);
  const replacementOrder = ["new:0", ...saved.slice(1).map((_, index) => `existing:${index + 1}`)];
  const replaced = applyImageOrder(saved, [image("cover")], JSON.stringify(replacementOrder));
  assert.equal(replaced.length, 30);
  assert.equal(replaced[0].url, "cover");
});
