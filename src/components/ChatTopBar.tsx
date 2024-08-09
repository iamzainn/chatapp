import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { X, ChevronDown, ChevronUp, MessageCircleOff, Users, Loader2, Video } from "lucide-react";
import { useSelectedChat } from "@/store/useSelectedChat";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { leaveGroup } from '@/action';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { GroupMembersList } from './GroupMembersList';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useGroupStore } from '../store/groupchatstore';
import { useToast } from "@/components/ui/use-toast"
import { unstable_noStore as noStore } from "next/cache";






interface tooltipProps {
  tooltipContent: string;
  onClick: () => void;
  icon:React.JSX.Element;
  className?: string;
  disabled?: boolean;

  
}

const ChatTopBar = () => {
  noStore();
  const { selectedChat, setSelectedChat } = useSelectedChat();
  const router = useRouter();
  const { user } = useKindeBrowserClient();
  const [showMembers, setShowMembers] = useState(false);
  
  // const currentGroup = useGroupStore(state => state.currentGroup);
  const { toast } = useToast();
  const [isLeaving, setIsLeaving] = useState(false);

  if (!selectedChat) return null;

  const isGroupChat = selectedChat.isGroupChat;
  // const chatDetails = isGroupChat ? currentGroup : null;

  const handleLeaveGroup = async () => {
    // if (!isGroupChat || !user?.id || !currentGroup?.id) return;
    setIsLeaving(true);
    try {
      // await leaveGroup(user.id, currentGroup.id);
      setSelectedChat(null);
      toast({
        title: "Success",
        description: "You have left the group.",
      });
      router.refresh(); // Revalidate and update the UI
    } catch (error) {
      console.error('Failed to leave group:', error);
      toast({
        title: "Error",
        description: "Failed to leave the group. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLeaving(false);
    }
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
    router.refresh(); // Revalidate and update the UI
  };

  const toggleMembersList = () => setShowMembers(!showMembers);

  const renderAvatar = () => (
    <Avatar className="h-12 w-12">
     
      {isGroupChat ? (
        <AvatarImage
          // src={chatDetails?.image}
          alt={isGroupChat ? "Group Image" : "User Image"}
        />
      ) : (
        <AvatarImage
          src={selectedChat.user?.profileImage}
          alt={isGroupChat ? "Group Image" : "User Image"}
        />
      )}
      {/* <AvatarFallback>{chatDetails?.name?.[0]}</AvatarFallback> */}
    </Avatar>
  );
  
  const renderChatInfo = () => (
    <div className="flex flex-col">
      {/* <span className="font-semibold text-lg">{isGroupChat?chatDetails?.name: selectedChat.user?.firstName}</span>
      {isGroupChat && currentGroup?.users && (
        <span className="text-sm text-muted-foreground">
          {currentGroup.users.length} members
        </span>
      )} */}
    </div>
  );

  const renderActionButtons = () => (
    <div className="flex gap-2 items-center">
      {isGroupChat && (
        <>
          <TooltipButton
            onClick={toggleMembersList}
            tooltipContent={showMembers ? "Hide members" : "Show members"}
            icon={showMembers ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          />
          <TooltipButton
            onClick={handleLeaveGroup}
            tooltipContent="Leave group"
            icon={isLeaving ? <Loader2 className="animate-spin" size={20} /> : <MessageCircleOff size={20} />}
            className="hover:text-destructive"
            disabled={isLeaving}
          />
        </>
      )}

          
						
            <TooltipButton
            onClick={()=>{router.push("/video-call") }}
            tooltipContent='Video call'
            icon={<Video size={20} />}
          />
            
            <TooltipButton
        onClick={handleCloseChat}
        tooltipContent="Close chat"
        icon={<X size={20} />}
      />
					

     
    </div>
  );

  return (
    <div className="w-full flex flex-col border-b">
      <div className="h-20 flex p-4 justify-between items-center bg-secondary/10">
        <div className="flex items-center gap-3">
          {renderAvatar()}
          {renderChatInfo()}
        </div>
        {renderActionButtons()}
      </div>
      {/* {isGroupChat && showMembers && currentGroup?.users && ( */}
        {/* <GroupMembersList 
          // users={currentGroup.users} 
          // adminId={currentGroup.adminId as string} 
          // groupId={currentGroup.id} 
        /> */}
      
    </div>
  );
};
const TooltipButton = ({icon,onClick,tooltipContent,className,disabled}: tooltipProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipContent>{tooltipContent}</TooltipContent>
      <TooltipTrigger asChild>
        <Button
          disabled={disabled}
          variant="ghost"
          size="icon"
          onClick={onClick}
          className={`text-muted-foreground hover:text-primary ${className}`}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltipContent}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default ChatTopBar;