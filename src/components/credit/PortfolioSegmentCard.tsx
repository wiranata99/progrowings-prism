// PortfolioSegmentCard.tsx

import {
  Building2,
  Users,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

interface Props {
  title: string;
  outstanding: string;
  nplAmount: string;
  ratio: string;

  outstandingDelta?: number | null;
  nplDelta?: number | null;
  ratioDelta?: number | null;
}

function splitAmount(value: string): {
  prefix: string;
  amount: string;
  suffix: string;
} {
  const normalized = value.trim();

  const match = normalized.match(
    /^(Rp)\s+(.+?)\s+(Bio)$/
  );

  if (!match) {
    return {
      prefix: "",
      amount: normalized,
      suffix: "",
    };
  }

  return {
    prefix: match[1],
    amount: match[2],
    suffix: match[3],
  };
}

export default function PortfolioSegmentCard({
  title,
  outstanding,
  nplAmount,
  ratio,
  outstandingDelta,
  nplDelta,
  ratioDelta,
}: Props) {
  const Icon = title
    .toLowerCase()
    .includes("consumer")
    ? Users
    : Building2;

  const outstandingParts =
    splitAmount(outstanding);

  const nplAmountParts =
    splitAmount(nplAmount);

  const Delta = ({
    value,
    positiveIsGood = true,
  }: {
    value?: number | null;
    positiveIsGood?: boolean;
  }) => {
    if (
      value === null ||
      value === undefined ||
      !Number.isFinite(value)
    ) {
      return (
        <div className="mt-2 text-xs font-semibold text-slate-500">
          - MoM
        </div>
      );
    }

    const positive = value >= 0;

    const good = positiveIsGood
      ? positive
      : !positive;

    return (
      <div
        className={`mt-2 flex items-center justify-center gap-1 text-xs font-semibold ${
          good
            ? "text-emerald-400"
            : "text-red-400"
        }`}
      >
        {positive ? (
          <TrendingUp size={13} />
        ) : (
          <TrendingDown size={13} />
        )}

        <span>
          {positive ? "+" : ""}
          {value.toFixed(2)}% MoM
        </span>
      </div>
    );
  };

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-7">
      <div className="mb-7 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
          <Icon size={24} />
        </div>

        <h2 className="text-2xl font-bold text-white">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="min-w-0 text-center">
          <div className="flex items-baseline justify-center gap-2 whitespace-nowrap text-white">
            {outstandingParts.prefix && (
              <span className="text-lg font-semibold text-slate-400">
                {outstandingParts.prefix}
              </span>
            )}

            <span className="text-[2.15rem] font-bold tracking-tight xl:text-[2.45rem]">
              {outstandingParts.amount}
            </span>

            {outstandingParts.suffix && (
              <span className="text-lg font-semibold text-slate-400">
                {outstandingParts.suffix}
              </span>
            )}
          </div>

          <div className="mt-3 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Outstanding
          </div>

          <Delta
            value={outstandingDelta}
            positiveIsGood={true}
          />
        </div>

        <div className="min-w-0 text-center">
          <div className="flex items-baseline justify-center gap-2 whitespace-nowrap text-amber-400">
            {nplAmountParts.prefix && (
              <span className="text-lg font-semibold text-amber-400/70">
                {nplAmountParts.prefix}
              </span>
            )}

            <span className="text-[2.15rem] font-bold tracking-tight xl:text-[2.45rem]">
              {nplAmountParts.amount}
            </span>

            {nplAmountParts.suffix && (
              <span className="text-lg font-semibold text-amber-400/70">
                {nplAmountParts.suffix}
              </span>
            )}
          </div>

          <div className="mt-3 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            NPL Amount
          </div>

          <Delta
            value={nplDelta}
            positiveIsGood={false}
          />
        </div>

        <div className="min-w-0 text-center">
          <div className="flex items-baseline justify-center whitespace-nowrap text-cyan-400">
            <span className="text-[2.15rem] font-bold tracking-tight xl:text-[2.45rem]">
              {ratio}
            </span>
          </div>

          <div className="mt-3 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Gross NPL Ratio
          </div>

          <Delta
            value={ratioDelta}
            positiveIsGood={false}
          />
        </div>
      </div>
    </section>
  );
}