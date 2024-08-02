type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
};

type Message = {
  length: number;
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  senderId: string;
  chatId: number;
  type: 'text' | 'image' | 'video';
};

type Chat = {
  id: number;
  isGroupChat: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: User; // for non-group chats
  users?:User[], // for group chats
  lastMessage?: {
    content: string;
    createdAt: Date;
    senderId: string;
  };
};

type Group = {
  id: number;
  name: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  groupAdminId: string | null;
  numberOfMembers: number;
  users: User[];
  groupchatId:number,
  lastMessage?: {
    content: string;
    createdAt: Date;
    senderId: string;
  };
};

type ChatResponse = {
  groups: Group[];
  chats: Chat[];
};



type SignedURLResponse = Promise<
  { failure?: undefined; success: { url: string } }
  | { failure: string; success?: undefined }
>


type SendMessageResult = {
  success: boolean;
  messages: Message[];
};

interface GroupMetadata {
  id: number;
  name: string;
  image: string;
  users: User[];
  adminId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface GroupStore {
  currentGroup: GroupMetadata | null;
  setCurrentGroup: (group: Group) => void;
  clearCurrentGroup: () => void;
}