

import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MySideBar } from "@/lib/MySideBar";
import { Toaster } from "@/components/ui/toaster";

// Font imports
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
    
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex max-h-[100vh]`}>
        <SidebarProvider>
          <MySideBar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </SidebarProvider>
        <Toaster />
      </body>
  );
}
