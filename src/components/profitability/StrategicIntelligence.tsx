import type { StrategicIntelligenceViewModel } from "../../presentation/mappers/strategicIntelligenceMapper";

import Panel from "../ui/Panel";

interface StrategicIntelligenceProps {
  data: StrategicIntelligenceViewModel;
}

function assessmentClasses(status: string): string {
  switch (status) {
    case "Positive":
      return "bg-emerald-500/15 text-emerald-300";
    case "Negative":
      return "bg-rose-500/15 text-rose-300";
    case "Monitor":
      return "bg-amber-500/15 text-amber-300";
    default:
      return "bg-slate-500/15 text-slate-400";
  }
}

function valueClasses(status: string): string {
  switch (status) {
    case "Positive":
      return "text-emerald-400";
    case "Negative":
      return "text-rose-400";
    case "Monitor":
      return "text-amber-400";
    default:
      return "text-slate-400";
  }
}

export default function StrategicIntelligence({
  data,
}: StrategicIntelligenceProps) {
  return (
    <Panel>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Strategic Intelligence
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Business Drivers & Profitability Impact
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-400">
            Connecting key balance sheet and earnings indicators with the Bank&apos;s
            profitability outlook and earnings quality.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300">
            As of {data.reportingDate}
          </span>

          <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400">
            {data.executiveAssessment}
          </span>
        </div>
      </div>

      {data.cards.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 text-sm leading-7 text-amber-200">
          Profitability Strategic Intelligence is waiting for DB_NIM and DB_IS data.
          Other PRISM modules remain available.
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {data.cards.map((item) => (
              <div
                key={item.key}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-5 transition hover:border-cyan-500/40"
              >
                <p className="text-sm text-slate-500">{item.title}</p>

                <h3
                  className={`mt-3 text-3xl font-bold ${valueClasses(item.assessment)}`}
                >
                  {item.value}
                </h3>

                {item.details && item.details.length > 0 && (
                  <p className="mt-2 min-h-5 text-xs leading-5 text-slate-400">
                    {item.details.map((detail, index) => (
                      <span key={`${item.key}-${detail}`}>
                        {index > 0 && (
                          <span className="px-1.5 text-slate-600">•</span>
                        )}
                        {detail}
                      </span>
                    ))}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${assessmentClasses(item.assessment)}`}
                  >
                    {item.assessment}
                  </span>

                  <span className="text-xs text-slate-500">{item.change}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full min-w-[900px]">
              <thead className="bg-slate-900/70">
                <tr className="text-left text-xs uppercase tracking-[0.18em] text-slate-500">
                  <th className="px-5 py-4">Business Driver</th>
                  <th className="px-5 py-4">Current Trend</th>
                  <th className="px-5 py-4">Profitability Impact</th>
                  <th className="px-5 py-4">Executive Assessment</th>
                </tr>
              </thead>

              <tbody>
                {data.drivers.map((item) => (
                  <tr
                    key={item.key}
                    className="border-t border-slate-800 transition hover:bg-slate-800/40"
                  >
                    <td className="px-5 py-5 font-medium text-white">
                      {item.factor}
                    </td>
                    <td className="px-5 py-5 font-semibold text-cyan-400">
                      {item.trend}
                    </td>
                    <td className="px-5 py-5 leading-7 text-slate-300">
                      {item.impact}
                    </td>
                    <td className="px-5 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${assessmentClasses(item.assessment)}`}
                      >
                        {item.assessment}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="mt-8 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.20em] text-violet-300">
          PRISM Strategic Conclusion
        </p>

        <p className="mt-4 leading-8 text-slate-300">{data.conclusion}</p>
      </div>
    </Panel>
  );
}