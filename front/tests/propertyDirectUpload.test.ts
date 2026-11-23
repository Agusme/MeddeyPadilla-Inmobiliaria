import assert from "node:assert/strict";
import test from "node:test";
import { ApiError, type ApiProperty } from "../lib/api";
import { createDirectPropertySaver } from "../lib/propertyDirectUpload";

const photo = (name: string, content = name) => new File([content], name, { type: "image/jpeg" });
const id = "4bc99de3-a42a-42c8-bd81-33fd1095496a";
const property = { _id: "property" } as ApiProperty;
const ticket = (digest: string) => ({ digest, url: "https://example.test", fields: {} });

test("retries only failed photos, preserves cover order and reuses uploads after a failed save", async () => {
  const photos = ["a", "b", "c", "d"].map(name => photo(name));
  const calls: string[][] = [];
  const submitted: { id: string; order: string[] }[] = [];
  const progress: { total: number; uploaded: number; failed: number }[] = [];
  let sending = 0;
  let maxSending = 0;
  let rejectPhoto = true;
  const save = createDirectPropertySaver({
    newId: () => id,
    authorize: async (key, body) => {
      assert.equal(key, id);
      assert.deepEqual([body.propertyId, body.revision], ["property", "revision"]);
      calls.push(body.files.map(file => file.digest));
      return { uploads: body.files.map(file => ticket(file.digest)) };
    },
    upload: async file => {
      sending++;
      maxSending = Math.max(maxSending, sending);
      await new Promise(resolve => setImmediate(resolve));
      sending--;
      if (file.name === "b" && rejectPhoto) {
        rejectPhoto = false;
        throw new Error("Offline");
      }
    },
    finalize: async (id, body) => {
      submitted.push({ id, order: body.order });
      if (submitted.length === 1) throw new ApiError("Mongo unavailable", 500);
      return property;
    },
  });
  const run = () => save({ title: "Casa" }, photos, ["new:1", "existing:2", "new:0", "new:2", "new:3"],
    { propertyId: "property", revision: "revision" }, value => progress.push(value));
  await assert.rejects(run(), /reintentar solo esa foto/);
  assert.deepEqual(progress.at(-1), { total: 4, uploaded: 3, failed: 1 });
  assert.equal(submitted.length, 0);
  await assert.rejects(run(), /Mongo unavailable/);
  assert.deepEqual(await run(), property);
  assert.equal(maxSending, 3);
  assert.deepEqual(calls[1], [calls[0][1]]);
  assert.equal(calls.length, 2);
  assert.deepEqual(submitted[0], submitted[1]);
  assert.deepEqual(submitted[0].order, [`new:${calls[0][1]}`, "existing:2", ...[0, 2, 3].map(index => `new:${calls[0][index]}`)]);
});

test("duplicate file content, oversized files and excess photos are rejected before authorization", async () => {
  const save = createDirectPropertySaver({ newId: () => id, authorize: async () => { throw new Error("Unexpected authorization"); } });
  await assert.rejects(save({}, [photo("a", "same"), photo("b", "same")], ["new:0", "new:1"], {}, () => {}), /repetidas/);
  const tooLarge = new File([new Uint8Array(8 * 1024 * 1024 + 1)], "big.jpg", { type: "image/jpeg" });
  await assert.rejects(save({}, [tooLarge], ["new:0"], {}, () => {}), /8 MB/);
  await assert.rejects(save({}, [], Array(31).fill("existing:0"), {}, () => {}), /30 fotos/);
});

test("retries a photo Cloudinary could not confirm and authorizes saves without photos", async () => {
  const authorized: string[][] = [];
  let unconfirmed = true;
  const save = createDirectPropertySaver({
    newId: () => id,
    authorize: async (_, body) => {
      authorized.push(body.files.map(file => file.digest));
      return { uploads: body.files.map(file => ticket(file.digest)) };
    },
    upload: async () => {},
    finalize: async (_, body) => {
      if (body.order.length === 2 && unconfirmed) {
        unconfirmed = false;
        throw new ApiError("Unconfirmed", 409, [body.order[1].slice(4)]);
      }
      return property;
    },
  });
  const photos = [photo("a"), photo("b")];
  await assert.rejects(save({}, photos, ["new:0", "new:1"], {}, () => {}), /Unconfirmed/);
  assert.deepEqual(await save({}, photos, ["new:0", "new:1"], {}, () => {}), property);
  assert.deepEqual(authorized[1], [authorized[0][1]]);
  assert.deepEqual(await save({}, [], [], { propertyId: "other", revision: "revision" }, () => {}), property);
  assert.deepEqual(authorized[2], []);
});

test("30 photos above the legacy batch budget are sent as their original files", async () => {
  const files = Array.from({ length: 30 }, (_, index) =>
    new File([String(index), new Uint8Array(200_000)], `${index}.jpg`, { type: "image/jpeg" }));
  const sent = new Set<File>();
  const save = createDirectPropertySaver({
    newId: () => id,
    authorize: async (_, body) => {
      assert.equal(body.files.length, 30);
      assert.ok(body.files.reduce((total, file) => total + file.size, 0) > 3_800_000);
      return { uploads: body.files.map(file => ticket(file.digest)) };
    },
    upload: async file => { sent.add(file); },
    finalize: async (_, body) => {
      assert.equal(body.order.length, 30);
      return property;
    },
  });
  await save({}, files, files.map((_, index) => `new:${index}`), {}, () => {});
  assert.deepEqual(sent, new Set(files));
});

test("sends file bytes only to Cloudinary and sends JSON to the authenticated API", async (t) => {
  const urls: string[] = [];
  t.mock.method(globalThis, "fetch", async (input: string, options: RequestInit) => {
    urls.push(input);
    if (input.endsWith("/image/upload")) {
      const multipart = options.body as FormData;
      assert.equal(options.credentials, "omit");
      assert.equal(await (multipart.get("file") as File).text(), "original");
      assert.equal(multipart.get("api_key"), "public-key");
      assert.equal(multipart.get("overwrite"), "false");
      return Response.json({ success: true });
    }
    assert.equal(new Headers(options.headers).get("Content-Type"), "application/json");
    const body = JSON.parse(options.body as string);
    if (input.endsWith("/save")) {
      assert.deepEqual(body.fields, { title: "Casa" });
      assert.match(body.order[0], /^new:[a-f0-9]{64}$/);
      return Response.json(property);
    }
    assert.equal(body.files[0].size, 8);
    return Response.json({ uploads: [{
      digest: body.files[0].digest,
      url: "https://api.cloudinary.com/v1_1/example/image/upload",
      fields: { api_key: "public-key", signature: "signature", overwrite: false },
    }] });
  });
  const save = createDirectPropertySaver({ newId: () => id });
  await save({ title: "Casa" }, [photo("main.jpg", "original")], ["new:0"], {}, () => {});
  assert.deepEqual(urls.map(url => url.startsWith("https://api.cloudinary.com/") ? url : new URL(url, "http://localhost").pathname), [
    `/api/admin/properties/upload-sessions/${id}`,
    "https://api.cloudinary.com/v1_1/example/image/upload",
    `/api/admin/properties/upload-sessions/${id}/save`,
  ]);
});
