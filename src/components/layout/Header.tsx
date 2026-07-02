import {
  Bell,
  CalendarDays,
  Clock3,
  Globe,
  Menu,
  Search,
} from "lucide-react";

interface HeaderProps {
  onOpenSidebar?: () => void;
}

export default function Header({
  onOpenSidebar,
}: HeaderProps) {
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
    <header className="border-b border-slate-800 bg-[#08111E] px-4 py-5 sm:px-6 lg:px-8 xl:px-10">

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-start gap-4">

          {/* Mobile Hamburger */}

          <button
            type="button"
            onClick={onOpenSidebar}
            className="mt-1 rounded-xl bg-slate-800 p-2 transition hover:bg-slate-700 xl:hidden"
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>

          <div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.30em] text-cyan-400 sm:text-xs">
              Executive Command Center
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl xl:text-4xl">
              Good Evening, Wiranata
            </h1>

            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              Enterprise Risk Intelligence Platform
            </p>

          </div>

        </div>

        <div className="hidden items-center gap-3 md:flex">

          <button className="rounded-2xl bg-slate-800 p-3 transition hover:bg-slate-700">
            <Search size={18} />
          </button>

          <button className="rounded-2xl bg-slate-800 p-3 transition hover:bg-slate-700">
            <Globe size={18} />
          </button>

          <button className="rounded-2xl bg-slate-800 p-3 transition hover:bg-slate-700">
            <Bell size={18} />
          </button>

          <div className="ml-2 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 font-bold text-slate-950">
            WK
          </div>

        </div>

      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

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