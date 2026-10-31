import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  id: string;
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  className?: string;
  aside?: React.ReactNode;
};

export function SectionHeading({ id, index, eyebrow, title, lede, className, aside }: SectionHeadingProps) {
  return (
    <header className={cn("grid gap-8 lg:grid-cols-12 lg:items-end", className)}>
      <div className="lg:col-span-7">
        <p className="label-mono flex items-center gap-3 text-steel-400">
          <span className="text-accent">§{index}</span>
          <span className="h-px w-8 bg-steel-600" aria-hidden />
          {eyebrow}
        </p>
        <h2
          id={id}
          className="font-display mt-6 text-balance text-[2.5rem] font-medium leading-[0.98] text-ink sm:text-6xl lg:text-[4.25rem]"
        >
          {title}
        </h2>
      </div>
      {(lede || aside) && (
        <div className="lg:col-span-5 lg:pb-2">
          {lede && (
            <p className="max-w-md text-pretty text-base leading-relaxed text-ink-dim lg:ml-auto">
              {lede}
            </p>
          )}
          {aside}
        </div>
      )}
    </header>
  );
}
