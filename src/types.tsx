export type Product = {
  id: number
  name: string
  vendorName: string
  price: number
  stock: number
  details?: Record<string, string>
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
