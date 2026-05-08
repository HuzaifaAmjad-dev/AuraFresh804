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
import {
  Loader2,
  Package,
  MapPin,
  Phone,
  Mail,
  User,
  CreditCard,
  ImageIcon,
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
  payerName?: string | null
  paymentScreenshot?: string | null
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

  useEffect(() => {
    if (!id) return

    const load = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`)

        if (!res.ok) throw new Error()

        const data: Order = await res.json()

        console.log("ORDER DATA:", data)

        setOrder(data)
        setStatus(data.status)
        setPaymentStatus(data.paymentStatus)
      } catch (error) {
        console.error(error)
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          paymentStatus,
        }),
      })

      if (!res.ok) throw new Error()

      const updated: Order = await res.json()

      // IMPORTANT:
      // preserve payerName/paymentScreenshot/items
      setOrder((prev) => ({
        ...prev!,
        ...updated,
      }))

      toast.success("Order updated")
    } catch (error) {
      console.error(error)
      toast.error("Update failed")
    } finally {
      setUpdating(false)
    }
  }

  function downloadImage(url: string) {
    const link = document.createElement("a")
    link.href = url
    link.download = "payment-screenshot"
    link.target = "_blank"
    link.click()
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-10">
        Order not found
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">
          {order.orderNumber}
        </h1>

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
              {(order.items ?? []).map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4"
                >
                  <div className="w-20 h-20 relative flex-shrink-0">
                    {item.product?.images?.[0] ? (
                     <Image
                     src={getImageUrl(item.product.images[0])}
                     alt={item.product.name}
                     fill
                     sizes="80px"
                     className="object-cover rounded-lg"
                   />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">
                      {item.product.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {item.quantity} × Rs. {item.price}
                    </p>
                  </div>

                  <p className="font-semibold">
                    Rs. {item.total}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* CUSTOMER INFO */}
          <Card>
            <CardHeader>
              <CardTitle>
                Customer Info
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">

              <p>
                <User className="inline w-4 h-4 mr-1" />
                {order.customerName}
              </p>

              <p>
                <Phone className="inline w-4 h-4 mr-1" />
                {order.customerPhone}
              </p>

              <p>
                <Mail className="inline w-4 h-4 mr-1" />
                {order.customerEmail}
              </p>

              <p className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 flex-shrink-0" />

                {order.address}, {order.city}, {order.province}

                {order.postalCode
                  ? `, ${order.postalCode}`
                  : ""}
              </p>

              {order.notes && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">
                    Order Notes
                  </p>

                  <p className="text-sm font-medium">
                    {order.notes}
                  </p>
                </div>
              )}

            </CardContent>
          </Card>

          {/* PAYMENT INFO */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Info
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

              {/* METHOD */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 w-36">
                  Method
                </span>

                <span className="font-medium">
                  {order.paymentMethod}
                </span>
              </div>

              {/* PAYER NAME */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 w-36">
                  Payer Name
                </span>

                {order.payerName ? (
                  <span className="font-medium">
                    {order.payerName}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400 italic">
                    Not provided
                  </span>
                )}
              </div>

              {/* SCREENSHOT */}
              <div className="space-y-2">

                <p className="text-sm text-gray-500">
                  Payment Screenshot
                </p>

                {order.paymentScreenshot ? (
                  <div>

                    <div
                      className="cursor-zoom-in inline-block"
                      onClick={() =>
                        setPreviewImage(
                          getImageUrl(order.paymentScreenshot!)
                        )
                      }
                    >
                      <Image
                        src={getImageUrl(order.paymentScreenshot)}
                        width={200}
                        height={200}
                        className="rounded-lg border object-cover hover:opacity-80 transition-opacity"
                        alt="Payment screenshot"
                      />
                    </div>

                    <p className="text-xs text-blue-500 mt-1">
                      Click to enlarge
                    </p>

                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-400 italic">
                    <ImageIcon className="w-4 h-4" />
                    No payment screenshot uploaded
                  </div>
                )}

              </div>
              
            </CardContent>
          </Card>

        </div>

        {/* RIGHT */}
        <div className="space-y-4">

          {/* ORDER SUMMARY */}
          <Card>
            <CardHeader>
              <CardTitle>
                Order Summary
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 text-sm">

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Subtotal
                </span>

                <span>
                  Rs. {Number(order.subtotal).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Shipping
                </span>

                <span>
                  Rs. {Number(order.shippingCost).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                <span>Total</span>

                <span>
                  Rs. {Number(order.total).toLocaleString()}
                </span>
              </div>

            </CardContent>
          </Card>

          {/* UPDATE ORDER */}
          <Card>
            <CardHeader>
              <CardTitle>
                Update Order
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

              <div className="space-y-1">

                <p className="text-xs text-gray-500">
                  Order Status
                </p>

                <Select
                  value={status}
                  onValueChange={setStatus}
                >
                  <SelectTrigger>
                    <SelectValue />
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

              </div>

              <div className="space-y-1">

                <p className="text-xs text-gray-500">
                  Payment Status
                </p>

                <Select
                  value={paymentStatus}
                  onValueChange={setPaymentStatus}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="UNPAID">UNPAID</SelectItem>
                    <SelectItem value="PAID">PAID</SelectItem>
                    <SelectItem value="REFUNDED">REFUNDED</SelectItem>
                  </SelectContent>
                </Select>

              </div>

              <Button
                onClick={updateOrder}
                disabled={updating}
                className="w-full"
              >
                {updating && (
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                )}

                {updating
                  ? "Updating..."
                  : "Update Order"}
              </Button>

            </CardContent>
          </Card>

        </div>
      </div>

      {/* IMAGE MODAL */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              onClick={() => downloadImage(previewImage)}
              className="absolute top-2 left-2 bg-green-600 text-white px-3 py-1 rounded text-sm z-10"
            >
              Download
            </button>

            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 bg-white text-black px-3 py-1 rounded text-sm z-10"
            >
              ✕
            </button>

            <Image
              src={previewImage}
              alt="Payment preview"
              width={900}
              height={900}
              className="max-h-[85vh] w-auto object-contain rounded-lg"
            />

          </div>
        </div>
      )}

    </div>
  )
}