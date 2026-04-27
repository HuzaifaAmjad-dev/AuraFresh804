"use client"

import { useEffect, useState, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const slides = [
  {
    image: "/images/1.jpg",
    tag: "New Arrival",
    title: "The Art of",
    highlight: "Fine Fragrance",
    desc: "Explore our curated collection of luxury perfumes. Each scent tells a story — find the one that speaks to your soul.",
  },
  {
    image: "/images/2.jpg",
    tag: "Premium Collection",
    title: "Luxury Scents",
    highlight: "For Every Occasion",
    desc: "From morning freshness to evening elegance — discover perfumes crafted for every moment of your day.",
  },
  {
    image: "/images/3.jpg",
    tag: "Best Sellers",
    title: "Your Signature",
    highlight: "Awaits You",
    desc: "Thousands of customers have found their perfect scent. Your signature fragrance is just a click away.",
  },
  {
    image: "/images/4.jpg",
    tag: "Exclusive",
    title: "Crafted With",
    highlight: "Pure Passion",
    desc: "Every bottle is a masterpiece. Experience the finest ingredients sourced from around the world.",
  },
]

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    emblaApi.on("select", () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    })

    // Auto play
    const autoplay = setInterval(() => {
      emblaApi.scrollNext()
    }, 8000)

    return () => clearInterval(autoplay)
  }, [emblaApi])

  return (
    <section className="relative bg-gray-950 overflow-hidden min-h-[92vh]">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="relative flex-none w-full min-h-[92vh]"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                {/* Dark overlay */}
<div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-gray-950/30 to-transparent" />
<div className="absolute inset-0 bg-gradient-to-t from-gray-950/40 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                <div className="max-w-2xl py-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-px w-12 bg-amber-400" />
                    <span className="text-amber-400 text-sm font-medium tracking-widest uppercase">
                      {slide.tag}
                    </span>
                  </div>
                  <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 leading-tight">
                    {slide.title}
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">
                      {slide.highlight}
                    </span>
                  </h1>
                  <p className="text-lg text-gray-400 mb-10 max-w-xl leading-relaxed">
                    {slide.desc}
                  </p>
                  <div className="flex gap-4 flex-wrap">
                    <Link href="/products">
                      <Button
                        size="lg"
                        className="bg-amber-400 hover:bg-amber-500 text-gray-950 font-semibold px-8 rounded-full"
                      >
                        Explore Collection
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-10 mt-16">
                    {[
                      { value: "100+", label: "Fragrances" },
                      { value: "5K+", label: "Happy Customers" },
                      { value: "100%", label: "Authentic" },
                    ].map((stat) => (
                      <div key={stat.label}>
                        <p className="text-3xl font-bold text-amber-400">{stat.value}</p>
                        <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prev / Next buttons */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/40 hover:bg-amber-400 text-white hover:text-gray-950 flex items-center justify-center transition-all duration-200 border border-white/10 hover:border-amber-400"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/40 hover:bg-amber-400 text-white hover:text-gray-950 flex items-center justify-center transition-all duration-200 border border-white/10 hover:border-amber-400"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi && emblaApi.scrollTo(index)}
            className={`transition-all duration-300 rounded-full ${
              index === selectedIndex
                ? "w-8 h-2 bg-amber-400"
                : "w-2 h-2 bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  )
}