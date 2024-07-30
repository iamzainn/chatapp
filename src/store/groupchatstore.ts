import { create } from 'zustand';

interface GroupUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string | null;
}

interface GroupChatState {
  groupUsers: Record<number, GroupUser[]>;
  setGroupUsers: (chatId: number, users: GroupUser[]) => void;
  clearGroupUsers: (chatId: number) => void;
}

export const useGroupChatStore = create<GroupChatState>((set) => ({
  groupUsers: {},
  setGroupUsers: (chatId, users) => 
    set((state) => ({ 
      groupUsers: { ...state.groupUsers, [chatId]: users } 
    })),
  clearGroupUsers: (chatId) => 
    set((state) => {
      const { [chatId]: _, ...rest } = state.groupUsers;
      return { groupUsers: rest };
    }),
}));