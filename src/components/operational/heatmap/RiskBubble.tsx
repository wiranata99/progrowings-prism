interface RiskBubbleProps {
  id: number;
  title: string;
  owner: string;
  likelihood: number;
  impact: number;
  level: "Low" | "Medium" | "High" | "Extreme";
  exposure?: number;
  position?: "left" | "right";
}

const bubbleColor = {
  Low: "bg-emerald-500",
  Medium: "bg-amber-400",
  High: "bg-orange-500",
  Extreme: "bg-red-500",
};

export default function RiskBubble({
  id,
  title,
  owner,
  likelihood,
  impact,
  level,
  exposure = 50,
  position = "right",

}: RiskBubbleProps) {
  const size =
    exposure >= 90
      ? 56
      : exposure >= 70
      ? 48
      : exposure >= 50
      ? 40
      : 34;

  return (
    <div className="group relative z-20">

      <div
        style={{
          width: size,
          height: size,
        }}
        className={`flex cursor-pointer items-center justify-center rounded-full border-2 border-white/20 text-sm font-bold text-white shadow-xl transition duration-300 hover:scale-110 ${bubbleColor[level]}`}
      >
        {id}
      </div>

      <div className={`pointer-events-none absolute top-1/2 z-[9999] hidden w-72 -translate-y-1/2 rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-2xl group-hover:block ${
  position === "right"
    ? "left-full ml-4"
    : "right-full mr-4"
}`}>

        <p className="font-semibold text-white">
          {title}
        </p>

        <div className="mt-3 space-y-1 text-sm">

          <div className="flex justify-between">
            <span className="text-slate-400">Owner</span>
            <span>{owner}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Likelihood</span>
            <span>{likelihood}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Impact</span>
            <span>{impact}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Residual Risk</span>
            <span>{level}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Exposure</span>
            <span>Rp {exposure} B</span>
          </div>

        </div>

      </div>

    </div>
  );
}