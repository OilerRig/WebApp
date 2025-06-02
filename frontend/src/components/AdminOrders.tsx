import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import Orders from './Orders'
import { Order } from '../types'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { API_BASE } from '../api'

const MySwal = withReactContent(Swal)

export default function AdminOrders() {
  const { getAccessTokenSilently } = useAuth0()
  const [orders, setOrders] = useState<Order[]>([])

  const fetchAdminOrders = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: 'http://oilerrig.westeurope.cloudapp.azure.com',
        },
      })

      const res = await fetch(`${API_BASE}/admin/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setOrders(data)
    } catch (err) {
      console.error('Error fetching admin orders:', err)
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Could not fetch admin orders.',
      })
    }
  }

  const handleAdminAction = async (
    endpoint: string,
    message: string,
    method: 'GET' | 'DELETE'
  ) => {
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) return

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: 'http://oilerrig.westeurope.cloudapp.azure.com',
        },
      })

      const res = await fetch(`${API_BASE}${endpoint.replace('/api', '')}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const responseText = await res.text()

      MySwal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: responseText,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: 'mt-2 mr-2 text-sm',
        },
      })

      // Post-action side effects
      if (endpoint === '/api/orders') {
        setOrders([])
      } else if (endpoint === '/api/admin/caches/sync') {
        fetchAdminOrders()
      }
    } catch (err) {
      console.error(err)
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong while performing the action.',
      })
    }
  }

  useEffect(() => {
    fetchAdminOrders()
  }, [])

  return (
    <section className="bg-gray-100 min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Admin Buttons */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Control Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() =>
                handleAdminAction('/api/admin/caches/vendors', 'This will initialize the vendor list.', 'GET')
              }
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Init Vendors
            </button>
            <button
              onClick={() =>
                handleAdminAction('/api/admin/caches/reset', 'This will reset all caches.', 'GET')
              }
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Reset Caches
            </button>
            <button
              onClick={() =>
                handleAdminAction('/api/admin/caches/sync', 'This will sync all caches.', 'GET')
              }
              className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Sync Caches
            </button>
            <button
              onClick={() =>
                handleAdminAction('/api/admin/orders', 'This will delete ALL orders permanently.', 'DELETE')
              }
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Delete All Orders
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Orders</h2>
          <Orders orders={orders} />
        </div>
      </div>
    </section>
  )
}
