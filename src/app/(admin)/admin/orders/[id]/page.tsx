// // "use client"

// // import { useState, useEffect } from "react"
// // import { useParams, useRouter } from "next/navigation"
// // import Image from "next/image"
// // import { Button } from "@/components/ui/button"
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select"
// // import { Badge } from "@/components/ui/badge"
// // import { toast } from "sonner"
// // import { ArrowLeft, Loader2, Package } from "lucide-react"
// // import Link from "next/link"

// // interface Order {
// //   id: string
// //   orderNumber: string
// //   customerName: string
// //   customerEmail: string
// //   customerPhone: string
// //   address: string
// //   city: string
// //   province: string
// //   postalCode?: string
// //   status: string
// //   paymentMethod: string
// //   paymentStatus: string
// //   subtotal: number
// //   shippingCost: number
// //   total: number
// //   notes?: string
// //   createdAt: string
// //   items: {
// //     id: string
// //     quantity: number
// //     price: number
// //     total: number
// //     product: {
// //       name: string
// //       images: string[]
// //     }
    
      
// //       orderNumber: string
// //       customerName: string
// //       customerPhone: string
// //       city: string
      
// //       status: string
// //       paymentMethod: string
// //       paymentStatus: string
// //       createdAt: string
// //       items: { id: string }[]
    
// //   }[]
// //   statusLogs: {
// //     id: string
// //     status: string
// //     note?: string
// //     createdAt: string
// //   }[]
// // }

// // const statusColors: Record<string, string> = {
// //   PENDING: "bg-yellow-100 text-yellow-800",
// //   CONFIRMED: "bg-blue-100 text-blue-800",
// //   PROCESSING: "bg-purple-100 text-purple-800",
// //   SHIPPED: "bg-indigo-100 text-indigo-800",
// //   DELIVERED: "bg-green-100 text-green-800",
// //   CANCELLED: "bg-red-100 text-red-800",
// //   REFUNDED: "bg-gray-100 text-gray-800",
// // }

// // export default function OrderDetailPage() {
// //   const params = useParams()
// //   const router = useRouter()
// //   const id = params.id as string

// //   const [order, setOrder] = useState<Order | null>(null)
// //   const [loading, setLoading] = useState(true)
// //   const [updating, setUpdating] = useState(false)
// //   const [newStatus, setNewStatus] = useState("")
// //   const [newPaymentStatus, setNewPaymentStatus] = useState("")

// //   useEffect(() => {
// //     fetch(`/api/orders/${id}`)
// //       .then((r) => r.json())
// //       .then((data) => {
// //         setOrder(data)
// //         setNewStatus(data.status)
// //         setNewPaymentStatus(data.paymentStatus)
// //         setLoading(false)
// //       })
// //   }, [id])

// //   async function handleUpdate() {
// //     setUpdating(true)
// //     try {
// //       const res = await fetch(`/api/orders/${id}`, {
// //         method: "PUT",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           status: newStatus,
// //           paymentStatus: newPaymentStatus,
// //         }),
// //       })
// //       if (!res.ok) throw new Error()
// //       toast.success("Order updated!")
// //       // Refresh order
// //       fetch(`/api/orders/${id}`)
// //         .then((r) => r.json())
// //         .then(setOrder)
// //     } catch {
// //       toast.error("Failed to update order")
// //     } finally {
// //       setUpdating(false)
// //     }
// //   }

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center h-64">
// //         <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
// //       </div>
// //     )
// //   }

// //   if (!order) return <div>Order not found</div>

// //   return (
// //     <div className="space-y-6 max-w-4xl">
// //       <div className="flex items-center gap-4">
// //         <Link href="/admin/orders">
// //           <Button variant="outline" size="sm">
// //             <ArrowLeft className="h-4 w-4 mr-1" />
// //             Back
// //           </Button>
// //         </Link>
// //         <div>
// //           <h1 className="text-2xl font-bold text-gray-900">
// //             {order.orderNumber}
// //           </h1>
// //           <p className="text-gray-500">
// //             {new Date(order.createdAt).toLocaleDateString("en-PK", {
// //               year: "numeric",
// //               month: "long",
// //               day: "numeric",
// //               hour: "2-digit",
// //               minute: "2-digit",
// //             })}
// //           </p>
// //         </div>
// //         <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
// //           {order.status}
// //         </span>
// //       </div>

// //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //         <div className="lg:col-span-2 space-y-6">
// //           {/* Order Items */}
// //           <Card>
// //             <CardHeader>
// //               <CardTitle>Order Items</CardTitle>
// //             </CardHeader>
// //             <CardContent className="space-y-4">
// //               {order.items.map((item) => (
// //                 <div key={item.id} className="flex items-center gap-4">
// //                   <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
// //                     {item.product.images[0] ? (
// //                       <Image
// //                         src={item.product.images[0]}
// //                         alt={item.product.name}
// //                         fill
// //                         className="object-cover"
// //                       />
// //                     ) : (
// //                       <div className="flex items-center justify-center h-full">
// //                         <Package className="h-6 w-6 text-gray-300" />
// //                       </div>
// //                     )}
// //                   </div>
// //                   <div className="flex-1">
// //                     <p className="font-medium text-gray-900">
// //                       {item.product.name}
// //                     </p>
// //                     <p className="text-sm text-gray-500">
// //                       Rs. {Number(item.price).toLocaleString()} x {item.quantity}
// //                     </p>
// //                   </div>
// //                   <p className="font-semibold">
// //                     Rs. {Number(item.total).toLocaleString()}
// //                   </p>
// //                 </div>
// //               ))}
// //               <div className="border-t pt-4 space-y-2">
// //                 <div className="flex justify-between text-sm text-gray-600">
// //                   <span>Subtotal</span>
// //                   <span>Rs. {Number(order.subtotal).toLocaleString()}</span>
// //                 </div>
// //                 <div className="flex justify-between text-sm text-gray-600">
// //                   <span>Shipping</span>
// //                   <span>Rs. {Number(order.shippingCost).toLocaleString()}</span>
// //                 </div>
// //                 <div className="flex justify-between font-bold text-gray-900">
// //                   <span>Total</span>
// //                   <span>Rs. {Number(order.total).toLocaleString()}</span>
// //                 </div>
// //               </div>
// //             </CardContent>
// //           </Card>

// //           {/* Customer Info */}
// //           <Card>
// //             <CardHeader>
// //               <CardTitle>Customer Information</CardTitle>
// //             </CardHeader>
// //             <CardContent className="space-y-3">
// //               <div className="grid grid-cols-2 gap-4">
// //                 <div>
// //                   <p className="text-sm text-gray-500">Name</p>
// //                   <p className="font-medium">{order.customerName}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-sm text-gray-500">Phone</p>
// //                   <p className="font-medium">{order.customerPhone}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-sm text-gray-500">Email</p>
// //                   <p className="font-medium">{order.customerEmail}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-sm text-gray-500">Payment</p>
// //                   <p className="font-medium">{order.paymentMethod}</p>
// //                 </div>
// //               </div>
// //               <div>
// //                 <p className="text-sm text-gray-500">Shipping Address</p>
// //                 <p className="font-medium">
// //                   {order.address}, {order.city}, {order.province}
// //                   {order.postalCode && `, ${order.postalCode}`}
// //                 </p>
// //               </div>
// //               {order.notes && (
// //                 <div>
// //                   <p className="text-sm text-gray-500">Notes</p>
// //                   <p className="font-medium">{order.notes}</p>
// //                 </div>
// //               )}
// //             </CardContent>
// //           </Card>

// //           {/* Status History */}
// //           {order.statusLogs.length > 0 && (
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle>Status History</CardTitle>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="space-y-3">
// //                   {order.statusLogs.map((log) => (
// //                     <div key={log.id} className="flex items-center gap-3">
// //                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[log.status]}`}>
// //                         {log.status}
// //                       </span>
// //                       <span className="text-sm text-gray-500">
// //                         {new Date(log.createdAt).toLocaleDateString("en-PK", {
// //                           month: "short",
// //                           day: "numeric",
// //                           hour: "2-digit",
// //                           minute: "2-digit",
// //                         })}
// //                       </span>
// //                       {log.note && (
// //                         <span className="text-sm text-gray-600">{log.note}</span>
// //                       )}
// //                     </div>
// //                   ))}
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           )}
// //         </div>

// //         {/* Update Status */}
// //         <div className="space-y-6">
// //           <Card>
// //             <CardHeader>
// //               <CardTitle>Update Order</CardTitle>
// //             </CardHeader>
// //             <CardContent className="space-y-4">
// //               <div className="space-y-2">
// //                 <p className="text-sm font-medium text-gray-700">Order Status</p>
// //                 <Select value={newStatus} onValueChange={setNewStatus}>
// //                   <SelectTrigger>
// //                     <SelectValue />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     <SelectItem value="PENDING">Pending</SelectItem>
// //                     <SelectItem value="CONFIRMED">Confirmed</SelectItem>
// //                     <SelectItem value="PROCESSING">Processing</SelectItem>
// //                     <SelectItem value="SHIPPED">Shipped</SelectItem>
// //                     <SelectItem value="DELIVERED">Delivered</SelectItem>
// //                     <SelectItem value="CANCELLED">Cancelled</SelectItem>
// //                     <SelectItem value="REFUNDED">Refunded</SelectItem>
// //                   </SelectContent>
// //                 </Select>
// //               </div>
// //               <div className="space-y-2">
// //                 <p className="text-sm font-medium text-gray-700">Payment Status</p>
// //                 <Select value={newPaymentStatus} onValueChange={setNewPaymentStatus}>
// //                   <SelectTrigger>
// //                     <SelectValue />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     <SelectItem value="UNPAID">Unpaid</SelectItem>
// //                     <SelectItem value="PAID">Paid</SelectItem>
// //                     <SelectItem value="REFUNDED">Refunded</SelectItem>
// //                   </SelectContent>
// //                 </Select>
// //               </div>
// //               <Button
// //                 className="w-full"
// //                 onClick={handleUpdate}
// //                 disabled={updating}
// //               >
// //                 {updating ? (
// //                   <>
// //                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
// //                     Updating...
// //                   </>
// //                 ) : (
// //                   "Update Order"
// //                 )}
// //               </Button>
// //             </CardContent>
// //           </Card>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// "use client"

// import { useState, useEffect } from "react"
// import { useParams } from "next/navigation"
// import Image from "next/image"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Loader2, Package } from "lucide-react"
// import { toast } from "sonner"
// import Link from "next/link"

// interface Order {
//   id: string
//   orderNumber: string
//   customerName: string
//   customerEmail: string
//   customerPhone: string
//   address: string
//   city: string
//   province: string
//   postalCode?: string
//   status: string
//   paymentMethod: string
//   paymentStatus: string
//   subtotal: number
//   shippingCost: number
//   total: number
//   notes?: string
//   payerName?: string
//   paymentScreenshot?: string
//   createdAt: string

//   items: {
//     id: string
//     quantity: number
//     price: number
//     total: number
//     product: {
//       name: string
//       images: string[]
//     }
//   }[]

//   statusLogs: {
//     id: string
//     status: string
//     note?: string
//     createdAt: string
//   }[]
// }

// export default function OrderDetailPage() {
//   const { id } = useParams()
//   const [order, setOrder] = useState<Order | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [status, setStatus] = useState("")
//   const [paymentStatus, setPaymentStatus] = useState("")
//   const [updating, setUpdating] = useState(false)

//   useEffect(() => {
//     fetch(`/api/orders/${id}`)
//       .then((r) => r.json())
//       .then((data) => {
//         setOrder(data)
//         setStatus(data.status)
//         setPaymentStatus(data.paymentStatus)
//         setLoading(false)
//       })
//   }, [id])

//   async function updateOrder() {
//     setUpdating(true)
//     try {
//       const res = await fetch(`/api/orders/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           status,
//           paymentStatus,
//         }),
//       })

//       if (!res.ok) throw new Error()

//       toast.success("Updated successfully")

//       const updated = await fetch(`/api/orders/${id}`).then((r) =>
//         r.json()
//       )
//       setOrder(updated)
//     } catch {
//       toast.error("Update failed")
//     } finally {
//       setUpdating(false)
//     }
//   }

//   if (loading)
//     return (
//       <div className="flex justify-center py-20">
//         <Loader2 className="animate-spin" />
//       </div>
//     )

//   if (!order) return <div>Order not found</div>

//   return (
//     <div className="space-y-6">

//       {/* HEADER */}
//       <div className="flex justify-between">
//         <div>
//           <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
//           <p className="text-gray-500">
//             {new Date(order.createdAt).toLocaleString()}
//           </p>
//         </div>
//       </div>

//       <div className="grid lg:grid-cols-3 gap-6">

//         {/* LEFT */}
//         <div className="lg:col-span-2 space-y-6">

//           {/* ITEMS */}
//           <Card>
//             <CardHeader><CardTitle>Items</CardTitle></CardHeader>
//             <CardContent className="space-y-4">
//               {order.items.map((item) => (
//                 <div key={item.id} className="flex gap-4">

//                   <div className="w-16 h-16 relative">
//                     {item.product.images?.[0] ? (
//                       <Image
//                         src={item.product.images[0]}
//                         fill
//                         className="object-cover rounded"
//                         alt=""
//                       />
//                     ) : (
//                       <Package />
//                     )}
//                   </div>

//                   <div className="flex-1">
//                     <p>{item.product.name}</p>
//                     <p className="text-sm text-gray-500">
//                       {item.quantity} × {item.price}
//                     </p>
//                   </div>

//                   <p>{item.total}</p>
//                 </div>
//               ))}
//             </CardContent>
//           </Card>

//           {/* CUSTOMER */}
//           <Card>
//             <CardHeader><CardTitle>Customer</CardTitle></CardHeader>
//             <CardContent className="space-y-2">

//               <p><b>Name:</b> {order.customerName}</p>
//               <p><b>Phone:</b> {order.customerPhone}</p>
//               <p><b>Email:</b> {order.customerEmail}</p>

//               {/* 👇 NEW */}
//               {order.payerName && (
//                 <p><b>Payer:</b> {order.payerName}</p>
//               )}

//               {/* 👇 SCREENSHOT */}
//               {order.paymentScreenshot && (
//                 <div>
//                   <p className="font-semibold mt-2">Payment Screenshot</p>
//                   <a href={order.paymentScreenshot} target="_blank">
//                     <Image
//                       src={order.paymentScreenshot}
//                       width={250}
//                       height={250}
//                       className="rounded border"
//                       alt=""
//                     />
//                   </a>
//                 </div>
//               )}

//             </CardContent>
//           </Card>

//         </div>

//         {/* RIGHT */}
//         <div className="space-y-4">

//           <Card>
//             <CardHeader><CardTitle>Update</CardTitle></CardHeader>
//             <CardContent className="space-y-3">

//               <Select value={status} onValueChange={setStatus}>
//                 <SelectTrigger><SelectValue /></SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="PENDING">PENDING</SelectItem>
//                   <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
//                   <SelectItem value="PROCESSING">PROCESSING</SelectItem>
//                   <SelectItem value="SHIPPED">SHIPPED</SelectItem>
//                   <SelectItem value="DELIVERED">DELIVERED</SelectItem>
//                 </SelectContent>
//               </Select>

//               <Button
//                 onClick={updateOrder}
//                 disabled={updating}
//                 className="w-full"
//               >
//                 {updating ? "Updating..." : "Update"}
//               </Button>

//             </CardContent>
//           </Card>

//         </div>

//       </div>
//     </div>
//   )
// }
"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Package, MapPin } from "lucide-react"
import { toast } from "sonner"

type OrderItem = {
  id: string
  quantity: number
  price: number
  total: number
  product: {
    name: string
    images: string[]
  }
}

type Order = {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  city: string
  province: string
  postalCode?: string

  status: string
  paymentStatus: string
  paymentMethod: string

  subtotal: number
  shippingCost: number
  total: number

  payerName?: string
  paymentScreenshot?: string

  createdAt: string
  items: OrderItem[]
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params.id

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const [status, setStatus] = useState("")
  const [paymentStatus, setPaymentStatus] = useState("")
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (!id) return

    const load = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`)
        if (!res.ok) throw new Error()

        const data: Order = await res.json()

        setOrder(data)
        setStatus(data.status)
        setPaymentStatus(data.paymentStatus)
      } catch {
        toast.error("Failed to load order")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  async function updateOrder() {
    setUpdating(true)

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          paymentStatus,
        }),
      })

      if (!res.ok) throw new Error()

      const updated: Order = await res.json()
      setOrder(updated)

      toast.success("Order updated")
    } catch {
      toast.error("Update failed")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  if (!order) return <div className="text-center py-10">Order not found</div>

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
        <p className="text-gray-500">
          {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* ITEMS */}
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {order.items.length ? (
                (order.items ?? []).map((item) => (
                  <div key={item.id} className="flex gap-4">

                    <div className="w-16 h-16 relative">
                      {item.product?.images?.length ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded"
                        />
                      ) : (
                        <Package className="w-5 h-5 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} × {item.price}
                      </p>
                    </div>

                    <p>{item.total}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No items</p>
              )}
            </CardContent>
          </Card>

          {/* CUSTOMER */}
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">

              <p><b>Name:</b> {order.customerName}</p>
              <p><b>Phone:</b> {order.customerPhone}</p>
              <p><b>Email:</b> {order.customerEmail}</p>

              <p className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                {order.address}, {order.city}, {order.province}
              </p>

              {order.payerName && (
                <p><b>Payer:</b> {order.payerName}</p>
              )}

              {order.paymentScreenshot && (
                <div>
                  <p className="font-semibold mt-2">Payment Screenshot</p>
                  <Image
                    src={order.paymentScreenshot}
                    width={250}
                    height={250}
                    className="rounded border"
                    alt="payment"
                  />
                </div>
              )}

            </CardContent>
          </Card>

        </div>

        {/* RIGHT */}
        <div>

          <Card>
            <CardHeader>
              <CardTitle>Update Order</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">PENDING</SelectItem>
                  <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
                  <SelectItem value="PROCESSING">PROCESSING</SelectItem>
                  <SelectItem value="SHIPPED">SHIPPED</SelectItem>
                  <SelectItem value="DELIVERED">DELIVERED</SelectItem>
                  <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                </SelectContent>
              </Select>

              <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UNPAID">UNPAID</SelectItem>
                  <SelectItem value="PAID">PAID</SelectItem>
                  <SelectItem value="REFUNDED">REFUNDED</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={updateOrder}
                disabled={updating}
                className="w-full"
              >
                {updating ? "Updating..." : "Update Order"}
              </Button>

            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  )
}