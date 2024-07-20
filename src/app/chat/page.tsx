import { ChatLayout } from "@/components/chat-layout";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { USERS } from "../../lib/dummy";


export const chatPage = async () => {
    const { getUser} = getKindeServerSession(); 
    const user = await getUser();
  

    if(!user){
        redirect('/')
    }


    const layout = cookies().get("react-resizable-panels:layout");
    const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
    
  return (
    <main className='flex h-screen flex-col items-center justify-center p-4 md:px-24 py-32 gap-4'>
  

    <div className='z-10 border rounded-lg max-w-5xl w-full min-h-[85vh] text-sm'>
      <ChatLayout defaultLayout={defaultLayout}navCollapsedSize={8} users={USERS} />
    </div>
  </main>
  )
}

export default chatPage;

