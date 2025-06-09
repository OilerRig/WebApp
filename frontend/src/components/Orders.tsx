import { useState } from 'react'
import { Order } from '../types'

type Props = {
  orders: Order[]
}

export default function Orders({ orders }: Props) {
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = orders.filter(order =>
    filter === 'all' ? true : order.status === filter
  )

  const statusClasses = (status: string) => {
    if (status === 'completed') return 'bg-green-100 text-green-700'
    if (status === 'pending') return 'bg-yellow-100 text-yellow-700'
    return 'bg-gray-100 text-gray-700'
  }

  return (
    <section className="bg-gray-100 min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Order History</h2>

        <div className="flex gap-4 mb-8">
          {['all', 'completed', 'pending'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as 'all' | 'completed' | 'pending')}
              className={`px-4 py-2 rounded-md font-medium ${
                filter === f
                  ? 'bg-[#262058] text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {filtered.map(order => (
            <div
              key={order.id}
              className="bg-white p-4 rounded-lg shadow-sm border"
            >
              <div
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                className="grid grid-cols-[1fr_150px_100px] items-center cursor-pointer gap-4"
              >
                <div>
                  <div className="text-sm text-gray-900 font-semibold">
                    Order ID: <span className="text-indigo-700">{order.id}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>

                <div>
                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${statusClasses(
                      order.status
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="text-lg font-bold text-gray-900 text-right">
                  ${order.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)}
                </div>
              </div>

              {expanded === order.id && (
                <div className="mt-4 space-y-2">
                  {order.items.map((item, idx) => (
                    <div
                      key={`${item.product.id}-${idx}`}
                      className="grid grid-cols-[1fr_120px_80px] items-center border p-2 rounded"
                    >
                      <div className="text-gray-800 font-medium">{item.product.name}</div>
                      <div className="text-sm text-gray-600 text-left">
                        Quantity: {item.quantity}
                      </div>
                      <div className="text-gray-900 font-semibold text-left">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
