"use client";
import { useState } from "react";
import { LogOut, Menu, X, ListCollapse } from "lucide-react";
import tabs from "@/utils/SideBarTabs";
import Link from "next/link";

export function MySideBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleMobileSidebar = () =>
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  const toggleSidebarCollapse = () =>
    setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <div className="flex h-screen">
      {/* Mobile Sidebar Toggle Button */}
      <div className="lg:hidden fixed top-4 right-4 z-40">
        <button
          onClick={toggleMobileSidebar}
          className="p-2 bg-gray-800 text-white rounded-lg"
          aria-label="Toggle sidebar"
        >
          {isMobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col h-full bg-gray-800 text-white transition-all duration-300 overflow-x-hidden ${
          isSidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="px-4 py-6 flex justify-between items-center duration-200">
          {!isSidebarCollapsed && (
            <span
              className={`font-bold ${
                isSidebarCollapsed ? "text-base" : "text-3xl"
              } overflow-y-hidden duration-200`}
            >
              {!isSidebarCollapsed && "Estishara"}
            </span>
          )}
          <button
            onClick={toggleSidebarCollapse}
            className="p-2 text-white rounded-lg hover:bg-gray-700 ml-[-8px]"
          >
            {isSidebarCollapsed ? (
              <ListCollapse />
            ) : (
              <ListCollapse className="rotate-180" />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto">
          {tabs.map((tab, index) => (
            <Link
              key={index}
              href={tab.path}
              className="flex items-center px-4 py-3 hover:bg-gray-700 transition-all"
            >
              <span className="flex-shrink-0">{tab.icon}</span>
              <span
                className={`ml-3 ${isSidebarCollapsed ? "hidden" : "block"}`}
              >
                {tab.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="px-4 py-2 border-t border-gray-600">
          <a
            href="/logout"
            className="flex items-center px-4 py-3 hover:bg-gray-700 transition-all"
          >
            <LogOut />
            <span className={`ml-3 ${isSidebarCollapsed ? "hidden" : "block"}`}>
              Logout
            </span>
          </a>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <>
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ${
            isMobileSidebarOpen
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={toggleMobileSidebar}
        />

        <aside
          className={`fixed top-0 left-0 w-64 h-full bg-gray-800 text-white z-50 lg:hidden 
                    transform transition-transform duration-300 ease-in-out ${
                      isMobileSidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }`}
        >
          <div className="px-4 py-6 flex justify-between items-center">
            <span className="text-xl font-bold">Estishara</span>
            <button
              onClick={toggleMobileSidebar}
              className="p-2 text-white rounded-lg hover:bg-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="space-y-2">
            {tabs.map((tab, index) => (
              <Link
                key={index}
                href={tab.path}
                className="flex items-center px-4 py-3 hover:bg-gray-700 transition-all"
                onClick={toggleMobileSidebar}
              >
                {tab.icon}
                <span className="ml-3">{tab.label}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-6 px-4 py-2 border-t border-gray-600">
            <a
              href="/logout"
              className="flex items-center px-4 py-3 hover:bg-gray-700 transition-all"
            >
              <LogOut />
              <span className="ml-3">Logout</span>
            </a>
          </div>
        </aside>
      </>
    </div>
  );
}
