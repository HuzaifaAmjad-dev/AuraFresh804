import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import slugify from "slugify"
export const dynamic = "force-dynamic"
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    })
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(product)
  } catch {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const slug = slugify(body.name, { lower: true, strict: true })

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        slug,
        description: body.description,
        price: parseFloat(body.price),
        comparePrice: body.comparePrice ? parseFloat(body.comparePrice) : null,
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
      },
    })

    return NextResponse.json(product)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}