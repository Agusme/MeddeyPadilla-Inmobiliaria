"use client";

import { useEffect, useRef, useState } from "react";

type ImageOrderItem = { key: string; label: string; src?: string; file?: File };

function FileThumbnail({ file }: { file: File }) {
  const thumbnail = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    if (thumbnail.current) thumbnail.current.src = objectUrl;
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img ref={thumbnail} alt="" className="h-16 w-20 shrink-0 rounded bg-black/5 object-cover" />
  );
}

export default function ImageOrderList({
  items,
  onReorder,
  compact = false,
}: {
  items: ImageOrderItem[];
  onReorder: (from: number, to: number) => void;
  compact?: boolean;
}) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  if (!items.length) return null;

  return (
    <ol className={compact ? "mt-4 grid min-w-0 gap-3" : "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"}>
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
          {compact ? <div className="flex shrink-0">
            <button type="button" disabled={index === 0} aria-label={`Mover foto ${index + 1} antes`} onClick={() => onReorder(index, index - 1)} className="flex h-11 w-9 items-center justify-center rounded text-black/60 hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-[#B71C1C] disabled:opacity-25">↑</button>
            <button type="button" disabled={index === items.length - 1} aria-label={`Mover foto ${index + 1} después`} onClick={() => onReorder(index, index + 1)} className="flex h-11 w-9 items-center justify-center rounded text-black/60 hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-[#B71C1C] disabled:opacity-25">↓</button>
          </div> : <span aria-hidden="true" className="select-none px-1 text-lg text-black/35">⠿</span>}
        </li>
      ))}
    </ol>
  );
}
