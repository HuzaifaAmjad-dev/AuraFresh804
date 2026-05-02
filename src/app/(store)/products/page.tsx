import { db } from "@/lib/db"
import { products } from "@/lib/schema"
import { desc } from "drizzle-orm"
import ProductCard from "@/components/store/ProductCard"
import { Package } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

async function getProducts(category?: string) {
  const result = await db.query.products.findMany({
    where: (p, { eq }) => eq(p.isActive, true),
    with: { category: true },
    orderBy: [desc(products.createdAt)],
  })

  if (!category) return result
  return result.filter((p) => p.category?.slug === category)
}

async function getCategories() {
  return db.query.categories.findMany({
    orderBy: (c, { asc }) => [asc(c.name)],
  })
}

export const metadata = {
  title: "All Perfumes | AuraFresh",
  description: "Browse our exclusive collection of premium perfumes.",
}

type Props = {
  searchParams: { category?: string }
}

export default async function ProductsPage({ searchParams }: Props) {
  const { category } = searchParams

  const [productList, categoryList] = await Promise.all([
    getProducts(category),
    getCategories(),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">All Perfumes</h1>

      <div className="flex gap-2 flex-wrap mb-8">
        <Link
          href="/products"
          className={`px-4 py-2 rounded-full ${
            !category ? "bg-black text-white" : "bg-gray-100"
          }`}
        >
          All
        </Link>

        {categoryList.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className={`px-4 py-2 rounded-full ${
              category === cat.slug ? "bg-black text-white" : "bg-gray-100"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {productList.length === 0 ? (
        <div className="text-center py-20">
          <Package className="mx-auto mb-3" />
          <p>No products found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}