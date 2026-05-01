
// import Link from "next/link"
// import { prisma } from "@/lib/prisma"
// import { Button } from "@/components/ui/button"
// import ProductCard from "@/components/store/ProductCard"
// import { serializeProducts } from "@/lib/serialize"
// import { Truck, Shield, RefreshCw, ArrowRight } from "lucide-react"
// import HeroCarousel from "@/components/store/HeroCarousel"
// import { usePathname, useSearchParams } from "next/navigation"
// export const revalidate = 0

// async function getFeaturedProducts() {
//   const products = await prisma.product.findMany({
//     where: {
//       isActive: true,
//       isFeatured: true,
      
//     },
//     include: { category: true },
//     take: 8,
//     orderBy: { createdAt: "desc" },
//   })

//   return serializeProducts(products)
// }

// async function getCategories() {
//   return prisma.category.findMany({
//     include: { _count: { select: { products: true } } },
//     take: 6,
//   })
// }

// export default async function HomePage() {
//   const [featuredProducts, categories] = await Promise.all([
//     getFeaturedProducts(),
//     getCategories(),
//   ])
//   const pathname = usePathname()
//   const searchParams = useSearchParams()
  
//   const activeCategory = searchParams.get("category")
//   return (
//     <div className="bg-white">

//       {/* HERO */}
//       <HeroCarousel />

//       {/* FEATURED PRODUCTS */}
//       {featuredProducts.length > 0 && (
//         <section className="bg-white border-t border-gray-100 py-24">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

//             <div className="text-center mb-14">
//               <p className="text-xs tracking-[0.3em] text-amber-600 uppercase font-medium">
//                 Featured Collection
//               </p>

//               <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
//                 Best Selling Perfumes
//               </h2>

//               <p className="text-gray-500 mt-4 max-w-xl mx-auto">
//                 Hand-picked fragrances loved by our customers.
//               </p>
//             </div>

//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {featuredProducts.map((product: any) => (
//                 <ProductCard key={product.id} product={product} />
//               ))}
//             </div>

//             <div className="text-center mt-14">
//               <Link href="/products">
//                 <Button className="rounded-full bg-gray-900 hover:bg-black text-white px-8">
//                   View All Products
//                   <ArrowRight className="ml-2 h-4 w-4" />
//                 </Button>
//               </Link>
//             </div>

//           </div>
//         </section>
//       )}

//       {/* FEATURES */}
//       <section className="bg-amber-400">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-amber-500">

//             {[
//               { icon: Truck, title: "Free Delivery", desc: "On orders over Rs. 3,000" },
//               { icon: Shield, title: "100% Authentic", desc: "Genuine certified products" },
//               { icon: RefreshCw, title: "Easy Returns", desc: "7 day return policy" },
//             ].map((feature) => {
//               const Icon = feature.icon
//               return (
//                 <div key={feature.title} className="flex items-center gap-4 py-5 px-8">
//                   <Icon className="h-6 w-6 text-gray-950" />
//                   <div>
//                     <h3 className="font-semibold text-gray-950 text-sm">
//                       {feature.title}
//                     </h3>
//                     <p className="text-xs text-amber-800">{feature.desc}</p>
//                   </div>
//                 </div>
//               )
//             })}

//           </div>
//         </div>
//       </section>

//       {/* CATEGORIES */}
//       {categories.length > 0 && (
//         <section className="py-20 bg-gray-50">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

//             <div className="text-center mb-12">
//               <h2 className="text-4xl font-bold text-gray-900">
//                 Shop by Category
//               </h2>
//               <p className="text-gray-500 mt-3 text-lg">
//                 Find your perfect fragrance
//               </p>
//             </div>

//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//             {categories.map((cat: any) => {
//   const isActive = activeCategory === cat.slug

//   return (
//     <Link
//       key={cat.id}
//       href={`/products?category=${cat.slug}`}
//       className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//         isActive
//           ? "bg-purple-600 text-white shadow-md"
//           : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//       }`}
//     >
//       {cat.name}
//     </Link>
//   )
// })}
//             </div>

//           </div>
//         </section>
//       )}

//     </div>
//   )
// }
export const dynamic = "force-dynamic"
import { prisma } from "@/lib/prisma"
import { serializeProducts } from "@/lib/serialize"
import HomeClient from "./Homeclient"

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    include: { category: true },
    take: 8,
    orderBy: { createdAt: "desc" },
  })

  return serializeProducts(products)
}

async function getCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    take: 6,
  })
}

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ])

  return (
    <HomeClient
      featuredProducts={featuredProducts}
      categories={categories}
    />
  )
}