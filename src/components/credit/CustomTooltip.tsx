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
    case "totalRatio":
      return "Gross NPL";

    case "totalOutstanding":
      return "Outstanding";

    case "totalNplAmount":
      return "NPL Amount";

    default:
      return key;
  }
};

const getValue = (key: string, value: number | string) => {
  switch (key) {
    case "totalRatio":
      return `${value}%`;

    case "totalOutstanding":
      return `${value}`;

    case "totalNplAmount":
      return `${value}`;

    default:
      return value;
  }
};

export default function CustomTooltip({
  active,
  payload,
  label,
}: Props) {
  if (!active || !payload?.length) return null;

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
        w-[280px]
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

<div className="space-y-3 px-5 py-5">

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

  <div className="my-2 border-t border-slate-800" />

  <div className="flex items-center justify-between">
    <span className="text-sm text-slate-400">
      Total Loan
    </span>

    <span className="text-lg font-bold text-cyan-400">
      Rp197.6 T
    </span>
  </div>

  <div className="flex items-center justify-between">
    <span className="text-sm text-slate-400">
      NPL Amount
    </span>

    <span className="text-lg font-bold text-amber-400">
      Rp5.42 T
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