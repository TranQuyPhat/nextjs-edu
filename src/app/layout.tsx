import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";
import Footer from "@/components/footer/page";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hệ thống Quản lý Học tập",
  description: "Nền tảng học tập hiện đại cho giáo viên và học sinh",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      {/* <body className={inter.className}>{children}</body> */}
      <body className={inter.className}>
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
        <Footer />
      </body>
    </html>
  );
}