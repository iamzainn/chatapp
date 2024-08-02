import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';

interface ChatItemProps {
  chat: Chat;
  isSelected: boolean;
  isCollapsed: boolean;
  onClick: (chat: Chat) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, isSelected, isCollapsed, onClick }) => {
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

  if (isCollapsed) {
    return (
      <Avatar onClick={() => onClick(chat)}>
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
        "w-full justify-start gap-4 my-1 p-3",
        isSelected && "bg-accent"
      )}
      onClick={() => onClick(chat)}
    >
      <Avatar>
        <AvatarImage src={chat.user?.profileImage || ""} alt="User Image" />
        <AvatarFallback>{chat.user?.firstName?.[0]}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-start overflow-hidden">
        <span className="font-medium truncate w-full">{chat.user?.firstName}</span>
        {renderLastMessage(chat.lastMessage)}
      </div>
    </Button>
  );
};

export default ChatItem;