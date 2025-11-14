'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Scale, Home, FileText, Gavel, Globe } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()
  
  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/case-setup', label: 'New Case', icon: FileText },
    { href: '/trial', label: 'Trial', icon: Scale },
    { href: '/verdict', label: 'Verdict', icon: Gavel }
  ]

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Scale className="h-8 w-8 text-legal-navy flex-shrink-0" />
            <span className="text-xl font-bold text-legal-navy">Vaquill</span>
          </Link>
          
          <div className="flex items-center space-x-8">
            <div className="flex space-x-6">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === href
                      ? 'text-legal-navy bg-blue-50'
                      : 'text-gray-600 hover:text-legal-navy hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
            
            <button className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-legal-navy hover:bg-gray-50 transition-colors">
              <Globe className="h-4 w-4 flex-shrink-0" />
              <span>EN</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}