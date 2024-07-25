
import { create } from "zustand";

type SelectedUserState = {
	selectedUser: User | null;
	setSelectedUser: (user: User | null) => void;
};

export const useSelectedUser = create<SelectedUserState>((set) => ({
	selectedUser: null,
	setSelectedUser: (user: User | null) => set({ selectedUser: user }),
}));

type SelectedChat = {
	selectedChat: Chat | null;
	setSelectedChat: (chat: Chat | null) => void;
}



export const useSelectedChat = create<SelectedChat>((set) => ({
	selectedChat: null,
	setSelectedChat: (chat: Chat | null) => set({ selectedChat: chat }),
}));
