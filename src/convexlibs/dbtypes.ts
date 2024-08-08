import { Id } from "../../convex/_generated/dataModel";

  export type User= {
    _id: Id<"users">;
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
  
  export type OneOnOneChat = {
    _id: Id<"chats">
    isGroupChat: boolean;
    createdAt: number;
    updatedAt: number;
    lastMessageId: string | null;
    user: User | null;
    lastMessage: Message | null;
  };
  
  export type GroupChat = {
    _id: Id<"chats">;
    isGroupChat: boolean;
    name: string;
    image: string;
    createdAt: number;
    updatedAt: number;
    users: User[];
    groupAdminId: string | null;
    numberOfMembers: number;
    lastMessageId: string | null;
    lastMessage: Message | null;
  };
  
  export type ChatData = {
    user1v1chats: OneOnOneChat[];
    usergroupschats: GroupChat[];
  };
  