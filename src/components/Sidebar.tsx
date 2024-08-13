import React, { forwardRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSelectedChat } from "@/store/useSelectedChat";
import { useQuery, useConvexAuth, useMutation } from "convex/react";
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
  const chatsData = useQuery(api.chats.getUserChats, isAuthenticated ? undefined : 'skip');
  const me = useQuery(api.users.getMe, isAuthenticated ? undefined : 'skip');
   
  const isLoading = authLoading || (isAuthenticated && !chatsData);
  const markAllNotficationChatsAsRead = useMutation(api.notifications.markChatNotificationsAsRead);



  const handleChatClick = async(chat: OneOnOneChat | GroupChat) => {
    const currentChat: Chat = chat.isGroupChat
      ? {
          isGroupChat: true,
          _id: chat._id,
          numberOfMembers: (chat as GroupChat).numberOfMembers,
          createdAt: chat.createdAt,
          lastMessage: chat.lastMessage,
          lastMessageId: chat.lastMessageId,
          updatedAt: chat.updatedAt,
          groupAdminId: (chat as GroupChat).groupAdminId as string,
          image: (chat as GroupChat).image,
          name: (chat as GroupChat).name,
          users: (chat as GroupChat).users,
        }
      : {
          isGroupChat: false,
          _id: chat._id,
          createdAt: chat.createdAt,
          lastMessage: chat.lastMessage,
          lastMessageId: chat.lastMessageId,
          updatedAt: chat.updatedAt,
          user: (chat as OneOnOneChat).user as User,
        };
     await markAllNotficationChatsAsRead({ chatId: currentChat._id });   
    setSelectedChat(currentChat);
  };

  if (isLoading) {
    return <Skeleton className="h-full w-full" />;
  }

  const userChats = chatsData?.user1v1chats || [];
  const userGroupChats = chatsData?.usergroupschats || [];

  return (
    <div ref={ref} className="flex flex-col h-full bg-background">
      <div className="p-4 flex justify-between items-center">
        {!isCollapsed && <h2 className="text-2xl font-bold">Chats</h2>}
        <div className={`flex items-center gap-2 ${isCollapsed ? 'justify-center w-full' : ''}`}>
          <UserListDialog />
         
        </div>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-2">
          {[...userChats, ...userGroupChats].map((chat) => (
            <TooltipProvider key={chat._id}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div>
                    {chat.isGroupChat ? (
                      <GroupItem
                        group={chat as GroupChat}
                        isSelected={selectedChat?._id === chat._id}
                        isCollapsed={isCollapsed}
                        onClick={() => handleChatClick(chat)}
                        currentUserId={me?._id!}
                      />
                    ) : (
                      <ChatItem
                        chat={chat as OneOnOneChat}
                        isSelected={selectedChat?._id === chat._id}
                        isCollapsed={isCollapsed}
                        onClick={() => handleChatClick(chat)}
                        currentUserId={me?._id!}
                      />
                    )}
                  </div>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" className="flex items-center gap-4">
                    {chat.isGroupChat ? (chat as GroupChat).name : (chat as OneOnOneChat).user?.name}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </ScrollArea>

      { (
        <div className="mt-auto p-4 flex justify-center">
          <UserButton />
        </div>
      )}
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;