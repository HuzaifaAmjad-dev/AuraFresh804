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
    <div className="space-y-4">

      {/* MAIN IMAGE */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50">
        {images.length > 0 ? (
          <Image
            src={getImageUrl(images[active])}
            alt={productName}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package className="h-24 w-24 text-gray-200" />
          </div>
        )}
      </div>

      {/* THUMBNAILS */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative aspect-square rounded-lg overflow-hidden border ${
                active === i ? "border-purple-600" : "border-gray-200"
              }`}
            >
              <Image
                src={getImageUrl(img)}
                alt={`${productName} ${i + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}