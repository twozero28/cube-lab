import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "#/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--glass-gradient)] text-[var(--primary-foreground)] shadow-[0_16px_34px_rgba(0,238,252,0.2)] hover:-translate-y-0.5 hover:brightness-105",
        secondary:
          "bg-[rgba(169,0,169,0.2)] text-[var(--secondary-foreground)] shadow-[inset_0_0_0_1px_var(--outline-variant)] hover:bg-[rgba(169,0,169,0.34)]",
        ghost: "text-[var(--text-primary)] hover:bg-white/10",
        outline:
          "bg-transparent text-[var(--text-primary)] shadow-[inset_0_0_0_1px_var(--outline-variant)] hover:bg-[var(--surface-variant)]",
      },
      size: {
        default: "min-h-12 px-5 py-3",
        sm: "min-h-10 px-4 py-2.5 text-xs",
        lg: "min-h-14 px-6 py-4 text-base",
        icon: "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
