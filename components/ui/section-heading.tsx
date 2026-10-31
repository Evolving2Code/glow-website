import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  id: string;
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  tone?: "dark" | "light";
  className?: string;
  aside?: React.ReactNode;
};

export function SectionHeading({ id, index, eyebrow, title, lede, tone = "dark", className, aside }: SectionHeadingProps) {
  const light = tone === "light";
  return (
    <header className={cn("grid gap-8 lg:grid-cols-12 lg:items-end", className)}>
      <div className="lg:col-span-7">
        <p className={cn("label-mono flex items-center gap-3", light ? "text-steel-500" : "text-steel-400")}>
          <span className={light ? "text-glow-700" : "text-glow-400"}>§{index}</span>
          <span className={cn("h-px w-8", light ? "bg-steel-300" : "bg-steel-600")} aria-hidden />
          {eyebrow}
        </p>
        <h2
          id={id}
          className={cn(
            "font-display mt-6 text-balance text-[2.5rem] font-medium leading-[0.98] sm:text-6xl lg:text-[4.25rem]",
            light ? "text-ink-dark" : "text-ink",
          )}
        >
          {title}
        </h2>
      </div>
      {(lede || aside) && (
        <div className="lg:col-span-5 lg:pb-2">
          {lede && (
            <p className={cn("max-w-md text-pretty text-base leading-relaxed lg:ml-auto", light ? "text-steel-600" : "text-ink-dim")}>
              {lede}
            </p>
          )}
          {aside}
        </div>
      )}
    </header>
  );
}
