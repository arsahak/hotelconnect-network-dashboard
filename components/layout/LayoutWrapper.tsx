"use client";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { SessionUserProvider, type SessionUser } from "@/lib/SessionUserContext";
import { SidebarProvider, useSidebarContext } from "@/lib/SidebarContext";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useSidebarContext();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Fixed positioning */}
      <Sidebar />

      {/* Topbar - Fixed positioning */}
      <Topbar />

      {/* Main content with proper spacing for fixed sidebar and topbar */}
      <main
        className="min-h-screen pt-16 transition-all duration-300"
        style={{ paddingLeft: isExpanded ? "256px" : "80px" }}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

export default function LayoutWrapper({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  return (
    <SessionUserProvider user={user}>
      <SidebarProvider>
        <LayoutContent>{children}</LayoutContent>
      </SidebarProvider>
    </SessionUserProvider>
  );
}
