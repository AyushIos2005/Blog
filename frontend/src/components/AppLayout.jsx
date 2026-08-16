import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileTabBar from "./MobileTabBar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-app)] flex">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col pb-16 lg:pb-0">
        <Topbar />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
      <MobileTabBar />
    </div>
  );
}
