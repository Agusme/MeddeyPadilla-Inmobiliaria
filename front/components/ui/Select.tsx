"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check, X } from "lucide-react";


export type SelectOption = { value: string; label: string; disabled?: boolean };
type Props = {
  options: readonly SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name: string;
  label: string;
  id?: string;
  required?: boolean;
  invalid?: boolean;
  describedBy?: string;
  searchable?: boolean;
  clearable?: boolean;
  placeholder?: string;
  variant?: "admin" | "public" | "hero";
};

const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");

export default function Select({ options, value: controlledValue, defaultValue = "", onChange, name, label, id: suppliedId, required = false, invalid = false, describedBy, searchable = false, clearable = false, placeholder = "Seleccionar", variant = "admin" }: Props) {
  const generatedId = useId();
  const id = suppliedId ?? generatedId;
  const [localValue, setLocalValue] = useState(defaultValue);
  const [validationError, setValidationError] = useState(false);
  const value = controlledValue ?? localValue;
  const input = useRef<HTMLInputElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const isAdmin = variant === "admin";
  const filtered = options.filter(option => normalize(option.label).includes(normalize(query)));
  const selectedLabel = options.find(option => option.value === value)?.label ?? value;

  function close() { setOpen(false); setQuery(""); }
  function show() {
    setQuery("");
    const selected = options.findIndex(option => option.value === value && !option.disabled);
    setActive(Math.max(0, selected >= 0 ? selected : options.findIndex(option => !option.disabled)));
    setPosition(null);
    setOpen(true);
  }
  function choose(next: string) { if (options.find(option => option.value === next)?.disabled) return; setLocalValue(next); setValidationError(false); onChange?.(next); close(); input.current?.focus(); }

  useEffect(() => {
    if (!open) return;
    function reposition() {
      const rect = input.current?.getBoundingClientRect();
      if (!rect) return;
      const viewport = window.visualViewport;
      const topEdge = viewport?.offsetTop ?? 0;
      const bottomEdge = topEdge + (viewport?.height ?? window.innerHeight);
      let safeTop = topEdge + 8;
      // Keep menus below any fixed or sticky header currently covering the viewport.
      document.querySelectorAll("header").forEach(header => {
        const style = getComputedStyle(header);
        const bounds = header.getBoundingClientRect();
        if ((style.position === "fixed" || style.position === "sticky") && bounds.top <= topEdge + 1 && bounds.bottom > topEdge) {
          safeTop = Math.max(safeTop, bounds.bottom + 8);
        }
      });
      if (rect.bottom < safeTop || rect.top > bottomEdge) { setOpen(false); return; }
      const below = Math.max(0, bottomEdge - rect.bottom - 12);
      const above = Math.max(0, rect.top - safeTop - 4);
      const desired = Math.min(250, Math.max(44, filtered.length * 40 + 8));
      const down = below >= desired || below >= above;
      const height = Math.min(desired, down ? below : above);
      const width = Math.min(rect.width, (viewport?.width ?? window.innerWidth) - 16);
      const leftEdge = viewport?.offsetLeft ?? 0;
      setPosition({
        left: Math.max(leftEdge + 8, Math.min(rect.left, leftEdge + (viewport?.width ?? window.innerWidth) - width - 8)),
        top: down ? rect.bottom + 4 : rect.top - height - 4,
        width, height,
      });
    }
    const frame = requestAnimationFrame(reposition);
    const observer = new ResizeObserver(reposition);
    if (input.current) observer.observe(input.current);
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    window.visualViewport?.addEventListener("resize", reposition);
    window.visualViewport?.addEventListener("scroll", reposition);
    function outside(event: PointerEvent) {
      if (!input.current?.parentElement?.contains(event.target as Node) && !panel.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", outside);
    return () => {
      cancelAnimationFrame(frame); observer.disconnect();
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
      window.visualViewport?.removeEventListener("resize", reposition);
      window.visualViewport?.removeEventListener("scroll", reposition);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open, filtered.length]);

  const positioned = position !== null;
  useEffect(() => {
    if (!open || !positioned) return;
    const menu = panel.current;
    const option = menu?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    if (!menu || !option) return;
    if (option.offsetTop < menu.scrollTop) menu.scrollTop = option.offsetTop;
    else if (option.offsetTop + option.offsetHeight > menu.scrollTop + menu.clientHeight) {
      menu.scrollTop = option.offsetTop + option.offsetHeight - menu.clientHeight;
    }
  }, [open, active, positioned]);

  function keyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) { show(); return; }
      const step = event.key === "ArrowDown" ? 1 : -1;
      let next = active + step;
      while (next >= 0 && next < filtered.length && filtered[next].disabled) next += step;
      if (next >= 0 && next < filtered.length) setActive(next);
    } else if (event.key === "Enter" || (!searchable && event.key === " ")) {
      event.preventDefault();
      if (!open) show();
      else if (filtered[active]) choose(filtered[active].value);
    } else if (event.key === "Escape" && open) {
      event.preventDefault(); event.stopPropagation(); close();
    } else if (event.key === "Tab") close();
    else if (open && (event.key === "Home" || event.key === "End") && (!searchable || event.ctrlKey)) {
      event.preventDefault();
      const enabled = filtered.map((option, index) => option.disabled ? -1 : index).filter(index => index >= 0);
      setActive((event.key === "Home" ? enabled[0] : enabled.at(-1)) ?? 0);
    } else if (!searchable && event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      if (!open) show();
      const next = options.findIndex(option => !option.disabled && normalize(option.label).startsWith(normalize(event.key)));
      if (next >= 0) setActive(next);
    }
  }

  return (
    <div className="relative min-w-0">
      {/* Preserve native FormData, required validation and disabled options without displaying a native menu. */}
      <select name={name} value={value} required={required} tabIndex={-1} aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-px w-px opacity-0"
        onChange={event => choose(event.target.value)}
        onInvalid={event => { event.preventDefault(); setValidationError(true); input.current?.focus(); }}>
        {!options.some(option => option.value === "") && <option value="" disabled={!clearable}>{placeholder}</option>}
        {options.map(option => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
      </select>
      <div className={isAdmin ? "relative mt-1.5" : "relative"}>
        <input
          ref={input} id={id} role="combobox" aria-label={label} aria-expanded={open} aria-controls={open ? id + "-list" : undefined}
          aria-autocomplete={searchable ? "list" : "none"} aria-haspopup="listbox" aria-required={required}
          aria-invalid={invalid || validationError} aria-describedby={describedBy}
          aria-activedescendant={open && position && filtered[active] ? id + "-option-" + active : undefined}
          autoComplete="off" readOnly={!searchable} value={open && searchable ? query : selectedLabel}
          placeholder={open && searchable ? "Buscar..." : placeholder}
          onClick={() => { if (!open) show(); else if (!searchable) close(); }}
          onChange={event => { setQuery(event.target.value); setActive(0); if (!open) { setPosition(null); setOpen(true); } }}
          onKeyDown={keyDown} onBlur={close}
          className={`${clearable && value !== "" ? "pr-16" : "pr-10"} min-w-0 w-full cursor-pointer rounded-xl border bg-white px-3 text-sm font-normal text-[#171717] outline-none transition-colors placeholder:text-[#171717]/60 hover:border-black/25 focus:border-[#B71C1C] disabled:cursor-not-allowed ${variant === "hero" ? "h-12" : "h-11"} ${invalid || validationError ? "border-red-600" : "border-black/15"}`}
        />
        {clearable && value !== "" && <button type="button" aria-label={`Limpiar ${label.toLocaleLowerCase("es")}`}
          onClick={() => choose("")}
          className="absolute right-8 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-black/40 transition-colors hover:bg-black/5 hover:text-[#B71C1C] focus-visible:outline-1 focus-visible:outline-[#B71C1C]">
          <X aria-hidden="true" className="h-3.5 w-3.5" />
        </button>}
        <ChevronDown aria-hidden="true" className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/45 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {open && position && createPortal(
        <div ref={panel} className="fixed z-[60] overflow-y-auto overscroll-contain rounded-xl border border-black/10 bg-white p-1 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.16)]"
          style={{ left: position.left, top: position.top, width: position.width, maxHeight: position.height }}
          onPointerDown={event => { if (event.pointerType === "mouse") event.preventDefault(); }}>
          <div id={id + "-list"} role="listbox" aria-label={label}>
            {filtered.map((option, index) => (
              <div key={option.value} id={id + "-option-" + index} role="option" aria-selected={option.value === value} aria-disabled={option.disabled || undefined}
                data-index={index} onPointerMove={() => { if (!option.disabled) setActive(index); }}
                onPointerDown={event => { if (event.pointerType !== "mouse") { event.preventDefault(); } }}
                onClick={() => choose(option.value)}
                className={`flex h-10 items-center justify-between gap-2 rounded-lg px-3 text-sm font-normal ${option.disabled ? "cursor-not-allowed text-black/30" : option.value === value ? "cursor-pointer bg-[#B71C1C]/[0.08] text-[#B71C1C]" : index === active ? "cursor-pointer bg-[#B71C1C]/[0.04] text-[#B71C1C]" : "cursor-pointer text-[#171717]"}`}>
                <span className="truncate">{option.label}</span>{option.value === value && <Check aria-hidden="true" className="h-4 w-4 shrink-0" />}
              </div>
            ))}
          </div>
          {filtered.length === 0 && <p role="status" className="px-3 py-2 text-sm text-black/55">Sin resultados.</p>}
        </div>, document.body,
      )}
    </div>
  );
}
