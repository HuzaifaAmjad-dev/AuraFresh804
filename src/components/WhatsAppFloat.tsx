"use client"

import Link from "next/link"
import { FaWhatsapp } from "react-icons/fa"

export default function WhatsAppFloat() {
  const phone = "923085088464"

  return (
    <Link
      href={`https://wa.me/${phone}?text=I%20need%20help`}
      target="_blank"
      className="fixed bottom-5 right-5 z-50 group"
    >
      <div className="relative flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] shadow-lg hover:scale-110 transition-all duration-300">
        
        {/* Pulse */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>

        {/* WhatsApp Icon */}
        <FaWhatsapp className="h-7 w-7 text-white relative z-10" />
      </div>
    </Link>
  )
}