import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Product, Order, PlaceOrderRequest } from '../types'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { API_BASE } from '../api'


const MySwal = withReactContent(Swal)

type Props = {
  cart: Product[]
  setCart: (cart: Product[]) => void
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>
  onOrderConfirmed: () => void
}

export default function Payment({ cart, setCart, setOrders, onOrderConfirmed }: Props) {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()

  const [form, setForm] = useState({
    country: '',
    city: '',
    street: '',
    zip: '',
    fullName: '',
    cardNumber: '',
    expiration: '',
    cvv: '',
  })

  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isValid, setIsValid] = useState(false)

  const grouped = cart.reduce<Record<number, { product: Product; count: number }>>((acc, item) => {
    if (!acc[item.id]) acc[item.id] = { product: item, count: 1 }
    else acc[item.id].count++
    return acc
  }, {})

  const total = Object.values(grouped).reduce(
    (sum, { product, count }) => sum + product.price * count,
    0
  )

  const validators = {
    country: (v: string) => /^[A-Za-z ]{2,}$/.test(v),
    city: (v: string) => /^[A-Za-z .'-]{2,}$/.test(v),
    street: (v: string) => /^[A-Za-z0-9 .'-]{5,}$/.test(v),
    zip: (v: string) => /^[A-Za-z0-9\- ]{4,10}$/.test(v),
    fullName: (v: string) => v.trim().length >= 3,
    cardNumber: (v: string) => /^[0-9]{16}$/.test(v.replace(/\s|-/g, '')),
    expiration: (v: string) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v),
    cvv: (v: string) => /^[0-9]{3,4}$/.test(v),
  }

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const isFormValid = () => {
    return Object.entries(validators).every(([field, fn]) => fn(form[field as keyof typeof form]))
  }

  useEffect(() => {
    setIsValid(isFormValid())
  }, [form])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid()) return

    const requestBody: PlaceOrderRequest = {
      orderItemProductIds: Object.values(grouped).map(({ product }) => product.id),
      orderItemQuantities: Object.values(grouped).map(({ count }) => count),
    }

    try {
      let headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      if (isAuthenticated) {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: 'http://oilerrig.westeurope.cloudapp.azure.com',
          },
        })
        headers['Authorization'] = `Bearer ${token}`
      }

      const res = await fetch(`${API_BASE}/orders`, {

        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      })

      if (!res.ok) throw new Error(`Order failed (status ${res.status})`)
      const order: Order = await res.json()
      setOrders(prev => [...prev, order])
      setCart([])

      await MySwal.fire({
        icon: 'success',
        title: 'Order Confirmed!',
        html: `
          <p>Your order has been placed successfully.</p>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p style="margin-top: 0.5rem; font-size: 0.85rem; color: #555;">
            Please save this ID to track your order.
          </p>
        `,
        confirmButtonText: 'OK',
        customClass: {
          popup: 'p-6',
          title: 'text-lg font-bold mb-4',
          htmlContainer: 'text-center',
        },
      })

      onOrderConfirmed()
    } catch (err) {
      console.error(err)
      MySwal.fire({
        icon: 'error',
        title: 'Payment failed',
        text: 'Something went wrong.',
      })
    }
  }

  const inputClass = (field: string) =>
    `block w-full rounded-lg border p-2.5 text-sm ${
      touched[field] && !validators[field as keyof typeof validators](form[field as keyof typeof form])
        ? 'border-red-500 bg-red-50'
        : 'border-gray-300 bg-gray-50'
    }`

  return (
    <section className="bg-white py-12">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Payment</h2>

          <div className="lg:flex lg:gap-12">
            <form onSubmit={handleSubmit} className="w-full lg:max-w-xl border rounded-lg shadow-sm p-6 space-y-4">
              {/* Address fields */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Country*</label>
                <input
                  type="text"
                  value={form.country}
                  onChange={e => handleChange('country', e.target.value)}
                  className={inputClass('country')}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">City*</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={e => handleChange('city', e.target.value)}
                    className={inputClass('city')}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">ZIP Code*</label>
                  <input
                    type="text"
                    value={form.zip}
                    onChange={e => handleChange('zip', e.target.value)}
                    className={inputClass('zip')}
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Street*</label>
                <input
                  type="text"
                  value={form.street}
                  onChange={e => handleChange('street', e.target.value)}
                  className={inputClass('street')}
                />
              </div>

              {/* Card fields */}
              <hr className="my-4" />
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Full Name (on card)*</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={e => handleChange('fullName', e.target.value)}
                  className={inputClass('fullName')}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Card Number*</label>
                <input
                  type="text"
                  value={form.cardNumber}
                  onChange={e => handleChange('cardNumber', e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  className={inputClass('cardNumber')}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Expiration (MM/YY)*</label>
                  <input
                    type="text"
                    value={form.expiration}
                    onChange={e => handleChange('expiration', e.target.value)}
                    placeholder="12/25"
                    className={inputClass('expiration')}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">CVV*</label>
                  <input
                    type="text"
                    value={form.cvv}
                    onChange={e => handleChange('cvv', e.target.value)}
                    className={inputClass('cvv')}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!isValid}
                className={`w-full py-2.5 rounded-lg font-semibold text-white ${
                  isValid ? 'bg-[#262058] hover:bg-[#1f1a4a]' : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Pay now
              </button>
            </form>

            {/* Summary */}
            <div className="mt-10 lg:mt-0 lg:w-1/2 space-y-4 bg-gray-50 rounded-lg border p-6">
              <h3 className="text-xl font-semibold text-gray-900">Order Summary</h3>
              {Object.values(grouped).map(({ product, count }) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span>{product.name} × {count}</span>
                  <span>${(product.price * count).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
