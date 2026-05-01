"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Package } from "lucide-react"
import Image from "next/image"
import { getImageUrl } from "@/lib/image"

interface CartItem {
  id: string
  name: string
  slug: string
  price: number
  image?: string
  quantity: number
}

export default function CheckoutPage() {
  const router = useRouter()

  const [cart, setCart] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    notes: "",

    payerName: "",
    paymentScreenshot: "",
  })

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("cart")
    if (stored) setCart(JSON.parse(stored))
  }, [])

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const shipping = subtotal > 3000 ? 0 : 200
  const total = subtotal + shipping

  // ✅ Upload image to your API
  async function uploadImage(file: File) {
    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!res.ok) throw new Error("Upload failed")

    const data = await res.json()
    return data.url as string
  }

  async function handlePlaceOrder() {
    if (cart.length === 0) return toast.error("Your cart is empty")

    if (!form.customerName) return toast.error("Name is required")
    if (!form.customerEmail) return toast.error("Email is required")
    if (!form.customerPhone) return toast.error("Phone is required")
    if (!form.address) return toast.error("Address is required")
    if (!form.city) return toast.error("City is required")
    if (!form.province) return toast.error("Province is required")

    setPlacing(true)

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          subtotal,
          shippingCost: shipping,
          total,
          paymentMethod: "COD",

          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      })

      if (!res.ok) throw new Error()

      const order = await res.json()

      localStorage.removeItem("cart")
      window.dispatchEvent(new Event("cartUpdated"))

      toast.success("Order placed successfully!")
      router.push(`/order-success?order=${order.orderNumber}`)
    } catch {
      toast.error("Failed to place order. Please try again.")
    } finally {
      setPlacing(false)
    }
  }

  if (!mounted) return null

  if (cart.length === 0) {
    router.push("/cart")
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">

          {/* PERSONAL INFO */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Input
                placeholder="Full Name"
                value={form.customerName}
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
                }
              />

              <Input
                placeholder="Email"
                value={form.customerEmail}
                onChange={(e) =>
                  setForm({ ...form, customerEmail: e.target.value })
                }
              />

              <Input
                placeholder="Phone"
                value={form.customerPhone}
                onChange={(e) =>
                  setForm({ ...form, customerPhone: e.target.value })
                }
              />
            </CardContent>
          </Card>

          {/* ADDRESS */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Input
                placeholder="Address"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="City"
                  value={form.city}
                  onChange={(e) =>
                    setForm({ ...form, city: e.target.value })
                  }
                />

                <Input
                  placeholder="Province"
                  value={form.province}
                  onChange={(e) =>
                    setForm({ ...form, province: e.target.value })
                  }
                />
              </div>

              <Input
                placeholder="Postal Code"
                value={form.postalCode}
                onChange={(e) =>
                  setForm({ ...form, postalCode: e.target.value })
                }
              />

              <Textarea
                placeholder="Notes"
                value={form.notes}
                onChange={(e) =>
                  setForm({ ...form, notes: e.target.value })
                }
              />
            </CardContent>
          </Card>

          {/* PAYMENT PROOF */}
          <div className="bg-gradient-to-r from-green-600 to-rose-600 text-white rounded-xl p-6 space-y-4 shadow-lg">

  <p className="text-lg md:text-xl font-extrabold tracking-wide">
    ⚠️ IMPORTANT PAYMENT INSTRUCTIONS
  </p>

  <p className="text-sm md:text-base font-medium">
    Please transfer your payment to the bank account below:
  </p>

  <div className="bg-white/10 border border-white/20 rounded-lg p-4 text-sm space-y-1 font-medium">
    <p><span className="font-bold">Bank:</span> United Bank Limited (UBL)</p>
    <p><span className="font-bold">Account Name:</span> Aizaz Ul Hassan</p>
    <p><span className="font-bold">Account Number:</span> 0577294618176</p>
    <p><span className="font-bold">IBAN:</span> PK45UNIL0109000294618176</p>
  </div>

  <p className="text-yellow-200 font-bold text-sm md:text-base">
    🚫 Your order will NOT be processed until payment is confirmed.
  </p>

  <p className="text-white/90 text-sm md:text-base">
    After payment, upload your screenshot below. Our team will contact you shortly to confirm your order.
  </p>
</div>
          <Card>
            
            <CardHeader>
              <CardTitle>Payment Proof</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

              <Input
                placeholder="Payer Name"
                value={form.payerName}
                onChange={(e) =>
                  setForm({ ...form, payerName: e.target.value })
                }
              />

              <Input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return

                  try {
                    setUploading(true)
                    const url = await uploadImage(file)

                    setForm((prev) => ({
                      ...prev,
                      paymentScreenshot: url,
                    }))

                    toast.success("Screenshot uploaded")
                  } catch {
                    toast.error("Upload failed")
                  } finally {
                    setUploading(false)
                  }
                }}
              />

              {uploading && (
                <p className="text-xs text-gray-500">
                  Uploading...
                </p>
              )}

              {form.paymentScreenshot && (
                <Image
                  src={form.paymentScreenshot}
                  alt="Payment"
                  width={160}
                  height={160}
                  className="rounded-lg border object-cover"
                />
              )}
            </CardContent>
          </Card>

        </div>

        {/* RIGHT SIDE */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

              {cart.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="h-12 w-12 relative">
                    {item.image ? (
                      <Image
                      src={getImageUrl(item.image)}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    ) : (
                      <Package />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm">{item.name}</p>
                    <p className="text-xs">x{item.quantity}</p>
                  </div>

                  <p className="text-sm">
                    Rs {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}

              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs {subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? "Free" : `Rs ${shipping}`}
                  </span>
                </div>

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>Rs {total}</span>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handlePlaceOrder}
                disabled={placing}
              >
                {placing ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : null}
                Place Order
              </Button>

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}