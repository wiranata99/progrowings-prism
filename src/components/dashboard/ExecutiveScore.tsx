interface ExecutiveScoreProps {
  score: number;
  status: string;
}

const domains = [
  {
    name: "Credit",
    score: 94,
    status: "Excellent",
    color: "emerald",
  },
  {
    name: "Market",
    score: 91,
    status: "Healthy",
    color: "cyan",
  },
  {
    name: "Liquidity",
    score: 97,
    status: "Strong",
    color: "emerald",
  },
  {
    name: "Operational",
    score: 89,
    status: "Healthy",
    color: "amber",
  },
  {
    name: "Climate",
    score: 86,
    status: "Watch",
    color: "amber",
  },
];

const colorClass = {
  emerald: "bg-emerald-400",
  cyan: "bg-cyan-400",
  amber: "bg-amber-400",
};

const badgeClass = {
  emerald: "bg-emerald-500/15 text-emerald-400",
  cyan: "bg-cyan-500/15 text-cyan-400",
  amber: "bg-amber-500/15 text-amber-400",
};

export default function ExecutiveScore({
  score,
  status,
}: ExecutiveScoreProps) {
  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-[#101827] p-4 shadow-2xl sm:p-6 lg:p-10">

      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.30em] text-cyan-400">
            Executive Command Center
          </p>

          <h2 className="mt-3 text-2xl font-bold sm:text-3xl lg:text-4xl">
            Enterprise Risk Score
          </h2>

        </div>

        <span className="w-fit rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-400">
          {status}
        </span>

      </div>

      {/* SCORE */}

      <div className="mt-8 flex flex-col items-start gap-3 sm:mt-10 sm:flex-row sm:items-end sm:gap-5">

        <h1 className="text-5xl font-bold leading-none sm:text-6xl lg:text-8xl">
          {score}
        </h1>

        <div className="mb-0 sm:mb-3">

          <p className="text-sm text-slate-400">
            Overall Enterprise Health
          </p>

          <p className="mt-1 text-lg font-semibold text-cyan-400">
            Within Risk Appetite
          </p>

        </div>

      </div>

      {/* BAR */}

      <div className="mt-8 h-3 overflow-hidden rounded-full bg-slate-800">

        <div
          className="h-full rounded-full bg-cyan-400 transition-all duration-700"
          style={{
            width: `${score}%`,
          }}
        />

      </div>

      {/* DOMAINS */}

      <div className="mt-10">

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Enterprise Risk Domains
          </p>

          <p className="text-xs text-slate-500">
            Current Assessment
          </p>

        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

          {domains.map((domain) => (

            <button
              key={domain.name}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10"
            >

              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                {domain.name}
              </p>

              <div className="mt-4 flex items-center justify-between gap-3">

                <h3 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
                  {domain.score}
                </h3>

                <span
                  className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                    badgeClass[domain.color as keyof typeof badgeClass]
                  }`}
                >
                  {domain.status}
                </span>

              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">

                <div
                  className={`h-full rounded-full ${
                    colorClass[domain.color as keyof typeof colorClass]
                  }`}
                  style={{
                    width: `${domain.score}%`,
                  }}
                />

              </div>

            </button>

          ))}

        </div>

      </div>

    </div>
  );
}