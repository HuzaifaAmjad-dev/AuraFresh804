import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { products } from "@/lib/schema"
import { eq } from "drizzle-orm"
import slugify from "slugify"

export const dynamic = "force-dynamic"

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const product = await db.query.products.findFirst({
      where: (p, { eq }) => eq(p.id, id),
      with: { category: true },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error: any) {
    console.error("Product GET [id] error:", error)
    return NextResponse.json({ error: "Failed to fetch product", details: error.message }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const slug = slugify(body.name, { lower: true, strict: true })

    await db.update(products)
      .set({
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
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))

    const product = await db.query.products.findFirst({
      where: (p, { eq }) => eq(p.id, id),
    })

    return NextResponse.json(product)
  } catch (error: any) {
    console.error("Product PUT error:", error)
    return NextResponse.json(
      { error: "Failed to update product", details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await db.delete(products).where(eq(products.id, id))

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Product DELETE error:", error)
    return NextResponse.json({ error: "Failed to delete product", details: error.message }, { status: 500 })
  }
}