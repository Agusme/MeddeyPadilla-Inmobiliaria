import assert from "node:assert/strict";
import test from "node:test";
import { Property } from "../src/models/Property";
import { propertyTypes, validPropertyTypes } from "../src/utils/propertyTypes";
import { propertyTypeOptions, hasResidentialFeatures } from "../../front/lib/propertyTypes";

test("catalogues agree and new selectors exclude legacy types", () => {
  assert.deepEqual(propertyTypeOptions.map(option => option.value), [...propertyTypes]);
  assert.equal(propertyTypeOptions.some(option => String(option.value) === "Propiedad"), false);
  for (const type of [...propertyTypes.slice(0, 4), "Propiedad"]) assert.equal(hasResidentialFeatures(type), true);
  assert.equal(hasResidentialFeatures("Oficina"), false);
});

test("GET, POST and PATCH preserve every type and filter without conflating types", async (t) => {
  Object.assign(process.env, {
    MONGODB_URI: "mongodb://localhost/property-types-tests", JWT_SECRET: "property-types-tests-secret-at-least-32-characters",
    ADMIN_USERNAME: "test", ADMIN_PASSWORD_HASH: "test", CLOUDINARY_CLOUD_NAME: "", CLOUDINARY_API_KEY: "", CLOUDINARY_API_SECRET: "",
  });
  const { propertiesRouter, adminPropertiesRouter } = await import("../src/routes/properties");
  const handler = (router: typeof propertiesRouter, path: string, method: string) => router.stack.find(layer => layer.route?.path === path && layer.route.methods[method])!.route.stack.at(-1)!.handle;
  let stored: InstanceType<typeof Property>;
  let capturedFilter: Record<string, unknown> = {};
  t.mock.method(Property, "create", async (data: object) => { stored = new Property(data); await stored.validate(); return stored; });
  t.mock.method(Property, "find", (filter: Record<string, unknown>) => { capturedFilter = filter; return { sort: async () => [stored] }; });
  t.mock.method(Property, "findOne", async () => stored);
  t.mock.method(Property, "findById", () => ({ select: () => ({ lean: async () => ({ images: [] }) }) }));
  t.mock.method(Property, "findByIdAndUpdate", async (_id: string, update: object) => { stored.set(update); await stored.validate(); return stored; });
  async function call(fn: Function, request: object) {
    let status = 200;
    let payload: any;
    const response = { status(code: number) { status = code; return this; }, json(data: unknown) { payload = data; return this; } };
    await fn(request, response);
    return { status, payload };
  }
  for (const propertyType of validPropertyTypes) {
    const body = { title: "Test", operation: "Venta", propertyType, price: "100", currency: "USD", city: "Test", description: "Test" };
    const expected = propertyType === "Local" ? "Local comercial" : propertyType;
    const created = await call(handler(adminPropertiesRouter, "/", "post"), { body, files: [] });
    assert.equal(created.status, 201);
    assert.equal(created.payload.propertyType, expected);
    assert.equal(stored!.toObject().propertyType, propertyType);
    const listed = await call(handler(propertiesRouter, "/", "get"), { query: { type: propertyType } });
    assert.equal(listed.status, 200);
    assert.equal(listed.payload[0].propertyType, expected);
    assert.deepEqual(capturedFilter.propertyType, { $in: propertyType === "Local comercial" ? [propertyType, "Local"] : [propertyType] });
    const detail = await call(handler(propertiesRouter, "/:slug", "get"), { params: { slug: "test" } });
    assert.equal(detail.payload.propertyType, expected);
    const updated = await call(handler(adminPropertiesRouter, "/:id", "patch"), { params: { id: "test" }, body, files: [] });
    assert.equal(updated.status, 200);
    assert.equal(updated.payload.propertyType, expected);
    assert.equal(stored!.toObject().propertyType, propertyType);
  }
  // A legacy document can explicitly adopt each new type through PATCH.
  for (const propertyType of propertyTypes) {
    stored!.propertyType = "Propiedad";
    const body = { title: "Test", operation: "Venta", propertyType, price: "100", currency: "USD", city: "Test", description: "Test" };
    const result = await call(handler(adminPropertiesRouter, "/:id", "patch"), { params: { id: "test" }, body, files: [] });
    assert.equal(result.status, 200);
    assert.equal(result.payload.propertyType, propertyType);
  }
  // Mixed results must never leak offices into commercial premises or vice versa.
  const mixed = ["Oficina", "Local comercial", "Local", "Propiedad"].map((propertyType, index) => new Property({
    slug: "mixed-" + index, title: "Mixed", operation: "Venta", propertyType,
    price: 100, currency: "USD", city: "Test", description: "Test", status: "published",
  }));
  t.mock.method(Property, "find", (filter: Record<string, unknown>) => ({ sort: async () => {
    const accepted = (filter.propertyType as { $in: string[] } | undefined)?.$in;
    return mixed.filter(document => !accepted || accepted.includes(document.propertyType));
  } }));
  for (const propertyType of ["Oficina", "Local comercial"]) {
    const result = await call(handler(propertiesRouter, "/", "get"), { query: { type: propertyType } });
    assert.equal(result.status, 200);
    assert.deepEqual(result.payload.map((property: { slug: string }) => property.slug),
      propertyType === "Oficina" ? ["mixed-0"] : ["mixed-1", "mixed-2"]);
    assert.ok(result.payload.every((property: { propertyType: string }) => property.propertyType === propertyType));
  }
  assert.deepEqual(mixed.map(document => document.toObject().propertyType), ["Oficina", "Local comercial", "Local", "Propiedad"]);
  for (const method of ["post", "patch"]) {
    const result = await call(handler(adminPropertiesRouter, method === "post" ? "/" : "/:id", method), { params: { id: "test" }, body: { title: "Test", operation: "Venta", propertyType: "invalid", price: "100", currency: "USD", city: "Test", description: "Test" }, files: [] });
    assert.equal(result.status, 400);
  }
  assert.equal((await call(handler(propertiesRouter, "/", "get"), { query: { type: "invalid" } })).status, 400);
});
