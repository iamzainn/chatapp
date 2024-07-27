import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Info, X, Users } from "lucide-react";
import { useSelectedChat } from "@/store/useSelectedUser";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { fetchGroupDetails, leaveGroup } from '@/action';
import { Skeleton } from './ui/skeleton';
import { MessageCircleOff } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';




const ChatTopBar = () => {
  const { selectedChat, setSelectedChat } = useSelectedChat();
  const { user } = useKindeBrowserClient();

  const { data: groupDetails, isLoading, isError } = useQuery({
    queryKey: ['groupDetails', selectedChat?.id],
    queryFn: () => selectedChat? fetchGroupDetails(selectedChat.id):null,
    enabled: !!selectedChat?.isGroupChat && !!selectedChat?.id,
  });

  const router = useRouter()

const handleLeaveGroup = async () => {
  if (!selectedChat?.isGroupChat || !user?.id) return

  try {
    const res= await leaveGroup(user.id, groupDetails?.id!)
    console.log(res);
    setSelectedChat(null) // Clear the selected chat
    router.refresh() // Refresh the page to reflect the changes
  } catch (error) {
    console.error('Failed to leave group:', error)
    
  }
}
  const handleCloseChat = () => {
    setSelectedChat(null);
  };

  if (!selectedChat) return null;

  const isGroupChat = selectedChat.isGroupChat;
  const chatName = isGroupChat ? groupDetails?.name :  selectedChat.user?.firstName
  const chatImage = isGroupChat 
    ? groupDetails?.image : selectedChat.user?.profileImage;
    

  return (
    <div className="w-full h-20 flex p-4 justify-between items-center border-b">
      <div className="flex items-center gap-2">
        <Avatar className="flex justify-center items-center">
          {isLoading ? (
             <Skeleton className="w-10 h-10 rounded-full" />
          ) : (
            <>
              <AvatarImage
                src={chatImage as string}
                alt={isGroupChat ? "Group Image" : "User Image"}
                className="w-10 h-10 object-cover rounded-full"
              />
              <AvatarFallback>
                {chatName?.[0]}
              </AvatarFallback>
            </>
          )}
        </Avatar>
        <div className="flex flex-col">
          {isLoading ? (
            <Skeleton className="h-4 w-24" />
			
          ) : (
            <span className="font-medium">{chatName}</span>
          )}
          {isGroupChat && !isLoading && (
            <span className="text-xs text-muted-foreground">
              {selectedChat?.users?.length || 0} members
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2 items-center">
        {isGroupChat && (
          <>
            <Users className="text-muted-foreground cursor-pointer hover:text-primary" />
            <button
              className="text-muted-foreground cursor-pointer hover:text-primary text-sm hidden sm:block"
              onClick={handleLeaveGroup}
            >
              <Button size={"icon"} variant={"ghost"} onClick={()=>handleLeaveGroup()}>
			  <MessageCircleOff></MessageCircleOff>
			  </Button>
            </button>
          </>
        )}
       
        <X
          className="text-muted-foreground cursor-pointer hover:text-primary"
          onClick={handleCloseChat}
        />
      </div>
    </div>
  );
};

export default ChatTopBar;