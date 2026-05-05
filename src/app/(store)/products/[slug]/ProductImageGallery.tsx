"use client"

import { useState } from "react"
import Image from "next/image"
import { Package, ZoomIn } from "lucide-react"
import { getImageUrl } from "@/lib/image"

export default function ProductImageGallery({
  images,
  productName,
}: {
  images: string[]
  productName: string
}) {
  const [active, setActive] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  return (
    <div className="space-y-3 select-none">

      {/* MAIN IMAGE */}
      <div
        className="relative aspect-square rounded-3xl overflow-hidden bg-stone-100 cursor-zoom-in group"
        onClick={() => setZoomed((z) => !z)}
      >
        {images.length > 0 ? (
          <>
            <Image
              src={getImageUrl(images[active])}
              alt={productName}
              fill
              className={`object-cover transition-transform duration-500 ${
                zoomed ? "scale-125" : "scale-100 group-hover:scale-105"
              }`}
              priority
            />
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm">
                <ZoomIn className="h-4 w-4 text-stone-500" />
              </div>
            </div>
            {images.length > 1 && (
              <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
                {active + 1} / {images.length}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Package className="h-20 w-20 text-stone-200" />
            <p className="text-stone-300 text-sm">No image available</p>
          </div>
        )}
      </div>

      {/* THUMBNAILS */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => { setActive(i); setZoomed(false) }}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                active === i
                  ? "border-amber-500 shadow-md shadow-amber-200 scale-[1.03]"
                  : "border-transparent opacity-60 hover:opacity-90 hover:border-stone-300"
              }`}
            >
              <Image
                src={getImageUrl(img)}
                alt={`${productName} view ${i + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* MOBILE HINT */}
      {images.length > 1 && (
        <p className="text-center text-[10px] text-stone-300 tracking-wide md:hidden">
          Tap thumbnail to change view
        </p>
      )}
    </div>
  )
}