import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const GroupItem: React.FC<GroupItemProps> = ({ group, isSelected, isCollapsed, onClick, currentUserId }) => {
  const senderId = group?.UnreadNotifications?.senderId;
  const unreadCount = group?.UnreadNotifications?.totals || 0;

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

  const GroupAvatar = () => (
    <Avatar className={cn(
      "shrink-0 transition-all bg-primary",
      isCollapsed ? "size-7" : "size-9"
    )}>
      <AvatarFallback>{group.name[0]}</AvatarFallback>
    </Avatar>
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
      <div className="flex justify-center my-2 relative" onClick={() => onClick(group)}>
        <GroupAvatar />
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
      onClick={() => onClick(group)}
    >
      <GroupAvatar />
      <div className="flex flex-col items-start overflow-hidden w-full">
        <span className="font-medium text-sm truncate w-full">
          <Users size={14} className="inline mr-1" />
          {group.name}
        </span>
        {renderLastMessage(group.lastMessage)}
      </div>
      <NotificationBadge />
    </Button>
  );
};

export default GroupItem;