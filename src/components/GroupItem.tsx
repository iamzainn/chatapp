import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";
import { format } from 'date-fns';

interface GroupItemProps {
  group: Group;
  isSelected: boolean;
  isCollapsed: boolean;
  onClick: (group: Group) => void;
}

const GroupItem: React.FC<GroupItemProps> = ({ group, isSelected, isCollapsed, onClick }) => {
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
      <Avatar onClick={() => onClick(group)}>
        <AvatarImage src={group.image} alt="Group Image" />
        <AvatarFallback>{group.name[0]}</AvatarFallback>
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
      onClick={() => onClick(group)}
    >
      <Avatar>
        <AvatarImage src={group.image} alt="Group Image" />
        <AvatarFallback>{group.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-start overflow-hidden">
        <span className="font-medium truncate w-full">{group.name}</span>
        {renderLastMessage(group.lastMessage)}
      </div>
      <Users size={16} className="ml-auto text-gray-500" />
    </Button>
  );
};

export default GroupItem;