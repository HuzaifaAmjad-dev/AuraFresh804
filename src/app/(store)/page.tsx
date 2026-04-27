import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/store/ProductCard"
import { serializeProducts } from "@/lib/serialize"
import { Sparkles, Truck, Shield, RefreshCw, ArrowRight } from "lucide-react"
import HeroCarousel from "@/components/store/HeroCarousel"

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: { category: true },
    take: 8,
    orderBy: { createdAt: "desc" },
  })
  return serializeProducts(products)
}

async function getCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    take: 6,
  })
}

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ])

  return (
    <div className="bg-white">
<HeroCarousel />
      {/* Hero Section */}
      <section className="relative bg-gray-950 overflow-hidden min-h-[90vh] flex items-center">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-amber-400 blur-3xl" />
          <div className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-amber-600 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-yellow-300 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-amber-400" />
              <span className="text-amber-400 text-sm font-medium tracking-widest uppercase">
                Premium Collection
              </span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              The Art of
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">
                Fine Fragrance
              </span>
            </h1>
            <p className="text-lg text-gray-400 mb-10 max-w-xl leading-relaxed">
              Explore our curated collection of luxury perfumes. Each scent tells
              a story — find the one that speaks to your soul.
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
      </section>

      {/* Features Strip */}
      <section className="bg-amber-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-amber-500">
            {[
              { icon: Truck, title: "Free Delivery", desc: "On orders over Rs. 3,000" },
              { icon: Shield, title: "100% Authentic", desc: "Genuine certified products" },
              { icon: RefreshCw, title: "Easy Returns", desc: "7 day return policy" },
            ].map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="flex items-center gap-4 py-5 px-8">
                  <Icon className="h-6 w-6 text-gray-950 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-950 text-sm">{feature.title}</h3>
                    <p className="text-xs text-amber-800">{feature.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="h-px w-10 bg-amber-400" />
                <span className="text-amber-600 text-xs font-medium tracking-widest uppercase">
                  Collections
                </span>
                <div className="h-px w-10 bg-amber-400" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900">Shop by Category</h2>
              <p className="text-gray-500 mt-3 text-lg">Find your perfect fragrance family</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {(categories as any[]).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="group bg-white border border-gray-200 rounded-2xl p-5 text-center hover:border-amber-400 hover:shadow-lg hover:shadow-amber-100 transition-all duration-300"
                >
                  <div className="bg-gray-950 rounded-xl p-4 mb-3 group-hover:bg-amber-400 transition-colors duration-300">
                    <Sparkles className="h-7 w-7 text-amber-400 group-hover:text-gray-950 mx-auto transition-colors duration-300" />
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{cat.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{cat._count.products} products</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px w-10 bg-amber-400" />
                  <span className="text-amber-600 text-xs font-medium tracking-widest uppercase">
                    Featured
                  </span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900">Best Sellers</h2>
                <p className="text-gray-500 mt-2 text-lg">Our most loved fragrances</p>
              </div>
              <Link href="/products">
                <Button variant="outline" className="rounded-full border-gray-900 hover:bg-gray-900 hover:text-white">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Banner Section */}
      <section className="bg-gray-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-r from-amber-900/30 to-gray-900 border border-amber-900/30 p-12 md:p-16 overflow-hidden">
            <div className="absolute top-0 right-0 h-64 w-64 bg-amber-400/10 rounded-full blur-3xl" />
            <div className="relative max-w-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-10 bg-amber-400" />
                <span className="text-amber-400 text-xs font-medium tracking-widest uppercase">
                  Limited Edition
                </span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Discover Your
                <span className="text-amber-400"> Signature</span> Scent
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Every great story begins with a scent. Browse our exclusive
                collection and find the fragrance that defines you.
              </p>
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-amber-400 hover:bg-amber-500 text-gray-950 font-semibold rounded-full px-8"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}