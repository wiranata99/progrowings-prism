import Panel from "../ui/Panel";

const businessDrivers = [
  {
    title: "Loan Growth",
    value: "+8.50%",
    change: "Strong",
    color: "text-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-300",
  },
  {
    title: "CASA Growth",
    value: "+4.20%",
    change: "Improving",
    color: "text-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-300",
  },
  {
    title: "Fee Income",
    value: "Rp236 B",
    change: "+8.10%",
    color: "text-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-300",
  },
  {
    title: "Funding Cost",
    value: "3.18%",
    change: "Monitor",
    color: "text-amber-400",
    badge: "bg-amber-500/15 text-amber-300",
  },
  {
    title: "Operating Expense",
    value: "+5.60%",
    change: "Monitor",
    color: "text-amber-400",
    badge: "bg-amber-500/15 text-amber-300",
  },
  {
    title: "Net Profit",
    value: "Rp1.82 T",
    change: "+9.40%",
    color: "text-cyan-400",
    badge: "bg-cyan-500/15 text-cyan-300",
  },
  {
    title: "Net Interest Margin",
    value: "5.42%",
    change: "Stable",
    color: "text-cyan-400",
    badge: "bg-cyan-500/15 text-cyan-300",
  },
  {
    title: "Cost of Credit",
    value: "1.08%",
    change: "Monitor",
    color: "text-amber-400",
    badge: "bg-amber-500/15 text-amber-300",
  },
];

const drivers = [
  {
    factor: "Loan Growth",
    impact:
      "Higher earning assets continue supporting interest income growth.",
    trend: "▲ Strong",
    assessment: "Positive",
  },
  {
    factor: "CASA Growth",
    impact:
      "Lower funding cost supports stronger Net Interest Margin.",
    trend: "▲ Improving",
    assessment: "Positive",
  },
  {
    factor: "Funding Cost",
    impact:
      "Deposit repricing moderately compresses portfolio margin.",
    trend: "▲ Rising",
    assessment: "Monitor",
  },
  {
    factor: "Operating Expense",
    impact:
      "Cost-to-Income Ratio remains under moderate pressure.",
    trend: "▲ Rising",
    assessment: "Monitor",
  },
];

const badge = (status: string) => {
  switch (status) {
    case "Positive":
      return "bg-emerald-500/15 text-emerald-300";

    case "Monitor":
      return "bg-amber-500/15 text-amber-300";

    default:
      return "bg-cyan-500/15 text-cyan-300";
  }
};

export default function StrategicIntelligence() {
  return (
    <Panel>

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Strategic Intelligence
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Business Drivers & Profitability Impact
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-400">
            Connecting key business performance indicators with
            the Bank's profitability outlook and earnings quality.
          </p>

        </div>

        <div className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400">
          Executive Assessment
        </div>

      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        {businessDrivers.map((item) => (

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

            <div className="mt-4">

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${item.badge}`}
              >
                {item.change}
              </span>

            </div>

          </div>

        ))}

      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800">

        <table className="w-full">

          <thead className="bg-slate-900/70">

            <tr className="text-left text-xs uppercase tracking-[0.18em] text-slate-500">

              <th className="px-5 py-4">
                Business Driver
              </th>

              <th className="px-5 py-4">
                Current Trend
              </th>

              <th className="px-5 py-4">
                Profitability Impact
              </th>

              <th className="px-5 py-4">
                Executive Assessment
              </th>

            </tr>

          </thead>

          <tbody>

            {drivers.map((item) => (

              <tr
                key={item.factor}
                className="border-t border-slate-800 transition hover:bg-slate-800/40"
              >

                <td className="px-5 py-5 font-medium text-white">
                  {item.factor}
                </td>

                <td className="px-5 py-5 font-medium text-white">
                  {item.factor}
                </td>

                <td className="px-5 py-5">
                  <span className="font-semibold text-cyan-400">
                    {item.trend}
                  </span>
                </td>

                <td className="px-5 py-5 leading-7 text-slate-300">
                  {item.impact}
                </td>

                <td className="px-5 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${badge(item.assessment)}`}
                  >
                    {item.assessment}
                  </span>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="mt-8 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">

        <p className="text-xs font-semibold uppercase tracking-[0.20em] text-violet-300">
          PRISM Strategic Conclusion
        </p>

        <p className="mt-4 leading-8 text-slate-300">
  Overall profitability remains resilient and continues to exceed the approved
  Business Plan. Healthy loan growth, improving funding composition, and stable
  treasury income continue to support earnings quality. Although funding costs
  and operating expenses have increased moderately, current profitability
  remains well positioned to sustain business growth and shareholder value
  creation. Management should continue strengthening low-cost funding,
  maintaining pricing discipline, and improving operational efficiency to
  preserve long-term margin resilience.
</p>

      </div>

    </Panel>
  );
}