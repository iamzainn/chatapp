import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOut, MessageCircle, Users } from "lucide-react";
import { useSelectedChat } from "@/store/useSelectedUser";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import UserListDialog from "./userlistDialogue";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { format } from 'date-fns';

interface SidebarProps {
  isCollapsed: boolean;
  chats: Chat[];
  users: User[];
  groups: Group[];
}

const Sidebar = ({ isCollapsed, chats, users, groups }: SidebarProps) => {
  const { selectedChat, setSelectedChat } = useSelectedChat();
  const { user } = useKindeBrowserClient();

  const handleChatClick = (item: Chat | Group | any) => {
	 console.log(item);
	 
	 if ('user' in item) {
      setSelectedChat(item);
    } else {
      setSelectedChat(item.chat as Chat);
    }
  };

  const renderLastMessage = (lastMessage?: { content: string; createdAt: Date; senderId: string }) => {
    if (!lastMessage) return null;
    const truncatedContent = lastMessage.content.length > 20
      ? `${lastMessage.content.substring(0, 20)}...`
      : lastMessage.content;
    return (
      <div className="text-sm text-gray-500 flex justify-between items-center w-full">
        <span>{truncatedContent}</span>
        <span className="text-xs">{format(new Date(lastMessage.createdAt), 'HH:mm')}</span>
      </div>
    );
  };

  const renderItem = (item: Chat | Group, idx: number) => {
    const isGroup = 'groupAdminId' in item;
    const isSelected = selectedChat?.id === item.id;

    return isCollapsed ? (
      <TooltipProvider key={idx}>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "flex items-center justify-center p-2 rounded-lg cursor-pointer transition-colors",
                isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              )}
              onClick={() => handleChatClick(item)}
            >
              <Avatar>
                <AvatarImage
                  src={isGroup ? item.image : item.user?.profileImage || "/chat.user-placeholder.png"}
                  alt={isGroup ? 'Group Image' : 'User Image'}
                />
                <AvatarFallback>{isGroup ? item.name[0] : item.user?.firstName[0]}</AvatarFallback>
              </Avatar>
            </div>
          </TooltipTrigger>
          <TooltipContent side='right' className='flex items-center gap-4'>
            {isGroup ? item.name : item.user?.firstName}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ) : (
      <Button
        key={idx}
        variant={isSelected ? "default" : "ghost"}
        size='lg'
        className={cn(
          "w-full justify-start gap-4 my-1 p-3",
          isSelected && "bg-accent"
        )}
        onClick={() => handleChatClick(item)}
      >
        <Avatar>
          <AvatarImage
            src={isGroup ? item.image : item.user?.profileImage || "/chat.user-placeholder.png"}
            alt={isGroup ? 'Group Image' : 'User Image'}
          />
          <AvatarFallback>{isGroup ? item.name[0] : item.user?.firstName[0]}</AvatarFallback>
        </Avatar>
        <div className='flex flex-col items-start overflow-hidden'>
          <span className="font-medium truncate w-full">
            {isGroup ? item.name : item.user?.firstName}
          </span>
          {renderLastMessage(item.lastMessage)}
        </div>
        {isGroup && <Users size={16} className="ml-auto text-gray-500" />}
      </Button>
    );
  };

  return (
    <div className='flex flex-col h-full bg-background'>
      <div className='p-4'>
        {!isCollapsed && (
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-2xl font-bold'>Chats</h2>
            <UserListDialog users={users}></UserListDialog>
          </div>
        )}
      </div>

      <ScrollArea className='flex-1 px-2'>
        <div className='space-y-2'>
          {[...chats, ...groups].map(renderItem)}
        </div>
      </ScrollArea>

      <div className='mt-auto p-4'>
        <div className='flex items-center gap-4'>
          {!isCollapsed && (
            <>
              <Avatar>
                <AvatarImage
                  src={user?.picture || "/chat.user-placeholder.png"}
                  alt='avatar'
                  referrerPolicy='no-referrer'
                />
                <AvatarFallback>{user?.given_name?.[0]}</AvatarFallback>
              </Avatar>
              <div className='flex-1 min-w-0'>
                <p className='font-medium truncate'>{user?.given_name}</p>
                <p className='text-sm text-gray-500 truncate'>{user?.email}</p>
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
};

export default Sidebar;