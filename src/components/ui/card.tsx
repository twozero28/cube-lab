import * as React from "react";

import { cn } from "#/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        "rounded-[1.5rem] bg-[var(--surface-variant)] shadow-[inset_0_0_0_1px_var(--outline-variant),var(--panel-shadow)] backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...props} />;
}
