import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/store/ProductCard"
import { Package } from "lucide-react"
import { serializeProducts } from "@/lib/serialize"

export const dynamic = "force-dynamic"

async function getProducts(category?: string) {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(category ? { category: { slug: category } } : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  })

  return serializeProducts(products)
}

async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  })
}

export const metadata = {
  title: "All Perfumes | AuraFresh",
  description: "Browse our exclusive collection of premium perfumes.",
}

type Props = {
  searchParams: {
    category?: string
  }
}

export default async function ProductsPage({ searchParams }: Props) {
  const category = searchParams?.category

  const [products, categories] = await Promise.all([
    getProducts(category),
    getCategories(),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">

      <h1 className="text-3xl font-bold mb-6">
        All Perfumes
      </h1>

      {/* FILTERS */}
      <div className="flex gap-2 flex-wrap mb-8">
        <a
          href="/products"
          className={`px-4 py-2 rounded-full ${
            !category ? "bg-black text-white" : "bg-gray-100"
          }`}
        >
          All
        </a>

        {categories.map((cat: any) => (
          <a
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className={`px-4 py-2 rounded-full ${
              category === cat.slug
                ? "bg-black text-white"
                : "bg-gray-100"
            }`}
          >
            {cat.name}
          </a>
        ))}
      </div>

      {/* PRODUCTS */}
      {products.length === 0 ? (
        <div className="text-center py-20">
          <Package className="mx-auto mb-3" />
          No products found
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
 )
}