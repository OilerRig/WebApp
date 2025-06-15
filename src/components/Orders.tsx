import { useState } from 'react'
import { Order } from '../types'

type Props = {
  orders: Order[]
  onLookup?: (id: string) => void // only passed in GuestOrderLookup
}

export default function Orders({ orders, onLookup }: Props) {
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [guestId, setGuestId] = useState('')

  const isGuest = typeof onLookup === 'function'

  const filtered = isGuest
    ? orders // show all guest orders
    : orders.filter(order =>
        filter === 'all' ? true : order.status === filter
      )

  const statusClasses = (status: string) => {
    if (status === 'completed') return 'bg-green-100 text-green-700'
    if (status === 'pending') return 'bg-yellow-100 text-yellow-700'
    return 'bg-gray-100 text-gray-700'
  }

  return (
    <section className="bg-gray-100 min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Guest order lookup input */}
        {isGuest && orders.length === 0 && onLookup && (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Enter your Order ID"
              className="flex-1 px-4 py-2 border rounded shadow-sm focus:outline-none"
              value={guestId}
              onChange={e => setGuestId(e.target.value)}
            />
            <button
              className="px-6 py-2 bg-[#262058] text-white rounded hover:bg-[#1f1a4a]"
              onClick={() => onLookup(guestId.trim())}
            >
              Search
            </button>
          </div>
        )}

        {/* Title + filters for logged-in users */}
        {!isGuest && (
          <>
            <h2 className="text-3xl font-bold text-gray-900">Order History</h2>
            <div className="flex gap-4">
              {['all', 'completed', 'pending'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
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
          </>
        )}

        {/* Filtered order results */}
        <div className="space-y-6">
          {filtered.length === 0 ? (
            !isGuest && (
              <div className="text-gray-600 text-lg mt-6">No orders yet.</div>
            )
          ) : (
            filtered.map(order => (
              <div
                key={order.id}
                className="bg-white p-6 rounded-lg shadow border"
              >
                <div
                  onClick={() =>
                    setExpanded(expanded === order.id ? null : order.id)
                  }
                  className="grid grid-cols-[1fr_150px_100px] items-center cursor-pointer gap-4"
                >
                  <div>
                    <div className="text-sm text-gray-900 font-semibold">
                      Order ID:{' '}
                      <span className="text-indigo-700">{order.id}</span>
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
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>

                  <div className="text-lg font-bold text-gray-900 text-right">
                    $
                    {order.orderItems
                      .reduce(
                        (sum, it) => sum + it.product.price * it.quantity,
                        0
                      )
                      .toFixed(2)}
                  </div>
                </div>

                {expanded === order.id && (
                  <div className="mt-4 space-y-2">
                    {order.orderItems.map((it, idx) => (
                      <div
                        key={`${it.product.id}-${idx}`}
                        className="grid grid-cols-[1fr_120px_80px] items-center border p-3 rounded"
                      >
                        <div className="font-medium text-gray-800">
                          {it.product.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          Quantity: {it.quantity}
                        </div>
                        <div className="text-gray-900 font-semibold">
                          ${(it.product.price * it.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
