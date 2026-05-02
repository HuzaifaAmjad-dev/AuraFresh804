import { db } from "@/lib/db"
import { orders, products, users } from "@/lib/schema"
import { eq, count } from "drizzle-orm"
import { ShoppingBag, Package, Users, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

async function getStats() {
  const [totalOrders, totalProducts, totalCustomers, pendingOrders] =
    await Promise.all([
      db.select({ count: count() }).from(orders).then((r) => r[0].count),
      db.select({ count: count() }).from(products).then((r) => r[0].count),
      db.select({ count: count() }).from(users).where(eq(users.role, "CUSTOMER")).then((r) => r[0].count),
      db.select({ count: count() }).from(orders).where(eq(orders.status, "PENDING")).then((r) => r[0].count),
    ])

  return { totalOrders, totalProducts, totalCustomers, pendingOrders }
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export default async function DashboardPage() {
  const stats = await getStats()

  const cards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back to AuraFresh admin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={cn("p-2 rounded-lg", card.bg)}>
                  <Icon className={cn("h-5 w-5", card.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}