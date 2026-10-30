"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, GripVertical, Trash2 } from "lucide-react";

type ImageOrderItem = { key: string; label: string; src?: string; file?: File };

function FileThumbnail({ file }: { file: File }) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setSrc(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return <ImagePreview src={src} />;
}

function ImagePreview({ src }: { src: string }) {
  const [loadedSrc, setLoadedSrc] = useState("");
  const [errorSrc, setErrorSrc] = useState("");
  const loaded = src !== "" && loadedSrc === src;
  const failed = src !== "" && errorSrc === src;

  return (
    <span className="relative block h-12 w-12 shrink-0 overflow-hidden rounded bg-black/5 sm:h-14 sm:w-16" aria-busy={Boolean(src) && !loaded && !failed}>
      {!loaded && <span aria-hidden="true" className={`absolute inset-0 bg-linear-to-br from-black/10 via-black/5 to-black/10 ${failed || !src ? "" : "animate-pulse"}`} />}
      {src && !failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          onLoad={() => setLoadedSrc(src)}
          onError={() => setErrorSrc(src)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </span>
  );
}

export default function ImageOrderList({
  items,
  onReorder,
  onRemove,
  compact = false,
}: {
  items: ImageOrderItem[];
  onReorder: (from: number, to: number) => void;
  onRemove: (key: string) => void;
  compact?: boolean;
}) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  if (!items.length) return null;

  return (
    <ol className={compact ? "mt-3 grid min-w-0 gap-3" : "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"}>
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
            if (draggedIndex !== null && Number.isInteger(from) && from >= 0 && from < items.length) onReorder(from, index);
            setDraggedIndex(null);
          }}
          onDragEnd={() => setDraggedIndex(null)}
          className={`flex min-h-20 min-w-0 cursor-grab items-center gap-2 rounded-xl border border-black/10 bg-[#fcfcfc] p-2 sm:gap-3 sm:p-3 active:cursor-grabbing ${draggedIndex === index ? "opacity-40" : ""}`}
        >
          <div className="relative shrink-0">
          {item.file ? (
            <FileThumbnail file={item.file} />
          ) : item.src ? (
            <ImagePreview src={item.src} />
          ) : (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-[#B71C1C]/5 text-xs font-semibold text-[#B71C1C] sm:h-14 sm:w-16">Foto nueva</span>
          )}
          </div>
          <div className="min-w-0 flex-1" title={item.label}>
            <p className="truncate text-sm font-semibold text-[#171717]">{index === 0 ? "Portada" : `Foto ${index + 1}`}</p>
          </div>
          <div className="flex shrink-0 items-center justify-end">
          {compact ? <div className="flex shrink-0">
            <button type="button" disabled={index === 0} aria-label={`Mover foto ${index + 1} antes`} onClick={() => onReorder(index, index - 1)} className="flex h-11 w-8 items-center justify-center rounded text-black/60 hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-[#B71C1C] disabled:invisible"><ArrowUp aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} /></button>
            <button type="button" disabled={index === items.length - 1} aria-label={`Mover foto ${index + 1} después`} onClick={() => onReorder(index, index + 1)} className="flex h-11 w-8 items-center justify-center rounded text-black/60 hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-[#B71C1C] disabled:invisible"><ArrowDown aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} /></button>
          </div> : <span aria-hidden="true" className="select-none px-1 text-black/35"><GripVertical className="h-5 w-5" strokeWidth={1.8} /></span>}
          <button
            type="button"
            draggable={false}
            aria-label={`Eliminar foto ${index + 1}${index === 0 ? ", portada" : ""}`}
            title="Eliminar foto"
            onPointerDown={(event) => event.stopPropagation()}
            onDragStart={(event) => { event.preventDefault(); event.stopPropagation(); }}
            onClick={(event) => { event.stopPropagation(); onRemove(item.key); }}
            className="flex h-11 w-8 cursor-pointer items-center justify-center rounded text-red-600 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B71C1C]"
          >
            <Trash2 aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
          </button>
          </div>
        </li>
      ))}
    </ol>
  );
}
