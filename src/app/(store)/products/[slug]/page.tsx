import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { serializeProduct } from "@/lib/serialize"
import ProductImageGallery from "./ProductImageGallery"

export const dynamic = "force-dynamic"

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  })

  if (!product) return null
  return serializeProduct(product)
}

type Props = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props) {
  const product = await getProduct(params.slug)

  if (!product) return {}

  return {
    title: `${product.name} | AuraFresh`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images ?? [],
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProduct(params.slug)

  if (!product || !product.isActive) notFound()

  const images: string[] = product.images || []

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-2 gap-12">

        <ProductImageGallery
          images={images}
          productName={product.name}
        />

        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <p className="text-gray-600">
            {product.description}
          </p>
        </div>

      </div>
    </div>
  )
}