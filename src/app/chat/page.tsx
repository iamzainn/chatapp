

import { ChatLayout } from "@/components/chat-layout";

import prisma from "@/lib/db";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";

 async function fetchInitialData(userId: string): Promise<ChatResponse> {
  try {
    // Define queries
    const chatsPromise = prisma.chat.findMany({
      where: {
        isGroupChat: false,
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
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
          select: {
            content: true,
            createdAt: true,
            senderId: true,
          }
        }
      }
    });

    const groupsPromise = prisma.group.findMany({
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
        chats: {
          take: 1,
          include: {
            messages: {
              orderBy: {
                createdAt: 'desc'
              },
              take: 1,
              select: {
                content: true,
                createdAt: true,
                senderId: true,
              }
            }
          }
        }
      }
    });

    // Run queries concurrently
    const [chats, groups] = await Promise.all([chatsPromise, groupsPromise]);

    // Transform non-group chats
    const transformedChats: Chat[] = chats.map(chat => {
      const otherUser = chat.users.find(userChat => userChat.user.id !== userId)?.user;
      const lastMessage = chat.messages[0];

      return {
        id: chat.id,
        isGroupChat: chat.isGroupChat,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        user: otherUser ? {
          id: otherUser.id,
          firstName: otherUser.firstName,
          lastName: otherUser.lastName,
          email: otherUser.email,
          profileImage: otherUser.profileImage,
        } : undefined,
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          createdAt: lastMessage.createdAt,
          senderId: lastMessage.senderId,
        } : undefined
      };
    });

    // Transform groups
    const transformedGroups: Group[] = groups.map(group => {
      const lastMessage = group.chats[0]?.messages[0];

      return {
        id: group.id,
        name: group.name,
        image: group.image || '',
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
        groupAdminId: group.groupAdminId,
        numberOfMembers: group.users.length,
        groupchatId: group.chats[0]?.id ?? 0, // Add this line
        users: group.users.map(userGroup => ({
          id: userGroup.user.id,
          firstName: userGroup.user.firstName,
          lastName: userGroup.user.lastName,
          email: userGroup.user.email,
          profileImage: userGroup.user.profileImage,
        })),
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          createdAt: lastMessage.createdAt,
          senderId: lastMessage.senderId,
        } : undefined
      };
    });

    return {
      groups: transformedGroups,
      chats: transformedChats
    };

  } catch (error) {
    console.error('Error fetching initial user data:', error);
    return {
      groups: [],
      chats: []
    };
  }
}


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


 const Page = async () => {
    noStore();
    const { getUser} = getKindeServerSession(); 
    const user = await getUser();
    const data = await fetchInitialData(user?.id as string)
    console.log(JSON.stringify(data,null,2));
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

export default Page;





