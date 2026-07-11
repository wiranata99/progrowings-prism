import { motion } from "framer-motion";

interface TooltipEntry {
  name: string;
  value: number | string;
  color: string;
  payload: {
    portfolio: number;
    benchmark: number;
    day: string;
  };
}

interface Props {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

const getLabel = (key: string) => {
  switch (key) {
    case "portfolio":
      return "Portfolio Yield";

    case "benchmark":
      return "Benchmark Yield";

    default:
      return key;
  }
};

const getValue = (key: string, value: number | string) => {
  switch (key) {
    case "portfolio":
    case "benchmark":
      return `${Number(value).toFixed(2)}%`;

    default:
      return value;
  }
};

export default function TreasuryTooltip({
  active,
  payload,
  label,
}: Props) {
  if (!active || !payload?.length) return null;

  const portfolio = Number(payload[0].payload.portfolio);
  const benchmark = Number(payload[0].payload.benchmark);

  const alpha = ((portfolio - benchmark) * 100).toFixed(0);

  // ===== Dummy Treasury Metrics =====

  const dayIndex =
    label === "Today"
      ? 30
      : Number(String(label).replace("D-", ""));

  const portfolioValue =
    24.8 +
    Math.sin(dayIndex * 0.28) * 0.45 +
    Math.cos(dayIndex * 0.21) * 0.18;

  const modifiedDuration =
    3.48 +
    Math.sin(dayIndex * 0.32) * 0.08;

  return (

    <motion.div
      initial={{
        opacity: 0,
        y: 10,
        scale: 0.97,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.18,
      }}
      className="
        w-[310px]
        overflow-hidden
        rounded-2xl
        border
        border-cyan-500/20
        bg-slate-950/95
        backdrop-blur-xl
        shadow-[0_25px_80px_rgba(0,0,0,.55)]
      "
    >

      <div className="border-b border-slate-800 px-5 py-4">

        <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
          Treasury Snapshot
        </p>

        <h3 className="mt-1 text-xl font-bold text-white">
          {label}
        </h3>

      </div>

      <div className="space-y-4 px-5 py-5">

        {payload.map((entry) => (

          <div
            key={entry.name}
            className="flex items-center justify-between"
          >

            <div className="flex items-center gap-3">

              <span
                className="h-3 w-3 rounded-full"
                style={{
                  background: entry.color,
                }}
              />

              <span className="text-sm text-slate-400">

                {getLabel(entry.name)}

              </span>

            </div>

            <span
              className="text-lg font-bold"
              style={{
                color: entry.color,
              }}
            >
              {getValue(entry.name, entry.value)}
            </span>

          </div>

        ))}

        <div className="border-t border-slate-800"/>

        <div className="flex items-center justify-between">

          <span className="text-sm text-slate-400">

            Alpha

          </span>

          <span className="text-lg font-bold text-emerald-400">

            +{alpha} bps

          </span>

        </div>

        <div className="flex items-center justify-between">

          <span className="text-sm text-slate-400">

            Portfolio Value

          </span>

          <span className="text-lg font-bold text-cyan-400">

            Rp{portfolioValue.toFixed(2)} T

          </span>

        </div>

        <div className="flex items-center justify-between">

          <span className="text-sm text-slate-400">

            Modified Duration

          </span>

          <span className="text-lg font-bold text-amber-400">

            {modifiedDuration.toFixed(2)}

          </span>

        </div>

      </div>

      <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900/60 px-5 py-3">

        <span className="text-xs text-slate-500">

          PRISM Intelligence

        </span>

        <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold text-cyan-300">

          Live

        </span>

      </div>

    </motion.div>

  );

}