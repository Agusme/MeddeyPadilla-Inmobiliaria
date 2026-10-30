import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ImageOrderList from "../components/properties/ImageOrderList";

test("every photo has a visible delete button alongside its reorder controls", () => {
  const html = renderToStaticMarkup(createElement(ImageOrderList, {
    compact: true,
    items: [
      { key: "existing:0", label: "Primera foto", src: "/first.jpg" },
      { key: "existing:1", label: "Segunda foto", src: "/second.jpg" },
    ],
    onRemove: () => {},
    onReorder: () => {},
  }));
  assert.equal((html.match(/title="Eliminar foto"/g) ?? []).length, 2);
  assert.match(html, /aria-label="Eliminar foto 1, portada"/);
  assert.match(html, /aria-label="Eliminar foto 2"/);
  const deleteButtons = html.match(/<button[^>]*title="Eliminar foto"[^>]*>/g) ?? [];
  assert.equal(deleteButtons.length, 2);
  deleteButtons.forEach((button) => {
    assert.match(button, /text-red-600/);
    assert.doesNotMatch(button, /group-hover|invisible|opacity-0|absolute/);
  });
  assert.match(html, /Mover foto 2 antes/);
  assert.match(html, /Portada/);
});
