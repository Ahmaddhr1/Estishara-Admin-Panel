"use client";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, LogOut, TimerIcon, User, ListCheck, Menu, X } from "lucide-react";

export function MySideBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Sidebar
      className={`h-screen flex flex-col transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <SidebarContent className="flex-1">
        <SidebarHeader className="py-6 px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isSidebarOpen ? (
              <>
                <h1 className="text-3xl font-bold">Estishara</h1>
                <button
                  onClick={toggleSidebar}
                  className="p-2 hover:bg-gray-200 rounded-lg transition duration-200"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={toggleSidebar}
                  className="p-2 hover:bg-gray-200 rounded-lg transition duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </SidebarHeader>

        <SidebarMenu className="space-y-2 mt-4">
          <SidebarMenuItem>
            <SidebarMenuButton className="py-3 px-6 flex items-center text-md">
              <Home className="mr-3 h-6 w-6" />
              {isSidebarOpen && <span>Dashboard</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="py-3 px-6 flex items-center text-md">
              <TimerIcon className="mr-3 h-6 w-6" />
              {isSidebarOpen && <span>Pending Doctors</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="py-3 px-6 flex items-center text-md">
              <User className="mr-3 h-6 w-6" />
              {isSidebarOpen && <span>Admins</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="py-3 px-6 flex items-center text-md">
              <ListCheck className="mr-3 h-6 w-6" />
              {isSidebarOpen && <span>Specialities</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="py-4">
        <SidebarMenuButton className="py-3 px-6 flex items-center text-md text-red-500 hover:text-red-600 transition duration-200">
          <LogOut className="mr-3 h-6 w-6" />
          {isSidebarOpen && <span>Logout</span>}
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
