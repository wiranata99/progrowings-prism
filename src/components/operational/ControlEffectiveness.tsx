import Panel from "../ui/Panel";

const controls = [
  { name: "Preventive Controls", score: 94, color: "bg-emerald-500" },
  { name: "Detective Controls", score: 88, color: "bg-cyan-500" },
  { name: "Corrective Controls", score: 81, color: "bg-amber-500" },
];

export default function ControlEffectiveness() {
  return (
    <Panel
      title="Control Effectiveness"
      subtitle="Enterprise internal control performance"
    >
      <div className="space-y-6">

        {controls.map((item) => (

          <div key={item.name}>

            <div className="mb-2 flex justify-between">

              <span className="font-medium">
                {item.name}
              </span>

              <span className="font-bold">
                {item.score}%
              </span>

            </div>

            <div className="h-3 rounded-full bg-slate-800">

              <div
                className={`h-3 rounded-full ${item.color}`}
                style={{
                  width: `${item.score}%`,
                }}
              />

            </div>

          </div>

        ))}

      </div>
    </Panel>
  );
}