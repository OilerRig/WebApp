import { useState } from 'react'
import ProductCard from './ProductCard'

type Product = {
  id: string
  name: string
  price: number
  description: string
}

type Props = {
  products: Product[]
  onSelectProduct: (product: Product) => void
  onSearch: (term: string) => void
}

const PRODUCTS_PER_PAGE = 9

export default function StorePage({ products, onSelectProduct, onSearch }: Props) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const currentProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE)

  const handleSearch = () => {
    setCurrentPage(1)
    onSearch(searchTerm.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handleClear = () => {
    setSearchTerm('')
    setCurrentPage(1)
    onSearch('')
  }

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-8 mx-auto">
        {/* Search bar */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search products..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <button
            onClick={handleSearch}
            className="bg-[#262058] text-white px-4 rounded-r hover:bg-[#1f1a4a]"
          >
            Search
          </button>
          {searchTerm && (
            <button
              onClick={handleClear}
              className="ml-4 text-sm text-indigo-600 underline"
            >
              Clear
            </button>
          )}
        </div>

        {/* Product list */}
        <div className="flex flex-wrap -m-4">
          {currentProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onClick={() => onSelectProduct(product)}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-10">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded transition ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#262058] text-white hover:bg-[#1f1a4a]'
              }`}
            >
              Previous
            </button>

            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded transition ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#262058] text-white hover:bg-[#1f1a4a]'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
