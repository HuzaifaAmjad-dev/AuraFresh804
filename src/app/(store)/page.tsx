import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/store/ProductCard"
import { Sparkles, Truck, Shield, RefreshCw } from "lucide-react"

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: { category: true },
    take: 8,
    orderBy: { createdAt: "desc" },
  })
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
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-purple-300" />
              <span className="text-purple-300 text-sm font-medium">
                Premium Fragrances
              </span>
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Discover Your
              <span className="text-purple-300"> Signature</span> Scent
            </h1>
            <p className="text-lg text-purple-200 mb-8">
              Explore our exclusive collection of premium perfumes crafted for
              those who appreciate the art of fragrance.
            </p>
            <div className="flex gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-white text-purple-900 hover:bg-purple-50">
                  Shop Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Truck, title: "Free Delivery", desc: "Free shipping on orders over Rs. 3000" },
              { icon: Shield, title: "100% Authentic", desc: "All products are genuine and certified" },
              { icon: RefreshCw, title: "Easy Returns", desc: "7 day hassle free return policy" },
            ].map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-500">{feature.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
              <p className="text-gray-500 mt-2">Find your perfect fragrance</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {(categories as any[]).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="group bg-white border border-gray-100 rounded-xl p-4 text-center hover:border-purple-200 hover:shadow-md transition-all"
                >
                  <div className="bg-purple-50 rounded-lg p-4 mb-3 group-hover:bg-purple-100 transition-colors">
                    <Sparkles className="h-8 w-8 text-purple-600 mx-auto" />
                  </div>
                  <p className="font-medium text-gray-900 text-sm">{cat.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {cat._count.products} products
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
                <p className="text-gray-500 mt-2">Our most loved fragrances</p>
              </div>
              <Link href="/products">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product:any) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-purple-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Scent?</h2>
          <p className="text-purple-200 mb-8 max-w-xl mx-auto">
            Browse our full collection of premium perfumes and find the one that speaks to you.
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-white text-purple-900 hover:bg-purple-50">
              Shop All Perfumes
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}