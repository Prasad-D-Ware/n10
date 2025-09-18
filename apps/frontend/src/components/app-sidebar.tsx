import { Home, LogOut, Settings } from "lucide-react";
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
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();

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
        <div className="flex justify-between">
          {/* <SidebarGroupLabel className="text-xl font-bold text-black ">N10</SidebarGroupLabel> */}
          <SidebarGroupLabel>
            <img src={n10Logo} alt="N10 Logo" className="h-10 w-auto" />
          </SidebarGroupLabel>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
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
        <SidebarFooter className="absolute bottom-3">
          <div className="flex justify-end gap-22 items-center">
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
