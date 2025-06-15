export type Product = {
  id: number
  name: string
  vendorName: string
  price: number
  stock: number
  specs?: Record<string, string> // from /products/{id}/details
}

export type Order = {
  id: string
  createdAt: string
  status: string
  orderItems: {
    product: Product
    quantity: number
  }[]
}


export type PlaceOrderRequest = {
  orderItemProductIds: number[]
  orderItemQuantities: number[]
}
