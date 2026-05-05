"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { getImageUrl } from "@/lib/image"
import { ShoppingCart, Zap, Star, Tag } from "lucide-react"
import { toast } from "sonner"

// ── Rich text renderer ──────────────────────────────────────────────────────
// Supports **bold**, __underline__, *italic* inline markers
function RichText({ text, className }: { text: string; className?: string }) {
  if (!text) return null

  // Split by any formatting token, keeping the delimiters
  const parts = text.split(/(\*\*.*?\*\*|__.*?__|_.*?_|\*.*?\*)/)

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**"))
          return <strong key={i}>{part.slice(2, -2)}</strong>
        if (part.startsWith("__") && part.endsWith("__"))
          return <u key={i}>{part.slice(2, -2)}</u>
        if (
          (part.startsWith("_") && part.endsWith("_")) ||
          (part.startsWith("*") && part.endsWith("*"))
        )
          return <em key={i}>{part.slice(1, -1)}</em>
        return <span key={i}>{part}</span>
      })}
    </span>
  )
}

// ── Star rating row ─────────────────────────────────────────────────────────
function Stars({ rating = 4.2, count = 128 }: { rating?: number; count?: number }) {
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
      <span className="text-xs text-gray-400 font-medium">
        {rating} <span className="text-gray-300">({count})</span>
      </span>
    </div>
  )
}

// ── Main card ───────────────────────────────────────────────────────────────
export default function ProductCard({ product }: any) {
  const [activeImage] = useState(0)
  const images = product.images || []

  const tags: string[] = product.tags ?? product.category?.tags ?? []
  const badge = product.badge ?? (product.stock < 10 ? "Low Stock" : null)
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  function addToCart(e: React.MouseEvent) {
    e.preventDefault()
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
    toast.success("Added to cart!")
  }

  function buyNow(e: React.MouseEvent) {
    e.preventDefault()
    addToCart(e)
    // navigate to cart / checkout – adjust path to your app
    window.location.href = "/cart"
  }

  return (
    <Link href={`/products/${product.slug}`} className="block focus:outline-none">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full">

        {/* ── IMAGE ──────────────────────────────────────────────── */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden flex-shrink-0">
          {images.length > 0 && (
            <Image
              src={getImageUrl(images[activeImage])}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition duration-500"
              sizes="300px"
            />
          )}

          {/* Top-left badge */}
          {badge && (
            <span className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow">
              {badge}
            </span>
          )}

          {/* Discount pill */}
          {discount && (
            <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
              -{discount}%
            </span>
          )}
        </div>

        {/* ── BODY ───────────────────────────────────────────────── */}
        <div className="p-4 flex flex-col gap-3 flex-1">

          {/* Section 1 – Category + Name */}
          <div>
            <p className="text-[10px] text-indigo-500 uppercase tracking-widest font-semibold mb-0.5">
              {product.category?.name ?? "Product"}
            </p>
            <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
              {product.name}
            </h3>
          </div>

          {/* Section 2 – Rating */}
          {/* <Stars rating={product.rating} count={product.reviewCount} /> */}

          {/* Section 3 – Description (rich text) */}
          {product.description && (
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
              <RichText text={product.description} />
            </p>
          )}

          {/* Section 4 – Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-gray-100 rounded-full px-2 py-0.5 font-medium"
                >
                  <Tag className="h-2.5 w-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Spacer pushes price + buttons to bottom */}
          <div className="flex-1" />

          {/* Section 5 – Price row */}
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-gray-900">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Section 6 – CTA buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {/* Add to Cart */}
            <button
              onClick={addToCart}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border-2 border-gray-900 text-gray-900 text-xs font-semibold hover:bg-gray-900 hover:text-white transition-colors duration-200"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Add to Cart
            </button>

            {/* Buy Now */}
            <button
              onClick={buyNow}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-black transition-colors duration-200"
            >
              <Zap className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300" />
              Buy Now
            </button>
          </div>

        </div>
      </div>
    </Link>
  )
}