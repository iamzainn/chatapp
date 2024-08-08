import { GroupChat, OneOnOneChat } from '@/convexlibs/dbtypes';
import { create } from 'zustand';

interface SelectedChatState {
  selectedChat: OneOnOneChat | GroupChat | null;
  setSelectedChat: (chat: OneOnOneChat | GroupChat | null) => void;
}
export const useSelectedChat = create<SelectedChatState>((set) => ({
  selectedChat: null,
  setSelectedChat: (chat) => set({ selectedChat: chat }),
}));