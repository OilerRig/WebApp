import { useState } from 'react'
import { Order } from '../types'
import Orders from './Orders'
import { API_BASE } from '../api'


type Props = {
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>
}

export default function GuestOrderLookup({ setOrders }: Props) {
  const [orderId, setOrderId] = useState('')
  const [guestOrder, setGuestOrder] = useState<Order | null>(null)
  const [error, setError] = useState('')

  const fetchOrder = async () => {
    if (!orderId.trim()) {
      setError('Please enter a valid order ID.')
      setGuestOrder(null)
      return
    }

    try {
      const res = await fetch(`${API_BASE}/orders/${orderId.trim()}`)
      if (!res.ok) throw new Error(`Order not found (status ${res.status})`)
      const order: Order = await res.json()
      setGuestOrder(order)
      setOrders([order]) // update parent state if needed
      setError('')
    } catch (e: any) {
      setGuestOrder(null)
      setError(e.message || 'Error fetching order.')
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Track Your Order</h2>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button
            onClick={fetchOrder}
            className="px-6 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            Search
          </button>
        </div>

        {error && <p className="text-red-600 mb-6">{error}</p>}

        {guestOrder && (
          <div className="mt-8">
            <Orders orders={[guestOrder]} onLookup={() => {}} />

          </div>
        )}
      </div>
    </div>
  )
}
