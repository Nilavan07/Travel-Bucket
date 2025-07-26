import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactQueryProvider } from "@/components/ReactQueryProvider";
import { ReactNode } from "react";
import Footer from "@/components/Footer";
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {children}
            <Footer />
          </TooltipProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
