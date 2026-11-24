import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "rounded-sm bg-primary uppercase tracking-wide text-primary-foreground shadow-sm hover:brightness-90 hover:shadow-md active:scale-[0.99]",
        pill: "rounded-full bg-primary uppercase tracking-wide text-primary-foreground shadow-sm hover:brightness-90 hover:shadow-md active:scale-[0.99]",
        destructive: "rounded-sm bg-destructive text-destructive-foreground hover:brightness-95",
        outline:
          "rounded-sm border border-foreground/20 bg-background uppercase tracking-wide text-foreground hover:border-foreground/60 hover:bg-secondary",
        outlinePink:
          "rounded-sm border border-foreground/20 bg-background uppercase tracking-wide text-foreground hover:border-foreground/60 hover:bg-secondary",
        secondary: "rounded-sm bg-secondary text-secondary-foreground hover:bg-border",
        ghost: "rounded-sm hover:bg-secondary",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "rounded-full bg-background uppercase tracking-wide text-foreground hover:bg-primary hover:text-primary-foreground",
        success: "rounded-sm bg-success uppercase tracking-wide text-success-foreground hover:brightness-95",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
