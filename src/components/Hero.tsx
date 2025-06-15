import pcImage from '../assets/images/pc_image.png'


type HeroProps = {
  onMoreInfo?: () => void
}

export default function Hero({ onMoreInfo }: HeroProps) {
  return (
    <section className="bg-[#dcd437] text-white py-16 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between">
      {/* Left: Text */}
      <div className="max-w-xl space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">
          Build your perfect PC with ease
        </h1>
        <p className="text-lg text-blue-100">
          Explore our selection of computer parts, compare prices, and assemble your dream setup in minutes. Whether you're a gamer, a creator, or a builder , we’ve got the pieces you need.
        </p>
        <button
          className="bg-[#262058] text-white font-semibold px-6 py-2 rounded shadow hover:bg-gray-100 transition"
          onClick={onMoreInfo}
        >
          More info
        </button>
      </div>

      {/* Right: Image */}
      <div className="mt-10 md:mt-0">
        <img
          src={pcImage}
          alt="PC parts"
          className="w-64 md:w-96 rounded-xl shadow-lg"
        />
      </div>
    </section>
  )
}
