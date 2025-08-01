// src/components/layout/Header.tsx
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="border-b border-gray-800/50 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/logo.svg" 
              alt="DevMemory Logo" 
              width={32} 
              height={32}
              className="rounded-lg"
            />
            <span className="font-mono text-xl font-bold text-white">
              DevMemory
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/learn" 
              className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium"
            >
              Learn
            </Link>
            <Link 
              href="/ts" 
              className="text-gray-300 hover:text-red-400 transition-colors duration-200 font-medium"
            >
              TS
            </Link>
            <Link 
              href="/book" 
              className="text-gray-300 hover:text-green-400 transition-colors duration-200 font-medium"
            >
              Book
            </Link>
            <Link 
              href="/product" 
              className="text-gray-300 hover:text-purple-400 transition-colors duration-200 font-medium"
            >
              Product
            </Link>
            <Link 
              href="/about" 
              className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 font-medium"
            >
              About
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-300 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}