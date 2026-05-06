"use client"

import { useState } from "react"
import Image from "next/image"
import { Package } from "lucide-react"
import { getImageUrl } from "@/lib/image"

export default function ProductImageGallery({
  images,
  productName,
}: {
  images: string[]
  productName: string
}) {
  const [active, setActive] = useState(0)

  return (
    <div className="space-y-3 select-none">

      {/* MAIN IMAGE */}
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#F5F2EE] border border-stone-100 group">
        {images.length > 0 ? (
          <>
            <Image
              src={getImageUrl(images[active])}
              alt={productName}
              fill
              className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
              priority
            />
            {images.length > 1 && (
              <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
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
              onClick={() => setActive(i)}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 bg-[#F5F2EE] ${
                active === i
                  ? "border-amber-500 shadow-md shadow-amber-200 scale-[1.03]"
                  : "border-transparent opacity-60 hover:opacity-90 hover:border-stone-300"
              }`}
            >
              <Image
                src={getImageUrl(img)}
                alt={`${productName} view ${i + 1}`}
                fill
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}

      {images.length > 1 && (
        <p className="text-center text-[10px] text-stone-300 tracking-wide md:hidden">
          Tap thumbnail to change view
        </p>
      )}
    </div>
  )
}