import React, { forwardRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSelectedChat } from "@/store/useSelectedChat";
import { useQuery, useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";
import UserListDialog from "./UserlistDialogue";
import ChatItem from './ChatItem';
import GroupItem from './GroupItem';
import { Skeleton } from './ui/skeleton';
import { ChatData, Chat, OneOnOneChat, User, GroupChat } from '@/convexlibs/dbtypes';
import { UserButton } from '@clerk/nextjs';

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(({ isCollapsed }, ref) => {
  const { selectedChat, setSelectedChat } = useSelectedChat();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  
  const chatsData: ChatData | undefined = useQuery(api.chats.getUserChats, 
    isAuthenticated ? undefined : 'skip'
  );
  const me:User | undefined = useQuery(api.users.getMe, 
    isAuthenticated ? undefined : 'skip'
  );

 

  const isLoading = authLoading || (isAuthenticated && !chatsData);

  const handleChatClick = (chat: OneOnOneChat) => {
    
    if(chat.isGroupChat ==false){
      const currentChat:Chat = {
        isGroupChat:false,
        _id:chat._id,
        createdAt:chat.createdAt,
        lastMessage:chat.lastMessage,
        lastMessageId:chat.lastMessageId,
        updatedAt:chat.updatedAt,
        user:chat.user as User,
       }
       setSelectedChat(currentChat);
    }
   
  
        
  };

  const handlegroupChatClick = (chat: GroupChat) => {
  
    if (chat.isGroupChat) {
    const currentChat: Chat = {
      isGroupChat: true,
      _id: chat._id,
      numberOfMembers: chat.numberOfMembers,
      createdAt: chat.createdAt,
      lastMessage: chat.lastMessage,
      lastMessageId: chat.lastMessageId,
      updatedAt: chat.updatedAt,
      groupAdminId: chat.groupAdminId as string,
      image: chat.image,
      name: chat.name,
      users: chat.users,
    }
    setSelectedChat(currentChat);
  }
  
  };
  if (isLoading) {
    return <Skeleton className="h-full w-full" />;
  }
  const userChats = chatsData?.user1v1chats || [];
  const userGroupChats = chatsData?.usergroupschats || [];

  return (
    <div ref={ref} className="flex flex-col h-full bg-background">
      <div className="p-4">
        {!isCollapsed && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Chats</h2>
            <UserListDialog />
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-2">
          {userChats.map((chat, idx) => (
            <TooltipProvider key={`chat-${chat._id}`}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div>
                    <ChatItem
                      chat={chat}
                      isSelected={selectedChat?._id === chat._id}
                      isCollapsed={isCollapsed}
                      onClick={() => handleChatClick(chat)}
                      currentUserId={me?._id!}
                      
                    />
                  </div>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" className="flex items-center gap-4">
                    {chat.user?.name}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
          {userGroupChats.map((group, idx) => (
            <TooltipProvider key={`group-${group._id}`}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div>
                    <GroupItem
                      group={group}
                      isSelected={selectedChat?._id === group._id}
                      isCollapsed={isCollapsed}
                      onClick={() => handlegroupChatClick(group)}
                      currentUserId={me?._id!}
                      
                    />
                  </div>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" className="flex items-center gap-4">
                    {group.name}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </ScrollArea>

      <div className="mt-auto p-4 flex">
        <div className="flex items-center gap-4">
          <UserButton />
        </div>
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;