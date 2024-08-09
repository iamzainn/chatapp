import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { Image, Video, FileText, MessageSquare } from 'lucide-react';
import { OneOnOneChat, Message, User } from '@/convexlibs/dbtypes';

interface ChatItemProps {
  chat: OneOnOneChat;
  isSelected: boolean;
  isCollapsed: boolean;
  onClick: (chat: OneOnOneChat) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, isSelected, isCollapsed, onClick }) => {
  const renderLastMessage = (lastMessage: Message | null) => {
    if (!lastMessage) return null;

    const getMessageIcon = () => {
      switch (lastMessage.type) {
        case 'image':
          return <Image size={16} className="mr-1 text-gray-500" />;
        case 'video':
          return <Video size={16} className="mr-1 text-gray-500" />;
        case 'file':
          return <FileText size={16} className="mr-1 text-gray-500" />;
        default:
          return <MessageSquare size={16} className="mr-1 text-gray-500" />;
      }
    };

    const truncatedContent = lastMessage.content.length > 20
      ? `${lastMessage.content.substring(0, 20)}...`
      : lastMessage.content;

    return (
      <div className="text-sm text-gray-500 flex justify-between items-center w-full">
        <span className="flex items-center">
          {getMessageIcon()}
          <span className="truncate">{truncatedContent}</span>
        </span>
        <span className="text-xs ml-2 shrink-0">{format(new Date(lastMessage.createdAt), 'HH:mm')}</span>
      </div>
    );
  };

  const AvatarWithStatus = ({ user }: { user: User | null }) => (
    <div className="relative" onClick={() => onClick(chat)}>
      <Avatar className={cn("shrink-0", isCollapsed && "cursor-pointer hover:ring-2 hover:ring-primary transition-all size-8")}>
        <AvatarImage src={user?.profileImage || ""} alt={user?.name || "User"} />
        <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
      </Avatar>
      {user?.isOnline && (
        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
      )}
    </div>
  );

  if (isCollapsed) {
    return <AvatarWithStatus user={chat.user} />;
  }

  return (
    <Button
      type='button'
      variant={isSelected ? "default" : "ghost"}
      size="icon"
      className={cn(
        "w-full justify-start gap-4 my-1 p-3 transition-all",
        isSelected ? "bg-accent shadow-md text-black hover:dark:bg-white hover:text-black" : "hover:bg-accent/15"
      )}
      onClick={() => onClick(chat)}
    >
      <AvatarWithStatus user={chat.user} />
      <div className="flex flex-col items-start overflow-hidden w-full">
        <span className="font-medium truncate w-full">{chat.user?.name || "Unknown User"}</span>
        {renderLastMessage(chat.lastMessage)}
      </div>
    </Button>
  );
};

export default ChatItem;