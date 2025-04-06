import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { BillSplitterProvider } from "@/contexts/bill-splitter-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Split-ny",
  description: "Split bills easily among friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BillSplitterProvider>{children}</BillSplitterProvider>
        <Toaster />
      </body>
    </html>
  );
}
