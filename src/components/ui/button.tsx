import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "#/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[0.8rem] text-sm font-bold transition-all disabled:pointer-events-none disabled:opacity-45 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(180deg,#77956e,var(--sage))] text-[var(--primary-foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_10px_18px_rgba(78,104,72,0.24)] hover:-translate-y-0.5 hover:brightness-105",
        secondary:
          "bg-[var(--surface-raised)] text-[var(--secondary-foreground)] shadow-[var(--shadow-inset),var(--shadow-short)] hover:-translate-y-0.5",
        ghost: "text-[var(--text-primary)] hover:bg-[rgba(104,84,58,0.08)]",
        outline:
          "bg-[var(--surface-paper)] text-[var(--text-primary)] shadow-[var(--shadow-inset)] hover:bg-[var(--surface-raised)]",
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
