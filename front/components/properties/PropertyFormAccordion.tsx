"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type Props = { title: string; defaultOpen?: boolean; children: ReactNode };

export default function PropertyFormAccordion({ title, defaultOpen = false, children }: Props) {
  const contentId = useId();
  const [expanded, setExpanded] = useState(defaultOpen);

  return (
    <details
      open={expanded}
      onToggle={(event) => setExpanded(event.currentTarget.open)}
      onInvalidCapture={(event) => {
        // Open before the browser focuses the invalid control.
        event.currentTarget.open = true;
        setExpanded(true);
      }}
      className="group min-w-0"
    >
      <summary
        aria-expanded={expanded}
        aria-controls={contentId}
        className="inline-flex min-h-11 w-full cursor-pointer list-none items-center gap-2 rounded-lg py-3 text-sm font-semibold text-[#171717] outline-none focus-visible:ring-2 focus-visible:ring-[#B71C1C]/35 [&::-webkit-details-marker]:hidden"
      >
        {title}
        <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 text-[#B71C1C] group-open:rotate-180" strokeWidth={1.8} />
      </summary>
      <div id={contentId} className="min-w-0 pb-4 pt-1">{children}</div>
    </details>
  );
}
