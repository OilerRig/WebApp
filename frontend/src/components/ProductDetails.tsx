import { Product } from '../types' // adjust relative path as needed


type Props = {
  product: Product
  onBack: () => void
  onAddToCart: (product: Product) => void
  onProceedToCheckout: () => void
  showCheckoutButton: boolean
}

export default function ProductDetails({
  product,
  onBack,
  onAddToCart,
  onProceedToCheckout,
  showCheckoutButton,
}: Props) {
  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-col lg:flex-row lg:items-start">
          <div className="lg:w-full w-full lg:pl-10 lg:py-6">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">BRAND NAME</h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">{product.name}</h1>
            <div className="flex mb-4">
              <span className="flex items-center text-indigo-500">
                ★★★★☆
                <span className="text-gray-600 ml-2">4 Reviews</span>
              </span>
            </div>
            <p className="leading-relaxed">{product.description}</p>

            <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
              <div className="flex">
                <span className="mr-3">Color</span>
                <button className="border-2 border-gray-300 rounded-full w-6 h-6 focus:outline-none"></button>
                <button className="border-2 border-gray-300 ml-1 bg-gray-700 rounded-full w-6 h-6 focus:outline-none"></button>
                <button className="border-2 border-gray-300 ml-1 bg-indigo-500 rounded-full w-6 h-6 focus:outline-none"></button>
              </div>
              <div className="flex ml-6 items-center">
                <span className="mr-3">Size</span>
                <div className="relative">
                  <select className="rounded border appearance-none border-gray-300 py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-200">
                    <option>SM</option>
                    <option>M</option>
                    <option>L</option>
                    <option>XL</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 items-center">
              <span className="title-font font-medium text-2xl text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              <button
                onClick={() => onAddToCart(product)}
                className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
              >
                Add to Cart
              </button>
              {showCheckoutButton && (
                <button
                  onClick={onProceedToCheckout}
                  className="text-white bg-green-600 border-0 py-2 px-6 focus:outline-none hover:bg-green-700 rounded"
                >
                  Proceed to Checkout
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
