import { create } from 'zustand';


type ExtendedChat = Chat & { messages?: Message[] };

interface SelectedChatState {
  selectedChat: ExtendedChat | null;
  setSelectedChat: (chat: ExtendedChat | null) => void;
  addMessage: (message: Message) => void;
}

export const useSelectedChat = create<SelectedChatState>((set) => ({
  selectedChat: null,
  setSelectedChat: (chat) => set({ selectedChat: chat }),
  addMessage: (message) => set((state) => ({
    selectedChat: state.selectedChat
      ? {
          ...state.selectedChat,
          messages: [...(state.selectedChat.messages || []), message],
        }
      : null,
  })),
}));