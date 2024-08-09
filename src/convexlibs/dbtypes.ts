import { Id } from "../../convex/_generated/dataModel";

  export type User= {
    _id: Id<"users">;
    name: string;
    email: string;
    profileImage: string;
    isOnline: boolean;
    tokenIdentifier: string;
    _creationTime: number;
  };

  
  export type Message= {
    _id: Id<"messages">;
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
    lastMessageId: Id<"messages"> | null;
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
    lastMessageId: Id<"messages"> | null;
    lastMessage: Message | null;
  };
  
  export type ChatData = {
    user1v1chats: OneOnOneChat[];
    usergroupschats: GroupChat[];
  };

  export type Chat ={
    _id: Id<"chats">
    createdAt: number
    updatedAt: number
    lastMessageId: Id<"messages"> | null
    lastMessage: Message | null
  } & (
    {
      isGroupChat: true
      name: string
      image: string
      groupAdminId: string
      numberOfMembers: number
      users: User[]
     } | {
      isGroupChat: false
      user: User
    }
  )
  