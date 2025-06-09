import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import StorePage from './components/StorePage'
import ProductDetails from './components/ProductDetails'
import Checkout from './components/Checkout'
import Orders from './components/Orders'
import { Product, Order } from './types'

import './index.css'

const PAGE_SIZE = 9

function App() {
  const [page, setPage] = useState<'home' | 'store' | 'product' | 'orders' | 'checkout'>('home')
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cart, setCart] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch products for current page (with optional search)
  const fetchProducts = (pageIndex = 0, search = '') => {
    const base = `/api/products/?page=${pageIndex}&size=${PAGE_SIZE}`
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

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    fetchProducts(0, term) // reset to first page
  }

  const handlePageChange = (newPage: number) => {
    fetchProducts(newPage, searchTerm)
  }

  // const handleProductClick = async (product: Product) => {
  //   try {
  //     const res = await fetch(`/api/products/${product.id}/details`)
  //     const specs = await res.json()
  //     setSelectedProduct({ ...product, specs })
  //     setPage('product')
  //   } catch (error) {
  //     console.error('Failed to fetch product specs:', error)
  //   }
  // }
  const handleProductClick = async (product: Product) => {
  try {
    const res = await fetch(`/api/products/${product.id}/details`)
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const text = await res.text()
    const specs = text ? JSON.parse(text) : null

    setSelectedProduct({ 
      ...product, 
      specs: specs || {
        CPU: "Intel i7",
        RAM: "16GB",
        Storage: "512GB SSD",
        GPU: "NVIDIA GTX 1660",
        Warranty: "2 years"
      }
    })
    setPage('product')
  } catch (error) {
    console.error('Failed to fetch product specs:', error)
    setSelectedProduct({ 
      ...product, 
      specs: {
        CPU: "Intel i5",
        RAM: "8GB",
        Storage: "256GB SSD",
        GPU: "Integrated Graphics",
        Warranty: "1 year"
      }
    })
    setPage('product')
  }
}


  const handleAddToCart = (product: Product) => {
    setCart(prev => [...prev, product])
  }

  const handleCheckout = () => {
    setPage('orders')
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Navbar
        page={page === 'product' ? 'store' : page}
        setPage={setPage}
        cartCount={cart.length}
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

        {page === 'orders' && <Orders orders={orders} />}

        {page === 'checkout' && (
          <Checkout
            cart={cart}
            setCart={setCart}
            setOrders={setOrders}
            onCheckout={handleCheckout}
          />
        )}
      </main>
    </div>
  )
}

export default App
