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
    <div>
      {/* ── Page title ── */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        <h1 className="text-3xl font-bold">Shop our best selling Perfumes</h1>
      </div>

      {/* ── Full-bleed black category strip ── */}
      <div className="w-full bg-black mb-10">
        <div className="relative max-w-7xl mx-auto">
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-black to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-black to-transparent z-10" />

          <div
            className="cat-strip flex items-center gap-1.5 overflow-x-auto px-6 py-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style>{`.cat-strip::-webkit-scrollbar{display:none}`}</style>

            {/* All pill */}
            <Link
              href="/products"
              className={`
                flex-shrink-0 px-4 py-1 rounded-full text-[11px] font-bold
                tracking-widest uppercase border transition-all duration-200 whitespace-nowrap
                ${
                  !category
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white/90 border-white/40 hover:border-white/40 hover:text-white/90"
                }
              `}
            >
              All
            </Link>

            {/* Divider */}
            <span className="flex-shrink-0 h-3.5 w-px bg-white/20 mx-0.5" />

            {categoryList.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={`
                  flex-shrink-0 px-4 py-1 rounded-full text-[11px] font-bold
                  tracking-widest uppercase border transition-all duration-200 whitespace-nowrap
                  ${
                    category === cat.slug
                      ? "bg-white text-black border-white"
                      : "bg-transparent text-white/95 border-white/45 hover:border-white/40 hover:text-white/90"
                  }
                `}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Products grid ── */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
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
    </div>
  )
}