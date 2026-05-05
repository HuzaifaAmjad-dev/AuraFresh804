import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyToken } from "@/lib/auth"

type UserToken = {
  id: string
  email: string
  role?: string
}

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    redirect("/login")
  }

  const user = (await verifyToken(token)) as UserToken

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-10">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">

        <h1 className="text-2xl font-bold">
          Welcome to your Dashboard 👋
        </h1>

        <p className="mt-3 text-gray-600">
          Logged in as: <b>{user.email}</b>
        </p>

        <div className="mt-6 grid gap-4">
          <a href="/my-orders" className="p-4 border rounded-lg hover:bg-gray-50">
            📦 My Orders
          </a>

          <a href="/products" className="p-4 border rounded-lg hover:bg-gray-50">
            🛍 Continue Shopping
          </a>
        </div>
      </div>
    </div>
  )
}