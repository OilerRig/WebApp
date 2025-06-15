import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import StorePage from './components/StorePage'
import ProductDetails from './components/ProductDetails'
import Checkout from './components/Checkout'
import Orders from './components/Orders'
import GuestOrderLookup from './components/GuestOrderLookup'
import Payment from './components/Payment'
import AdminOrders from './components/AdminOrders'
import { Product, Order } from './types'

import { API_BASE } from './api'


import './index.css'

const PAGE_SIZE = 9

function App() {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0()
  const [page, setPage] = useState<'home' | 'store' | 'product' | 'orders' | 'checkout' | 'payment' | 'admin'>('home')
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cart, setCart] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  const namespace = 'oilerrig'
  const roles = user?.[`${namespace}/roles`] || []
  const isAdmin = roles.includes('ROLE_ADMIN')

  const fetchProducts = (pageIndex = 0, search = '') => {
    const base = `${API_BASE}/products?page=${pageIndex}&size=${PAGE_SIZE}`
    const url = search ? `${base}&search=${encodeURIComponent(search)}` : base

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data.content)
        setTotalPages(data.page.totalPages)
        setCurrentPage(data.page.number)
      })
      .catch(err => console.error('Error fetching products:', err))
  }

  const fetchUserOrders = async () => {
  try {
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: 'http://oilerrig.westeurope.cloudapp.azure.com',
      },
    })

    const res = await fetch(`${API_BASE}/users/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    setOrders(data)
  } catch (err) {
    console.error('Error fetching user orders:', err)
  }
}


  // fetch all products once on load
  useEffect(() => {
    fetchProducts()
  }, [])

  // fetch orders on auth and switch to orders page
  useEffect(() => {
    if (page === 'orders' && isAuthenticated) {
      fetchUserOrders()
    }
  }, [page, isAuthenticated])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    fetchProducts(0, term)
  }

  const handlePageChange = (newPage: number) => {
    fetchProducts(newPage, searchTerm)
  }

  const handleProductClick = async (product: Product) => {
    try {
      const res = await fetch(`${API_BASE}/products/${product.id}/details`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const specs = await res.json();

      setSelectedProduct({ ...product, specs });
      setPage('product');
    } catch {
      console.error("failed to retrieve product details."); 
    }
  }

  const handleAddToCart = (product: Product) => {
    setCart(prev => [...prev, product])
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Navbar
        page={page === 'product' ? 'store' : page}
        setPage={setPage}
        cartCount={cart.length}
        isAdmin={isAdmin}
      />

      <main>
        {page === 'home' && <Hero onMoreInfo={() => setPage('store')} />}
        {page === 'store' && (
          <StorePage
            products={products}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onSelectProduct={handleProductClick}
            onSearch={handleSearch}
          />
        )}
        {page === 'product' && selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            onBack={() => setPage('store')}
            onAddToCart={handleAddToCart}
            onProceedToCheckout={() => setPage('checkout')}
            showCheckoutButton={cart.length > 0}
          />
        )}
        {page === 'checkout' && (
          <Checkout
            cart={cart}
            setCart={setCart}
            onProceedToPayment={() => setPage('payment')}
          />
        )}
        {page === 'payment' && (
          <Payment
            cart={cart}
            setCart={setCart}
            setOrders={setOrders}
            onOrderConfirmed={() => setPage('orders')}
          />
        )}
        {page === 'orders' && (
          isAuthenticated
            ? <Orders orders={orders} />
            : <GuestOrderLookup setOrders={setOrders} />
        )}
        {page === 'admin' && <AdminOrders />}
      </main>
    </div>
  )
}

export default App
