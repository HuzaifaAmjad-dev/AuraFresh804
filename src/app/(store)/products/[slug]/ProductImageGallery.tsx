"use client"

import { useState, useRef } from "react"
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
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 })
  const [showLens, setShowLens] = useState(false)
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0 })
  const imgRef = useRef<HTMLDivElement>(null)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!imgRef.current) return
    const rect = imgRef.current.getBoundingClientRect()

    // percentage for background-position
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setLensPos({ x, y })

    // position panel near cursor but offset so it doesn't block view
    setPanelPos({
      top: e.clientY - 120,
      left: e.clientX + 20,
    })
  }

  return (
    <div className="space-y-3 select-none">

      {/* MAIN IMAGE */}
      <div
        ref={imgRef}
        className="relative aspect-square rounded-3xl overflow-hidden bg-[#F5F2EE] border border-stone-100 cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setShowLens(true)}
        onMouseLeave={() => setShowLens(false)}
      >
        {images.length > 0 ? (
          <>
            <Image
              src={getImageUrl(images[active])}
              alt={productName}
              fill
              className="object-contain p-6 pointer-events-none"
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

      {/* FLOATING ZOOM PANEL — fixed to viewport, follows cursor */}
      {showLens && images.length > 0 && (
        <div
          className="fixed z-50 w-56 h-56 rounded-2xl overflow-hidden border-2 border-amber-200 shadow-2xl pointer-events-none hidden lg:block"
          style={{ top: panelPos.top, left: panelPos.left }}
        >
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(${getImageUrl(images[active])})`,
              backgroundSize: "350%",
              backgroundPosition: `${lensPos.x}% ${lensPos.y}%`,
              backgroundRepeat: "no-repeat",
              backgroundColor: "#F5F2EE",
            }}
          />
        </div>
      )}

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