import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

/* =========================
   GET ALL CUSTOMERS
========================= */
export async function GET() {
  const { prisma } = await import("@/lib/prisma")

  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      _count: { select: { orders: true } },
      orders: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(customers)
}