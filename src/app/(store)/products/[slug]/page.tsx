import { prisma } from "@/lib/prisma"
import Image from "next/image"
import { notFound } from "next/navigation"
import AddToCartButton from "@/components/store/AddToCartButton"
import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"
import { serializeProduct } from "@/lib/serialize"

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  })
  if (!product) return null
  return serializeProduct(product)
}

export async function generateMetadata({
    params,
  }: {
    params: Promise<{ slug: string }>
  }) {
    const { slug } = await params
    const product = await getProduct(slug)
  
    if (!product) return {}
  
    return {
      title: `${product.name} | AuraFresh`,
      description: product.description.slice(0, 160),
      openGraph: {
        title: product.name,
        description: product.description.slice(0, 160),
        images: product.images[0] ? [product.images[0]] : [],
      },
    }
  }
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product || !product.isActive) notFound()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Package className="h-24 w-24 text-gray-200" />
              </div>
            )}
          </div>
          {(product.images as string[]).length > 1 && (
  <div className="grid grid-cols-4 gap-2">
    {(product.images as string[]).slice(1).map((img: string, i: number) => (
      <div
        key={i}
        className="relative aspect-square rounded-lg overflow-hidden bg-gray-50"
      >
        <Image
          src={img}
          alt={`${product.name} ${i + 2}`}
          fill
          className="object-cover"
        />
      </div>
    ))}
  </div>
)}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-purple-600 font-medium mb-1">
              {product.category.name}
            </p>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-gray-900">
              Rs. {Number(product.price).toLocaleString()}
            </span>
            {product.comparePrice && (
              <span className="text-xl text-gray-400 line-through">
                Rs. {Number(product.comparePrice).toLocaleString()}
              </span>
            )}
            {product.comparePrice && (
              <Badge className="bg-red-500">
                {Math.round(
                  ((Number(product.comparePrice) - Number(product.price)) /
                    Number(product.comparePrice)) *
                    100
                )}
                % OFF
              </Badge>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline">{product.gender}</Badge>
            {product.volume && (
              <Badge variant="outline">{product.volume}</Badge>
            )}
            {product.occasion && (
              <Badge variant="outline">{product.occasion}</Badge>
            )}
            {product.season && (
              <Badge variant="outline">{product.season}</Badge>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Notes */}
          {(product.topNotes.length > 0 ||
            product.middleNotes.length > 0 ||
            product.baseNotes.length > 0) && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <h3 className="font-semibold text-gray-900">Fragrance Notes</h3>
              {product.topNotes.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Top Notes</p>
                  <div className="flex gap-2 flex-wrap">
                    {product.topNotes.map((note:any) => (
                      <span
                        key={note}
                        className="px-2 py-1 bg-white rounded-full text-xs text-gray-700 border"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {product.middleNotes.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Middle Notes</p>
                  <div className="flex gap-2 flex-wrap">
                    {product.middleNotes.map((note:any) => (
                      <span
                        key={note}
                        className="px-2 py-1 bg-white rounded-full text-xs text-gray-700 border"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {product.baseNotes.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Base Notes</p>
                  <div className="flex gap-2 flex-wrap">
                    {product.baseNotes.map((note:any) => (
                      <span
                        key={note}
                        className="px-2 py-1 bg-white rounded-full text-xs text-gray-700 border"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stock */}
          <p className={`text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
            {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : "✗ Out of Stock"}
          </p>

          {/* Add to Cart */}
          <AddToCartButton product={product as any} />
        </div>
      </div>
      {/* JSON-LD Structured Data */}
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: product.images,
      offers: {
        "@type": "Offer",
        price: Number(product.price),
        priceCurrency: "PKR",
        availability:
          product.stock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
      },
    }),
  }}
/>
    </div>
  )
}