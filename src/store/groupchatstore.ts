import { create } from 'zustand';





export const useGroupStore = create<GroupStore>((set) => ({
  currentGroup: null,
  
  setCurrentGroup: (group: Group) => {
    const groupMetadata: GroupMetadata = {
      id: group.id,
      name: group.name,
      image: group.image || '',
      users: group.users.map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
        email: user.email,
      })),
      adminId: group.groupAdminId,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
    };
    set({ currentGroup: groupMetadata });
  },

  clearCurrentGroup: () => {
    set({ currentGroup: null });
  },
}));