"use client"; // Add this directive since we're using client-side functionality

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/app/globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MySideBar } from "@/lib/MySideBar";


export default function RootLayout({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the token exists in sessionStorage
    const token = sessionStorage.getItem("token");
    if (!token) {
      // Redirect to the login page if the token is not present
      router.push("/");
    } else {
      // Set authenticated state to true if the token is present
      setIsAuthenticated(true);
    }
  }, [router]);

  // If not authenticated, render nothing (or a loading spinner)
  if (!isAuthenticated) {
    return null; // or return a loading spinner
  }

  // If authenticated, render the layout
  return (
    <html lang="en">
      <body className={`antialiased flex h-screen`}>
        <SidebarProvider>
          <MySideBar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </SidebarProvider>
      </body>
    </html>
  );
}