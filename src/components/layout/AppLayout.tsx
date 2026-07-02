import type { ReactNode } from "react";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({
  children,
}: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-[#060B16] text-white">

      {/* Desktop Sidebar */}

      <div className="hidden xl:block">
        <Sidebar onClose={closeSidebar} />
      </div>

      {/* Mobile Sidebar Overlay */}

      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 xl:hidden ${
          isSidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeSidebar}
      >
        <div
          className={`h-full w-72 transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <Sidebar onClose={closeSidebar} />
        </div>
      </div>

      {/* Main Content */}

      <main className="min-w-0 flex-1 overflow-x-hidden">

        <Header
          onOpenSidebar={openSidebar}
        />

        <div className="space-y-4 p-4 sm:p-6 lg:space-y-6 lg:p-8 xl:p-10">

          {children}

        </div>

      </main>

    </div>
  );
}