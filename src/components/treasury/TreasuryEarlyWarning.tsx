import Panel from "../ui/Panel";

const warnings = [
  {
    level: "Medium",
    issue: "Modified Duration mendekati limit ALCO.",
    impact: "Sensitivitas terhadap kenaikan suku bunga meningkat.",
    action: "Evaluasi reposisi portofolio tenor panjang.",
  },
  {
    level: "Low",
    issue: "Eksposur obligasi korporasi meningkat.",
    impact: "Potensi peningkatan risiko kredit investasi.",
    action: "Review rating dan limit issuer.",
  },
  {
    level: "High",
    issue: "Volatilitas USD/IDR meningkat.",
    impact: "Berpotensi mempengaruhi valuasi portofolio FX.",
    action: "Lakukan monitoring harian dan stress scenario.",
  },
];

export default function TreasuryEarlyWarning() {
  return (
    <Panel>

      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-400">
        Early Warning
      </p>

      <h2 className="mt-2 text-3xl font-bold">
        Treasury Risk Alert
      </h2>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800">

        <table className="w-full">

          <thead className="bg-slate-800">

            <tr>

              <th className="px-5 py-4 text-left">Level</th>
              <th className="px-5 py-4 text-left">Issue</th>
              <th className="px-5 py-4 text-left">Business Impact</th>
              <th className="px-5 py-4 text-left">Recommended Action</th>

            </tr>

          </thead>

          <tbody>

            {warnings.map((item) => (

              <tr
                key={item.issue}
                className="border-t border-slate-800 hover:bg-slate-800/40 transition-colors"
              >

                <td className="px-5 py-5">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.level === "High"
                        ? "bg-rose-500/15 text-rose-400"
                        : item.level === "Medium"
                        ? "bg-amber-500/15 text-amber-400"
                        : "bg-emerald-500/15 text-emerald-400"
                    }`}
                  >
                    {item.level}
                  </span>

                </td>

                <td className="px-5 py-5">{item.issue}</td>

                <td className="px-5 py-5 text-slate-400">
                  {item.impact}
                </td>

                <td className="px-5 py-5 text-cyan-400 font-medium">
                  {item.action}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </Panel>
  );
}