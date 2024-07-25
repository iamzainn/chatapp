import { ChatLayout } from "@/components/chat-layout";

import prisma from "@/lib/db";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";




    
export async function fetchUserChats(userId: string): Promise<ChatResponse[]> {
  try {
    const chats = await prisma.chat.findMany({
      where: {
        users: {
          some: {
            userId: userId,
          }
        }
      },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                profileImage: true,
              }
            }
          }
        },
        messages: true,
      }
    });

    const transformedChats: ChatResponse[] = chats.map(chat => {
      const isGroupChat = chat.isGroupChat;
      // console.log("is group chat", isGroupChat)
      const chatUsers = chat.users.map(userChat => userChat.user);
      // console.log("chat users", chatUsers);
      
      const response: ChatResponse = {
        id: chat.id,
        isGroupChat: isGroupChat,
        createdAt: chat.createdAt,
        messages: chat.messages.map(message => ({
          id: message.id,
          content: message.content,
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
          senderId: message.senderId,
          type:message.type,
          chatId: message.chatId

        }))
      };

      if (isGroupChat) {
        response.users = chatUsers;
      } else {
        response.user = chatUsers.find(u => u.id !== userId) || undefined
      }

      return response;
    });
    
    return transformedChats;
  } catch (error) {
    console.error('Error fetching user chats:', error);
    return [];
  }
}








export const chatPage = async () => {
    const { getUser} = getKindeServerSession(); 
    const user = await getUser();
   
    const data = await fetchUserChats(user?.id as string)
    // const allUsers = data.map((chat) => !chat.isGroupChat ? chat.user :null).flat() as User[];
    
    
  
   

    
    
  


    
  

    if(!user){
        redirect('/')
    }


    const layout = cookies().get("react-resizable-panels:layout");
    const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
    
  return (
    <main className='flex h-screen flex-col items-center justify-center p-4 md:px-24 py-32 gap-4'>
  

    <div className='z-10 border rounded-lg max-w-5xl w-full min-h-[85vh] text-sm'>
      <ChatLayout defaultLayout={defaultLayout}navCollapsedSize={8} chats={data}/>
    </div>
  </main>
  )
}

export default chatPage;

