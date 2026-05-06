"use client"

import { useState } from "react"
import { ShoppingBag, Zap, Minus, Plus, Heart } from "lucide-react"
import { toast } from "sonner"

type Product = {
  id: string | number
  name: string
  price?: string | number
  stock?: number | null
  images?: string[] | null
  [key: string]: unknown
}

interface Props {
  product: Product
  priceDisplay: string
}

export default function AddToCartControls({ product, priceDisplay }: Props) {
  const initialStock = typeof product.stock === "number" ? product.stock : 99
  const [stock, setStock] = useState(initialStock)
  const [qty, setQty] = useState(1)
  const [wishlist, setWishlist] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const outOfStock = stock === 0
  const lowStock = stock > 0 && stock <= 5

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
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existing = cart.find((item: any) => item.id === product.id)
    if (existing) {
      existing.quantity += qty
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: images[0],
        quantity: qty,
      })
    }
    localStorage.setItem("cart", JSON.stringify(cart))
    window.dispatchEvent(new Event("cartUpdated"))
    toast.success(`Added ${qty} × ${product.name} to cart!`)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
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

      {/* STOCK BADGE */}
      {lowStock && (
        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-sm shadow-amber-100">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
          <p className="text-base font-bold text-amber-700 tracking-wide">
            Only <span className="text-amber-900 text-lg">{stock}</span> left in stock — order soon!
          </p>
        </div>
      )}
      {outOfStock && (
        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-red-50 border-2 border-red-300 shadow-sm shadow-red-100">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500 flex-shrink-0" />
          <p className="text-base font-bold text-red-700 tracking-wide">
            Out of Stock
          </p>
        </div>
      )}

      {/* QUANTITY SELECTOR */}
      {!outOfStock && (
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-medium mb-2.5">
            Quantity
          </p>
          <div className="inline-flex items-center border border-stone-200 rounded-full overflow-hidden bg-white">
            <button
              onClick={() => changeQty(-1)}
              disabled={qty <= 1}
              className="w-11 h-11 flex items-center justify-center text-stone-500 hover:bg-stone-50 transition-colors disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center text-sm font-semibold text-stone-800 select-none">
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
          <p className="text-[11px] text-stone-500 font-semibold mt-1.5 pl-1">
            {stock} in stock
          </p>
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={addToCart}
          disabled={outOfStock}
          className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 py-4 px-6 rounded-full border-2 font-semibold text-sm transition-all duration-200 ${
            outOfStock
              ? "border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed"
              : addedToCart
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-[#1A1108] bg-white text-[#1A1108] hover:bg-stone-50"
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          {outOfStock ? "Out of Stock" : addedToCart ? "Added ✓" : "Add to Cart"}
        </button>

        <button
          onClick={buyNow}
          disabled={outOfStock}
          className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 py-4 px-6 rounded-full font-semibold text-sm transition-colors duration-200 shadow-lg shadow-stone-900/20 ${
            outOfStock
              ? "bg-stone-300 text-stone-400 cursor-not-allowed"
              : "bg-[#1A1108] text-white hover:bg-stone-800"
          }`}
        >
          <Zap className="h-4 w-4 fill-yellow-300 text-yellow-300" />
          Buy Now
        </button>

        <button
          onClick={() => setWishlist((w) => !w)}
          aria-label="Toggle wishlist"
          className={`w-14 h-14 flex items-center justify-center rounded-full border-2 transition-all duration-200 ${
            wishlist
              ? "border-rose-400 bg-rose-50 text-rose-500"
              : "border-stone-200 bg-white text-stone-400 hover:border-stone-300"
          }`}
        >
          <Heart className={`h-5 w-5 ${wishlist ? "fill-rose-400" : ""}`} />
        </button>
      </div>

      {qty > 1 && !outOfStock && (
        <p className="text-xs text-stone-500 pl-1">
          Subtotal for {qty} bottles:{" "}
          <span className="text-stone-800 font-semibold">{priceDisplay} × {qty}</span>
        </p>
      )}
    </div>
  )
}