import Panel from "../ui/Panel";

const risks = [
  {
    title: "Cyber Attack",
    x: 5,
    y: 5,
    level: "Extreme",
  },
  {
    title: "Internal Fraud",
    x: 4,
    y: 4,
    level: "High",
  },
  {
    title: "System Failure",
    x: 3,
    y: 4,
    level: "High",
  },
  {
    title: "Settlement Error",
    x: 2,
    y: 3,
    level: "Medium",
  },
  {
    title: "Documentation",
    x: 2,
    y: 2,
    level: "Low",
  },
];

const colors = {
  Low: "bg-emerald-500",
  Medium: "bg-amber-400",
  High: "bg-orange-500",
  Extreme: "bg-red-500",
};

export default function RiskHeatmap() {
  return (
    <Panel
      title="Risk Heatmap"
      subtitle="Enterprise operational risk distribution"
    >
      <div className="grid grid-cols-5 gap-2">

        {[5,4,3,2,1].map((impact) =>

          [1,2,3,4,5].map((likelihood) => {

            const risk = risks.find(
              r =>
                r.x === likelihood &&
                r.y === impact
            );

            return (

              <div
                key={`${impact}-${likelihood}`}
                className="flex aspect-square items-center justify-center rounded-xl border border-slate-700 bg-slate-800"
              >

                {risk && (

                  <div
                    title={risk.title}
                    className={`h-5 w-5 rounded-full ${colors[risk.level as keyof typeof colors]}`}
                  />

                )}

              </div>

            );

          })

        )}

      </div>

      <div className="mt-6 flex flex-wrap gap-5 text-sm">

        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-emerald-500" />
          Low
        </div>

        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-amber-400" />
          Medium
        </div>

        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-orange-500" />
          High
        </div>

        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          Extreme
        </div>

      </div>

    </Panel>
  );
}