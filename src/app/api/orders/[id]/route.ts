import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { prisma } = await import("@/lib/prisma")

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
      statusLogs: {
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  return NextResponse.json(order)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { prisma } = await import("@/lib/prisma")

    const body = await req.json()

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: body.status,
        paymentStatus: body.paymentStatus,
      },
    })

    await prisma.orderStatusLog.create({
      data: {
        orderId: id,
        status: body.status,
        note: body.note || null,
      },
    })

    return NextResponse.json(order)
  } catch {
    return NextResponse.json(
      { error: "Failed to update order" },
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
    const { prisma } = await import("@/lib/prisma")

    await prisma.order.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    )
  }
}