"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MySideBar } from "@/lib/MySideBar";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/utils/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function DashboardLayout({ children }) {
  return (
    
      <div
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex max-h-screen min-w-[100vw]`}
      >
        <SidebarProvider>
          <MySideBar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </SidebarProvider>
        <Toaster />
      </div>
    
  );
}
