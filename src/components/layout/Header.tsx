import { useTranslation } from "react-i18next";

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
  const { t, i18n } = useTranslation();

const data = {
  reportingDate: "30 June 2026",
  lastRefresh: "Today, 08:30",
  portfolio: "Rp60.5 Trillion",
  riskAppetite: "Within Limit",
  riskAppetiteClassName: "text-emerald-400",
};

  return (
    <header className="border-b border-slate-800 bg-[#08111E] px-4 py-5 sm:px-6 lg:px-8 xl:px-10">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
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
              {t(
                "common.executiveCommandCenter"
              )}
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl xl:text-4xl">
              Good Evening, Wiranata
            </h1>

            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              {t("common.platformTitle")}
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            className="rounded-2xl bg-slate-800 p-3 transition hover:bg-slate-700"
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          <div className="flex items-center rounded-2xl bg-slate-800 p-1">
            <button
              type="button"
              onClick={() =>
                i18n.changeLanguage("id")
              }
              className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                i18n.language === "id"
                  ? "bg-cyan-500 text-slate-950"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              INA
            </button>

            <button
              type="button"
              onClick={() =>
                i18n.changeLanguage("en")
              }
              className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                i18n.language === "en"
                  ? "bg-cyan-500 text-slate-950"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              ENG
            </button>

            <button
              type="button"
              className="ml-1 rounded-xl p-2 hover:bg-slate-700"
              aria-label="Language settings"
            >
              <Globe size={18} />
            </button>
          </div>

          <button
            type="button"
            className="rounded-2xl bg-slate-800 p-3 transition hover:bg-slate-700"
            aria-label="Notifications"
          >
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
              {t("common.reportingDate")}
            </span>
          </div>

          <p className="mt-2 text-lg font-semibold">
            {data.reportingDate}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">
          <div className="flex items-center gap-2 text-cyan-400">
            <Clock3 size={16} />

            <span className="text-xs uppercase tracking-wider">
              {t("common.lastRefresh")}
            </span>
          </div>

          <p className="mt-2 text-lg font-semibold">
            {data.lastRefresh}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">
          <p className="text-xs uppercase tracking-wider text-cyan-400">
            {t("common.portfolio")}
          </p>

          <p className="mt-2 text-lg font-semibold">
            {data.portfolio}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">
          <p className="text-xs uppercase tracking-wider text-cyan-400">
            {t("common.riskAppetite")}
          </p>

          <p
            className={`mt-2 text-lg font-semibold ${data.riskAppetiteClassName}`}
          >
            {data.riskAppetite}
          </p>
        </div>
      </div>
    </header>
  );
}