"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Loader2, Package, MapPin, Phone, Mail, User, CreditCard
} from "lucide-react"
import { toast } from "sonner"
import { getImageUrl } from "@/lib/image"

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

  notes?: string
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

  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // ✅ FIX: safe image handler
  const safeImage = (img?: string) =>
    img?.startsWith("http") ? img : getImageUrl(img || "")

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
    <div className="space-y-6 max-w-5xl">

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

              {/* ✅ FIX: safe array check */}
              {Array.isArray(order.items) && order.items.length ? (
                order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">

                    <div className="w-20 h-20 relative">
                      {item.product?.images?.length ? (
                        <Image
                          src={safeImage(item.product.images?.[0])}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} × Rs. {item.price}
                      </p>
                    </div>

                    <p className="font-semibold">Rs. {item.total}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No items</p>
              )}

              {/* TOTALS */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>Rs. {order.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>Rs. {order.shippingCost}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>Rs. {order.total}</span>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* CUSTOMER */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Info</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">

              <p><User className="inline w-4 h-4 mr-1" /> {order.customerName}</p>
              <p><Phone className="inline w-4 h-4 mr-1" /> {order.customerPhone}</p>
              <p><Mail className="inline w-4 h-4 mr-1" /> {order.customerEmail}</p>

              <p className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                {order.address}, {order.city}, {order.province}
              </p>

              {/* NOTES FIX */}
              {order.notes?.trim() && (
                <div className="mt-3">
                  <p className="text-sm text-gray-500">Order Notes</p>
                  <p className="font-medium text-gray-900">
                    {order.notes}
                  </p>
                </div>
              )}

              <p>
                <CreditCard className="inline w-4 h-4 mr-1" />
                {order.paymentMethod}
              </p>

              {order.payerName && (
                <p><b>Payer:</b> {order.payerName}</p>
              )}

              {/* PAYMENT IMAGE FIX */}
              {order.paymentScreenshot && (
                <div className="mt-3">
                  <p className="font-semibold mb-2">Payment Screenshot</p>

                  <div
                    className="cursor-pointer inline-block"
                    onClick={() =>
                      setPreviewImage(safeImage(order.paymentScreenshot))
                    }
                  >
                    <Image
                      src={safeImage(order.paymentScreenshot)}
                      width={220}
                      height={220}
                      className="rounded-lg border shadow hover:scale-105 transition"
                      alt="payment"
                    />
                    <p className="text-xs text-blue-500 mt-1">
                      Click to view full size
                    </p>
                  </div>
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

      {/* MODAL */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-5xl w-full flex justify-center"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-white bg-white/20 px-3 py-1 rounded"
            >
              Close ✕
            </button>

            <a
              href={previewImage}
              download
              target="_blank"
              className="absolute -top-10 left-0 text-white bg-green-600 px-3 py-1 rounded"
            >
              Download ⬇
            </a>

            <Image
              src={previewImage}
              alt="full"
              width={1000}
              height={1000}
              className="max-h-[85vh] w-auto object-contain rounded-xl"
            />

          </div>
        </div>
      )}

    </div>
  )
}