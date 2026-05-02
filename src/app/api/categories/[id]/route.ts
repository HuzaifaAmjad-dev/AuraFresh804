import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import slugify from "slugify"

export const dynamic = "force-dynamic"

/* =========================
   GET SINGLE CATEGORY
========================= */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: true },
    })

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    )
  }
}

/* =========================
   UPDATE CATEGORY
========================= */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    const slug = slugify(body.name, { lower: true, strict: true })

    const updated = await prisma.category.update({
      where: { id },
      data: {
        ...body,
        slug,
      },
    })

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    )
  }
}

/* =========================
   DELETE CATEGORY
========================= */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.category.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    )
  }
}