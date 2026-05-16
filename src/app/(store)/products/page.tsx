import { db } from "@/lib/db"
import { products, categories } from "@/lib/schema"
import { desc, eq, and, inArray } from "drizzle-orm"
import ProductCard from "@/components/store/ProductCard"
import { Package } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"
export const revalidate = 60

async function getProducts(category?: string) {
  if (!category) {
    return db.query.products.findMany({
      where: (p, { eq }) => eq(p.isActive, true),
      with: { category: true },
      orderBy: [desc(products.createdAt)],
    })
  }

  const categorySubquery = db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.slug, category))

  return db.query.products.findMany({
    where: (p) =>
      and(eq(p.isActive, true), inArray(p.categoryId, categorySubquery)),
    with: { category: true },
    orderBy: [desc(products.createdAt)],
  })
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
  searchParams: Promise<{ category?: string }>
}

export default async function ProductsPage({ searchParams }: Props) {
  const { category } = await searchParams

  const [productList, categoryList] = await Promise.all([
    getProducts(category),
    getCategories(),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">All Perfumes</h1>

      {/* Category scroll strip */}
      <div className="relative mb-10">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent z-10" />

        <div
          className="flex gap-2.5 overflow-x-auto px-2 pb-1"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <style>{`.cat-strip::-webkit-scrollbar { display: none; }`}</style>

          {/* All pill */}
          <Link
            href="/products"
            className={`
              flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold
              tracking-wide border-2 transition-all duration-200 whitespace-nowrap
              ${
                !category
                  ? "bg-amber-500 text-white border-amber-500 ring-2 ring-amber-300 ring-offset-1"
                  : "bg-white text-gray-500 border-gray-200 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50"
              }
            `}
          >
            All
          </Link>

          {categoryList.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={`
                flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold
                tracking-wide border-2 transition-all duration-200 whitespace-nowrap
                ${
                  category === cat.slug
                    ? "bg-amber-500 text-white border-amber-500 ring-2 ring-amber-300 ring-offset-1"
                    : "bg-white text-gray-500 border-gray-200 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50"
                }
              `}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Products */}
      {productList.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Package className="mx-auto mb-3 w-10 h-10" />
          <p className="text-lg">No products found</p>
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