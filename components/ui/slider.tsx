"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center py-3", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-[3px] w-full grow overflow-hidden rounded-full bg-contrast/[0.08]">
      <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-glow-700 via-glow-500 to-glow-300" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className="group relative block size-6 cursor-grab rounded-full border-[0.5px] border-glow-200/80 bg-surface shadow-[0_0_0_4px_rgba(255,196,107,0.12),0_0_30px_rgba(255,196,107,0.55)] transition-[box-shadow,transform] duration-200 hover:scale-110 hover:shadow-[0_0_0_7px_rgba(255,196,107,0.14),0_0_44px_rgba(255,196,107,0.8)] focus-visible:outline-none focus-visible:shadow-[0_0_0_7px_rgba(255,196,107,0.25),0_0_44px_rgba(255,196,107,0.8)] active:cursor-grabbing"
      aria-label={props["aria-label"]}
    >
      <span className="absolute inset-[7px] rounded-full bg-glow-300 shadow-[0_0_10px_rgba(255,210,140,1)]" />
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;
