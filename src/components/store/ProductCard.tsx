"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { getImageUrl } from "@/lib/image"
import { ShoppingCart, Zap, Star, Tag } from "lucide-react"
import { toast } from "sonner"

function Stars({ rating = 4.2, count = 128 }: any) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`h-3.5 w-3.5 ${
              s <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-gray-400">
        {rating} <span className="text-gray-300">({count})</span>
      </span>
    </div>
  )
}

export default function ProductCard({ product }: any) {
  const [activeImage, setActiveImage] = useState(0)
  const images = product.images || []

  const tags: string[] = product.tags ?? product.category?.tags ?? []
  const badge = product.badge ?? (product.stock < 10 ? "Low Stock" : null)

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  // Parse stock safely — same logic as AddToCartControls
  const stock = (() => {
    const s = product.stock
    if (s == null) return 0
    const n = typeof s === "number" ? s : parseInt(String(s), 10)
    return isNaN(n) ? 0 : Math.max(0, n)
  })()

  const outOfStock = stock <= 0

  function addToCart(e: React.MouseEvent) {
    e.preventDefault()

    if (outOfStock) {
      toast.error("This item is currently out of stock.")
      return
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existing = cart.find((item: any) => item.id === product.id)

    if (existing) {
      // Respect stock ceiling — use whichever stock value is already stored or current
      const effectiveStock = existing.stock ?? stock
      if (existing.quantity >= effectiveStock) {
        toast.error("You've reached the maximum available quantity for this item.")
        return
      }
      existing.quantity += 1
      existing.stock = effectiveStock
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: images[0],
        slug: product.slug,
        quantity: 1,
        stock, // ← always store stock so cart page & other components can enforce the limit
      })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    window.dispatchEvent(new Event("cartUpdated"))
    toast.success("Added to cart!")
  }

  function buyNow(e: React.MouseEvent) {
    e.preventDefault()
    if (outOfStock) {
      toast.error("This item is currently out of stock.")
      return
    }
    addToCart(e)
    window.location.href = "/cart"
  }

  return (
    <Link href={`/products/${product.slug}`} className="block">
      <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">

        {/* IMAGE SECTION */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          {images.length > 0 && (
            <Image
              src={getImageUrl(images[activeImage])}
              alt={product.name}
              fill
              sizes="300px"
              className="object-cover group-hover:scale-110 transition duration-500"
            />
          )}

          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.slice(0, 3).map((_: any, i: number) => (
                <button
                  key={i}
                  onMouseEnter={() => setActiveImage(i)}
                  className={`w-2 h-2 rounded-full transition ${
                    i === activeImage ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}

          {badge && (
            <span className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow">
              {badge}
            </span>
          )}

          {outOfStock && (
            <span className="absolute top-3 left-3 bg-gray-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow">
              Out of Stock
            </span>
          )}

          {discount && !outOfStock && (
            <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow">
              -{discount}%
            </span>
          )}
        </div>

        {/* BODY */}
        <div className="p-4 flex flex-col gap-3 flex-1">
          <p className="text-[10px] text-indigo-500 uppercase tracking-widest font-semibold">
            {product.category?.name ?? "Product"}
          </p>

          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag: string) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                >
                  <Tag className="h-2.5 w-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* CTA */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={addToCart}
              disabled={outOfStock}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition
                ${outOfStock
                  ? "border-gray-200 text-gray-300 cursor-not-allowed pointer-events-none"
                  : "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                }`}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Cart
            </button>

            <button
              onClick={buyNow}
              disabled={outOfStock}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition
                ${outOfStock
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed pointer-events-none"
                  : "bg-gray-900 text-white hover:bg-black"
                }`}
            >
              <Zap className="h-3.5 w-3.5 text-yellow-300" />
              Buy
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}