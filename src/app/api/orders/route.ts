import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

/* =========================
   GET ALL ORDERS
========================= */
export async function GET() {
  const { prisma } = await import("@/lib/prisma")

  const orders = await prisma.order.findMany({
    include: {
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(orders)
}

/* =========================
   CREATE ORDER
========================= */
export async function POST(req: NextRequest) {
  try {
    const { prisma } = await import("@/lib/prisma")

    const body = await req.json()

    const orderNumber = `AF-${Date.now()}`

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        address: body.address,
        city: body.city,
        province: body.province,
        postalCode: body.postalCode || null,
        subtotal: body.subtotal,
        shippingCost: body.shippingCost || 0,
        total: body.total,
        notes: body.notes || null,
        paymentMethod: body.paymentMethod || "COD",

        items: {
          create: body.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
      },
    })

    return NextResponse.json(order)
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create order", details: error.message },
      { status: 500 }
    )
  }
}