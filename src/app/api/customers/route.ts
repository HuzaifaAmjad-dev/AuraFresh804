import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
export const dynamic = "force-dynamic"
export async function GET() {
  try {
    const customers = await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      include: {
        _count: { select: { orders: true } },
        orders: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { total: true, createdAt: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(customers)
  } catch {
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}