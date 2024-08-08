import React, { forwardRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSelectedChat } from "@/store/useSelectedChat";
import { useQuery,useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";

import UserListDialog from "./userlistDialogue";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import ChatItem from './ChatItem';
import GroupItem from './GroupItem';
import { useGroupStore } from '../store/groupchatstore';
import { updateLogoutStatus } from '@/action';
import { Skeleton } from './ui/skeleton';
import { ChatData, User,OneOnOneChat,GroupChat } from '@/convexlibs/dbtypes';
import { UserButton } from '@clerk/nextjs';


interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(({ isCollapsed }, ref) => {
  const { selectedChat, setSelectedChat } = useSelectedChat();
 
  const { isAuthenticated, isLoading } = useConvexAuth();
  const chatsData:ChatData = useQuery(api.chats.getUserChats,isAuthenticated?undefined:'skip');
  const users:User[] | undefined = useQuery(api.users.getUsers,isAuthenticated?undefined:'skip');
  const   UserChats  = chatsData ?  chatsData.user1v1chats:[]; 
  const   UserGroupsChats = chatsData ? chatsData.usergroupschats: [];




  




  if (isLoading) {
  <Skeleton></Skeleton>
  }

  // const handleChatClick = (chat: Chat) => {
  //   setSelectedChat(chat);
  // };



  // const handleGroupClick = (group: Group) => {
  //   setCurrentGroup(group);
  //   const groupChat: Chat = {
  //     id: group.groupchatId,
  //     isGroupChat: true,
  //     createdAt: group.createdAt,
  //     updatedAt: group.updatedAt,
  //     users: group.users,
  //     lastMessage: group.lastMessage,
  //   };
  //   setSelectedChat(groupChat);
  // };

  return (
    <div ref={ref} className="flex flex-col h-full bg-background">
      <div className="p-4">
        {!isCollapsed && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Chats</h2>
            <UserListDialog users={users!} />
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-2">
          {UserChats?.map((chat, idx) => (
            <TooltipProvider key={`chat-${idx}`}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div>
                    <ChatItem
                      chat={chat}
                      isSelected={selectedChat?._id === chat._id}
                      isCollapsed={isCollapsed}
                      // onClick={handleChatClick}
                      onClick={()=>{}}
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
          {UserGroupsChats?.map((group, idx) => (
            <TooltipProvider key={`group-${idx}`}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div>
                    <GroupItem
                      group={group}
                      isSelected={selectedChat?._id === group._id}
                      isCollapsed={isCollapsed}
                      // onClick={handleGroupClick}
                      onClick={()=>{}}
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

      <div className="mt-auto p-4">
        <div className="flex items-center gap-4">
          <UserButton></UserButton>
        </div>
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;