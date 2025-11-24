import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Toaster } from "sonner";
import ModalProvider from "@/components/ModalProvider";

export const metadata: Metadata = {
  title: "ListenWise",
  description: "Smart Audiobooks from YouTube & PDFs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-linear-to-br from-purple-950 via-black to-blue-950">
        <ModalProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Header />
              <main className="flex-1 overflow-y-auto p-6 pb-24">
                {children}
              </main>
            </div>
          </div>
          <Toaster position="bottom-right" theme="dark" />
        </ModalProvider>
      </body>
    </html>
  );
}