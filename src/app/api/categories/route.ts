import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import slugify from "slugify"

const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional(),
})

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(categories)
  } catch {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = categorySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    const slug = slugify(parsed.data.name, { lower: true, strict: true })

    const category = await prisma.category.create({
      data: { ...parsed.data, slug },
    })

    return NextResponse.json(category)
  } catch {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}