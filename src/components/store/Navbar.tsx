"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ShoppingCart, Menu, X, User } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/about", label: "About Us" },
  { href: "/shipping-policy", label: "Shipping Policy" },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [menuOpen, setMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [openDropdown, setOpenDropdown] = useState(false)

  // ✅ LOAD USER FROM API (IMPORTANT FIX)
  async function loadUser() {
    try {
      const res = await fetch("/api/auth/me")
      const data = await res.json()
      setUser(data)
    } catch {
      setUser(null)
    }
  }

  useEffect(() => {
    loadUser()

    window.addEventListener("authChanged", loadUser)
    return () => window.removeEventListener("authChanged", loadUser)
  }, [])

  useEffect(() => {
    function loadCart() {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0)
      setCartCount(count)
    }

    loadCart()
    window.addEventListener("cartUpdated", loadCart)

    return () => window.removeEventListener("cartUpdated", loadCart)
  }, [])

  function logout() {
    document.cookie = "token=; Max-Age=0; path=/"

    setUser(null)
    setOpenDropdown(false)

    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 bg-gray-950 text-white shadow-md">

      <div className="bg-amber-500 text-black text-xs text-center py-2">
        🚚 Free delivery on orders over Rs. 5,000
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-4">

        <Link href="/">
          <Image src="/images/logo.png" alt="Logo" width={60} height={60} />
        </Link>

        <nav className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className={cn("text-sm", pathname === link.href && "text-amber-400")}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">

          <Link href="/cart" className="relative">
            <ShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-400 text-black text-xs px-2 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {!user ? (
            <Link href="/login" className="bg-white text-black px-3 py-1 rounded">
              Login
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setOpenDropdown(!openDropdown)}
                className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded"
              >
                <User size={16} />
                {user.email}
              </button>

              {openDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-white text-black rounded shadow">
                  <Link href="/dashboard" className="block px-4 py-2">Dashboard</Link>
                  <Link href="/my-orders" className="block px-4 py-2">My Orders</Link>
                  <button onClick={logout} className="w-full text-left px-4 py-2 text-red-500">
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  )
}