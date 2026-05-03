"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  LogOut,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/customers", label: "Customers", icon: Users },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <aside className="w-64 bg-white border-r flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-600" />
          <span className="text-xl font-bold">AuraFresh</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-purple-50 text-purple-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-purple-600" : "text-gray-400"
                )}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => router.push("/")}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Exit Admin
        </Button>
      </div>
    </aside>
  )
}