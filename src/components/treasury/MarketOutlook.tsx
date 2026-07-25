import Panel from "../ui/Panel";

const marketData = [
  {
    title: "BI Rate",
    value: "5.50%",
    change: "Hold",
    color: "text-white",
    status: "bg-slate-700/40 text-slate-300",
  },
  {
    title: "Fed Funds Rate",
    value: "4.50%",
    change: "▼ 25 bps",
    color: "text-cyan-400",
    status: "bg-emerald-500/15 text-emerald-400",
  },
  {
    title: "Indonesia 10Y",
    value: "6.84%",
    change: "▲ 8 bps",
    color: "text-cyan-400",
    status: "bg-amber-500/15 text-amber-300",
  },
  {
    title: "UST 10Y",
    value: "4.32%",
    change: "▲ 6 bps",
    color: "text-amber-400",
    status: "bg-amber-500/15 text-amber-300",
  },
  {
    title: "USD / IDR",
    value: "16,420",
    change: "▲ 0.40%",
    color: "text-amber-400",
    status: "bg-rose-500/15 text-rose-300",
  },
  {
    title: "IHSG",
    value: "7,245",
    change: "▲ 0.70%",
    color: "text-emerald-400",
    status: "bg-emerald-500/15 text-emerald-300",
  },
  {
    title: "Gold",
    value: "US$3,340",
    change: "▲ 1.20%",
    color: "text-yellow-300",
    status: "bg-yellow-500/15 text-yellow-300",
  },
  {
    title: "Brent Oil",
    value: "US$71",
    change: "▼ 0.80%",
    color: "text-sky-400",
    status: "bg-cyan-500/15 text-cyan-300",
  },
];

export default function MarketOutlook() {
  return (
    <Panel>

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Market Performance Analytics
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Market Outlook
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-400">
            Key macroeconomic and market indicators influencing
            Treasury portfolio performance.
          </p>

        </div>

        <div className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400">
          Updated Today
        </div>

      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-4 md:grid-cols-2">

        {marketData.map((item) => (

          <div
            key={item.title}
            className="rounded-2xl border border-slate-800 bg-slate-950 p-5 transition hover:border-cyan-500/40"
          >

            <p className="text-sm text-slate-500">
              {item.title}
            </p>

            <h3 className={`mt-3 text-3xl font-bold ${item.color}`}>
              {item.value}
            </h3>

            <div className="mt-4 flex items-center justify-between">

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status}`}
              >
                {item.change}
              </span>

            </div>

          </div>

        ))}

      </div>

      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">

        <p className="text-xs font-semibold uppercase tracking-[0.20em] text-cyan-400">
          PRISM Strategic Intelligence
        </p>

        <p className="mt-4 leading-8 text-slate-300">

          Current market conditions remain broadly supportive for the
          Bank's Treasury portfolio. Stable domestic policy rates and
          resilient equity performance continue to provide a favorable
          investment environment. Although higher US Treasury yields
          may create moderate mark-to-market pressure on long-duration
          bonds, the overall impact is expected to remain manageable
          under the current portfolio positioning.

        </p>

      </div>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-6">

        <p className="text-xs font-semibold uppercase tracking-[0.20em] text-cyan-400">
          External Drivers vs Portfolio Impact
        </p>

        <div className="mt-5 overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-[0.20em] text-slate-500">

                <th className="pb-4">External Driver</th>
                <th className="pb-4">Portfolio Impact</th>

              </tr>

            </thead>

            <tbody>

              <tr className="border-b border-slate-800">

                <td className="py-4 text-white">
                  BI Rate unchanged
                </td>

                <td className="text-slate-300">
                  Funding cost remains stable and supports bond carry income.
                </td>

              </tr>

              <tr className="border-b border-slate-800">

                <td className="py-4 text-white">
                  US Treasury +6 bps
                </td>

                <td className="text-slate-300">
                  Mild valuation pressure on long-duration government bonds.
                </td>

              </tr>

              <tr className="border-b border-slate-800">

                <td className="py-4 text-white">
                  Rupiah weakened 0.40%
                </td>

                <td className="text-slate-300">
                  Limited impact on FX exposure, monitoring continues.
                </td>

              </tr>

              <tr>

                <td className="py-4 text-white">
                  Brent Oil declined
                </td>

                <td className="text-slate-300">
                  Lower inflation expectations support bond market stability.
                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </Panel>
  );
}