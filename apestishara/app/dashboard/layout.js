import "../globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MySideBar } from "@/lib/MySideBar";

export const metadata = {
  title: "Estishara",
  description: "Login",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={` antialiased flex h-screen`}
      >
        <SidebarProvider>
          <MySideBar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </SidebarProvider>
      </body>
    </html>
  );
}
