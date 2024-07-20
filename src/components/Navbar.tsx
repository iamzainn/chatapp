import { LoginLink, RegisterLink, getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { WebcamIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import { Button } from './ui/button';
import { UserDropdown } from './UserDropdown';

const Navbar = async() => {

    const { getUser} = getKindeServerSession(); 
    const user = await getUser();
    return (
    
     <>
      <header className="flex items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
        <Link href="#" className="flex items-center" prefetch={false}>
          <WebcamIcon className="h-8 w-8 text-primary" />
          <span className="ml-2 text-lg font-semibold">Chatter</span>
        </Link>
        <nav className="hidden space-x-4 sm:flex">
          <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors" prefetch={false}>
            Features
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-primary transition-colors" prefetch={false}>
            Pricing
          </Link>

        </nav>
       {user ? (
          <UserDropdown
            email={user.email as string}
            name={user.given_name as string}
            userImage={
              user.picture ?? `https://avatar.vercel.sh/${user.given_name}`
            }
          />
        ) : (
          <div className="flex items-center space-x-3">
            <Button variant="ghost" asChild>
              <LoginLink>Sign in</LoginLink>
            </Button>
            <span className="h-6 w-px bg-gray-200"></span>
            <Button variant="ghost" asChild>
              <RegisterLink>Create Account</RegisterLink>
            </Button>
          </div>
        )}
        
       
      </header>
     </>
    
);
        
               
         
       
        
}

export default Navbar
