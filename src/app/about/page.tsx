import { Sparkles, ShieldCheck, Truck, Heart, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
export default function AboutPage() {
  return (
    <div className="bg-white">

      {/* HERO */}
      <section className="relative py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-6 text-center">

          <p className="text-xs tracking-[0.3em] text-amber-600 uppercase">
            About AuraFresh
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4">
            Crafting Signature Scents for Every Personality
          </h1>

          <p className="mt-6 text-gray-600 text-lg leading-relaxed">
            AuraFresh is a premium fragrance brand in Pakistan, dedicated to
            delivering luxury perfumes that define elegance, confidence, and identity.
          </p>

        </div>
      </section>

      {/* STORY */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Our Story
            </h2>

            <p className="mt-4 text-gray-600 leading-relaxed">
              AuraFresh was built to bring premium international-quality fragrances
              to Pakistan at affordable prices. Every scent is selected to match
              personality, mood, and lifestyle.
            </p>

            <p className="mt-4 text-gray-600 leading-relaxed">
              From deep oud to fresh citrus blends, we focus on long-lasting,
              authentic, and luxurious perfumes.
            </p>
          </div>

          <div className="bg-gray-100 rounded-2xl h-40 w-40 flex items-center justify-center">
  <Image
    src="/images/logo.png"
    alt="AuraFresh Logo"
    width={160}
    height={160}
    className="object-contain"
  />
</div>

        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Why Choose AuraFresh
            </h2>
            <p className="text-gray-500 mt-2">
              Premium quality, trust, and luxury experience
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">

            {[
              { icon: Sparkles, title: "Premium Quality", desc: "Luxury selected perfumes" },
              { icon: ShieldCheck, title: "100% Authentic", desc: "Guaranteed original products" },
              { icon: Truck, title: "Fast Delivery", desc: "All over Pakistan" },
              { icon: Heart, title: "Customer First", desc: "We care about your experience" },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="bg-white p-6 rounded-xl border">
                  <Icon className="h-6 w-6 text-amber-600" />
                  <h3 className="mt-4 font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-2">{item.desc}</p>
                </div>
              )
            })}

          </div>
        </div>
      </section>

      {/* CONTACT DETAILS */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">
              Contact Us
            </h2>
            <p className="text-gray-500 mt-2">
              We’re always here to help you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-center">

            {/* Phone */}
            <div className="p-6 border rounded-xl">
              <Phone className="mx-auto h-6 w-6 text-amber-600" />
              <p className="mt-3 font-medium">Phone</p>
              <a href="tel:03085088464" className="text-gray-600 hover:text-amber-600">
                0308 5088464
              </a>
            </div>

            {/* Email */}
            <div className="p-6 border rounded-xl">
              <Mail className="mx-auto h-6 w-6 text-amber-600" />
              <p className="mt-3 font-medium">Email</p>
              <a href="mailto:info@aurafresh804.com" className="text-gray-600 hover:text-amber-600">
                info@aurafresh804.com
              </a>
            </div>

            {/* Location */}
            <div className="p-6 border rounded-xl">
              <MapPin className="mx-auto h-6 w-6 text-amber-600" />
              <p className="mt-3 font-medium">Location</p>
              <p className="text-gray-600">Rawalpindi, Pakistan</p>
            </div>

          </div>
        </div>
      </section>

      {/* SOCIAL MEDIA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-2xl font-bold text-gray-900">
            Follow Us
          </h2>

          <p className="text-gray-500 mt-2 mb-6">
            Stay updated with our latest perfumes & offers
          </p>

          <div className="flex justify-center gap-4 flex-wrap">

            <Link
              href="https://www.facebook.com/Aurafresh804"
              target="_blank"
              className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm"
            >
              Facebook
            </Link>

            <Link
              href="https://www.instagram.com/aurafresh804/"
              target="_blank"
              className="px-5 py-2 bg-pink-600 text-white rounded-full text-sm"
            >
              Instagram
            </Link>

            <Link
              href="https://www.tiktok.com/@aurafresh804"
              target="_blank"
              className="px-5 py-2 bg-black text-white rounded-full text-sm"
            >
              TikTok
            </Link>

          </div>
        </div>
      </section>

    </div>
  )
}