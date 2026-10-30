"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { BiX } from "react-icons/bi";
import { cn } from "@/lib/utils";

/**
 * Native <dialog>: focus trap, Escape and the top layer come from the
 * browser. Clicking the backdrop closes it too.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={cn(
        "m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-xl bg-gray-50 p-0 text-gray-900 shadow-2xl backdrop:bg-ink-950/50 backdrop:backdrop-blur-sm",
        className,
      )}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <h2 className="font-display text-2xl text-gray-950">{title}</h2>
        <button type="button" onClick={onClose} className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900">
          <BiX size={22} />
          <span className="sr-only">Close</span>
        </button>
      </div>
      <div className="p-6">{open && children}</div>
    </dialog>
  );
}
