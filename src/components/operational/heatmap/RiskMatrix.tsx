import RiskBubble from "./RiskBubble";

interface RiskItem {
  id: number;
  title: string;
  owner: string;
  likelihood: number;
  impact: number;
  level: "Low" | "Medium" | "High" | "Extreme";
  exposure: number;
}

interface RiskMatrixProps {
  risks: RiskItem[];
}

const likelihoodLabels = [
  "Rare",
  "Unlikely",
  "Possible",
  "Likely",
  "Almost Certain",
];

const impactLabels = [
  "Insignificant",
  "Minor",
  "Moderate",
  "Major",
  "Severe",
];

const cellColor = (likelihood: number, impact: number) => {
  const score = likelihood * impact;

  if (score >= 20) return "bg-red-600/20";
  if (score >= 12) return "bg-orange-500/20";
  if (score >= 6) return "bg-amber-500/20";
  return "bg-emerald-500/20";
};

export default function RiskMatrix({
  risks,
}: RiskMatrixProps) {
  return (
    <div className="overflow-x-auto overflow-y-visible">

      <div className="grid grid-cols-6 gap-2">

        <div />

        {likelihoodLabels.map((label) => (
          <div
            key={label}
            className="pb-2 text-center text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            {label}
          </div>
        ))}

        {[5,4,3,2,1].map((impact) => (
          <>
            <div
              key={`label-${impact}`}
              className="flex items-center justify-end pr-3 text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              {impactLabels[impact-1]}
            </div>

            {[1,2,3,4,5].map((likelihood) => {

              const risk = risks.find(
                r =>
                  r.likelihood === likelihood &&
                  r.impact === impact
              );

              return (

                <div
                  key={`${impact}-${likelihood}`}
                  className={`relative flex h-24 items-center justify-center rounded-xl border border-slate-700 transition ${cellColor(
                    likelihood,
                    impact
                  )}`}
                >

                  {risk && (
                    <RiskBubble
                    {...risk}
                    position={likelihood >= 4 ? "left" : "right"}
                    />
                  )}

                </div>

              );

            })}

          </>
        ))}

      </div>

    </div>
  );
}