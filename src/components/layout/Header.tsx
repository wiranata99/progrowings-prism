import {
  Bell,
  CalendarDays,
  Clock3,
  Globe,
  Search,
} from "lucide-react";

export default function Header() {
  const now = new Date();

  const date = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const time = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="border-b border-slate-800 bg-[#08111E] px-10 py-6">

      <div className="flex items-start justify-between">

        {/* Left */}

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400">
            Executive Command Center
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Good Evening, Wiranata
          </h1>

          <p className="mt-2 text-slate-400">
            Enterprise Risk Intelligence Platform
          </p>

        </div>

        {/* Right */}

        <div className="flex items-center gap-3">

          <button className="rounded-2xl bg-slate-800 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-700 hover:shadow-lg hover:shadow-cyan-500/10">
            <Search size={18} />
          </button>

          <button className="rounded-2xl bg-slate-800 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-700 hover:shadow-lg hover:shadow-cyan-500/10">
            <Globe size={18} />
          </button>

          <button className="rounded-2xl bg-slate-800 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-700 hover:shadow-lg hover:shadow-cyan-500/10">
            <Bell size={18} />
          </button>

          <div className="ml-2 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 font-bold text-slate-950">
            WK
          </div>

        </div>

      </div>

      {/* Executive Information Bar */}

      <div className="mt-6 grid gap-4 md:grid-cols-4">

        <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">

          <div className="flex items-center gap-2 text-cyan-400">

            <CalendarDays size={16} />

            <span className="text-xs uppercase tracking-wider">
              Reporting Date
            </span>

          </div>

          <p className="mt-2 text-lg font-semibold">
            {date}
          </p>

        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">

          <div className="flex items-center gap-2 text-cyan-400">

            <Clock3 size={16} />

            <span className="text-xs uppercase tracking-wider">
              Last Refresh
            </span>

          </div>

          <p className="mt-2 text-lg font-semibold">
            {time}
          </p>

        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">

          <p className="text-xs uppercase tracking-wider text-cyan-400">
            Portfolio
          </p>

          <p className="mt-2 text-lg font-semibold">
            Rp60.5 Trillion
          </p>

        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">

          <p className="text-xs uppercase tracking-wider text-cyan-400">
            Risk Appetite
          </p>

          <p className="mt-2 text-lg font-semibold text-emerald-400">
            Within Limit
          </p>

        </div>

      </div>

    </header>
  );
}