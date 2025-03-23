// components/MySideBar.jsx
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"; 
import { Home, Settings, User, LogOut } from "lucide-react";

export function MySideBar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <h1 className="text-xl font-bold">My App</h1>
        </SidebarHeader>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <User className="mr-2 h-4 w-4" />
              Profile
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarFooter>
          <SidebarMenuButton>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </SidebarMenuButton>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}