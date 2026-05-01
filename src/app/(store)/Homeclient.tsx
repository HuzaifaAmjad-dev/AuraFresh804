"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import ProductCard from "@/components/store/ProductCard"
import HeroCarousel from "@/components/store/HeroCarousel"
import { Button } from "@/components/ui/button"
import { ArrowRight, Truck, Shield, RefreshCw } from "lucide-react"

export default function HomeClient({
  featuredProducts,
  categories,
}: any) {
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get("category")

  return (
    <div className="bg-white">

      {/* HERO */}
      <HeroCarousel />

      {/* FEATURED */}
      {featuredProducts.length > 0 && (
        <section className="py-24 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">

            <div className="text-center mb-14">
              <p className="text-xs tracking-[0.3em] text-amber-600 uppercase">
                Featured Collection
              </p>
              <h2 className="text-4xl font-bold mt-3">
                Best Selling Perfumes
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            <div className="text-center mt-14">
              <Link href="/products">
                <Button className="rounded-full bg-black text-white px-8">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

          </div>
        </section>
      )}

      {/* FEATURES */}
      <section className="bg-amber-400">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">

            {[
              { icon: Truck, title: "Free Delivery", desc: "On orders over Rs. 3,000" },
              { icon: Shield, title: "Authentic", desc: "100% genuine products" },
              { icon: RefreshCw, title: "Easy Returns", desc: "7-day policy" },
            ].map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="flex gap-4 py-5 px-8">
                  <Icon className="h-6 w-6" />
                  <div>
                    <h3 className="font-semibold">{f.title}</h3>
                    <p className="text-sm">{f.desc}</p>
                  </div>
                </div>
              )
            })}

          </div>
        </div>
      </section>

      {/* CATEGORIES
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">

          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">Shop by Category</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat: any) => {
              const isActive = activeCategory === cat.slug

              return (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className={`px-4 py-2 rounded-full text-sm ${
                    isActive
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {cat.name}
                </Link>
              )
            })}
          </div>

        </div>
      </section> */}

    </div>
  )
}