import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orders, orderStatusLogs } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { createId } from "@paralleldrive/cuid2"

export const dynamic = "force-dynamic"

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const order = await db.query.orders.findFirst({
    where: (o, { eq }) => eq(o.id, id),
    with: {
      items: { with: { product: true } },
      statusLogs: true,
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
    const body = await req.json()

    await db.update(orders)
      .set({
        status: body.status,
        paymentStatus: body.paymentStatus,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))

    await db.insert(orderStatusLogs).values({
      id: createId(),
      orderId: id,
      status: body.status,
      note: body.note || null,
    })

    const order = await db.query.orders.findFirst({
      where: (o, { eq }) => eq(o.id, id),
    })

    return NextResponse.json(order)
  } catch {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await db.delete(orders).where(eq(orders.id, id))

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 })
  }
}