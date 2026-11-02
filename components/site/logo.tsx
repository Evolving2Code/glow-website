import { cn } from "@/lib/utils";

/** Typographic wordmark — no pictogram. The lit bar over the O is the only mark. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span
        className="font-display relative text-[1.35rem] font-semibold leading-none tracking-[-0.06em] text-ink"
      >
        GL
        <span className="relative">
          O
          <span
            aria-hidden
            className="absolute -top-[3px] left-1/2 h-[2px] w-[70%] -translate-x-1/2 rounded-full bg-glow-500 shadow-[0_0_8px_2px_rgba(245,168,58,0.7),0_6px_18px_2px_rgba(245,168,58,0.4)]"
          />
        </span>
        W
      </span>
      <span className="label-mono !text-[9.5px] !tracking-[0.24em] text-steel-400">
        LED Lighting
      </span>
    </span>
  );
}
