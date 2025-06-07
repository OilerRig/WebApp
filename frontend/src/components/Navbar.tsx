import oilRigLogo from '../assets/images/oil_rig.png'

type Props = {
  page: 'home' | 'store'
  setPage: (p: 'home' | 'store') => void
}

export default function Navbar({ page, setPage }: Props) {
  return (
    <nav className="bg-[#dcd437] text-white px-6 py-4 flex justify-between items-center">
      {/* Left: Logo + nav links */}
      <div className="flex items-center space-x-4">
        <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setPage('home')}
            >
            <img src={oilRigLogo} alt="Oiler Rig Logo" className="w-8 h-8 rounded-full" />
            <span className="text-xl font-bold">Oiler Rig</span>
        </div>

        <span className="text-white/50">|</span>
        <button
          onClick={() => setPage('home')}
          className={`${
            page === 'home' ? 'text-white font-semibold' : 'text-white/80'
          } hover:text-white`}
        >
          Home
        </button>
        <span className="text-white/50">|</span>
        <button
          onClick={() => setPage('store')}
          className={`${
            page === 'store' ? 'text-white font-semibold' : 'text-white/80'
          } hover:text-white`}
        >
          Store
        </button>
      </div>

      {/* Right: Auth buttons */}
      <div className="space-x-3">
        <button className="bg-[#262058] text-white font-medium px-4 py-1.5 rounded-lg shadow hover:bg-[#1f1a4a] transition">
          Register
        </button>
        <button className="bg-[#262058] text-white font-medium px-4 py-1.5 rounded-lg shadow hover:bg-[#1f1a4a] transition">
          Sign In
        </button>
      </div>
    </nav>
  )
}
