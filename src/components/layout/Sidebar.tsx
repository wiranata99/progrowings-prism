import {
  Activity,
  BarChart3,
  Droplets,
  FileText,
  LayoutDashboard,
  Leaf,
  Settings,
  ShieldCheck,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface MenuItem {
  name: string;
  icon: LucideIcon;
  active?: boolean;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const executiveMenu: MenuGroup[] = [
  {
    title: "EXECUTIVE",
    items: [
      {
        name: "Dashboard",
        icon: LayoutDashboard,
        active: true,
      },
    ],
  },
  {
    title: "RISK",
    items: [
      {
        name: "Credit Risk",
        icon: ShieldCheck,
      },
      {
        name: "Market Risk",
        icon: BarChart3,
      },
      {
        name: "Liquidity",
        icon: Droplets,
      },
      {
        name: "Operational",
        icon: Activity,
      },
      {
        name: "Climate",
        icon: Leaf,
      },
    ],
  },
  {
    title: "ANALYTICS",
    items: [
      {
        name: "Stress Testing",
        icon: Zap,
      },
      {
        name: "Reports",
        icon: FileText,
      },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      {
        name: "Settings",
        icon: Settings,
      },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-800 bg-[#08111E]">

      {/* Logo */}

      <div className="border-b border-slate-800 p-8">

        <h1 className="text-4xl font-black tracking-tight text-cyan-400">
          PRISM
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Enterprise Risk Intelligence
        </p>

      </div>

      {/* Menu */}

      <div className="flex-1 overflow-y-auto px-5 py-6">

        {executiveMenu.map((group) => (

          <div
            key={group.title}
            className="mb-8"
          >

            <p className="mb-3 px-3 text-xs font-semibold tracking-[0.25em] text-slate-500">
              {group.title}
            </p>

            <div className="space-y-1">

              {group.items.map((item) => {

                const Icon = item.icon;

                return (

                  <button
                    key={item.name}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-300 ${
                      item.active
                        ? "bg-cyan-500/15 text-cyan-400"
                        : "text-slate-300 hover:bg-slate-800 hover:text-cyan-400"
                    }`}
                  >

                    <Icon size={18} />

                    <span className="font-medium">
                      {item.name}
                    </span>

                  </button>

                );

              })}

            </div>

          </div>

        ))}

      </div>

      {/* Footer */}

      <div className="border-t border-slate-800 p-6">

        <div className="rounded-2xl bg-slate-900 p-5">

          <p className="text-xs tracking-widest text-cyan-400">
            SYSTEM STATUS
          </p>

          <div className="mt-3 flex items-center gap-2">

            <div className="h-3 w-3 rounded-full rounded-full bg-emerald-400" />

            <span className="text-sm text-emerald-400">
              All Services Online
            </span>

          </div>

          <div className="mt-5 border-t border-slate-700 pt-4">

            <p className="font-semibold">
              Wiranata
            </p>

            <p className="text-sm text-slate-400">
              Chief Risk Officer
            </p>

          </div>

          <div className="mt-5 text-xs text-slate-500">
            PRISM v0.1 Beta
          </div>

        </div>

      </div>

    </aside>
  );
}