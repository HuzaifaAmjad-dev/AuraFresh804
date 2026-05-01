import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import WhatsAppFloat from "@/components/WhatsAppFloat"

import Navbar from "../components/store/Navbar"
import Footer from "@/components/store/Footer"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "AuraFresh | Premium Perfumes in Pakistan",
    template: "%s | AuraFresh",
  },
  description:
    "Discover premium perfumes at AuraFresh. Shop authentic fragrances for men and women in Pakistan. Free delivery on orders over Rs. 3000.",
  keywords: ["perfumes pakistan", "buy perfume online", "oud perfume", "fragrances pakistan"],
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "https://aurafresh804.com",
    siteName: "AuraFresh",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        {/* GLOBAL LAYOUT WRAPPER */}
        <div className="flex flex-col min-h-screen">

          <Navbar />

          <main className="flex-1">
            {children}
          </main>

          <Footer />
          <WhatsAppFloat />
        </div>

        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}