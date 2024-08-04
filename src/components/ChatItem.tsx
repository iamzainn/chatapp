import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { Image, Video, FileText } from 'lucide-react';

interface ChatItemProps {
  chat: Chat;
  isSelected: boolean;
  isCollapsed: boolean;
  onClick: (chat: Chat) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, isSelected, isCollapsed, onClick }) => {
  const renderLastMessage = (lastMessage?: { content: string; createdAt: Date; senderId: string; type?: string }) => {
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
          return null;
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

  if (isCollapsed) {
    return (
      <Avatar onClick={() => onClick(chat)} className="cursor-pointer hover:ring-2 hover:ring-primary transition-all">
        <AvatarImage src={chat.user?.profileImage || ""} alt="User Image" />
        <AvatarFallback>{chat.user?.firstName?.[0]}</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Button
      variant={isSelected ? "default" : "ghost"}
      size="lg"
      className={cn(
        "w-full justify-start gap-4 my-1 p-3 transition-all",
        isSelected ? "bg-accent shadow-md" : "hover:bg-accent/50"
      )}
      onClick={() => onClick(chat)}
    >
      <Avatar className="shrink-0">
        <AvatarImage src={chat.user?.profileImage || ""} alt="User Image" />
        <AvatarFallback>{chat.user?.firstName?.[0]}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-start overflow-hidden w-full">
        <span className="font-medium truncate w-full">{chat.user?.firstName}</span>
        {renderLastMessage(chat.lastMessage)}
      </div>
    </Button>
  );
};

export default ChatItem;