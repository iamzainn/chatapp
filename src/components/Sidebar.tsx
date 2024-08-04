import React, { forwardRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useSelectedChat } from "@/store/useSelectedUser";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import UserListDialog from "./userlistDialogue";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import ChatItem from './ChatItem';
import GroupItem from './GroupItem';
import { useGroupStore } from '../store/groupchatstore';

interface SidebarProps {
  isCollapsed: boolean;
  chats: Chat[];
  users: User[];
  groups: Group[];
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(({ isCollapsed, chats, users, groups }, ref) => {
  const { selectedChat, setSelectedChat } = useSelectedChat();
  const { user } = useKindeBrowserClient();
  const { setCurrentGroup } = useGroupStore();

  const handleChatClick = (chat: Chat) => {
    setSelectedChat(chat);
  };

  const handleGroupClick = (group: Group) => {
    setCurrentGroup(group);
    const groupChat: Chat = {
      id: group.groupchatId,
      isGroupChat: true,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
      users: group.users,
      lastMessage: group.lastMessage,
    };
    setSelectedChat(groupChat);
  };

  return (
    <div ref={ref} className="flex flex-col h-full bg-background">
      <div className="p-4">
        {!isCollapsed && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Chats</h2>
            <UserListDialog users={users} />
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-2">
          {chats.map((chat, idx) => (
            <TooltipProvider key={`chat-${idx}`}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div>
                    <ChatItem
                      chat={chat}
                      isSelected={selectedChat?.id === chat.id}
                      isCollapsed={isCollapsed}
                      onClick={handleChatClick}
                    />
                  </div>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" className="flex items-center gap-4">
                    {chat.user?.firstName}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
          {groups.map((group, idx) => (
            <TooltipProvider key={`group-${idx}`}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div>
                    <GroupItem
                      group={group}
                      isSelected={selectedChat?.id === group.groupchatId}
                      isCollapsed={isCollapsed}
                      onClick={handleGroupClick}
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
          {!isCollapsed && (
            <>
              <Avatar>
                <AvatarImage
                  src={user?.picture || ""}
                  alt="avatar"
                  referrerPolicy="no-referrer"
                />
                <AvatarFallback>{user?.given_name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.given_name}</p>
                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
              </div>
            </>
          )}
          <LogoutLink>
            <Button variant="ghost" size="icon">
              <LogOut size={20} />
            </Button>
          </LogoutLink>
        </div>
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;