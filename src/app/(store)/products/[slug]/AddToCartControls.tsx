"use client"

import { useState } from "react"
import { ShoppingBag, Zap, Minus, Plus, Heart } from "lucide-react"
import { toast } from "sonner"

type Product = {
  id: string | number
  name: string
  price?: string | number
  images?: string[] | null
  [key: string]: unknown
}

interface Props {
  product: Product
  priceDisplay: string
}

export default function AddToCartControls({ product, priceDisplay }: Props) {
  const [qty, setQty] = useState(1)
  const [wishlist, setWishlist] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [selectedSize, setSelectedSize] = useState(1) // index of default size

  function changeQty(delta: number) {
    setQty((prev) => Math.max(1, Math.min(99, prev + delta)))
  }

  function addToCart(e?: React.MouseEvent) {
    e?.preventDefault()
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

  function buyNow(e?: React.MouseEvent) {
    e?.preventDefault()
    addToCart(e)
    window.location.href = "/cart"
  }

  return (
    <div className="space-y-5">

      {/* SIZE SELECTOR */}
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-medium mb-2.5">
          Size / Volume
        </p>
        <div className="flex gap-2 flex-wrap">
          {["30 ml", "50 ml", "100 ml"].map((size, i) => (
            <button
              key={size}
              onClick={() => setSelectedSize(i)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-150 ${
                selectedSize === i
                  ? "border-[#1A1108] bg-[#1A1108] text-white"
                  : "border-stone-200 bg-white text-stone-600 hover:border-stone-400"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* QUANTITY SELECTOR */}
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
            disabled={qty >= 99}
            className="w-11 h-11 flex items-center justify-center text-stone-500 hover:bg-stone-50 transition-colors disabled:opacity-30"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-3 flex-wrap">
        {/* Add to Cart */}
        <button
          onClick={addToCart}
          className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 py-4 px-6 rounded-full border-2 font-semibold text-sm transition-all duration-200 ${
            addedToCart
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-[#1A1108] bg-white text-[#1A1108] hover:bg-stone-50"
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          {addedToCart ? "Added ✓" : "Add to Cart"}
        </button>

        {/* Buy Now */}
        <button
          onClick={buyNow}
          className="flex-1 min-w-[160px] flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-[#1A1108] text-white font-semibold text-sm hover:bg-stone-800 transition-colors duration-200 shadow-lg shadow-stone-900/20"
        >
          <Zap className="h-4 w-4 fill-yellow-300 text-yellow-300" />
          Buy Now
        </button>

        {/* Wishlist */}
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

      {/* SUBTOTAL HINT */}
      {qty > 1 && (
        <p className="text-xs text-stone-500 pl-1">
          Subtotal for {qty} bottles:{" "}
          <span className="text-stone-800 font-semibold">{priceDisplay} × {qty}</span>
        </p>
      )}
    </div>
  )
}