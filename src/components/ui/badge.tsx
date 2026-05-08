import * as React from "react";

import { cn } from "#/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-[0.55rem] bg-[var(--sage-soft)] px-3 py-1 text-[11px] font-extrabold text-[var(--sage-dark)] shadow-[inset_0_0_0_1px_rgba(104,132,95,0.16)]",
        className,
      )}
      {...props}
    />
  );
}
