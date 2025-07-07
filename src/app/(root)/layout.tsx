import {ReactNode} from "react";

import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";

import AppSidebar from "./_components/app-sidebar";
import ActiveStatus from "./_components/active-status";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="container mx-auto h-full">
        <SidebarTrigger />
        {children}
      </div>
      <ActiveStatus />
    </SidebarProvider>
  );
}
