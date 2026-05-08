import * as React from "react";

import { cn } from "#/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full bg-[rgba(35,35,65,0.72)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)] shadow-[inset_0_0_0_1px_var(--outline-variant)] backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}
