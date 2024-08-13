import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { Image, Video, FileText, MessageSquare, Check, Link } from 'lucide-react';
import { OneOnOneChat, Message, User } from '@/convexlibs/dbtypes';
import { Badge } from './ui/badge';

interface ChatItemProps {
  chat: OneOnOneChat;
  isSelected: boolean;
  isCollapsed: boolean;
  onClick: (chat: OneOnOneChat) => void;
  currentUserId: string;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, isSelected, isCollapsed, onClick, currentUserId })=> {
  const senderId = chat?.UnreadNotifications?.senderId;
  const unreadCount = chat?.UnreadNotifications?.totals || 0;
  const renderLastMessage = (lastMessage: Message | null) => {
    if (!lastMessage) return null;
    const getMessageIcon = () => {
      switch (lastMessage.type) {
        case 'image':
          return <Image size={14} className="mr-1 text-muted-foreground" />;
        case 'video':
          return <Video size={14} className="mr-1 text-muted-foreground" />;
        case 'file':
          return <FileText size={14} className="mr-1 text-muted-foreground" />;
          case 'link':   
          
          return <Link size={14} className="mr-1 text-muted-foreground"></Link>  
        default:
          return <MessageSquare size={14} className="mr-1 text-muted-foreground" />;
      }
    };

    const truncatedContent = lastMessage.content.length > 20
      ? `${lastMessage.content.substring(0, 20)}...`
      : lastMessage.content;

    const isMyMessage = lastMessage.senderId === currentUserId;

    return (
      <div className="text-xs text-muted-foreground flex justify-between items-center w-full">
        <span className="flex items-center space-x-1 truncate">
          {getMessageIcon()}
          <span className="truncate">{truncatedContent}</span>
        </span>
        <div className="flex items-center space-x-1 shrink-0">
          {isMyMessage && (
            <div className="flex">
              <Check size={12} className="text-blue-500" />
              <Check size={12} className="text-blue-500 -ml-1" />
            </div>
          )}
          <span className="text-[10px]">{format(new Date(lastMessage.createdAt), 'HH:mm')}</span>
        </div>
      </div>
    );
  };

  const AvatarWithStatus = ({ user }: { user: User | null }) => (
    <div className="relative" onClick={() => onClick(chat)}>
      <Avatar className={cn(
        "shrink-0 transition-all",
        isCollapsed && "cursor-pointer hover:ring-2 hover:ring-primary size-7",
        !isCollapsed && "size-9"
      )}>
        <AvatarImage src={user?.profileImage || ""} alt={user?.name || "User"} />
        <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
      </Avatar>
      {user?.isOnline && (
        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-900" />
      )}
    </div>
  );

  const NotificationBadge = () => {
    if (senderId === currentUserId || unreadCount === 0) return null;
    return (
      <Badge 
        variant="destructive" 
        className="absolute top-0 right-0 px-1 min-w-[1.5rem] h-5 flex items-center justify-center text-xs font-bold rounded-full"
      >
        {unreadCount > 99 ? '99+' : unreadCount}
      </Badge>
    );
  };

  if (isCollapsed) {
    return (
      <div className="flex justify-center my-2 relative">
        <AvatarWithStatus user={chat.user} />
        <NotificationBadge />
      </div>
    );
  }

  return (
    <Button
      type='button'
      variant="ghost"
      size="sm"
      className={cn(
        "w-full justify-start gap-3 my-1 p-2 transition-all relative",
        isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent/10 dark:hover:bg-accent/20",
        "dark:text-foreground"
      )}
      onClick={() => onClick(chat)}
    >
      <AvatarWithStatus user={chat.user} />
      <div className="flex flex-col items-start overflow-hidden w-full">
        <span className="font-medium text-sm truncate w-full">{chat.user?.name || "Unknown User"}</span>
        {renderLastMessage(chat.lastMessage)}
      </div>
      <NotificationBadge />
    </Button>
  );
};

export default ChatItem;
