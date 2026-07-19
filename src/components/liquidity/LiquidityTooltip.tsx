import { motion } from "framer-motion";

interface TooltipEntry {
  name: string;
  value: number | string;
  color: string;
}

interface Props {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

const getLabel = (key: string) => {
  switch (key) {
    case "value":
      return "Liquidity Coverage Ratio";

    default:
      return key;
  }
};

const getValue = (key: string, value: number | string) => {
  switch (key) {
    case "value":
      return `${Number(value).toFixed(2)}%`;

    default:
      return value;
  }
};

export default function LiquidityTooltip({
  active,
  payload,
  label,
}: Props) {
  if (!active || !payload?.length) return null;

// =========================================
// Dynamic Dummy Data
// Formula:
// LCR = HQLA / Net Cash Outflow
// =========================================

const lcr = Number(payload[0].value);

// Today dianggap hari ke-30
const dayIndex =
  label === "Today"
    ? 30
    : Number(String(label).replace("D-", ""));

// Total Liquidity Portfolio
const portfolio = 60.5; // Trillion

// HQLA sekitar 6.5% dari portfolio
// dengan fluktuasi kecil agar terlihat realistis
const hqla =
  portfolio * 0.065 +
  Math.sin(dayIndex * 0.42) * 0.18 +
  Math.cos(dayIndex * 0.28) * 0.12;

// Mengikuti formula LCR
const netCashOutflow = hqla / (lcr / 100);

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
        w-[300px]
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
          Monthly Snapshot
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

        <div className="border-t border-slate-800" />

        <div className="flex items-center justify-between">

          <span className="text-sm text-slate-400">
            HQLA
          </span>

          <span className="text-lg font-bold text-amber-400">
            Rp{hqla.toFixed(2)} T
          </span>

        </div>

        <div className="flex items-center justify-between">

          <span className="text-sm text-slate-400">
            Net Cash Outflow
          </span>

          <span className="text-lg font-bold text-amber-400">
            Rp{netCashOutflow.toFixed(2)} T
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