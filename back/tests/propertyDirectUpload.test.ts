import assert from "node:assert/strict";
import test from "node:test";
import { v2 as cloudinary } from "cloudinary";
import { Property } from "../src/models/Property";
import { PropertyUploadSession } from "../src/models/PropertyUploadSession";

Object.assign(process.env, {
  MONGODB_URI: "mongodb://localhost/direct-upload-tests", JWT_SECRET: "direct-upload-test-secret-at-least-32-characters",
  ADMIN_USERNAME: "test", ADMIN_PASSWORD_HASH: "test",
  CLOUDINARY_CLOUD_NAME: "test", CLOUDINARY_API_KEY: "test-key", CLOUDINARY_API_SECRET: "test-secret",
});

const createId = "4bc99de3-a42a-42c8-bd81-33fd1095496a";
const editId = "bbab78ee-79fa-4581-ada1-b00f04887e8e";
const first = "a".repeat(64);
const second = "b".repeat(64);
const third = "c".repeat(64);
const fields = { title: "Casa", operation: "Venta", propertyType: "Casa", price: "100", currency: "USD", city: "Test", description: "Test" };
const descriptor = (digest: string, size = 100) => ({ digest, size, type: "image/jpeg" });

type TestImage = { publicId?: string; url: string; position: number };
type Receipt = { _id: string; owner: string; propertyId: string | null; revision: string | null; expiresAt: Date; publicIds: string[]; retiredIds: string[]; requestHash?: string; resultId?: string };
type Saved = { _id: string; id: string; updatedAt: Date; images: TestImage[]; propertyType: string; title: string };

test("direct routes authorize, verify and atomically save a creation and an edit", async (t) => {
  const { adminPropertiesRouter } = await import("../src/routes/properties");
  const { propertyImagePublicId } = await import("../src/services/propertyUploads");
  let receipts = new Map<string, Receipt>();
  let properties = new Map<string, Saved>();
  let unavailable = true;
  let failReceipt = true;
  let assetBytes = 100;
  let verificationCalls = 0;
  const destroyed: string[] = [];
  t.mock.method(console, "error", () => {});
  t.mock.method(cloudinary.uploader, "destroy", async (id: string) => { destroyed.push(id); return { result: "ok" }; });
  t.mock.method(cloudinary.api, "resources_by_ids", async (ids: string[]) => {
    verificationCalls++;
    return { resources: ids.filter(id => !(unavailable && id.endsWith(second))).map(public_id => ({
      public_id, bytes: assetBytes, format: "jpg", type: "upload", resource_type: "image", secure_url: `https://res.cloudinary.com/test/image/upload/${public_id}.jpg`,
    })) };
  });
  t.mock.method(PropertyUploadSession, "updateOne", async (query: { _id: string; owner?: string }, update: Record<string, any>) => {
    const receipt = receipts.get(query._id);
    if (update.$setOnInsert && !receipt) {
      receipts.set(query._id, { _id: query._id, publicIds: [], retiredIds: [], ...update.$setOnInsert });
      return { matchedCount: 0 };
    }
    if (receipt && update.$addToSet && query.owner === receipt.owner && !receipt.resultId) {
      receipt.publicIds = [...new Set([...receipt.publicIds, ...update.$addToSet.publicIds.$each])];
      return { matchedCount: 1 };
    }
    return { matchedCount: 0 };
  });
  t.mock.method(PropertyUploadSession, "findOne", (query: { _id: string; owner: string }) => {
    const receipt = receipts.get(query._id);
    const owned = receipt?.owner === query.owner ? receipt : undefined;
    return {
      lean: async () => owned,
      session: async () => owned && {
        ...owned,
        async save() {
          if (failReceipt) {
            failReceipt = false;
            throw new Error("Receipt write failed");
          }
          const { save: _, ...state } = this;
          receipts.set(query._id, state);
        },
      },
    };
  });
  t.mock.method(Property.db, "transaction", async (callback: (session: object) => Promise<unknown>) => {
    const before = structuredClone({ receipts, properties });
    try { return await callback({}); } catch (error) {
      ({ receipts, properties } = before);
      throw error;
    }
  });
  t.mock.method(Property.prototype, "save", async function (this: any) {
    const value = { ...this.toObject(), _id: this.id, id: this.id, updatedAt: new Date() };
    properties.set(this.id, value);
    return value;
  });
  t.mock.method(Property, "exists", async (query: { _id: string; updatedAt: Date }) =>
    properties.get(query._id)?.updatedAt.getTime() === query.updatedAt.getTime());
  t.mock.method(Property, "findById", (id: string) =>
    Object.assign(Promise.resolve(properties.get(id)), { session: () => ({ lean: async () => properties.get(id) }) }));
  t.mock.method(Property, "findByIdAndUpdate", async (id: string, update: any) => {
    const current = properties.get(id);
    if (!current) return null;
    const saved = { ...current, ...(update.$set ?? update), updatedAt: new Date(current.updatedAt.getTime() + 1) };
    properties.set(id, saved);
    return saved;
  });

  async function request(path: string, id: string, body: object, expected: number, owner = "test") {
    const handler = adminPropertiesRouter.stack.find(layer => layer.route?.path === path)!.route.stack.at(-1)!.handle;
    let status = 200;
    let payload: any;
    await handler({ params: { id }, body }, {
      locals: { adminUsername: owner },
      status(code: number) { status = code; return this; },
      json(body: unknown) { payload = body; return this; },
    });
    assert.equal(status, expected, JSON.stringify(payload));
    return payload;
  }
  const sign = "/upload-sessions/:id";
  const save = "/upload-sessions/:id/save";
  await request(sign, createId, { files: [descriptor(first), descriptor(first)] }, 400);
  await request(sign, createId, { files: [descriptor(first, 8 * 1024 * 1024 + 1)] }, 400);
  const { uploads } = await request(sign, createId, { files: [descriptor(first), descriptor(second)] }, 200);
  assert.equal(uploads[0].fields.public_id, propertyImagePublicId(createId, first));
  assert.equal(uploads[0].fields.overwrite, false);
  assert.equal(uploads[0].url, "https://api.cloudinary.com/v1_1/test/image/upload");
  assert.ok(uploads[0].fields.signature);
  assert.ok(!JSON.stringify(uploads).includes("test-secret"));
  await request(save, createId, { fields, order: [`new:${first}`] }, 404, "someone-else");
  await request(save, createId, { fields, order: [`new:${"c".repeat(64)}`] }, 403);
  await request(save, createId, { fields, order: [`new:${first}`, `new:${first}`] }, 400);

  const data = { fields, order: [`new:${second}`, `new:${first}`] };
  assert.deepEqual((await request(save, createId, data, 409)).missingDigests, [second]);
  assert.equal(properties.size, 0);
  unavailable = false;
  assetBytes = 8 * 1024 * 1024 + 1;
  await request(save, createId, data, 400);
  assetBytes = 100;
  await request(save, createId, data, 500);
  assert.equal(properties.size, 0);
  assert.deepEqual(destroyed, []);
  const saved = await request(save, createId, data, 201);
  const checked = verificationCalls;
  assert.equal((await request(save, createId, data, 200))._id, saved._id);
  assert.equal(verificationCalls, checked);
  assert.equal(properties.size, 1);
  await request(save, createId, { ...data, fields: { ...fields, title: "Other" } }, 409);
  await request(sign, createId, { files: [] }, 409);

  const legacyImage = { url: "https://example.test/legacy.jpg", position: 2 };
  properties.get(saved._id)!.images.push(legacyImage);
  const revision = saved.updatedAt.toISOString();
  await request(sign, editId, { propertyId: saved._id, revision, files: [descriptor(first), descriptor(third)] }, 200);
  await request(save, editId, { fields, order: ["existing:1", `new:${first}`] }, 400);
  const editedData = { fields, order: ["existing:2", `new:${third}`, "existing:1"] };
  const edited = await request(save, editId, editedData, 200);
  assert.deepEqual(edited.images.map((image: TestImage) => [image.url, image.position]), [
    [legacyImage.url, 0], [`https://res.cloudinary.com/test/image/upload/${propertyImagePublicId(editId, third)}.jpg`, 1],
    [saved.images[1].url, 2],
  ]);
  assert.deepEqual(receipts.get(editId)!.retiredIds, [propertyImagePublicId(createId, second)]);
  assert.equal((await request(save, editId, editedData, 200))._id, saved._id);
  assert.equal(properties.size, 1);
  const staleId = "f02d2de0-484d-483a-8a74-711b40cdfb80";
  await request(sign, staleId, { propertyId: saved._id, revision, files: [] }, 409);
  await request(sign, staleId, { files: [] }, 200);
  receipts.get(staleId)!.expiresAt = new Date(0);
  await request(save, staleId, { fields, order: [] }, 409);
});

test("cleanup protects attached photos and leaves failed deletions pending", async (t) => {
  const { cleanPropertyUploads } = await import("../src/services/propertyUploads");
  const removed: string[] = [];
  const completed: string[] = [];
  t.mock.method(PropertyUploadSession, "find", () => ({
    select: () => ({ sort: () => ({ limit: () => ({ lean: async () => [{
      _id: createId, publicIds: ["attached", "abandoned", "failure"], retiredIds: ["retired"],
    }] }) }) }),
  }));
  t.mock.method(PropertyUploadSession, "updateOne", async (_query: unknown, update: any) => { completed.push(...(update.$pullAll?.publicIds ?? [])); });
  t.mock.method(Property, "exists", async (query: { "images.publicId": string }) => query["images.publicId"] === "attached");
  t.mock.method(cloudinary.uploader, "destroy", async (id: string) => {
    if (id === "failure") throw new Error("Service unavailable");
    removed.push(id);
    return { result: "ok" };
  });
  assert.deepEqual(await cleanPropertyUploads(), { removed: 2, failures: 1 });
  assert.deepEqual(removed.sort(), ["abandoned", "retired"]);
  assert.deepEqual(completed.sort(), ["abandoned", "attached", "retired"]);
});
