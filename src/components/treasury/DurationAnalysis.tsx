import Panel from "../ui/Panel";

import { durationAnalysis } from "../../data/treasury";

export default function DurationAnalysis() {
  return (
    <Panel>

      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
        Interest Rate Risk
      </p>

      <h2 className="mt-2 text-3xl font-bold">
        Duration Analysis
      </h2>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800">

        <table className="w-full">

          <thead className="bg-slate-800">

            <tr>

              <th className="px-6 py-4 text-left">
                Bucket
              </th>

              <th className="px-6 py-4 text-right">
                Outstanding
              </th>

              <th className="px-6 py-4 text-right">
                Duration
              </th>

            </tr>

          </thead>

          <tbody>

            {durationAnalysis.map((item) => (

              <tr
                key={item.bucket}
                className="border-t border-slate-800"
              >

                <td className="px-6 py-4">
                  {item.bucket}
                </td>

                <td className="px-6 py-4 text-right">
                  {item.amount}
                </td>

                <td className="px-6 py-4 text-right font-semibold text-cyan-400">
                  {item.duration}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Executive Assessment
        </p>

        <p className="mt-4 leading-8 text-slate-300">
          Current Modified Duration remains within the ALCO limit,
          indicating that the investment portfolio has a manageable
          sensitivity to interest rate movements.
          No material duration mismatch is currently observed.
        </p>

      </div>

    </Panel>
  );
}