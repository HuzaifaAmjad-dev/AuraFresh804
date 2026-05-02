import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users, orders } from "@/lib/schema"
import { desc, eq } from "drizzle-orm"

export const dynamic = "force-dynamic"

export async function GET() {
  const result = await db.query.users.findMany({
    where: (u, { eq }) => eq(u.role, "CUSTOMER"),
    with: {
      orders: {
        orderBy: [desc(orders.createdAt)],
        limit: 1,
      },
    },
    orderBy: [desc(users.createdAt)],
  })

  const withCount = await Promise.all(
    result.map(async (user) => {
      const allOrders = await db.query.orders.findMany({
        where: (o, { eq }) => eq(o.userId, user.id),
      })
      return {
        ...user,
        _count: { orders: allOrders.length },
      }
    })
  )

  return NextResponse.json(withCount)
}