import { cn } from "@/lib/utils";

/** Typographic wordmark — no pictogram. The lit bar over the O is the only mark. */
export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span
        className={cn(
          "font-display relative text-[1.35rem] font-semibold leading-none tracking-[-0.06em]",
          tone === "dark" ? "text-ink" : "text-ink-dark",
        )}
      >
        GL
        <span className="relative">
          O
          <span
            aria-hidden
            className="absolute -top-[3px] left-1/2 h-[2px] w-[70%] -translate-x-1/2 rounded-full bg-glow-300 shadow-[0_0_8px_2px_rgba(255,196,107,0.85),0_6px_18px_2px_rgba(255,196,107,0.45)]"
          />
        </span>
        W
      </span>
      <span className={cn("label-mono !text-[9.5px] !tracking-[0.24em]", tone === "dark" ? "text-steel-400" : "text-steel-500")}>
        LED Lighting
      </span>
    </span>
  );
}
