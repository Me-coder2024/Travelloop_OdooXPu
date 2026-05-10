import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/shared/Navbar";
import { AuthProvider } from "@/hooks/useAuth";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  icons: { icon: "/favicon.ico" }, title: "Traveloop — Personalized Travel Planning",
  description: "Plan your perfect trip with Traveloop. Create itineraries, track expenses, and share your adventures.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans antialiased" style={{ background: '#F8FAFC' }}>
        <AuthProvider>
          <Navbar />
          <main style={{ paddingTop: '64px' }}>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
