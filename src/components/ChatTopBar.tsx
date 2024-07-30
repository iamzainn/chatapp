import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { X, ChevronDown, ChevronUp, MessageCircleOff } from "lucide-react";
import { useSelectedChat } from "@/store/useSelectedUser";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { fetchGroupDetails, leaveGroup } from '@/action';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { GroupMembersList } from './GroupMembersList';
import { Tooltip, TooltipContent, TooltipProvider } from './ui/tooltip';

const ChatTopBar = () => {
  const { selectedChat, setSelectedChat } = useSelectedChat();
  const { user } = useKindeBrowserClient();
  const [showMembers, setShowMembers] = useState(false);

  const { data: groupDetails, isLoading } = useQuery({
    queryKey: ['groupDetails', selectedChat?.id, selectedChat?.isGroupChat],
    queryFn: () => selectedChat ? fetchGroupDetails(selectedChat.id, selectedChat.isGroupChat) : null,
    enabled: !!selectedChat?.id,
  });

  const router = useRouter();

  const handleLeaveGroup = async () => {
    if (!selectedChat?.isGroupChat || !user?.id || !groupDetails?.id) return;
    try {
      await leaveGroup(user.id, groupDetails.id);
      setSelectedChat(null);
      router.refresh();
    } catch (error) {
      console.error('Failed to leave group:', error);
    }
  };

  const handleCloseChat = () => setSelectedChat(null);
  const toggleMembersList = () => setShowMembers(!showMembers);

  if (!selectedChat) return null;

  const isGroupChat = selectedChat.isGroupChat;
  const chatName = isGroupChat ? groupDetails?.name : selectedChat.user?.firstName;
  const chatImage = isGroupChat ? groupDetails?.image : selectedChat.user?.profileImage;

  return (
    <div className="w-full flex flex-col border-b">
      <div className="h-20 flex p-4 justify-between items-center bg-secondary/10">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            {isLoading ? (
              <Skeleton className="h-12 w-12 rounded-full" />
            ) : (
              <>
                <AvatarImage
                  src={chatImage || ''}
                  alt={isGroupChat ? "Group Image" : "User Image"}
                />
                <AvatarFallback>{chatName?.[0]}</AvatarFallback>
              </>
            )}
          </Avatar>
          <div className="flex flex-col">
            {isLoading ? (
              <Skeleton className="h-5 w-32" />
            ) : (
              <span className="font-semibold text-lg">{chatName}</span>
            )}
            {isGroupChat && !isLoading && groupDetails?.users && (
              <span className="text-sm text-muted-foreground">
                {groupDetails.users.length} members
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2 items-center">
          {isGroupChat && (
            <TooltipProvider>
              <Tooltip>
                <TooltipContent>{showMembers ? "Hide members" : "Show members"}</TooltipContent>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMembersList}
                className="text-muted-foreground hover:text-primary"
              >
                {showMembers ? <ChevronUp /> : <ChevronDown />}
              </Button>
            </Tooltip>
            </TooltipProvider>
          )}
          {isGroupChat && (
           <TooltipProvider>
             <Tooltip>
             <TooltipContent>
             Leave group
          </TooltipContent>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLeaveGroup}
                className="text-muted-foreground hover:text-destructive"
              >
                <MessageCircleOff />
              </Button>
            </Tooltip>
           </TooltipProvider>
          )}
         <TooltipProvider>
         <Tooltip >
          <TooltipContent>
          Close chat
          </TooltipContent>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCloseChat}
              className="text-muted-foreground hover:text-primary"
            >
              <X />
            </Button>
          </Tooltip>
         </TooltipProvider>
        </div>
      </div>
      {isGroupChat && showMembers && groupDetails?.users && (
        <GroupMembersList users={groupDetails.users} adminId={groupDetails.groupAdminId} groupId={  groupDetails.id} />
      )}
    </div>
  );
};

export default ChatTopBar;