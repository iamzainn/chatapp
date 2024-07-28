
import { fetchData } from "@/action";
import { ChatLayout } from "@/components/chat-layout";

import prisma from "@/lib/db";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getallusers (myId:string){

  const allUsers = await prisma.user.findMany({
    select:{
        id:true,
        email:true,
        firstName:true,
        createdAt:true,
        lastName:true,
        profileImage:true,
    }
  })
  

  return allUsers.filter(user=>user.id!==myId);

}




    






export const chatPage = async () => {
    const { getUser} = getKindeServerSession(); 
    const user = await getUser();
    const data = await fetchData(user?.id as string)
    // console.log(JSON.stringify(data,null,2));
    const Users = await getallusers(user?.id as string);

    if(!user){
        redirect('/')
    }


    const layout = cookies().get("react-resizable-panels:layout");
    const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
    
  return (
    <main className='flex h-screen flex-col items-center justify-center p-4 md:px-24 py-32 gap-4'>
    <div className='z-10 border rounded-lg max-w-5xl w-full min-h-[85vh] text-sm'>
      <ChatLayout groups={data.groups!} defaultLayout={defaultLayout}navCollapsedSize={8} chats={data.chats!} users={Users}/>
    </div>
  </main>
  )
}

export default chatPage;





