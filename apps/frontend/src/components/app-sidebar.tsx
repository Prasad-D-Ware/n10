import { Home, LineChart, LogOut, PanelLeft } from "lucide-react";
import n10Logo from "@/assets/n10-logo.png";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: LineChart,
  },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();

  const handleLogut = async () =>{
    try {
      const response = await axios.post(`${BACKEND_URL}/auth/logout`);
  
      if (response.data.success) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2">
          <SidebarGroupLabel>
            <img src={n10Logo} alt="N10 Logo" className="h-10 w-auto" />
          </SidebarGroupLabel>
          {state === "expanded" && (
            <SidebarTrigger className="border border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500 size-8 flex-shrink-0 transition-colors" />
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="flex flex-col">
        <SidebarGroup className="flex-1">
          <SidebarGroupContent>
            <SidebarMenu>
              {state === "collapsed" && (
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={toggleSidebar}
                    className="justify-center border border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500 transition-colors"
                  >
                    <PanelLeft className="size-4" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url}>
                      {({ isActive }) => (
                        <>
                          <item.icon className={isActive ? "text-orange-500" : undefined} />
                          <span className={`font-kode ${isActive ? "text-orange-500" : ""}`}>{item.title}</span>
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter className="mt-auto">
          <div className="flex justify-between items-center gap-2">
            <ModeToggle />
            {state === "expanded" && (
              <Button variant={"outline"} onClick={handleLogut} className="bg-orange-500 dark:bg-orange-500 text-white">
                <LogOut />
                Logout
              </Button>
            )}
          </div>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
