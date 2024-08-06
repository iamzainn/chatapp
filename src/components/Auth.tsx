

import { SignInButton, UserButton } from '@clerk/nextjs'
import { Authenticated, Unauthenticated } from 'convex/react'
import React from 'react'

const Auth = () => {
  return (
   <>
    <Unauthenticated>    
     <SignInButton mode='modal' />    
    </Unauthenticated>  
    <Authenticated>
    <UserButton />
    </Authenticated>
   
   </>
  )
}

export default Auth
