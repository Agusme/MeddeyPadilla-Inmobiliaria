"use client";

import { useEffect, useState } from "react";

type ImageOrderItem = { key: string; label: string; src?: string; file?: File };

function FileThumbnail({ file }: { file: File }) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setSrc(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className="h-16 w-20 shrink-0 rounded object-cover" />
  ) : (
    <span className="flex h-16 w-20 shrink-0 items-center justify-center rounded bg-black/5 text-xs text-black/45">Cargando…</span>
  );
}

export default function ImageOrderList({
  items,
  onReorder,
}: {
  items: ImageOrderItem[];
  onReorder: (from: number, to: number) => void;
}) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  if (!items.length) return null;

  return (
    <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <li
          key={item.key}
          draggable
          onDragStart={(event) => {
            setDraggedIndex(index);
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/plain", String(index));
          }}
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
          }}
          onDrop={(event) => {
            event.preventDefault();
            const from = Number(event.dataTransfer.getData("text/plain"));
            if (Number.isInteger(from)) onReorder(from, index);
            setDraggedIndex(null);
          }}
          onDragEnd={() => setDraggedIndex(null)}
          className={`flex min-w-0 cursor-grab items-center gap-3 rounded-md border border-black/10 bg-white p-3 active:cursor-grabbing ${draggedIndex === index ? "opacity-40" : ""}`}
        >
          {item.file ? (
            <FileThumbnail file={item.file} />
          ) : item.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.src} alt="" className="h-16 w-20 shrink-0 rounded object-cover" />
          ) : (
            <span className="flex h-16 w-20 shrink-0 items-center justify-center rounded bg-[#B71C1C]/5 text-xs font-semibold text-[#B71C1C]">Foto nueva</span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[#171717]">{index === 0 ? "Portada" : `Foto ${index + 1}`}</p>
            <p className="truncate text-xs text-black/55">{item.label}</p>
          </div>
          <span aria-hidden="true" className="select-none px-1 text-lg text-black/35">⠿</span>
        </li>
      ))}
    </ol>
  );
}
