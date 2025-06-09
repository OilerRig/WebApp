export type Product = {
  id: string
  name: string
  price: number
  description: string
  image?: string
  specs?: Record<string, string> // ← new
}


export type Order = {
  id: string
  status: 'pending' | 'completed'
  createdAt: string
  total: number
  items: {
    id: string
    name: string
    price: number
    count: number
  }[]
}
