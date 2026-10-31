import Image from "next/image";
import type { AssetSpec } from "@/lib/content";
import { cn } from "@/lib/utils";
import { LoopVideo } from "./loop-video";

type AssetSlotProps = {
  spec: AssetSpec;
  className?: string;
  density?: "full" | "compact";
  priority?: boolean;
  sizes?: string;
  children?: React.ReactNode;
  captionAlign?: "spread" | "top";
};

function CropMarks() {
  const mark = "absolute size-3 border-glow-400/60";
  return (
    <>
      <span aria-hidden className={cn(mark, "left-3 top-3 border-l-[0.5px] border-t-[0.5px]")} />
      <span aria-hidden className={cn(mark, "right-3 top-3 border-r-[0.5px] border-t-[0.5px]")} />
      <span aria-hidden className={cn(mark, "bottom-3 left-3 border-b-[0.5px] border-l-[0.5px]")} />
      <span aria-hidden className={cn(mark, "bottom-3 right-3 border-b-[0.5px] border-r-[0.5px]")} />
    </>
  );
}

/**
 * Renders the supplied asset when `spec.src` is set. Until then it renders a
 * production brief so the slot is visibly reserved at the correct aspect ratio
 * and the exact asset requirements travel with the layout.
 */
export function AssetSlot({ spec, className, density = "full", priority, sizes = "100vw", children, captionAlign = "spread" }: AssetSlotProps) {
  if (spec.video) {
    return (
      <div className={cn("relative overflow-hidden bg-obsidian-950", className)}>
        <LoopVideo
          mp4={spec.video.mp4}
          webm={spec.video.webm}
          poster={spec.video.poster ?? spec.src}
          alt={spec.alt ?? spec.title}
          priority={priority}
          sizes={sizes}
        />
        {children}
      </div>
    );
  }

  if (spec.src) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image src={spec.src} alt={spec.alt ?? ""} fill priority={priority} sizes={sizes} className="object-cover" />
        {children}
      </div>
    );
  }

  const ratio = `${spec.width} × ${spec.height}`;

  return (
    <figure
      className={cn(
        "relative overflow-hidden bg-obsidian-950 blueprint-grid",
        "outline-dashed outline-[0.5px] -outline-offset-[0.5px] outline-glow-400/25",
        className,
      )}
      aria-label={`Asset required: ${spec.title}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(255,196,107,0.16),transparent_55%)]"
      />
      <CropMarks />

      {density === "full" ? (
        <figcaption
          className={cn(
            "absolute inset-x-6 bottom-6 top-6 flex flex-col sm:inset-x-8 sm:bottom-8 sm:top-8",
            captionAlign === "top" ? "justify-start gap-10" : "justify-between",
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <span className="label-mono inline-flex items-center gap-2 rounded-full border-[0.5px] border-glow-400/40 bg-glow-400/[0.06] px-2.5 py-1 text-glow-300">
              <span className="size-1.5 animate-pulse-glow rounded-full bg-glow-400" />
              Asset required · {spec.id}
            </span>
            <span className="label-mono text-steel-500 tabular">{ratio} px</span>
          </div>

          <div className="max-w-md">
            <p className="font-display text-xl font-medium leading-tight text-ink sm:text-2xl">{spec.title}</p>
            <dl className="mt-5 grid gap-3 text-[13px] leading-snug">
              <div className="grid grid-cols-[5.5rem_1fr] gap-3">
                <dt className="label-mono pt-0.5 text-steel-500">Subject</dt>
                <dd className="text-ink-dim">{spec.subject}</dd>
              </div>
              <div className="grid grid-cols-[5.5rem_1fr] gap-3">
                <dt className="label-mono pt-0.5 text-steel-500">Lighting</dt>
                <dd className="text-ink-dim">{spec.lighting}</dd>
              </div>
              <div className="grid grid-cols-[5.5rem_1fr] gap-3">
                <dt className="label-mono pt-0.5 text-steel-500">Format</dt>
                <dd className="text-ink-dim">{spec.format}</dd>
              </div>
              {spec.notes && (
                <div className="grid grid-cols-[5.5rem_1fr] gap-3">
                  <dt className="label-mono pt-0.5 text-steel-500">Notes</dt>
                  <dd className="text-ink-dim">{spec.notes}</dd>
                </div>
              )}
            </dl>
          </div>
        </figcaption>
      ) : (
        <figcaption className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
          <span className="label-mono inline-flex items-center gap-2 text-glow-300/90">
            <span className="size-1.5 animate-pulse-glow rounded-full bg-glow-400" />
            {spec.id} · Asset required
          </span>
          <span className="max-w-[18rem] text-[12px] leading-snug text-steel-400">{spec.title}</span>
          <span className="label-mono text-steel-600 tabular">{ratio}</span>
        </figcaption>
      )}
      {children}
    </figure>
  );
}
