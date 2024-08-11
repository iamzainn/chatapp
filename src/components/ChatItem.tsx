import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { Image, Video, FileText, MessageSquare, Check } from 'lucide-react';
import { OneOnOneChat, Message, User } from '@/convexlibs/dbtypes';

interface ChatItemProps {
  chat: OneOnOneChat;
  isSelected: boolean;
  isCollapsed: boolean;
  onClick: (chat: OneOnOneChat) => void;
  currentUserId: string;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, isSelected, isCollapsed, onClick, currentUserId }) => {
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

  if (isCollapsed) {
    return (
      <div className="flex justify-center my-2">
        <AvatarWithStatus user={chat.user} />
      </div>
    );
  }

  return (
    <Button
      type='button'
      variant="ghost"
      size="sm"
      className={cn(
        "w-full justify-start gap-3 my-1 p-2 transition-all",
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
    </Button>
  );
};

export default ChatItem;