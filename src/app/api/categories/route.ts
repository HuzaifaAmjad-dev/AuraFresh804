import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { categories } from "@/lib/schema"
import { desc, eq } from "drizzle-orm"
import { createId } from "@paralleldrive/cuid2"
import slugify from "slugify"
import { z } from "zod"

export const dynamic = "force-dynamic"

const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional(),
})

export async function GET() {
  const result = await db.query.categories.findMany({
    with: { products: true },
    orderBy: [desc(categories.createdAt)],
  })

  const withCount = result.map((c) => ({
    ...c,
    _count: { products: c.products.length },
    products: undefined,
  }))

  return NextResponse.json(withCount)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const parsed = categorySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    const slug = slugify(parsed.data.name, { lower: true, strict: true })
    const id = createId()

    await db.insert(categories).values({
      id,
      name: parsed.data.name,
      description: parsed.data.description,
      image: parsed.data.image,
      slug,
    })

    const category = await db.query.categories.findFirst({
      where: (c, { eq }) => eq(c.id, id),
    })

    return NextResponse.json(category)
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create category", details: error.message },
      { status: 500 }
    )
  }
}