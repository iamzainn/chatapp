import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { X, Video } from "lucide-react";
import { useSelectedChat } from "@/store/useSelectedChat";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from "@/components/ui/use-toast";
import { useUser } from '@clerk/nextjs';
import GroupMembersDialog from './GroupMembersList';
import { Id } from '../../convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { User } from '@/convexlibs/dbtypes';


interface ActionButtonProps {
  tooltipContent: string;
  onClick: () => void;
  icon: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  tooltipContent,
  onClick,
  icon,
  className,
  disabled
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={className}
          onClick={onClick}
          disabled={disabled}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltipContent}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
const ChatTopBar: React.FC = () => {
  const { selectedChat, setSelectedChat} = useSelectedChat();

  
  const { toast } = useToast();
  const { user } = useUser();

  if (!selectedChat || !user) return null;

  const isGroupChat = selectedChat.isGroupChat;
  const chatName = isGroupChat ? selectedChat.name : selectedChat.user.name;
  const chatImage = isGroupChat ? selectedChat.image : selectedChat.user.profileImage;
  const currentUser : User | undefined = selectedChat.isGroupChat ?selectedChat.users.find((u) => {
   
   if(u.email==user.emailAddresses[0].emailAddress){
     
     return u._id;
   }

  }):undefined;
    
  
  

  const handleCloseChat = () => {
    setSelectedChat(null);
 
  };

  const handleVideoCall = () => {
    toast({
      title: "Video call",
      description: "This feature is not implemented yet.",
    });
  };

  return (
    <div className="w-full border-b bg-secondary/10">
      <div className="h-20 flex p-4 justify-between items-center">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={chatImage} alt={chatName} />
            <AvatarFallback>{chatName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-lg">{chatName}</span>
            {isGroupChat ? (
              <span className="text-sm text-muted-foreground">
                {selectedChat.numberOfMembers} members
              </span>
            ) : (
              selectedChat.user.isOnline && (
                <span className="text-sm text-green-500">Active Now</span>
              )
            )}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {isGroupChat && (
            <GroupMembersDialog 
              chat={selectedChat} 
              handleCloseChat={handleCloseChat}
              currentUserId={currentUser?._id!}
            />
          )}
          <ActionButton
            tooltipContent="Video Call"
            onClick={handleVideoCall}
            icon={<Video className="h-5 w-5" />}
          />
          <ActionButton
            tooltipContent="Close Chat"
            onClick={handleCloseChat}
            icon={<X className="h-5 w-5" />}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatTopBar;