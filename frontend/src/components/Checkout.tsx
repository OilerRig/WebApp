import { Product, Order } from '../types'

type Props = {
  cart: Product[]
  setCart: (cart: Product[]) => void
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>
  onCheckout: () => void
}

export default function Checkout({ cart, setCart, setOrders, onCheckout }: Props) {
  const grouped = cart.reduce<Record<string, { product: Product; count: number }>>((acc, item) => {
    if (!acc[item.id]) acc[item.id] = { product: item, count: 1 }
    else acc[item.id].count++
    return acc
  }, {})

  const handleUpdateQty = (id: string, change: number) => {
    const flatCart: Product[] = []
    for (const { product, count } of Object.values(grouped)) {
      if (product.id === id) {
        const newCount = count + change
        if (newCount > 0) flatCart.push(...Array(newCount).fill(product))
      } else {
        flatCart.push(...Array(count).fill(product))
      }
    }
    setCart(flatCart)
  }

  const handleRemove = (id: string) => {
    const filtered = cart.filter(p => p.id !== id)
    setCart(filtered)
  }

  const total = Object.values(grouped).reduce(
    (sum, { product, count }) => sum + product.price * count,
    0
  )

  const handleCheckout = () => {
    const newOrder: Order = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'completed',
      total,
      items: Object.values(grouped).map(({ product, count }) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        count,
      })),
    }

    setOrders(prev => [...prev, newOrder])
    setCart([])
    onCheckout()
  }

  return (
    <section className="bg-white py-8 md:py-16">
      <div className="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row gap-10">
        {/* Left - Cart Items */}
        <div className="flex-1 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Shopping Cart</h2>
          {Object.values(grouped).map(({ product, count }) => (
            <div key={product.id} className="flex justify-between items-center border rounded-lg p-4 shadow-sm">
              <div>
                <span className="font-medium text-gray-900">{product.name}</span>
                <button
                  onClick={() => handleRemove(product.id)}
                  className="text-red-600 text-sm hover:underline block mt-1 ml-[20px]"
                >
                  Remove
                </button>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUpdateQty(product.id, -1)}
                    className="w-7 h-7 border rounded text-lg flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="w-6 text-center">{count}</span>
                  <button
                    onClick={() => handleUpdateQty(product.id, 1)}
                    className="w-7 h-7 border rounded text-lg flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-800 font-semibold w-20 text-right">
                  ${(product.price * count).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right - Summary */}
        <div className="w-full lg:w-1/3 space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900">Order Summary</h3>
          <div className="flex justify-between text-gray-700 text-base font-medium">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-[#262058] text-white font-medium py-2.5 rounded-lg hover:bg-[#1f1a4a] transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </section>
  )
}
