import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/store/ProductCard"
import { Package } from "lucide-react"

async function getProducts(category?: string) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      ...(category ? { category: { slug: category } } : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  })
}

async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  })
}
export const metadata = {
  title: "All Perfumes | AuraFresh",
  description: "Browse our exclusive collection of premium perfumes for men and women.",
  openGraph: {
    title: "All Perfumes | AuraFresh",
    description: "Browse our exclusive collection of premium perfumes.",
  },
}
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams

  const [products, categories] = await Promise.all([
    getProducts(category),
    getCategories(),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Perfumes</h1>
        <p className="text-gray-500 mt-2">{products.length} products available</p>
      </div>

      <div className="flex gap-2 flex-wrap mb-8">
        <a href="/products" className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!category ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
          All
        </a>
        {categories.map((cat: any) => (
          <a key={cat.id} href={`/products?category=${cat.slug}`} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === cat.slug ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {cat.name}
          </a>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24">
          <Package className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      )}
    </div>
  )
}
