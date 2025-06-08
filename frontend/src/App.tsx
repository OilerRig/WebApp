import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import StorePage from './components/StorePage'
import ProductDetails from './components/ProductDetails'
import Checkout from './components/Checkout'
import { Product } from '../src/types' // adjust relative path as needed


import './index.css'

// type Product = {
//   id: string
//   name: string
//   price: number
//   description: string
//   image?: string
// }

function App() {
  const [page, setPage] = useState<'home' | 'store' | 'product' | 'orders' | 'checkout'>('home')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cart, setCart] = useState<Product[]>([])

  const products: Product[] = [
    { id: '1', name: 'Intel i9 CPU', price: 499.99, description: 'High-performance processor for gaming and productivity.' },
    { id: '2', name: 'NVIDIA RTX 4080', price: 1199.99, description: 'Top-tier graphics card for ultra settings and 4K.' },
    { id: '3', name: '32GB DDR5 RAM', price: 159.99, description: 'Blazing fast memory for modern multitasking.' },
    { id: '4', name: '1TB NVMe SSD', price: 129.99, description: 'Ultra-fast storage for loading games and software.' },
    { id: '5', name: '750W Power Supply', price: 89.99, description: 'Reliable modular PSU with 80+ Gold certification.' },
    { id: '6', name: 'Mid Tower ATX Case', price: 79.99, description: 'Spacious case with airflow-focused design.' },
    { id: '7', name: 'Noctua Air Cooler', price: 99.99, description: 'Whisper-quiet CPU air cooling solution.' },
    { id: '8', name: 'ASUS Z790 Motherboard', price: 289.99, description: 'Next-gen board with DDR5, PCIe 5.0, and WiFi 6E.' },
    { id: '9', name: 'Corsair Gaming Mouse', price: 49.99, description: 'High-precision FPS mouse with RGB lighting.' },
    { id: '10', name: 'Mechanical Keyboard', price: 119.99, description: 'Hot-swappable switches with customizable RGB.' },
    { id: '11', name: '4K 144Hz Monitor', price: 499.99, description: 'Stunning color accuracy and ultra-fast refresh rate.' },
    { id: '12', name: 'Windows 11 Pro License', price: 139.99, description: 'Digital license for latest Windows OS.' },
    { id: '13', name: 'External HDD 2TB', price: 69.99, description: 'Portable backup drive with USB 3.2 support.' },
  ]

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setPage('product')
  }

  const handleAddToCart = (product: Product) => {
    setCart((prev) => [...prev, product])
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
            onSelectProduct={handleProductClick}
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

        {page === 'orders' && (
          <div className="text-center text-2xl p-6 text-gray-700">
            Orders page goes here
          </div>
        )}

        {page === 'checkout' && <Checkout cart={cart} setCart={setCart} />}


      </main>
    </div>
  )
}

export default App
