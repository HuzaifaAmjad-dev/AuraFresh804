export const dynamic = "force-dynamic"

import { db } from "@/lib/db"
import { products } from "@/lib/schema"
import { eq, and, desc } from "drizzle-orm"
import HomeClient from "./Homeclient"

async function getFeaturedProducts() {
  return db.query.products.findMany({
    where: (p, { eq, and }) => and(eq(p.isActive, true), eq(p.isFeatured, true)),
    with: { category: true },
    limit: 8,
    orderBy: [desc(products.createdAt)],
  })
}

async function getCategories() {
  const result = await db.query.categories.findMany({
    with: { products: true },
    limit: 6,
  })

  return result.map((c) => ({
    ...c,
    _count: { products: c.products.length },
    products: undefined,
  }))
}

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ])

  return (
    <HomeClient
      featuredProducts={featuredProducts}
      categories={categories}
    />
  )
}