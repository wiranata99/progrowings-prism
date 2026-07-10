// PortfolioSegmentCard.tsx

import { Building2, Users, TrendingDown, TrendingUp } from "lucide-react";

interface Props {
  title: string;
  outstanding: string;
  nplAmount: string;
  ratio: string;

  outstandingDelta?: number;
  nplDelta?: number;
  ratioDelta?: number;
}

export default function PortfolioSegmentCard({
  title,
  outstanding,
  nplAmount,
  ratio,

  outstandingDelta = 1.8,
  nplDelta = -2.4,
  ratioDelta = -0.12,
}: Props) {
  const Icon = title.toLowerCase().includes("consumer")
    ? Users
    : Building2;

  const Delta = ({
    value,
    suffix = "%",
  }: {
    value: number;
    suffix?: string;
  }) => {
    const positive = value >= 0;

    return (
      <div
        className={`mt-2 flex items-center justify-center gap-1 text-xs font-semibold ${
          positive ? "text-emerald-400" : "text-red-400"
        }`}
      >
        {positive ? (
          <TrendingUp size={13} />
        ) : (
          <TrendingDown size={13} />
        )}

        <span>
          {positive ? "+" : ""}
          {value}
          {suffix} MoM
        </span>
      </div>
    );
  };

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-7">

      <div className="mb-6 flex items-center gap-3">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
          <Icon size={24} />
        </div>

        <h2 className="text-2xl font-bold text-white">
          {title}
        </h2>

      </div>

      <div className="grid grid-cols-3 gap-8">

        <div className="text-center">

          <div className="text-[2.5rem] xl:text-[2.75rem] font-bold tracking-tight text-white">
            {outstanding} 
          </div>

          <div className="mt-2 text-sm uppercase tracking-wider text-slate-500">
            Outstanding
          </div>

          <Delta value={outstandingDelta} />

        </div>

        <div className="text-center">

          <div className="text-[2.5rem] xl:text-[2.75rem] font-bold tracking-tight text-amber-400">
            {nplAmount}
          </div>

          <div className="mt-2 text-sm uppercase tracking-wider text-slate-500">
            NPL Amount
          </div>

          <Delta value={nplDelta} />

        </div>

        <div className="text-center">

          <div className="text-[2.5rem] xl:text-[2.75rem] font-bold tracking-tight text-cyan-400">
            {ratio}
          </div>

          <div className="mt-2 text-sm uppercase tracking-wider text-slate-500">
            Gross NPL
          </div>

          <Delta value={ratioDelta} suffix="%" />

        </div>

      </div>

    </section>
  );
}