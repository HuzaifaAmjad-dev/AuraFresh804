import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import slugify from "slugify"

// GET ALL PRODUCTS
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(products)
  } catch (error: any) {
    console.error("GET PRODUCTS ERROR:", error)

    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message },
      { status: 500 }
    )
  }
}

// CREATE PRODUCT
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const slug = slugify(body.name, { lower: true, strict: true })

    const product = await prisma.product.create({
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
  } catch (error: any) {
    console.error("CREATE PRODUCT ERROR:", error)

    return NextResponse.json(
      { error: "Failed to create product", details: error.message },
      { status: 500 }
    )
  }
}