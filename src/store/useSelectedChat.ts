import { Chat } from '@/convexlibs/dbtypes';
import { create } from 'zustand';


interface SelectedChatState {
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat | null) => void;
}
export const useSelectedChat = create<SelectedChatState>((set) => ({
  selectedChat: null,
  setSelectedChat: (chat) => set({ selectedChat: chat }),
}));