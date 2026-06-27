import Sidebar from "../components/layout/Sidebar";
import ExecutiveScore from "../components/dashboard/ExecutiveScore";
import TrendChart from "../components/dashboard/TrendChart";

const kpis = [
  { title: "CAR", value: "26.18%", trend: "+0.22%", color: "text-emerald-400" },
  { title: "Gross NPL", value: "2.42%", trend: "-0.08%", color: "text-cyan-400" },
  { title: "LCR", value: "181%", trend: "+5%", color: "text-cyan-400" },
  { title: "ROA", value: "2.31%", trend: "+0.12%", color: "text-emerald-400" },
];

const market = [
  ["USD/IDR", "17,180"],
  ["BI Rate", "5.50%"],
  ["SRBI 12M", "6.42%"],
  ["US10Y", "4.36%"],
];

const alerts = [
  "Corporate NPL increased",
  "USD volatility rising",
  "Recovery Plan Trigger active",
  "Climate Risk reporting due",
];

export function Dashboard() {
  return (
    <div className="flex h-screen bg-[#060B16] text-white">

      <Sidebar />

      <main className="flex-1 overflow-auto">

        {/* HEADER */}

        <header className="flex h-24 items-center justify-between border-b border-slate-800 bg-[#08111E] px-10">

          <div>

            <p className="text-sm font-medium tracking-widest text-cyan-400 uppercase">
              Executive Command Center
            </p>

            <h2 className="mt-1 text-4xl font-bold">
              Good Evening, Wiranata
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Saturday · 27 June 2026 · 20:30 WIB
            </p>

          </div>

          <div className="flex items-center gap-3">

            <button className="rounded-xl bg-slate-800 px-4 py-2 hover:bg-slate-700">
              🔍 Search
            </button>

            <button className="rounded-xl bg-slate-800 px-4 py-2 hover:bg-slate-700">
              🌐 EN
            </button>

            <button className="rounded-xl bg-slate-800 px-4 py-2 hover:bg-slate-700">
              🔔 4
            </button>

            <button className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-500 font-bold text-slate-950">
              WK
            </button>

          </div>

        </header>

        <div className="grid gap-6 p-10">

          {/* HERO */}

          <div className="grid grid-cols-12 gap-6">

            <div className="col-span-8">
              <ExecutiveScore
                score={92}
                status="Healthy Institution"
              />
            </div>

            <div className="col-span-4 rounded-3xl bg-slate-900 p-8">

              <h3 className="text-xl font-semibold text-cyan-400">
                Today's Executive Brief
              </h3>

              <div className="mt-6 space-y-5 text-sm leading-7 text-slate-300">

                <p>
                  Overall institution remains in a healthy position.
                </p>

                <p>
                  Corporate concentration risk increased slightly during this month.
                </p>

                <p>
                  FX volatility should continue to be monitored closely due to USD appreciation.
                </p>

                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">

                  <p className="font-semibold text-emerald-400">
                    AI Recommendation
                  </p>

                  <p className="mt-2">
                    Review Top 20 corporate borrowers before month end and maintain conservative underwriting.
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* KPI */}

          <div className="grid grid-cols-4 gap-5">

            {kpis.map((item) => (

              <div
                key={item.title}
                className="rounded-2xl bg-slate-900 p-6 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10"
              >

                <p className="text-slate-400">
                  {item.title}
                </p>

                <h3 className="mt-4 text-4xl font-bold">
                  {item.value}
                </h3>

                <p className={`mt-2 ${item.color}`}>
                  {item.trend}
                </p>

              </div>

            ))}

          </div>

          {/* MARKET */}

          <div className="grid grid-cols-12 gap-6">

            <div className="col-span-8 rounded-3xl bg-slate-900 p-8">

              <h3 className="mb-6 text-2xl font-semibold">
                Market Monitor
              </h3>

              <div className="grid grid-cols-2 gap-6">

                {market.map(([name, value]) => (

                  <div
                    key={name}
                    className="rounded-xl border border-slate-700 p-5"
                  >

                    <p className="text-slate-400">
                      {name}
                    </p>

                    <h3 className="mt-2 text-2xl font-bold">
                      {value}
                    </h3>

                  </div>

                ))}

              </div>

            </div>

            <div className="col-span-4 rounded-3xl bg-slate-900 p-8">

              <h3 className="mb-6 text-2xl font-semibold text-red-400">
                Critical Alerts
              </h3>

              <div className="space-y-4">

                {alerts.map((item) => (

                  <div
                    key={item}
                    className="rounded-xl border border-red-500/20 bg-red-500/5 p-4"
                  >
                    {item}
                  </div>

                ))}

              </div>

            </div>

          </div>

          {/* ANALYTICS */}

          <div className="grid grid-cols-12 gap-6">

            <div className="col-span-8">
              <TrendChart />
            </div>

            <div className="col-span-4 rounded-3xl bg-slate-900 p-8">

              <h3 className="text-2xl font-semibold text-cyan-400">
                Portfolio Composition
              </h3>

              <div className="mt-8 flex justify-center">

                <div className="relative h-48 w-48 rounded-full bg-[conic-gradient(#22d3ee_0_45%,#16a34a_45%_75%,#f59e0b_75%_90%,#ef4444_90%_100%)]">

                  <div className="absolute inset-8 rounded-full bg-slate-900"></div>

                </div>

              </div>

              <div className="mt-8 space-y-3 text-sm">

                <div className="flex justify-between">
                  <span>Corporate</span>
                  <span>45%</span>
                </div>

                <div className="flex justify-between">
                  <span>Consumer</span>
                  <span>30%</span>
                </div>

                <div className="flex justify-between">
                  <span>Treasury</span>
                  <span>15%</span>
                </div>

                <div className="flex justify-between">
                  <span>Others</span>
                  <span>10%</span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}