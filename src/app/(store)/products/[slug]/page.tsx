import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import ProductImageGallery from "./ProductImageGallery"
import AddToCartControls from "./AddToCartControls"
import { ShieldCheck, Truck, RefreshCcw, Sparkles, Droplets, Wind, Star, Flower2 } from "lucide-react"
import Reviews from "@/components/store/Reviews"

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

function NoteTag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-800 text-xs font-medium">
      <Droplets className="h-3 w-3" />
      {label}
    </span>
  )
}

function TrustBadge({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-amber-600">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-stone-800">{title}</p>
        <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  )
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product || !product.isActive) {
    notFound()
    return null
  }

  const images: string[] = product.images || []

  const numericPrice = product.price != null ? parseFloat(String(product.price)) : null

  const priceDisplay = numericPrice != null
    ? `PKR ${numericPrice.toLocaleString()}`
    : "Price on request"

  const originalPriceDisplay = numericPrice != null
    ? `PKR ${Math.round(numericPrice * 1.2).toLocaleString()}`
    : null

  const scentNotes: string[] = (product as any).scentNotes ?? [
    "Bergamot", "Jasmine", "Sandalwood", "Amber",
  ]

  return (
    <main className="min-h-screen bg-[#FAF8F5]">

      {/* BREADCRUMB */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <nav className="text-xs text-stone-400 flex items-center gap-2">
          <a href="/" className="hover:text-stone-700 transition-colors">Home</a>
          <span>/</span>
          <a href="/products" className="hover:text-stone-700 transition-colors">Fragrances</a>
          {product.category && (
            <>
              <span>/</span>
              <a href={`/products?category=${product.category.slug}`} className="hover:text-stone-700 transition-colors capitalize">
                {product.category.name}
              </a>
            </>
          )}
          <span>/</span>
          <span className="text-stone-600 truncate max-w-[180px]">{product.name}</span>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-2 gap-14 xl:gap-20">
        <ProductImageGallery images={images} productName={product.name} />

        <div className="space-y-7">
          {product.category && (
            <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.3em] uppercase font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
              <Sparkles className="h-3 w-3" />
              {product.category.name}
            </span>
          )}

          <div>
            <h1
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="text-4xl md:text-5xl font-bold text-stone-900 leading-tight"
            >
              {product.name}
            </h1>
            <div className="flex items-center gap-1.5 mt-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`h-4 w-4 ${s <= 4 ? "fill-amber-400 text-amber-400" : "text-stone-200"}`} />
              ))}
              <span className="text-xs text-stone-500 ml-1">4.0 · 38 reviews</span>
            </div>
          </div>

          {/* Price row — fixed, no /100 */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-stone-900">{priceDisplay}</span>
            {originalPriceDisplay && (
              <span className="text-sm text-stone-400 line-through">{originalPriceDisplay}</span>
            )}
            {originalPriceDisplay && (
              <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                20% off
              </span>
            )}
          </div>

          <hr className="border-stone-200" />

          {scentNotes.length > 0 && (
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-medium mb-2.5">Scent Notes</p>
              <div className="flex flex-wrap gap-2">
                {scentNotes.map((note) => <NoteTag key={note} label={note} />)}
              </div>
            </div>
          )}

          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-medium mb-2.5">About This Fragrance</p>
            <p className="text-stone-600 leading-relaxed text-[15px]">{product.description}</p>
          </div>

          <AddToCartControls product={product} priceDisplay={priceDisplay} />

          <hr className="border-stone-200" />

          <div className="grid sm:grid-cols-3 gap-5">
            <TrustBadge icon={<Truck className="h-5 w-5" />} title="Free Delivery" subtitle="Orders above PKR 3,000" />
            <TrustBadge icon={<RefreshCcw className="h-5 w-5" />} title="Easy Returns" subtitle="7-day return policy" />
            <TrustBadge icon={<ShieldCheck className="h-5 w-5" />} title="100% Authentic" subtitle="Sealed & verified" />
          </div>
        </div>
      </section>

      {/* FRAGRANCE PROFILE */}
      <section className="border-t border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <p className="text-[10px] tracking-[0.35em] uppercase text-stone-400 font-medium mb-2">Fragrance Profile</p>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-2xl font-bold text-stone-900 mb-8">
            Understand the Layers
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Wind className="h-5 w-5" />, label: "Top Notes", description: "The opening impression — light, fresh, and the first thing you smell.", notes: scentNotes.slice(0, 2) },
              { icon: <Flower2 className="h-5 w-5" />, label: "Heart Notes", description: "The core character of the fragrance, emerges after 20 minutes.", notes: scentNotes.slice(1, 3) },
              { icon: <Droplets className="h-5 w-5" />, label: "Base Notes", description: "The lasting dry-down — deep, warm, and what lingers all day.", notes: scentNotes.slice(2) },
            ].map((layer) => (
              <div key={layer.label} className="bg-[#FAF8F5] rounded-2xl p-6 border border-stone-100">
                <div className="text-amber-600 mb-3">{layer.icon}</div>
                <h3 className="font-semibold text-stone-800 mb-1">{layer.label}</h3>
                <p className="text-stone-400 text-xs leading-relaxed mb-4">{layer.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {layer.notes.map((n) => (
                    <span key={n} className="text-[11px] px-2.5 py-0.5 rounded-full bg-white border border-stone-200 text-stone-600">{n}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO WEAR */}
      <section className="bg-[#1A1108] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-amber-400 text-[10px] tracking-[0.35em] uppercase font-medium mb-2">Application Tips</p>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-2xl font-bold mb-8">
            How to Wear It Right
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { step: "01", tip: "Apply to pulse points — wrists, neck, behind ears." },
              { step: "02", tip: "Spray from 15 cm away for even diffusion." },
              { step: "03", tip: "Don't rub — let the scent bloom naturally." },
              { step: "04", tip: "Layer with unscented moisturiser for longer wear." },
            ].map((item) => (
              <div key={item.step} className="border-t border-white/10 pt-5">
                <span className="text-5xl font-bold text-white/10 block mb-3">{item.step}</span>
                <p className="text-white/60 text-sm leading-relaxed">{item.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Reviews productId={product.id} />
    </main>
  )
}