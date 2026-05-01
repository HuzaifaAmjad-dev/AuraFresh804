"use client"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  {href:"/about",label: "About Us"}
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function updateCount() {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      const count = cart.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      )
      setCartCount(count)
    }
    updateCount()
    window.addEventListener("cartUpdated", updateCount)

    function handleScroll() {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("cartUpdated", updateCount)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header className={cn(
      "sticky top-0 z-50 transition-all duration-300 bg-gray-950",
      scrolled ? "shadow-lg shadow-black/30" : ""
    )}>
      {/* Top bar */}
      <div className="bg-amber-500 text-gray-950 text-xs text-center py-2 px-4 font-medium">
        🚚 Free delivery on orders over Rs. 3,000 &nbsp;|&nbsp; Cash on Delivery Available
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-25 w-25"> {/* 🔥 bigger & proportional */}
    <Image
      src="/images/logo.png"
      alt="AuraFresh Logo"
      fill
      className="object-contain rounded-full"
      // sizes="px"
      priority
    />
  </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors relative group",
                  pathname === link.href
                    ? "text-amber-400"
                    : "text-gray-300 hover:text-white"
                )}
              >
                {link.label}
                <span className={cn(
                  "absolute -bottom-1 left-0 h-0.5 bg-amber-400 transition-all duration-300",
                  pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                )} />
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-5">
            <Link href="/cart" className="relative group">
              <ShoppingCart className="h-6 w-6 text-gray-300 group-hover:text-amber-400 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-gray-950 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              className="md:hidden text-gray-300 hover:text-white transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4 space-y-1 pb-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-amber-900/30 text-amber-400"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/cart"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              Cart
              {cartCount > 0 && (
                <span className="bg-amber-400 text-gray-950 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}