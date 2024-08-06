  type User= {
    id: string;
    name: string;
    email: string;
    profileImage: string;
    isOnline: boolean;
  };
  
  interface Message {
    content: string;
    createdAt: number;
    senderId: string;
    type: string;
  };
  
  type OneOnOneChat = {
    id: string;
    isGroupChat: boolean;
    createdAt: number;
    updatedAt: number;
    participants: string[];
    lastMessageId: string | null;
    user: User | null;
    lastMessage: Message | null;
  };
  
  type GroupChat = {
    id: string;
    name: string;
    image: string;
    createdAt: number;
    updatedAt: number;
    groupAdminId: string | null;
    numberOfMembers: number;
    lastMessageId: string | null;
    lastMessage: Message | null;
  };
  
  type ChatData = {
    user1v1chats: OneOnOneChat[];
    usergroups: GroupChat[];
  };
  