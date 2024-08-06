
import { cookies } from "next/headers";

import ChatClient from "./Client";
export default function ChatPage() {
  
  const layout = cookies().get("react-resizable-panels:layout");
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;


  

  return (
   <>
   <ChatClient></ChatClient>
   
   </>
  );
}