"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBag, Eye, User, MapPin, CreditCard } from "lucide-react"
import { getImageUrl } from "@/lib/image"

type Order = {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  address: string
  city: string
  province: string
  total: number
  status: string
  paymentMethod: string
  paymentStatus: string
  createdAt: string
  payerName?: string
  paymentScreenshot?: string
  items: {
    id: string
    product?: { name: string }
  }[]
}

const paymentColors: Record<string, string> = {
  PAID:     "bg-green-100 text-green-800",
  UNPAID:   "bg-yellow-100 text-yellow-800",
  REFUNDED: "bg-red-100 text-red-800",
}

const statusColors: Record<string, string> = {
  PENDING:    "bg-yellow-100 text-yellow-800",
  CONFIRMED:  "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED:    "bg-indigo-100 text-indigo-800",
  DELIVERED:  "bg-green-100 text-green-800",
  CANCELLED:  "bg-red-100 text-red-800",
  REFUNDED:   "bg-gray-100 text-gray-800",
}

const statuses = ["ALL","PENDING","CONFIRMED","PROCESSING","SHIPPED","DELIVERED","CANCELLED"]

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("ALL")

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data: Order[]) => { setOrders(data); setLoading(false) })
  }, [])

  const filtered = filter === "ALL" ? orders : orders.filter((o) => o.status === filter)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-gray-500">Manage customer orders</p>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-2 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === s ? "bg-purple-600 text-white" : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {s}
            {s !== "ALL" && (
              <span className="ml-1 text-xs opacity-70">
                ({orders.filter((o) => o.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">

                  {/* LEFT — Order details */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-gray-900">{order.orderNumber}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${paymentColors[order.paymentStatus] ?? "bg-gray-100"}`}>
                        {order.paymentStatus}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 font-medium">
                      {order.customerName} · {order.customerPhone}
                    </p>

                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      {order.address}, {order.city}, {order.province}
                    </p>

                    <p className="text-xs text-gray-500">
                      🛒 {order.items?.map((i) => i.product?.name).filter(Boolean).join(", ")}
                    </p>

                    {order.payerName && (
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <User className="h-3 w-3" />
                        Paid by: <span className="font-medium">{order.payerName}</span>
                      </p>
                    )}

                    {/* ✅ Payment screenshot thumbnail */}
                    {order.paymentScreenshot && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                          <CreditCard className="h-3 w-3" />
                          Payment Screenshot:
                        </p>
                        <a href={getImageUrl(order.paymentScreenshot)} target="_blank" rel="noreferrer">
                          <Image
                            src={getImageUrl(order.paymentScreenshot)}
                            alt="Payment proof"
                            width={100}
                            height={100}
                            className="rounded-lg border border-gray-200 object-cover hover:opacity-80 transition-opacity cursor-zoom-in"
                          />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* RIGHT — Price + actions */}
                  <div className="flex flex-col items-end gap-2 min-w-[130px]">
                    <p className="font-bold text-lg text-gray-900">
                      Rs. {Number(order.total).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("en-PK", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                    </p>
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button size="sm" variant="outline" className="mt-1">
                        <Eye className="h-4 w-4 mr-1" />
                        View Order
                      </Button>
                    </Link>
                  </div>

                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}