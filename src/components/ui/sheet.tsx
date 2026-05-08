import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "#/lib/utils";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

const SheetPortal = DialogPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-[rgba(7,10,24,0.6)] backdrop-blur-sm", className)}
    {...props}
  />
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

export const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 rounded-t-[2rem] bg-[rgba(29,29,57,0.9)] p-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),inset_0_0_0_1px_var(--outline-variant),0_-22px_56px_rgba(4,6,20,0.45)] backdrop-blur-xl",
        className,
      )}
      {...props}
    >
      <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-[var(--panel-line-strong)]" />
      {children}
      <DialogPrimitive.Close className="absolute right-5 top-5 rounded-full bg-[rgba(35,35,65,0.72)] p-2 text-[var(--text-secondary)] shadow-[inset_0_0_0_1px_var(--outline-variant)] transition hover:bg-[var(--surface-variant-strong)] hover:text-[var(--text-primary)]">
        <X className="size-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = DialogPrimitive.Content.displayName;

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-2", className)} {...props} />;
}

export const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-2xl font-semibold text-[var(--text-primary)]", className)}
    {...props}
  />
));
SheetTitle.displayName = DialogPrimitive.Title.displayName;

export const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm leading-6 text-[var(--text-secondary)]", className)}
    {...props}
  />
));
SheetDescription.displayName = DialogPrimitive.Description.displayName;
