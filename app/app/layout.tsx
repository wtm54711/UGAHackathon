import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Athens Helper",
  description: "Help your neighbors in Athens with quick community requests.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${manrope.variable}`}>
      <body className="min-h-screen font-[var(--font-sans)]">
        <NavBar />
        <main className="min-h-[calc(100vh-140px)]">{children}</main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-500">
            <span>Built for Athens. Powered by neighbors.</span>
            <span>State Farm Community Track Hackathon MVP.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
