import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import PageTransition from "./PageTransition";
import GrowthField from "./GrowthField";
import { attachButtonMotion } from "../animations/motion";

export default function AppShell() {
  const location = useLocation();
  const rootRef = useRef(null);

  // Global tactility: every button/link compresses on press and springs
  // back; primary buttons lift on hover. One delegated listener pair.
  useEffect(() => attachButtonMotion(rootRef.current), []);

  return (
    <div ref={rootRef} className="relative h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 flex">
      {/* Global animated background layer (decorative, non-interactive) */}
      <GrowthField />
      <div className="relative z-10 flex h-screen w-full min-w-0">
      {/* Static Fixed Sidebar */}
      <Sidebar />
      {/* Scrollable Right Content Column */}
      <div className="flex h-screen flex-1 flex-col min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 min-w-0 overflow-y-auto bg-slate-50/70">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </main>
      </div>
      </div>
    </div>
  );
}