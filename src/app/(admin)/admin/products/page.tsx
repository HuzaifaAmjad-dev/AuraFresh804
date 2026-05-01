"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Package } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  comparePrice?: number
  images: string[]
  stock: number
  isActive: boolean
  isFeatured: boolean
  gender: string
  volume?: string
  category: { name: string }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchProducts() {
    const res = await fetch("/api/products")
    const data = await res.json()
  
    setProducts(data.filter((p: any) => !p.isDeleted))
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Product deleted!")
      fetchProducts()
    } catch {
      toast.error("Failed to delete")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500">Manage your perfume products</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No products yet</p>
          <Link href="/admin/products/new">
            <Button className="mt-4">Add your first product</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative h-48 bg-gray-100">
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Package className="h-12 w-12 text-gray-300" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  {product.isFeatured && (
                    <Badge className="bg-purple-600">Featured</Badge>
                  )}
                  <Badge variant={product.isActive ? "default" : "secondary"}>
                    {product.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">Rs. {product.price}</p>
                    {product.comparePrice && (
                      <p className="text-sm text-gray-400 line-through">
                        Rs. {product.comparePrice}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline">{product.gender}</Badge>
                  {product.volume && (
                    <Badge variant="outline">{product.volume}</Badge>
                  )}
                  <Badge variant="outline">Stock: {product.stock}</Badge>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/products/${product.id}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full">
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}