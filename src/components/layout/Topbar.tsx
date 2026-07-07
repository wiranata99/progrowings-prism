import { Bell, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/Button";

export interface TopbarProps {
  title: string;
  tag: string;
}

export function Topbar({ title, tag }: TopbarProps) {
  const { i18n } = useTranslation();

  return (
    <header className="topbar">
      <div>
        <p className="topbar-tag">{tag}</p>
        <h2>{title}</h2>
      </div>

      <div className="topbar-actions">

        <div className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-900 p-1">

          <button
            onClick={() => i18n.changeLanguage("id")}
            className={`rounded-lg px-3 py-1 text-sm transition ${
              i18n.language === "id"
                ? "bg-cyan-500 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            INA
          </button>

          <button
            onClick={() => i18n.changeLanguage("en")}
            className={`rounded-lg px-3 py-1 text-sm transition ${
              i18n.language === "en"
                ? "bg-cyan-500 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            ENG
          </button>

        </div>

        <Button type="button" aria-label="Search">
          <Search size={18} />
        </Button>

        <Button type="button" aria-label="Notifications">
          <Bell size={18} />
        </Button>

      </div>
    </header>
  );
}