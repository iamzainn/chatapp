import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Users, Image, Video, FileText, MessageSquare, Check } from "lucide-react";
import { format } from 'date-fns';
import { GroupChat, Message } from '@/convexlibs/dbtypes';

interface GroupItemProps {
  group: GroupChat;
  isSelected: boolean;
  isCollapsed: boolean;
  onClick: (group: GroupChat) => void;
  currentUserId: string;
}

const GroupItem: React.FC<GroupItemProps> = ({ group, isSelected, isCollapsed, onClick , currentUserId}) => {
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
        {/* <span className="text-[10px] shrink-0">{format(new Date(lastMessage.createdAt), 'HH:mm')}</span> */}
      </div>
    );
  };

  const GroupAvatar = () => (
    <Avatar className={cn(
      "shrink-0 transition-all",
      isCollapsed && "cursor-pointer hover:ring-2 hover:ring-primary size-7",
      !isCollapsed && "size-9"
    )}>
      <AvatarImage src={group.image} alt={group.name} />
      <AvatarFallback>{group.name[0]}</AvatarFallback>
    </Avatar>
  );

  if (isCollapsed) {
    return (
      <div className="flex justify-center my-2" onClick={() => onClick(group)}>
        <GroupAvatar />
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
      onClick={() => onClick(group)}
    >
      <GroupAvatar />
      <div className="flex flex-col items-start overflow-hidden w-full">
        <span className="font-medium text-sm truncate w-full">{group.name}</span>
        {renderLastMessage(group.lastMessage)}
      </div>
      <Users size={14} className="ml-auto text-muted-foreground shrink-0" />
    </Button>
  );
};

export default GroupItem;