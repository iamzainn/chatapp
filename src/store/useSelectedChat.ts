import { Chat, GroupChat, Message, OneOnOneChat, User } from '@/convexlibs/dbtypes';
import { create } from 'zustand';
import { Id } from '../../convex/_generated/dataModel';


// type Chat = {
//   _id: Id<"chats">
//   isGroupChat: true;
//   createdAt: number;
//   updatedAt: number;
//   lastMessageId: string | null;
//   users : User[];
//   name: string;
//   image: string;
//   groupAdminId: string;
//   numberOfMembers: number;
//   lastMessage: Message | null;
// } | {
//   _id: Id<"chats">
//   isGroupChat: false;
//   createdAt: number;
//   updatedAt: number;
//   lastMessageId: string | null;
//   user: User;
//   lastMessage: Message | null;
// }



interface SelectedChatState {
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat | null) => void;
}
export const useSelectedChat = create<SelectedChatState>((set) => ({
  selectedChat: null,
  setSelectedChat: (chat) => set({ selectedChat: chat }),
}));