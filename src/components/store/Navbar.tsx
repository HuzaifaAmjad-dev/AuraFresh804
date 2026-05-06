"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ShoppingCart, Menu, X, User, ChevronDown } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

const policyLinks = [
  { href: "/shipping-policy", label: "Shipping Policy" },
  { href: "/privacy-policy",  label: "Privacy Policy"  },
  { href: "/refund-policy",   label: "Refund Policy"   },

]

export default function Navbar() {
  const pathname  = usePathname()
  const router    = useRouter()
  const userDropdownRef   = useRef<HTMLDivElement>(null)
  const policyDropdownRef = useRef<HTMLDivElement>(null)

  const [menuOpen,        setMenuOpen]        = useState(false)
  const [cartCount,       setCartCount]       = useState(0)
  const [user,            setUser]            = useState<any>(null)
  const [openUserMenu,    setOpenUserMenu]    = useState(false)
  const [openPolicyMenu,  setOpenPolicyMenu]  = useState(false)
  const [mobilePolicyOpen, setMobilePolicyOpen] = useState(false)

  async function loadUser() {
    try {
      const res  = await fetch("/api/auth/me")
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
      const cart  = JSON.parse(localStorage.getItem("cart") || "[]")
      const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0)
      setCartCount(count)
    }
    loadCart()
    window.addEventListener("cartUpdated", loadCart)
    return () => window.removeEventListener("cartUpdated", loadCart)
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node))
        setOpenUserMenu(false)
      if (policyDropdownRef.current && !policyDropdownRef.current.contains(e.target as Node))
        setOpenPolicyMenu(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  function logout() {
    document.cookie = "token=; Max-Age=0; path=/"
    setUser(null)
    setOpenUserMenu(false)
    router.push("/")
  }

  const isPolicyActive = policyLinks.some(l => l.href === pathname)

  return (
    <header className="sticky top-0 z-50 bg-gray-950 text-white shadow-md">

      <div className="bg-amber-500 text-black text-xs text-center py-2 font-medium">
        🚚 Free delivery on orders over Rs. 5,000
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-4">

        <Link href="/">
          <Image src="/images/logo.png" alt="Logo" width={60} height={60} />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex gap-6 items-center">

          <Link href="/"
            className={cn("text-sm hover:text-amber-400 transition-colors", pathname === "/" && "text-amber-400")}
          >
            Home
          </Link>

          <Link href="/products"
            className={cn("text-sm hover:text-amber-400 transition-colors", pathname === "/products" && "text-amber-400")}
          >
            Shop
          </Link>

          <Link href="/about"
            className={cn("text-sm hover:text-amber-400 transition-colors", pathname === "/about" && "text-amber-400")}
          >
            About Us
          </Link>

          {/* POLICIES DROPDOWN */}
          <div className="relative" ref={policyDropdownRef}>
            <button
              onClick={() => setOpenPolicyMenu(v => !v)}
              className={cn(
                "flex items-center gap-1 text-sm hover:text-amber-400 transition-colors",
                isPolicyActive && "text-amber-400"
              )}
            >
              Policies
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", openPolicyMenu && "rotate-180")} />
            </button>

            {openPolicyMenu && (
              <div className="absolute left-0 top-full mt-3 w-52 bg-white text-gray-900 rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                {policyLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpenPolicyMenu(false)}
                    className={cn(
                      "block px-4 py-3 text-sm hover:bg-amber-50 hover:text-amber-700 transition-colors border-b border-gray-50 last:border-0",
                      pathname === link.href && "text-amber-600 font-semibold bg-amber-50"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-5">

          <Link href="/cart" className="relative">
            <ShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-400 text-black text-xs px-2 rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {!user ? (
            <Link href="/login" className="bg-white text-black px-3 py-1 rounded text-sm font-medium hover:bg-amber-400 transition-colors">
              Login
            </Link>
          ) : (
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setOpenUserMenu(v => !v)}
                className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded text-sm hover:bg-gray-700 transition-colors"
              >
                <User size={15} />
                <span className="max-w-[120px] truncate">{user.email}</span>
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", openUserMenu && "rotate-180")} />
              </button>

              {openUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <Link href="/dashboard" onClick={() => setOpenUserMenu(false)}
                    className="block px-4 py-3 text-sm hover:bg-gray-50 transition-colors border-b border-gray-50"
                  >
                    Dashboard
                  </Link>
                  <Link href="/my-orders" onClick={() => setOpenUserMenu(false)}
                    className="block px-4 py-3 text-sm hover:bg-gray-50 transition-colors border-b border-gray-50"
                  >
                    My Orders
                  </Link>
                  <button onClick={logout}
                    className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
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

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 py-4 space-y-1">
          {[
            { href: "/",        label: "Home"     },
            { href: "/products",label: "Shop"     },
            { href: "/about",   label: "About Us" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "block px-3 py-2.5 rounded-lg text-sm hover:bg-gray-800 transition-colors",
                pathname === link.href && "text-amber-400 bg-gray-800"
              )}
            >
              {link.label}
            </Link>
          ))}

          {/* MOBILE POLICIES ACCORDION */}
          <div>
            <button
              onClick={() => setMobilePolicyOpen(v => !v)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm hover:bg-gray-800 transition-colors"
            >
              <span className={isPolicyActive ? "text-amber-400" : ""}>Policies</span>
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", mobilePolicyOpen && "rotate-180")} />
            </button>
            {mobilePolicyOpen && (
              <div className="ml-4 mt-1 border-l border-gray-700 pl-3 space-y-1">
                {policyLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => { setMenuOpen(false); setMobilePolicyOpen(false) }}
                    className={cn(
                      "block px-3 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors",
                      pathname === link.href && "text-amber-400"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </header>
  )
}