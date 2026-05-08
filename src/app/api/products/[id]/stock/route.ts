import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const body = await req.json()

    // your update logic here
    // example:
    // await db.update(...)

    return NextResponse.json({
      success: true,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}