export function serializeProduct(product: any) {
    return {
      ...product,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      createdAt: product.createdAt?.toISOString(),
      updatedAt: product.updatedAt?.toISOString(),
      category: product.category
        ? {
            ...product.category,
            createdAt: product.category.createdAt?.toISOString(),
            updatedAt: product.category.updatedAt?.toISOString(),
          }
        : undefined,
    }
  }
  
  export function serializeProducts(products: any[]) {
    return products.map(serializeProduct)
  }