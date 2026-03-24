import { useState } from 'react'
import { Palette } from 'lucide-react'
import { Navigation, MobileMenuToggle } from '@/components/composite/Navigation'
import { WalletConnect } from './WalletConnect'

const navigationItems = [
  { label: 'Home', href: '/' },
  { label: 'Explore', href: '/explore' },
  { label: 'Create', href: '/mint' },
  { label: 'Profile', href: '/profile' },
]

const brand = {
  name: 'Muse',
  icon: <Palette className="h-8 w-8 text-primary-600" />,
  href: '/',
}

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-secondary-200 bg-white/80 backdrop-blur-sm nav-mobile">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Desktop navigation */}
          <div className="flex-1 hidden md:flex">
            <Navigation
              items={navigationItems}
              brand={brand}
              actions={<WalletConnect />}
            />
          </div>

          {/* Mobile: brand + hamburger toggle */}
          <div className="flex md:hidden items-center justify-between w-full">
            <Navigation brand={brand} items={[]} />
            <MobileMenuToggle
              isOpen={isMobileMenuOpen}
              onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <Navigation
          items={navigationItems}
          mobile
          actions={<WalletConnect />}
        />
      )}
    </nav>
  )
}
