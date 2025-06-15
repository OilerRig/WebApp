import { Product } from '../types'

type Props = {
  product: Product
  onBack: () => void
  onAddToCart: (product: Product) => void
  onProceedToCheckout: () => void
  showCheckoutButton: boolean
  cartCountForProduct: number
}

export default function ProductDetails({
  product,
  onBack,
  onAddToCart,
  onProceedToCheckout,
  showCheckoutButton,
  cartCountForProduct,
}: Props) {
  const specs = product.details || {}

  const excludedKeys = ['id', 'name', 'price', 'stock', 'vendorName', 'details']
  const isOutOfStock = product.stock === 0
  const limitReached = cartCountForProduct >= product.stock

  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-col lg:flex-row lg:items-start">
          <div className="lg:w-full w-full lg:pl-10 lg:py-6">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">BRAND NAME</h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">{product.name}</h1>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Specifications</h3>
              <ul className="space-y-1 text-gray-700">
                <li>
                  <span className="font-medium">Name:</span> {product.name}
                </li>
                {product.vendorName && (
                  <li>
                    <span className="font-medium">Vendor:</span> {product.vendorName}
                  </li>
                )}
                <li>
                  <span className="font-medium">Price:</span> ${product.price.toFixed(2)}
                </li>
                <li>
                  <span className="font-medium">Stock:</span> {product.stock}
                </li>
                {Object.entries(specs)
                  .filter(([key]) => !excludedKeys.includes(key))
                  .map(([key, value]) => (
                    <li key={key}>
                      <span className="font-medium">{key}:</span> {String(value)}
                    </li>
                  ))}
              </ul>
            </div>

            <div className="flex space-x-4 items-center mt-6">
              <span className="title-font font-medium text-2xl text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              <button
                onClick={() => onAddToCart(product)}
                disabled={limitReached}
                className={`text-white border-0 py-2 px-6 rounded ${
                  limitReached
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-500 hover:bg-indigo-600'
                }`}
              >
                Add to Cart
              </button>
              {showCheckoutButton && (
                <button
                  onClick={onProceedToCheckout}
                  className="text-white bg-green-600 border-0 py-2 px-6 focus:outline-none hover:bg-green-700 rounded"
                >
                  Go to Cart
                </button>
              )}
            </div>

            <button
              onClick={onBack}
              className="mt-6 text-sm text-indigo-500 hover:underline"
            >
              ← Back to Store
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
