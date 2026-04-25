import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  const { order } = await searchParams

  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle className="h-20 w-20 text-green-500" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Order Placed!
      </h1>
      <p className="text-gray-500 mb-2">
        Thank you for your order. We will process it shortly.
      </p>
      {order && (
        <p className="text-purple-600 font-semibold text-lg mb-8">
          Order Number: {order}
        </p>
      )}
      <p className="text-sm text-gray-400 mb-8">
        You will receive a confirmation soon. Our team will contact you
        for delivery details.
      </p>
      <div className="flex gap-4 justify-center">
        <Link href="/products">
          <Button className="bg-purple-600 hover:bg-purple-700">
            Continue Shopping
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline">Go Home</Button>
        </Link>
      </div>
    </div>
  )
}