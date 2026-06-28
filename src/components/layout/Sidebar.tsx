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
import { NavLink } from "react-router-dom";

interface MenuItem {
  name: string;
  icon: LucideIcon;
  path: string;
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
        path: "/dashboard",
      },
    ],
  },
  {
    title: "RISK INTELLIGENCE",
    items: [
      {
        name: "Credit",
        icon: ShieldCheck,
        path: "/credit",
      },
      {
        name: "Treasury",
        icon: BarChart3,
        path: "/treasury",
      },
      {
        name: "Liquidity",
        icon: Droplets,
        path: "#",
      },
      {
        name: "Operational",
        icon: Activity,
        path: "#",
      },
      {
        name: "Climate",
        icon: Leaf,
        path: "#",
      },
    ],
  },
  {
    title: "ANALYTICS",
    items: [
      {
        name: "Stress Testing",
        icon: Zap,
        path: "/stress-testing",
      },
      {
        name: "Reports",
        icon: FileText,
        path: "#",
      },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      {
        name: "Settings",
        icon: Settings,
        path: "#",
      },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-800 bg-[#08111E]">

      {/* Header */}

      <div className="border-b border-slate-800 px-8 py-8">

        <h1 className="text-4xl font-black tracking-tight text-cyan-400">
          PRISM
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Enterprise Risk Intelligence
        </p>

      </div>

      {/* Navigation */}

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

                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
                        isActive
                          ? "bg-cyan-500/15 text-cyan-400"
                          : "text-slate-300 hover:bg-slate-800 hover:text-cyan-400"
                      }`
                    }
                  >

                    {({ isActive }) => (
                      <>

                        {isActive && (
                          <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-cyan-400" />
                        )}

                        <Icon
                          size={18}
                          className="transition-transform duration-300 group-hover:scale-110"
                        />

                        <span className="font-medium">
                          {item.name}
                        </span>

                      </>
                    )}

                  </NavLink>

                );

              })}

            </div>

          </div>

        ))}

      </div>

      {/* Footer */}

      <div className="border-t border-slate-800 p-6">

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

          <div className="flex items-center gap-2">

            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />

            <span className="text-sm font-medium text-emerald-400">
              All Services Online
            </span>

          </div>

          <div className="mt-5 border-t border-slate-800 pt-4">

            <p className="font-semibold text-white">
              Wiranata
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Chief Risk Officer
            </p>

          </div>

          <div className="mt-5 text-xs text-slate-500">
            PRISM v0.1 Showcase
          </div>

        </div>

      </div>

    </aside>
  );
}