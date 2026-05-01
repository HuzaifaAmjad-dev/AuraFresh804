import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              
              <div>
                <span className="text-xl font-bold text-white">AuraFresh</span>
                <p className="text-xs text-gray-500 tracking-widest uppercase">
                  Premium Fragrances
                </p>
              </div>
            </Link>

            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Discover your signature scent. We bring you premium perfumes crafted
              for true fragrance lovers.
            </p>

            {/* Socials */}
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/Aurafresh804"
                target="_blank"
                className="h-9 w-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-white transition"
              >
                FB
              </a>

              <a
                href="https://www.instagram.com/aurafresh804/"
                target="_blank"
                className="h-9 w-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-white transition"
              >
                IG
              </a>

              <a
                href="https://www.tiktok.com/@aurafresh804"
                target="_blank"
                className="h-9 w-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-white transition"
              >
                TT
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li><Link href="/" className="hover:text-amber-400 text-sm">Home</Link></li>
              <li><Link href="/products" className="hover:text-amber-400 text-sm">Shop All</Link></li>
              <li><Link href="/cart" className="hover:text-amber-400 text-sm">Cart</Link></li>
              <li><Link href="/checkout" className="hover:text-amber-400 text-sm">Checkout</Link></li>
            </ul>
          </div>

          {/* Legal Pages (NEW) */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Policies
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy-policy" className="hover:text-amber-400 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-amber-400 text-sm">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Contact
            </h3>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-amber-400 mt-0.5" />
                <span className="text-sm">Rawalpindi, Punjab, Pakistan</span>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-amber-400" />
                <a href="tel:03085088464" className="text-sm hover:text-amber-400">
                  03085088464
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-amber-400" />
                <a href="mailto:info@aurafresh804.com" className="text-sm hover:text-amber-400">
                  info@aurafresh804.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} AuraFresh. All rights reserved.
          </p>

          <div className="flex gap-6 text-xs text-gray-600">
            <span>COD Available</span>
            <span>Authentic Perfumes</span>
            <span>Pakistan Wide Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  )
}