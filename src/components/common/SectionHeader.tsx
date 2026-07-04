interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  badge,
}: SectionHeaderProps) {
  return (
    <section className="flex items-start justify-between gap-6">

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.30em] text-cyan-400">
          {eyebrow}
        </p>

        <h1 className="mt-2 text-4xl font-bold text-white">
          {title}
        </h1>

        <p className="mt-3 max-w-4xl leading-7 text-slate-400">
          {description}
        </p>

      </div>

      {badge && (

        <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400">

          {badge}

        </div>

      )}

    </section>
  );
}