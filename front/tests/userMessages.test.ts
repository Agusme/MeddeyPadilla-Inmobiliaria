import assert from "node:assert/strict";
import test from "node:test";
import { ApiError, authorizePropertyUploads, createAdminProperty, deleteAdminProperty, getPublicProperties, login, propertyMutationNotice } from "../lib/api";

test("protects public catalog and login from technical network and server errors", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch", async () => { throw new TypeError("Failed to fetch"); });
  await assert.rejects(getPublicProperties(), { message: "No pudimos conectar con el servidor. Revisá tu conexión e intentá nuevamente." });
  await assert.rejects(login("admin", "test"), /No pudimos conectar con el servidor/);
  fetch.mock.mockImplementation(async () => Response.json({ message: "Internal Server Error\ncluster password" }, { status: 500 }));
  await assert.rejects(getPublicProperties(), /No pudimos cargar la información/);
  await assert.rejects(login("admin", "test"), /No pudimos iniciar sesión/);
  fetch.mock.mockImplementation(async () => Response.json({ message: "Unauthorized" }, { status: 401 }));
  await assert.rejects(login("admin", "test"), /usuario o la contraseña son incorrectos/);
});

test("distinguishes validation, photo authorization and unconfirmed property mutations", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch", async () =>
    Response.json({ userMessage: "Completá todos los campos obligatorios.", message: "ValidationError" }, { status: 400 }));
  await assert.rejects(createAdminProperty(new FormData()), error => {
    assert.deepEqual(propertyMutationNotice(error, "save"), {
      title: "No pudimos guardar la propiedad", text: "Completá todos los campos obligatorios.", icon: "error", confirmButtonText: "Entendido",
    });
    return true;
  });

  fetch.mock.mockImplementation(async () => { throw new TypeError("Network Error"); });
  await assert.rejects(authorizePropertyUploads("id", { files: [] }), error =>
    error instanceof ApiError && !error.outcomeUncertain && /Revisá tu conexión/.test(error.message));
  await assert.rejects(createAdminProperty(new FormData()), error => {
    const notice = propertyMutationNotice(error, "save");
    return notice.title === "Guardado sin confirmar" && /Revisá si la propiedad se guardó/.test(notice.text);
  });
  fetch.mock.mockImplementation(async () => new Response("FUNCTION_INVOCATION_TIMEOUT", { status: 504 }));
  await assert.rejects(deleteAdminProperty("id"), error => {
    const notice = propertyMutationNotice(error, "delete");
    return notice.title === "Eliminación sin confirmar" && /sigue en el listado/.test(notice.text) && !notice.text.includes("504");
  });
  fetch.mock.mockImplementation(async () => Response.json({}));
  await assert.rejects(createAdminProperty(new FormData()), error => error instanceof ApiError && error.outcomeUncertain);
  fetch.mock.mockImplementation(async () => Response.json({ _id: "saved" }, { status: 201 }));
  assert.equal((await createAdminProperty(new FormData()))._id, "saved");
});
