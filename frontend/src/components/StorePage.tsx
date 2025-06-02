import { useState } from 'react'
import ProductCard from './ProductCard'

type Product = {
  id: number
  name: string
  vendorName: string
  price: number
  stock: number
}

type Props = {
  products: Product[]
  currentPage: number
  totalPages: number
  onSelectProduct: (product: Product) => void
  onSearch: (term: string) => void
  onPageChange: (newPage: number) => void
}

export default function StorePage({
  products,
  currentPage,
  totalPages,
  onSelectProduct,
  onSearch,
  onPageChange,
}: Props) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = () => {
    console.log('StorePage searchTerm:');

    onSearch(searchTerm.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handleClear = () => {
    setSearchTerm('')
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
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              description=""
              onClick={() => onSelectProduct(product)}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-10">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className={`px-4 py-2 rounded transition ${
                currentPage === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#262058] text-white hover:bg-[#1f1a4a]'
              }`}
            >
              Previous
            </button>

            <span className="text-sm text-gray-600">
              Page {currentPage + 1} of {totalPages}
            </span>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className={`px-4 py-2 rounded transition ${
                currentPage >= totalPages - 1
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
