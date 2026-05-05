import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyToken } from "@/lib/auth"
import { db } from "@/lib/db"
import { orders } from "@/lib/schema"
import { eq, desc } from "drizzle-orm"

type UserToken = {
  id: string
  email: string
}

export default async function MyOrdersPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    redirect("/login")
  }

  const user = (await verifyToken(token)) as UserToken

  const userOrders = await db.query.orders.findMany({
    where: (o, { eq }) => eq(o.userId, user.id),
    orderBy: [desc(orders.createdAt)],
    with: {
      items: {
        with: {
          product: true,
        },
      },
    },
  })

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-8">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-2xl font-bold mb-6">
          My Orders
        </h1>

        {userOrders.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-5 rounded-xl shadow border"
              >
                <div className="flex justify-between">
                  <h2 className="font-semibold">
                    Order #{order.orderNumber}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {order.status}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  Total: Rs {order.total}
                </p>

                <div className="mt-3 space-y-1">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="text-sm text-gray-700 flex justify-between"
                    >
                      <span>{item.product.name}</span>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}