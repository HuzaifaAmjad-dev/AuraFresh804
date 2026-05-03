import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { categories } from "@/lib/schema"
import { eq } from "drizzle-orm"
import slugify from "slugify"

export const dynamic = "force-dynamic"

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const category = await db.query.categories.findFirst({
      where: (c, { eq }) => eq(c.id, id),
      with: { products: true },
    })

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error: any) {
    console.error("Category GET [id] error:", error)
    return NextResponse.json({ error: "Failed to fetch category", details: error.message }, { status: 500 })
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

    await db.update(categories)
      .set({ ...body, slug, updatedAt: new Date() })
      .where(eq(categories.id, id))

    const updated = await db.query.categories.findFirst({
      where: (c, { eq }) => eq(c.id, id),
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error("Category PUT error:", error)
    return NextResponse.json({ error: "Failed to update category", details: error.message }, { status: 500 })
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await db.delete(categories).where(eq(categories.id, id))

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Category DELETE error:", error)
    return NextResponse.json({ error: "Failed to delete category", details: error.message }, { status: 500 })
  }
}