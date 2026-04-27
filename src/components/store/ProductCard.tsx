"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Package } from "lucide-react"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  images: string[]
  volume?: string
  gender: string
  isFeatured: boolean
  category: { name: string }
}

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const discount = product.comparePrice
    ? Math.round(
        ((Number(product.comparePrice) - Number(product.price)) /
          Number(product.comparePrice)) *
          100
      )
    : null

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existing = cart.find((item: any) => item.id === product.id)

    if (existing) {
      existing.quantity += 1
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: Number(product.price),
        image: product.images[0] || null,
        quantity: 1,
      })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    window.dispatchEvent(new Event("cartUpdated"))
    toast.success("Added to cart!")
    if (onAddToCart) onAddToCart(product)
  }

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
        {/* Image */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Package className="h-16 w-16 text-gray-200" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.isFeatured && (
              <span className="bg-gray-950 text-amber-400 text-xs font-medium px-2 py-1 rounded-full">
                Featured
              </span>
            )}
            {discount && (
              <span className="bg-amber-400 text-gray-950 text-xs font-medium px-2 py-1 rounded-full">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Add to cart overlay */}
          <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              className="w-full bg-gray-950 hover:bg-amber-400 text-white hover:text-gray-950 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-200"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-amber-600 font-medium mb-1 uppercase tracking-wide">
            {product.category.name}
          </p>
          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full">
              {product.gender}
            </span>
            {product.volume && (
              <span className="text-xs text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full">
                {product.volume}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900 text-lg">
                Rs. {Number(product.price).toLocaleString()}
              </p>
              {product.comparePrice && (
                <p className="text-xs text-gray-400 line-through">
                  Rs. {Number(product.comparePrice).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}