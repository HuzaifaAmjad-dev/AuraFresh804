import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { products } from "@/lib/schema"
import { desc } from "drizzle-orm"
import { createId } from "@paralleldrive/cuid2"
import slugify from "slugify"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const result = await db.query.products.findMany({
      with: { category: true },
      orderBy: [desc(products.createdAt)],
    })
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Products GET error:", error)
    return NextResponse.json({ error: "Failed to fetch products", details: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const slug = slugify(body.name, { lower: true, strict: true })
    const id = createId()

    await db.insert(products).values({
      id,
      name: body.name,
      slug,
      description: body.description,
      price: parseFloat(body.price).toString(),
      comparePrice: body.comparePrice ? parseFloat(body.comparePrice).toString() : null,
      images: body.images || [],
      stock: parseInt(body.stock) || 0,
      isActive: body.isActive ?? true,
      isFeatured: body.isFeatured ?? false,
      categoryId: body.categoryId,
      volume: body.volume || null,
      gender: body.gender || "UNISEX",
      topNotes: body.topNotes || [],
      middleNotes: body.middleNotes || [],
      baseNotes: body.baseNotes || [],
      occasion: body.occasion || null,
      season: body.season || null,
      createdAt: new Date(),  // 👈 add
      updatedAt: new Date(),  // 👈 add
    })

    const product = await db.query.products.findFirst({
      where: (p, { eq }) => eq(p.id, id),
    })

    return NextResponse.json(product)
  } catch (error: any) {
    console.error("Products POST error:", error)
    return NextResponse.json(
      { error: "Failed to create product", details: error.message },
      { status: 500 }
    )
  }
}