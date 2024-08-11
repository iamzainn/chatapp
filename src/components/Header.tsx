 'use client'
 import Link from 'next/link';
import { useState, useEffect } from 'react';

import { cn } from '@/lib/utils';

import { ModeToggle } from './Theme-toggle';
import Auth from './Auth';



const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md" : "bg-transparent"
    )}>
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-heading text-2xl font-bold text-gray-900 dark:text-white">
             Chat App
            </span>
          </Link>

          

          <div className="flex items-center space-x-4">
            <ModeToggle />
            <Auth />

            

            
          </div>
        </div>
      </div>

      
    </header>
  );
};

export default Header;
