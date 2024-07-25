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
    type:"text" | "image" | "video"
  };
  
  type ChatResponse = {
    id: number;
    isGroupChat: boolean;
    createdAt: Date;
    user?: User;
    users?: User[];
    messages: Message[];
  };

  type Chat ={
    id:number,
    isGroupChat:boolean,
    createdAt:Date,
    user?:User,
    users?:User[],
    messages:Message[],  
    
  }