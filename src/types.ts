type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
};

type Message = {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  senderId: string;
  chatId: number;
  type: 'text' | 'image' | 'video';
};

type Group = {
  id: number;
  name: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  chat?: Chat; // specific to this group
  groupAdminId: string | null;
  numberOfMembers: number;
};

type Chat = {
  id: number;
  isGroupChat: boolean;
  createdAt: Date;
  updateAt: Date;
  user?: User; // not undefined if it's not a group chat, else undefined
  users?: User[]; // not undefined if it's a group chat, else undefined
  messages?: Message[];
};

type ChatResponse = {
  groups?: Group[];
  chats?: Chat[];
};

type SignedURLResponse = Promise<
  { failure?: undefined; success: { url: string } }
  | { failure: string; success?: undefined }
>


type SendMessageResult = {
  success: boolean;
  messages: Message[];
};