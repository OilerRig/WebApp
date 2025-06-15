import { Product } from '../types'

type Props = {
  cart: Product[]
  setCart: (cart: Product[]) => void
  onProceedToPayment: () => void
}

export default function Checkout({ cart, setCart, onProceedToPayment }: Props) {
  const grouped = cart.reduce<Record<number, { product: Product; count: number }>>((acc, item) => {
    if (!acc[item.id]) acc[item.id] = { product: item, count: 1 }
    else acc[item.id].count++
    return acc
  }, {})

  const handleUpdateQty = (id: number, change: number) => {
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

  const handleRemove = (id: number) => {
    setCart(cart.filter(p => p.id !== id))
  }

  const total = Object.values(grouped).reduce(
    (sum, { product, count }) => sum + product.price * count,
    0
  )

  return (
    <section className="bg-white py-8 md:py-16">
      <div className="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row gap-10">
        {/* Cart Items */}
        <div className="flex-1 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Shopping Cart</h2>
          {Object.values(grouped).map(({ product, count }) => (
            <div key={product.id} className="flex justify-between items-center border rounded-lg p-4 shadow-sm">
              <div>
                <span className="font-medium text-gray-900">{product.name}</span>
                <button
                  onClick={() => handleRemove(product.id)}
                  className="text-red-600 text-sm hover:underline block mt-1 ml-[20px]"
                >Remove</button>
              </div>
              <div className="flex items-center gap-8">
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleUpdateQty(product.id, -1)} className="w-7 h-7 border rounded">−</button>
                  <span className="w-6 text-center">{count}</span>
                  <button onClick={() => handleUpdateQty(product.id, 1)} className="w-7 h-7 border rounded">+</button>
                </div>
                <span className="text-gray-800 font-semibold w-20 text-right">
                  ${(product.price * count).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary & Checkout */}
        <div className="w-full lg:w-1/3 space-y-4 rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900">Order Summary</h3>
          <div className="flex justify-between text-gray-700 text-base font-medium">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            onClick={onProceedToPayment}
            disabled={cart.length === 0}
            className={`w-full py-2.5 rounded-lg font-semibold text-white ${
              cart.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#262058] hover:bg-[#1f1a4a]'
            }`}
          >
            Proceed to Checkout
          </button>

        </div>
      </div>
    </section>
  )
}
