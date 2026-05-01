"use client"
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2, ShoppingCart, Package } from "lucide-react"
import { toast } from "sonner"
import { getImageUrl } from "@/lib/image"

interface CartItem {
  id: string
  name: string
  slug: string
  price: number
  image?: string   // ✅ single string
  quantity: number
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("cart")
    if (stored) setCart(JSON.parse(stored))

    const handleUpdate = () => {
      const stored = localStorage.getItem("cart")
      if (stored) setCart(JSON.parse(stored))
    }

    window.addEventListener("cartUpdated", handleUpdate)
    return () => window.removeEventListener("cartUpdated", handleUpdate)
  }, [])

  function updateCart(newCart: CartItem[]) {
    setCart(newCart)
    localStorage.setItem("cart", JSON.stringify(newCart))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity < 1) return
    const newCart = cart.map((item) =>
      item.id === id ? { ...item, quantity } : item
    )
    updateCart(newCart)
  }

  function removeItem(id: string) {
    const newCart = cart.filter((item) => item.id !== id)
    updateCart(newCart)
    toast.success("Item removed from cart")
  }

  function clearCart() {
    updateCart([])
    toast.success("Cart cleared")
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const shipping = subtotal > 3000 ? 0 : 200
  const total = subtotal + shipping

  if (!mounted) return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-24">
          <ShoppingCart className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-6">Your cart is empty</p>
          <Link href="/products">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Continue Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
              >
                <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                  {item.image ? (
                    <Image
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Package className="h-8 w-8 text-gray-200" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-semibold text-gray-900 hover:text-purple-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                  <p className="text-purple-600 font-medium mt-1">
                    Rs. {item.price.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-3 py-1 font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <p className="font-bold text-gray-900 w-24 text-right">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              onClick={clearCart}
              className="text-sm text-red-400 hover:text-red-600 transition-colors"
            >
              Clear cart
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-fit">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Order Summary
            </h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `Rs. ${shipping}`
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-400">
                  Free shipping on orders over Rs. 3,000
                </p>
              )}
              <div className="border-t pt-3 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>
            <Link href="/checkout">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Proceed to Checkout
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" className="w-full mt-3">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}