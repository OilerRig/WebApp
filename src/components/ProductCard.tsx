type Product = {
  id: number
  name: string
  price: number
  description?: string
  onClick: () => void
}

export default function ProductCard({
  name,
  price,
  onClick,
}: Product) {
  return (
    <div className="p-4 md:w-1/3">
      <div
        onClick={onClick}
        className="h-full bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition transform hover:-translate-y-1 cursor-pointer"
      >
        <div className="text-xs text-gray-400 font-semibold tracking-wide mb-1">
          PRODUCT
        </div>

        <div className="text-xl font-semibold text-gray-900 mb-2">{name}</div>

        <div className="border-b border-gray-100 my-2" />

        <div className="flex justify-between items-center">
          <span className="text-indigo-600 text-sm font-medium hover:underline">
            Learn More →
          </span>
          <span className="text-gray-800 font-semibold">${price.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
