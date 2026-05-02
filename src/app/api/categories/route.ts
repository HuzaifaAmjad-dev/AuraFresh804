import { NextRequest, NextResponse } from "next/server"
import slugify from "slugify"
import { z } from "zod"

export const dynamic = "force-dynamic"

const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional(),
})

/* =========================
   GET ALL CATEGORIES
========================= */
export async function GET() {
  const { prisma } = await import("@/lib/prisma")

  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(categories)
}

/* =========================
   CREATE CATEGORY
========================= */
export async function POST(req: NextRequest) {
  try {
    const { prisma } = await import("@/lib/prisma")

    const body = await req.json()

    const parsed = categorySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    const slug = slugify(parsed.data.name, { lower: true, strict: true })

    const category = await prisma.category.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description,
        image: parsed.data.image,
        slug,
      },
    })

    return NextResponse.json(category)
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create category", details: error.message },
      { status: 500 }
    )
  }
}