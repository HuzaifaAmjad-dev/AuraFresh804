import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import ProductImageGallery from "./ProductImageGallery"

export const dynamic = "force-dynamic"

async function getProduct(slug: string) {
  return db.query.products.findFirst({
    where: (p, { eq }) => eq(p.slug, slug),
    with: { category: true },
  })
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)

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
  const { slug } = await params
  const product = await getProduct(slug)

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
          <p className="text-gray-600">{product.description}</p>
        </div>
      </div>
    </div>
  )
}