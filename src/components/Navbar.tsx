import { useAuth0 } from '@auth0/auth0-react'
import oilRigLogo from '../assets/images/oil_rig.png'
import { ShoppingCart } from 'lucide-react'

type Props = {
  page: 'home' | 'store' | 'orders' | 'checkout' | 'payment' | 'admin'
  setPage: (p: Props['page']) => void
  cartCount: number
  isAdmin: boolean
}

export default function Navbar({ page, setPage, cartCount, isAdmin }: Props) {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0()

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
          className={`${page === 'home' ? 'text-white font-semibold' : 'text-white/80'} hover:text-white`}
        >
          Home
        </button>

        <span className="text-white/50">|</span>
        <button
          onClick={() => setPage('store')}
          className={`${page === 'store' ? 'text-white font-semibold' : 'text-white/80'} hover:text-white`}
        >
          Store
        </button>

        <span className="text-white/50">|</span>
        <button
          onClick={() => setPage('orders')}
          className={`${page === 'orders' ? 'text-white font-semibold' : 'text-white/80'} hover:text-white`}
        >
          Orders
        </button>

        {isAdmin && (
          <>
            <span className="text-white/50">|</span>
            <button
              onClick={() => setPage('admin')}
              className={`${page === 'admin' ? 'text-white font-semibold' : 'text-white/80'} hover:text-white`}
            >
              Admin
            </button>
          </>
        )}
      </div>

      {/* Right: Cart + Auth */}
      <div className="flex items-center space-x-4">
        {/* Cart button */}
        <button
          onClick={() => setPage('checkout')}
          className="relative flex items-center text-white hover:text-[#262058] transition"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="ml-1 text-sm font-medium">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs min-w-[20px] text-center px-1 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </button>

        {isLoading ? (
          <span className="text-white/80 text-sm">Loading...</span>
        ) : isAuthenticated ? (
          <div className="flex flex-col items-end space-y-1">
            <span className="text-[#262058] font-medium text-sm">
              Hi, {user?.given_name || user?.name || 'User'}
            </span>
            <button
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
              className="bg-[#262058] text-white font-medium px-4 py-1.5 rounded-lg shadow hover:bg-[#1f1a4a] transition"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() =>
                loginWithRedirect({
                  authorizationParams: {
                    screen_hint: 'signup',
                  },
                })
              }
              className="bg-[#262058] text-white font-medium px-4 py-1.5 rounded-lg shadow hover:bg-[#1f1a4a] transition"
            >
              Register
            </button>
            <button
              onClick={() => loginWithRedirect()}
              className="bg-[#262058] text-white font-medium px-4 py-1.5 rounded-lg shadow hover:bg-[#1f1a4a] transition"
            >
              Sign In
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
