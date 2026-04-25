"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
    ? Math.round(((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100)
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
      <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
        {/* Image */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Package className="h-16 w-16 text-gray-200" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isFeatured && (
              <Badge className="bg-purple-600 text-xs">Featured</Badge>
            )}
            {discount && (
              <Badge className="bg-red-500 text-xs">{discount}% OFF</Badge>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-gray-500 mb-1">{product.category.name}</p>
          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs">{product.gender}</Badge>
            {product.volume && (
              <Badge variant="outline" className="text-xs">{product.volume}</Badge>
            )}
          </div>
          <div className="flex items-center justify-between mt-3">
            <div>
              <p className="font-bold text-gray-900">
                Rs. {Number(product.price).toLocaleString()}
              </p>
              {product.comparePrice && (
                <p className="text-xs text-gray-400 line-through">
                  Rs. {Number(product.comparePrice).toLocaleString()}
                </p>
              )}
            </div>
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}