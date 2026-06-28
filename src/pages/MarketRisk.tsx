import AppLayout from "../components/layout/AppLayout";
import Panel from "../components/ui/Panel";
import MetricCard from "../components/cards/MetricCard";
import TrendChart from "../components/dashboard/TrendChart";

const bondPortfolio = [
  {
    series: "FR0101",
    book: "Rp1.24 T",
    mtm: "+Rp18.4 B",
    duration: "2.81",
    rating: "AAA",
  },
  {
    series: "FR0103",
    book: "Rp980 B",
    mtm: "+Rp11.2 B",
    duration: "4.65",
    rating: "AAA",
  },
  {
    series: "PBS038",
    book: "Rp760 B",
    mtm: "+Rp6.4 B",
    duration: "5.18",
    rating: "AAA",
  },
  {
    series: "SRBI 12M",
    book: "Rp500 B",
    mtm: "-",
    duration: "1.00",
    rating: "BI",
  },
];

const insights = [
  {
    level: "HIGH",
    color: "text-rose-400",
    title: "US Treasury Yield Increased",
    desc: "US 10Y Treasury increased by 8 bps, creating downward pressure on bond prices.",
  },
  {
    level: "MEDIUM",
    color: "text-amber-400",
    title: "Duration Within ALCO Limit",
    desc: "Current modified duration remains inside the Board approved tolerance.",
  },
  {
    level: "LOW",
    color: "text-emerald-400",
    title: "FX Net Open Position Stable",
    desc: "NOP remains significantly below the internal and regulatory limit.",
  },
];

export default function MarketRisk() {
  return (
    <AppLayout>

      {/* HERO */}

      <div className="rounded-3xl border border-cyan-500/20 bg-[#101827] p-10 shadow-2xl">

        <p className="text-xs font-semibold uppercase tracking-[0.30em] text-cyan-400">
          Market Risk Intelligence
        </p>

        <div className="mt-8 flex items-end justify-between">

          <div>

            <h1 className="text-7xl font-bold">
              94
            </h1>

            <p className="mt-3 text-xl text-cyan-400">
              Market Risk Health
            </p>

            <p className="mt-2 text-slate-400">
              Within Board Approved Risk Appetite
            </p>

          </div>

          <span className="rounded-full bg-emerald-500/15 px-5 py-2 font-semibold text-emerald-400">
            Healthy
          </span>

        </div>

        <div className="mt-8 h-3 rounded-full bg-slate-800">

          <div
            className="h-full rounded-full bg-cyan-400"
            style={{ width: "94%" }}
          />

        </div>

      </div>

      {/* KPI */}

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

        <MetricCard
          title="Daily Value at Risk"
          value="Rp82.4 B"
          trend="+2.1%"
          target="< Rp100 B"
          status="Healthy"
        />

        <MetricCard
          title="PV01"
          value="Rp14.2 M"
          trend="-1.8%"
          target="Board Limit"
          status="Healthy"
        />

        <MetricCard
          title="Modified Duration"
          value="4.18"
          trend="+0.06"
          target="< 5.00"
          status="Healthy"
        />

        <MetricCard
          title="FX Net Open Position"
          value="3.8%"
          trend="-0.2%"
          target="<20%"
          status="Healthy"
        />

      </div>

      {/* ANALYTICS */}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">

        <Panel
          title="Yield Curve Trend"
          className="xl:col-span-8"
        >

          <TrendChart />

        </Panel>

        <Panel
          title="AI Market Copilot"
          className="xl:col-span-4"
        >

          <div className="space-y-6">

            {insights.map((item) => (

              <div
                key={item.title}
                className="border-l-2 border-slate-700 pl-4"
              >

                <p className={`text-xs font-bold ${item.color}`}>
                  {item.level}
                </p>

                <h3 className="mt-2 font-semibold">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  {item.desc}
                </p>

              </div>

            ))}

          </div>

        </Panel>

      </div>

      {/* PORTFOLIO */}

      <Panel
        title="Government Bond Portfolio"
        className="mt-6"
      >

        <table className="w-full">

          <thead className="border-b border-slate-800 text-left text-sm text-slate-400">

            <tr>

              <th className="pb-4">Series</th>
              <th className="pb-4">Book Value</th>
              <th className="pb-4">MTM</th>
              <th className="pb-4">Duration</th>
              <th className="pb-4">Rating</th>

            </tr>

          </thead>

          <tbody>

            {bondPortfolio.map((bond) => (

              <tr
                key={bond.series}
                className="border-b border-slate-800/60 hover:bg-slate-900"
              >

                <td className="py-4 font-semibold">
                  {bond.series}
                </td>

                <td>{bond.book}</td>

                <td className="text-emerald-400">
                  {bond.mtm}
                </td>

                <td>{bond.duration}</td>

                <td>{bond.rating}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </Panel>

    </AppLayout>
  );
}