import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
export const dynamic = "force-dynamic"
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true },
        },
        statusLogs: {
          orderBy: { createdAt: "desc" },
        },
      },
    })
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(order)
  } catch {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: body.status,
        paymentStatus: body.paymentStatus,
      },
    })

    // Log status change
    await prisma.orderStatusLog.create({
      data: {
        orderId: id,
        status: body.status,
        note: body.note || null,
      },
    })

    return NextResponse.json(order)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
