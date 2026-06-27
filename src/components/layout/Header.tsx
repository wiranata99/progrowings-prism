import {
  Bell,
  Globe,
  Search,
} from "lucide-react";

export default function Header() {
  return (
    <header className="flex h-24 items-center justify-between border-b border-slate-800 bg-[#08111E] px-10">

      <div>

        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
          Executive Command Center
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Good Evening, Wiranata
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Enterprise Risk Intelligence Platform
        </p>

      </div>

      <div className="flex items-center gap-3">

        <button className="rounded-xl bg-slate-800 p-3 transition hover:bg-slate-700">
          <Search size={18} />
        </button>

        <button className="rounded-xl bg-slate-800 p-3 transition hover:bg-slate-700">
          <Globe size={18} />
        </button>

        <button className="rounded-xl bg-slate-800 p-3 transition hover:bg-slate-700">
          <Bell size={18} />
        </button>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-500 font-bold text-slate-950">
          WK
        </div>

      </div>

    </header>
  );
}