"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/app/globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MySideBar } from "@/lib/MySideBar";
import Loading from "@/lib/Loading";

export default function RootLayout({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // If not authenticated, render nothing (or a loading spinner)

  // If authenticated, render the layout
  return (
    <html lang="en">
      <body className={`flex max-h-[100vh]`}>
        <SidebarProvider>
          
          <MySideBar />
          <main className="flex-1 overflow-y-auto p-6">{ isAuthenticated? children: <Loading/>}</main>
        </SidebarProvider>
      </body>
    </html>
  );
}
