
import { create } from "zustand";


type SelectedChat = {
	selectedChat: Chat  | null;
	setSelectedChat: (chat: Chat  | null) => void;
}

export const useSelectedChat = create<SelectedChat>((set) => ({
	selectedChat: null,
	setSelectedChat: (chat: Chat | null) => set({ selectedChat: chat }),
}));
