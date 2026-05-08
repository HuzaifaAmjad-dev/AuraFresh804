type Props = {
  searchParams: Promise<{ order?: string }>
}

export default async function OrderSuccessPage({ searchParams }: Props) {
  const params = await searchParams
  const order = params?.order

  return (
    <div className="max-w-3xl mx-auto py-20 text-center">
      <h1 className="text-3xl font-bold">Order Successful 🎉</h1>

      <p className="mt-4 text-gray-600">
        Order ID: {order ?? "N/A"}
      </p>
    </div>
  )
}