// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { ShoppingBag, Eye } from "lucide-react"

// interface Order {
//   id: string
//   orderNumber: string
//   customerName: string
//   customerPhone: string
//   city: string
//   total: number
//   status: string
//   paymentMethod: string
//   paymentStatus: string
//   createdAt: string
//   items: { id: string }[]
// }

// const statusColors: Record<string, string> = {
//   PENDING: "bg-yellow-100 text-yellow-800",
//   CONFIRMED: "bg-blue-100 text-blue-800",
//   PROCESSING: "bg-purple-100 text-purple-800",
//   SHIPPED: "bg-indigo-100 text-indigo-800",
//   DELIVERED: "bg-green-100 text-green-800",
//   CANCELLED: "bg-red-100 text-red-800",
//   REFUNDED: "bg-gray-100 text-gray-800",
// }

// export default function OrdersPage() {
//   const [orders, setOrders] = useState<Order[]>([])
//   const [loading, setLoading] = useState(true)
//   const [filter, setFilter] = useState("ALL")

//   useEffect(() => {
//     fetch("/api/orders")
//       .then((r) => r.json())
//       .then((data) => {
//         setOrders(data)
//         setLoading(false)
//       })
//   }, [])

//   const filtered = filter === "ALL"
//     ? orders
//     : orders.filter((o) => o.status === filter)

//   const statuses = ["ALL", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
//         <p className="text-gray-500">Manage customer orders</p>
//       </div>

//       {/* Filter tabs */}
//       <div className="flex gap-2 flex-wrap">
//         {statuses.map((s) => (
//           <button
//             key={s}
//             onClick={() => setFilter(s)}
//             className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
//               filter === s
//                 ? "bg-purple-600 text-white"
//                 : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//             }`}
//           >
//             {s}
//             {s !== "ALL" && (
//               <span className="ml-1 text-xs">
//                 ({orders.filter((o) => o.status === s).length})
//               </span>
//             )}
//           </button>
//         ))}
//       </div>

//       {loading ? (
//         <div className="text-center py-12 text-gray-400">Loading...</div>
//       ) : filtered.length === 0 ? (
//         <div className="text-center py-12">
//           <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
//           <p className="text-gray-500">No orders found</p>
//         </div>
//       ) : (
//         <div className="space-y-3">
//           {filtered.map((order) => (
//             <Card key={order.id}>
//               <CardContent className="p-4">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-4">
//                     <div>
//                       <p className="font-semibold text-gray-900">
//                         {order.orderNumber}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         {order.customerName} • {order.customerPhone}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         {order.city} • {order.items.length} items
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <div className="text-right">
//                       <p className="font-bold text-gray-900">
//                         Rs. {Number(order.total).toLocaleString()}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {order.paymentMethod}
//                       </p>
//                       <p className="text-xs text-gray-400">
//                         {new Date(order.createdAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                     <div className="flex flex-col items-end gap-2">
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
//                         {order.status}
//                       </span>
//                       <Link href={`/admin/orders/${order.id}`}>
//                         <Button size="sm" variant="outline">
//                           <Eye className="h-4 w-4 mr-1" />
//                           View
//                         </Button>
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBag, Eye, ImageIcon, User, MapPin } from "lucide-react"

// ✅ TYPE FIX (IMPORTANT)
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
    product?: {
      name: string
    }
  }[]
}

const paymentColors: Record<string, string> = {
  PAID: "bg-green-100 text-green-800",
  UNPAID: "bg-yellow-100 text-yellow-800",
  REFUNDED: "bg-red-100 text-red-800",
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
}

export default function OrdersPage() {
  // ✅ FIX HERE (THIS REMOVES "never" ERROR)
  const [orders, setOrders] = useState<Order[]>([])

  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("ALL")

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data: Order[]) => {
        setOrders(data)
        setLoading(false)
      })
  }, [])

  const filtered =
    filter === "ALL"
      ? orders
      : orders.filter((o) => o.status === filter)

  const statuses = [
    "ALL",
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-gray-500">Manage customer orders</p>
      </div>

      {/* FILTER */}
      <div className="flex gap-2 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === s ? "bg-purple-600 text-white" : "bg-gray-100"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* LIST */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="space-y-3">

          {filtered.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4 flex justify-between">

                {/* LEFT */}
                <div className="space-y-1">

                  <p className="font-semibold">{order.orderNumber}</p>

                  <p className="text-sm text-gray-500">
                    {order.customerName} • {order.customerPhone}
                  </p>

                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {order.address}, {order.city}, {order.province}
                  </p>

                  <p className="text-xs text-gray-500">
                    🛒{" "}
                    {order.items
                      ?.map((i) => i.product?.name)
                      .join(", ")}
                  </p>

                  {order.payerName && (
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {order.payerName}
                    </p>
                  )}

                  {order.paymentScreenshot && (
                    <p className="text-xs text-blue-600 flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" />
                      Payment Proof
                    </p>
                  )}
                </div>

                {/* RIGHT */}
                <div className="text-right space-y-1">

                  <p className="font-bold">
                    Rs {Number(order.total).toLocaleString()}
                  </p>

                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      paymentColors[order.paymentStatus] || "bg-gray-100"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>

                  <div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        statusColors[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>

                  <Link href={`/admin/orders/${order.id}`}>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </Link>

                </div>

              </CardContent>
            </Card>
          ))}

        </div>
      )}
    </div>
  )
}