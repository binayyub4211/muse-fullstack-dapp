import { useState } from 'react'
import { Muse } from 'lucide-react'
import { Navigation, MobileMenuToggle } from '@/components/composite/Navigation'
import { WalletConnect } from './WalletConnect'

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    { label: 'Home', href: '/' },
    { label: 'Explore', href: '/explore' },
    { label: 'Create', href: '/mint' },
    { label: 'Profile', href: '/profile' }
  ]

  const brand = {
    name: 'Muse',
    icon: <Muse className="h-8 w-8 text-primary-600" />,
    href: '/'
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-secondary-200 bg-white/80 backdrop-blur-sm nav-mobile">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Navigation
            items={navigationItems}
            brand={brand}
            actions={<WalletConnect />}
          />
          
          <div className="md:hidden">
            <MobileMenuToggle
              isOpen={isMobileMenuOpen}
              onToggle={toggleMobileMenu}
            />
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
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
