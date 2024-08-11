'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ModeToggle } from './Theme-toggle'
import Auth from './Auth'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="font-heading text-lg font-semibold text-gray-900 dark:text-white hidden sm:inline-block">
              Chat App
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-4">
              <Link
                href="/features"
                className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light transition-colors"
              >
                Features
              </Link>
          
            </nav>
            <ModeToggle />
            <Auth />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header