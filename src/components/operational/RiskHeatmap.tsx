import Panel from "../ui/Panel";

const risks = [
  {
    id: 1,
    title: "Cyber Attack",
    likelihood: 5,
    impact: 5,
    level: "Extreme",
    owner: "IT Security",
  },
  {
    id: 2,
    title: "Internal Fraud",
    likelihood: 4,
    impact: 4,
    level: "High",
    owner: "Operations",
  },
  {
    id: 3,
    title: "System Failure",
    likelihood: 3,
    impact: 4,
    level: "High",
    owner: "IT Operations",
  },
  {
    id: 4,
    title: "Settlement Error",
    likelihood: 2,
    impact: 3,
    level: "Medium",
    owner: "Treasury",
  },
  {
    id: 5,
    title: "Documentation",
    likelihood: 2,
    impact: 2,
    level: "Low",
    owner: "Credit Administration",
  },
];

const bubbleColor = {
  Low: "bg-emerald-500",
  Medium: "bg-amber-400",
  High: "bg-orange-500",
  Extreme: "bg-red-500",
};

const matrixColor = (likelihood: number, impact: number) => {
  const score = likelihood + impact;

  if (score >= 9) return "bg-red-500/15";
  if (score >= 7) return "bg-orange-500/15";
  if (score >= 5) return "bg-amber-500/15";
  return "bg-emerald-500/15";
};

export default function RiskHeatmap() {
  const impacts = [5, 4, 3, 2, 1];
  const likelihoods = [1, 2, 3, 4, 5];

  return (
    <Panel
      title="Enterprise Risk Heatmap"
      subtitle="Residual operational risk distribution"
    >
      <div className="flex gap-6">

        {/* Y Axis */}

        <div className="flex flex-col">

          <div className="mb-4 h-8" />

          {impacts.map((impact) => (

            <div
              key={impact}
              className="flex h-20 items-center justify-end pr-4 text-sm font-semibold text-slate-400"
            >
              {impact}
            </div>

          ))}

          <p className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">

            Impact

          </p>

        </div>

        {/* Matrix */}

        <div className="flex-1">

          {/* X Axis */}

          <div className="mb-4 grid grid-cols-5 gap-2">

            {likelihoods.map((item) => (

              <div
                key={item}
                className="text-center text-sm font-semibold text-slate-400"
              >
                {item}
              </div>

            ))}

          </div>

          {/* Heatmap */}

          <div className="grid grid-cols-5 gap-2">

            {impacts.map((impact) =>
              likelihoods.map((likelihood) => {
                const risk = risks.find(
                  (r) =>
                    r.impact === impact &&
                    r.likelihood === likelihood
                );

                return (
                  <div
                    key={`${impact}-${likelihood}`}
                    className={`flex h-20 items-center justify-center rounded-xl border border-slate-700 transition-all duration-300 hover:scale-[1.02] ${matrixColor(
                      likelihood,
                      impact
                    )}`}
                  >
                    {risk && (
                      <div
                        className={`group flex h-8 w-8 cursor-pointer items-center justify-center rounded-full shadow-lg ring-2 ring-white/20 transition duration-300 hover:scale-125 ${
                          bubbleColor[
                            risk.level as keyof typeof bubbleColor
                          ]
                        }`}
                        title={`${risk.title}
Owner : ${risk.owner}
Likelihood : ${risk.likelihood}
Impact : ${risk.impact}`}
                      >
                        <span className="text-[10px] font-bold text-white">
                          {risk.id}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}

          </div>

          <p className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">

            Likelihood

          </p>

        </div>

      </div>

      {/* Legend */}

      <div className="mt-8 flex flex-wrap gap-6">

        <div className="flex items-center gap-2">

          <div className="h-3 w-3 rounded-full bg-emerald-500" />

          <span className="text-sm text-slate-300">
            Low
          </span>

        </div>

        <div className="flex items-center gap-2">

          <div className="h-3 w-3 rounded-full bg-amber-400" />

          <span className="text-sm text-slate-300">
            Medium
          </span>

        </div>

        <div className="flex items-center gap-2">

          <div className="h-3 w-3 rounded-full bg-orange-500" />

          <span className="text-sm text-slate-300">
            High
          </span>

        </div>

        <div className="flex items-center gap-2">

          <div className="h-3 w-3 rounded-full bg-red-500" />

          <span className="text-sm text-slate-300">
            Extreme
          </span>

        </div>

      </div>

    </Panel>
  );
}