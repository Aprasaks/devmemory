// src/components/layout/Header.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="border-b border-gray-800/50 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <Image
              src="/logo.svg"
              alt="DevMemory Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="font-mono text-xl font-bold text-white">DevMemory</span>
          </Link>

          {/* Desktop Navigation */}
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
              href="/books"
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
          <button
            className="md:hidden text-gray-300 hover:text-white transition-colors p-2"
            onClick={toggleMenu}
            aria-label="메뉴 열기/닫기"
          >
            <svg
              className={`w-6 h-6 transition-transform duration-200 ${isMenuOpen ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-64 opacity-100 mt-4" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <nav className="flex flex-col space-y-4 py-4 border-t border-gray-800/50">
            <Link
              href="/learn"
              className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium px-2 py-2 rounded-lg hover:bg-gray-800/30"
              onClick={closeMenu}
            >
              📚 Learn
            </Link>
            <Link
              href="/ts"
              className="text-gray-300 hover:text-red-400 transition-colors duration-200 font-medium px-2 py-2 rounded-lg hover:bg-gray-800/30"
              onClick={closeMenu}
            >
              🔷 TS
            </Link>
            <Link
              href="/books"
              className="text-gray-300 hover:text-green-400 transition-colors duration-200 font-medium px-2 py-2 rounded-lg hover:bg-gray-800/30"
              onClick={closeMenu}
            >
              📖 Book
            </Link>
            <Link
              href="/product"
              className="text-gray-300 hover:text-purple-400 transition-colors duration-200 font-medium px-2 py-2 rounded-lg hover:bg-gray-800/30"
              onClick={closeMenu}
            >
              🚀 Product
            </Link>
            <Link
              href="/about"
              className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 font-medium px-2 py-2 rounded-lg hover:bg-gray-800/30"
              onClick={closeMenu}
            >
              👋 About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
