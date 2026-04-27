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
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <span className="text-xl font-bold text-white">AuraFresh</span>
                <p className="text-xs text-gray-500 tracking-widest uppercase">Premium Fragrances</p>
              </div>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Discover your signature scent. We bring you the finest collection
              of premium perfumes crafted for those who appreciate true luxury.
            </p>
            <div className="flex gap-3">
              <a href="#" className="h-9 w-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-white transition-all duration-200">
                <span className="text-xs font-bold">FB</span>
              </a>
              <a href="#" className="h-9 w-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-white transition-all duration-200">
                <span className="text-xs font-bold">IG</span>
              </a>
              <a href="#" className="h-9 w-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-white transition-all duration-200">
                <span className="text-xs font-bold">TW</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-gray-500 hover:text-amber-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-gray-500 hover:text-amber-400 transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-sm text-gray-500 hover:text-amber-400 transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="text-sm text-gray-500 hover:text-amber-400 transition-colors">
                  Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm tracking-wider uppercase">
              Categories
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products?category=oud" className="text-sm text-gray-500 hover:text-amber-400 transition-colors">
                  Oud Collection
                </Link>
              </li>
              <li>
                <Link href="/products?category=floral" className="text-sm text-gray-500 hover:text-amber-400 transition-colors">
                  Floral
                </Link>
              </li>
              <li>
                <Link href="/products?category=fresh" className="text-sm text-gray-500 hover:text-amber-400 transition-colors">
                  Fresh & Aqua
                </Link>
              </li>
              <li>
                <Link href="/products?category=oriental" className="text-sm text-gray-500 hover:text-amber-400 transition-colors">
                  Oriental
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm tracking-wider uppercase">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-500">Rawalpindi, Punjab, Pakistan</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <a href="tel:+923000000000" className="text-sm text-gray-500 hover:text-amber-400 transition-colors">
                  +92 300 0000000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <a href="mailto:info@aurafresh.pk" className="text-sm text-gray-500 hover:text-amber-400 transition-colors">
                  info@aurafresh.pk
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} AuraFresh. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-gray-600">Cash on Delivery</span>
            <span className="text-xs text-gray-600">Authentic Products</span>
            <span className="text-xs text-gray-600">Pakistan Wide Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  )
}