"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { getImageUrl } from "@/lib/image"
import { ShoppingCart } from "lucide-react"
import { toast } from "sonner"

export default function ProductCard({ product }: any) {
  const [activeImage] = useState(0)
  const images = product.images || []

  function addToCart(e: any) {
    e.preventDefault() // 🔥 stops Link navigation

    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    const existing = cart.find((item: any) => item.id === product.id)

    if (existing) {
      existing.quantity += 1
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: images[0],
        quantity: 1,
      })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    window.dispatchEvent(new Event("cartUpdated"))

    toast.success("Added to cart")
  }

  return (
    <Link href={`/products/${product.slug}`} className="block">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300">

        {/* IMAGE */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          {images.length > 0 && (
            <Image
              src={getImageUrl(images[activeImage])}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition duration-500"
              sizes="300px"
            />
          )}
        </div>

        {/* INFO */}
        <div className="p-4 space-y-2">

          {/* NAME */}
          <h3 className="font-medium text-gray-900 line-clamp-1">
            {product.name}
          </h3>

          {/* CATEGORY */}
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            {product.category?.name}
          </p>

          {/* PRICE */}
          <div className="flex items-center justify-between mt-2">
            <p className="font-semibold text-gray-900">
              Rs. {product.price}
            </p>

            {/* ADD TO CART */}
            <button
              onClick={addToCart}
              className="p-2 rounded-full bg-gray-900 text-white hover:bg-black transition"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>
    </Link>
  )
}