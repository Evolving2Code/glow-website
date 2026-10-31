import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-[-0.01em] transition-[background,color,box-shadow,border-color] duration-300 disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        glow:
          "bg-glow-400 text-obsidian-950 shadow-[0_0_0_0.5px_rgba(255,214,150,0.9)_inset,0_10px_40px_-8px_rgba(255,180,80,0.65),0_0_80px_-20px_rgba(255,196,107,0.8)] hover:bg-glow-300 hover:shadow-[0_0_0_0.5px_rgba(255,236,200,1)_inset,0_14px_50px_-8px_rgba(255,180,80,0.85),0_0_110px_-20px_rgba(255,196,107,0.95)]",
        ghost:
          "border-[0.5px] border-white/15 bg-white/[0.03] text-ink hover:border-white/30 hover:bg-white/[0.07]",
        dark:
          "bg-obsidian-900 text-concrete-50 shadow-[0_0_0_0.5px_rgba(255,255,255,0.1)_inset] hover:bg-obsidian-700",
        link: "rounded-none px-0 text-ink-dim underline-offset-4 hover:text-ink hover:underline",
      },
      size: {
        sm: "h-8 px-3.5 text-[13px]",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-6 text-[15px]",
        xl: "h-14 px-8 text-base",
      },
    },
    defaultVariants: { variant: "glow", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);
Button.displayName = "Button";

export { buttonVariants };
