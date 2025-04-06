import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex max-h-[100vh]`}
      >
        {children}
        <Toaster
          position="top-center"
          richColors
          visibleToasts={3}
          toastOptions={{
            className: "max-sm:top-0 max-sm:right-0 max-sm:w-full",
          }}
        />
      </body>
    </html>
  );
}
