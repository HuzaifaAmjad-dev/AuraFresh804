"use client"

import { useState } from "react"
import { ShoppingBag, Zap, Minus, Plus, Heart } from "lucide-react"
import { toast } from "sonner"

type Product = {
  id: string | number
  name: string
  slug?: string
  price?: string | number
  stock?: number | null
  images?: string[] | null
  [key: string]: unknown
}

interface Props {
  product: Product  // ✅ not nullable — page.tsx already guards with notFound()
  priceDisplay: string
}

function getCart(): any[] {
  try {
    const stored = localStorage.getItem("cart")
    if (!stored) return []
    return JSON.parse(stored) ?? []
  } catch {
    return []
  }
}

export default function AddToCartControls({ product, priceDisplay }: Props) {
  const initialStock =
    product.stock != null && typeof product.stock === "number"
      ? product.stock
      : 0

  const [stock, setStock] = useState(initialStock)
  const [qty, setQty] = useState(1)
  const [wishlist, setWishlist] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const outOfStock = stock === 0

  function changeQty(delta: number) {
    setQty((prev) => Math.max(1, Math.min(stock, prev + delta)))
  }

  async function decrementStock(quantityBought: number) {
    try {
      await fetch(`/api/products/${product.id}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decrement: quantityBought }),
      })
      setStock((prev) => Math.max(0, prev - quantityBought))
    } catch (err) {
      console.error("Failed to decrement stock", err)
    }
  }

  function addToCart(e?: React.MouseEvent) {
    e?.preventDefault()
    if (outOfStock) return

    const images = (product.images as string[]) || []
    const cart = getCart()
    const existing = cart.find((item: any) => item.id === product.id)

    if (existing) {
      const newQty = existing.quantity + qty
      if (newQty > stock) {
        toast.error("You've reached the maximum available quantity for this item.")
        return
      }
      existing.quantity = newQty
      existing.stock = stock
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: images[0],
        quantity: qty,
        stock,
      })
    }

    try {
      localStorage.setItem("cart", JSON.stringify(cart))
    } catch {
      toast.error("Could not save cart. Storage may be full.")
      return
    }

    window.dispatchEvent(new Event("cartUpdated"))
    toast.success(`Added ${qty} × ${product.name} to cart!`)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2500)
  }

  async function buyNow(e?: React.MouseEvent) {
    e?.preventDefault()
    if (outOfStock) return
    addToCart(e)
    await decrementStock(qty)
    window.location.href = "/cart"
  }

  return (
    <div className="space-y-5">
      {outOfStock && (
        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-red-50 border-2 border-red-200">
          <span className="h-2 w-2 rounded-full bg-red-400 flex-shrink-0" />
          <p className="text-sm font-semibold text-red-600">Currently unavailable</p>
        </div>
      )}

      {!outOfStock && (
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-medium mb-2.5">
            Quantity
          </p>
          <div className="inline-flex items-center border-2 border-stone-200 rounded-full overflow-hidden bg-white">
            <button
              onClick={() => changeQty(-1)}
              disabled={qty <= 1}
              className="w-11 h-11 flex items-center justify-center text-stone-500 hover:bg-stone-50 transition-colors disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center text-sm font-bold text-stone-800 select-none">
              {qty}
            </span>
            <button
              onClick={() => changeQty(1)}
              disabled={qty >= stock}
              className="w-11 h-11 flex items-center justify-center text-stone-500 hover:bg-stone-50 transition-colors disabled:opacity-30"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {qty > 1 && (
            <p className="text-[11px] text-stone-400 mt-1.5 pl-1">
              {qty} bottles ·{" "}
              <span className="text-stone-600 font-semibold">{priceDisplay} each</span>
            </p>
          )}
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        <button
          onClick={addToCart}
          disabled={outOfStock}
          className={`
            flex-1 min-w-[160px] flex items-center justify-center gap-2.5
            py-4 px-6 rounded-full font-bold text-sm tracking-wide
            transition-all duration-300
            ${
              outOfStock
                ? "bg-stone-100 text-stone-400 cursor-not-allowed border-2 border-stone-200"
                : addedToCart
                ? "bg-emerald-500 text-white"
                : "bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400 text-white shadow-lg shadow-amber-200 hover:brightness-105 active:scale-[0.98]"
            }
          `}
        >
          <ShoppingBag className="h-4 w-4 flex-shrink-0" />
          {outOfStock ? "Unavailable" : addedToCart ? "Added to Cart ✓" : "Add to Cart"}
        </button>

        <button
          onClick={buyNow}
          disabled={outOfStock}
          className={`
            flex-1 min-w-[160px] flex items-center justify-center gap-2.5
            py-4 px-6 rounded-full font-bold text-sm tracking-wide
            transition-all duration-200
            ${
              outOfStock
                ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                : "bg-[#1A1108] text-white hover:bg-stone-800 active:scale-[0.98]"
            }
          `}
        >
          <Zap className="h-4 w-4 fill-yellow-300 text-yellow-300 flex-shrink-0" />
          Buy Now
        </button>

        <button
          onClick={() => setWishlist((w) => !w)}
          aria-label="Toggle wishlist"
          className={`
            w-14 h-14 flex items-center justify-center rounded-full border-2
            transition-all duration-200
            ${
              wishlist
                ? "border-rose-300 bg-rose-50 text-rose-500"
                : "border-stone-200 bg-white text-stone-400 hover:border-rose-200 hover:text-rose-400"
            }
          `}
        >
          <Heart className={`h-5 w-5 transition-all ${wishlist ? "fill-rose-400 scale-110" : ""}`} />
        </button>
      </div>
    </div>
  )
}