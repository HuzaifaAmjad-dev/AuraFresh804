import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
export const dynamic = "force-dynamic"
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(orders)
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
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
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}