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
  const plainDescription = product.description.replace(/<[^>]*>/g, "").slice(0, 160)
  return {
    title: `${product.name} | AuraFresh`,
    description: plainDescription,
    openGraph: {
      title: product.name,
      description: plainDescription,
      images: product.images ?? [],
    },
  }
}

function NoteTag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-800 text-xs font-medium tracking-wide">
      <Droplets className="h-3 w-3 flex-shrink-0" />
      {label}
    </span>
  )
}

function TrustBadge({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-stone-100">
      <div className="mt-0.5 text-amber-600 flex-shrink-0">{icon}</div>
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

  const p = product as any

  const images: string[] = product.images || []
  const numericPrice = product.price != null ? parseFloat(String(product.price)) : null
  const priceDisplay = numericPrice != null ? `PKR ${numericPrice.toLocaleString()}` : "Price on request"

  // Use comparePrice from DB if available, otherwise fall back to 20% markup
  const numericCompare = p.comparePrice != null ? parseFloat(String(p.comparePrice)) : null
  const originalPriceDisplay = numericCompare != null
    ? `PKR ${numericCompare.toLocaleString()}`
    : numericPrice != null
    ? `PKR ${Math.round(numericPrice * 1.2).toLocaleString()}`
    : null

  const discountPct = numericCompare && numericPrice
    ? Math.round((1 - numericPrice / numericCompare) * 100)
    : 20

  // Pull real notes from DB fields
  const topNotes: string[]    = Array.isArray(p.topNotes)    ? p.topNotes    : []
  const middleNotes: string[] = Array.isArray(p.middleNotes) ? p.middleNotes : []
  const baseNotes: string[]   = Array.isArray(p.baseNotes)   ? p.baseNotes   : []
  const allNotes: string[]    = [...new Set([...topNotes, ...middleNotes, ...baseNotes])]

  const volume: string | null  = p.volume   ?? null
  const gender: string | null  = p.gender   ?? null
  const occasion: string | null = p.occasion ?? null
  const season: string | null  = p.season   ?? null

  return (
    <main className="min-h-screen bg-[#FAF8F5]">

      {/* BREADCRUMB */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <nav className="text-xs text-stone-400 flex items-center gap-2 flex-wrap">
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
          <span className="text-stone-600 truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-14 xl:gap-24">
        <ProductImageGallery images={images} productName={product.name} />

        <div className="space-y-6">

          {/* Category pill */}
          {product.category && (
            <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.3em] uppercase font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
              <Sparkles className="h-3 w-3" />
              {product.category.name}
            </span>
          )}

          {/* Name + stars */}
          <div>
            <h1
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="text-4xl md:text-5xl font-bold text-stone-900 leading-tight"
            >
              {product.name}
            </h1>
            <div className="flex items-center gap-1.5 mt-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`h-4 w-4 ${s <= 4 ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"}`} />
              ))}
              <span className="text-xs text-stone-500 ml-1">4.0 · 38 reviews</span>
            </div>
          </div>

          {/* Quick meta pills */}
          {(volume || gender || occasion || season) && (
            <div className="flex flex-wrap gap-2">
              {volume && (
                <span className="text-[11px] px-3 py-1 rounded-full bg-stone-100 text-stone-600 font-medium">
                  {volume}
                </span>
              )}
              {gender && gender !== "UNISEX" && (
                <span className="text-[11px] px-3 py-1 rounded-full bg-stone-100 text-stone-600 font-medium capitalize">
                  {gender.toLowerCase()}
                </span>
              )}
              {gender === "UNISEX" && (
                <span className="text-[11px] px-3 py-1 rounded-full bg-stone-100 text-stone-600 font-medium">
                  Unisex
                </span>
              )}
              {occasion && (
                <span className="text-[11px] px-3 py-1 rounded-full bg-stone-100 text-stone-600 font-medium">
                  {occasion}
                </span>
              )}
              {season && (
                <span className="text-[11px] px-3 py-1 rounded-full bg-stone-100 text-stone-600 font-medium">
                  {season}
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 py-1">
            <span
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="text-4xl font-bold text-stone-900"
            >
              {priceDisplay}
            </span>
            {originalPriceDisplay && (
              <>
                <span className="text-sm text-stone-400 line-through">{originalPriceDisplay}</span>
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  {discountPct}% off
                </span>
              </>
            )}
          </div>

          <hr className="border-stone-200" />

          {/* Scent notes */}
          {allNotes.length > 0 && (
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-medium mb-3">Scent Notes</p>
              <div className="flex flex-wrap gap-2">
                {allNotes.map((note) => <NoteTag key={note} label={note} />)}
              </div>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-medium mb-3">About This Fragrance</p>
              <div
                className="text-stone-600 leading-relaxed text-[15px] [&_strong]:font-semibold [&_strong]:text-stone-800 [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_p]:mb-2 last:[&_p]:mb-0"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}

          {/* Cart controls */}
          <AddToCartControls product={product} priceDisplay={priceDisplay} />

          <hr className="border-stone-200" />

          {/* Trust badges */}
          <div className="grid sm:grid-cols-3 gap-3">
            <TrustBadge icon={<Truck className="h-5 w-5" />} title="Free Delivery" subtitle="Orders above PKR 5,000" />
            <TrustBadge icon={<RefreshCcw className="h-5 w-5" />} title="Easy Returns" subtitle="7-day return policy" />
            <TrustBadge icon={<ShieldCheck className="h-5 w-5" />} title="100% Authentic" subtitle="Sealed & verified" />
          </div>
        </div>
      </section>

      {/* FRAGRANCE PROFILE */}
      {(topNotes.length > 0 || middleNotes.length > 0 || baseNotes.length > 0) && (
        <section className="border-t border-stone-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <p className="text-[10px] tracking-[0.35em] uppercase text-stone-400 font-medium mb-2">Fragrance Profile</p>
            <h2
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="text-3xl font-bold text-stone-900 mb-10"
            >
              Understand the Layers
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Wind className="h-5 w-5" />,
                  label: "Top Notes",
                  description: "The opening impression — light, fresh, and the first thing you smell.",
                  notes: topNotes,
                  accent: "bg-sky-50 border-sky-100 text-sky-700",
                  iconColor: "text-sky-500",
                },
                {
                  icon: <Flower2 className="h-5 w-5" />,
                  label: "Heart Notes",
                  description: "The core character of the fragrance, emerges after 20 minutes.",
                  notes: middleNotes,
                  accent: "bg-rose-50 border-rose-100 text-rose-700",
                  iconColor: "text-rose-400",
                },
                {
                  icon: <Droplets className="h-5 w-5" />,
                  label: "Base Notes",
                  description: "The lasting dry-down — deep, warm, and what lingers all day.",
                  notes: baseNotes,
                  accent: "bg-amber-50 border-amber-100 text-amber-800",
                  iconColor: "text-amber-600",
                },
              ].map((layer) => layer.notes.length > 0 && (
                <div key={layer.label} className="bg-[#FAF8F5] rounded-2xl p-6 border border-stone-100 hover:shadow-md hover:shadow-stone-100 transition-shadow duration-300">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4 ${layer.accent} border`}>
                    <span className={layer.iconColor}>{layer.icon}</span>
                  </div>
                  <h3 className="font-semibold text-stone-800 mb-1 text-base">{layer.label}</h3>
                  <p className="text-stone-400 text-xs leading-relaxed mb-4">{layer.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {layer.notes.map((n) => (
                      <span key={n} className={`text-[11px] px-2.5 py-1 rounded-full border font-medium ${layer.accent}`}>
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* HOW TO WEAR */}
      <section className="bg-[#1A1108] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-amber-400 text-[10px] tracking-[0.35em] uppercase font-medium mb-2">Application Tips</p>
          <h2
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="text-3xl font-bold mb-12"
          >
            How to Wear It Right
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { step: "01", tip: "Apply to pulse points — wrists, neck, behind ears." },
              { step: "02", tip: "Spray from 15 cm away for even diffusion." },
              { step: "03", tip: "Don't rub — let the scent bloom naturally." },
              { step: "04", tip: "Layer with unscented moisturiser for longer wear." },
            ].map((item) => (
              <div key={item.step} className="group border-t border-white/10 pt-6 hover:border-amber-500/50 transition-colors duration-300">
                <span className="text-6xl font-bold text-white/[0.07] block mb-4 group-hover:text-amber-500/20 transition-colors duration-300">
                  {item.step}
                </span>
                <p className="text-white/60 text-sm leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                  {item.tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Reviews productId={product.id} />
    </main>
  )
}