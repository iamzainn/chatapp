'use client'

import { ChatLayout } from "@/components/chat-layout";
import { useQuery,useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";


export default function ChatClient() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  const usersChats = useQuery(api.chats.getUserChats,isAuthenticated?undefined:'skip');
  const allusers = useQuery(api.users.getUsers,isAuthenticated?undefined:'skip');

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }


 
  console.log({usersChats,allusers})



  

  



  

  return (
   <>
   
   
   </>
  );
}