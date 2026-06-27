import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({
  children,
}: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-[#060B16] text-white">

      <Sidebar />

      <main className="flex-1 overflow-auto">

        <Header />

        <div className="space-y-6 p-10">

          {children}

        </div>

      </main>

    </div>
  );
}