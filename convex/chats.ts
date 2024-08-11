import { Chat, ChatData, GroupChat, Message, OneOnOneChat } from "@/convexlibs/dbtypes";
import { query, mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { User } from "@/convexlibs/dbtypes";
import { Id } from "./_generated/dataModel";

export const getUserChats = query({
    args: {},
    handler: async (ctx, args): Promise<ChatData> => {
       
      const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new ConvexError("Unauthorized");

		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
			.unique();

		if (!user) throw new ConvexError("User not found");

      let chats = await ctx.db
        .query("chats")
        .order("desc")
        .collect();
  
    
      chats = chats.filter((chat) => chat.participants.includes(user._id));
  
      const oneOnOneChats: OneOnOneChat[] = [];
      const groups: GroupChat[] = [];
  
      
      await Promise.all(
        chats.map(async (chat) => {
          const lastMessage = chat.lastMessageId
            ? await ctx.db.get(chat.lastMessageId)
            : null;
  
          if (chat.isGroupChat) {
            let Users :User[] =[] as User[]; 

            await Promise.all(chat.participants.map(async (id) => {
              console.log("id", id);
              const user = await ctx.db.get(id) as User;
              if (user) {
                  Users.push(user);
              }
          }));
          
        
              
            const groupChat: GroupChat = {
              _id: chat._id,
              name: chat.name ?? "",
              image: chat.image ?? "",
              createdAt: chat.createdAt,
              isGroupChat: chat.isGroupChat,
              users: Users!,
              updatedAt: chat.updatedAt,
              groupAdminId: chat.adminId ?? null,
              numberOfMembers: chat.participants.length,
              lastMessageId: chat.lastMessageId ?? null,
              lastMessage: lastMessage
                ? { 
                    _id: lastMessage._id, 
                    content: lastMessage.content,
                    createdAt: lastMessage.createdAt,
                    senderId: lastMessage.senderId,
                    type: lastMessage.type,
                  }
                : null,
            };

            // console.log("groupChat",groupChat);
            groups.push(groupChat);
          } else {
            const otherUserId = chat.participants.find((id) => id !== user._id);
            const otherUser = otherUserId
              ? await ctx.db.get(otherUserId)
              : null;
  
            const oneOnOneChat: OneOnOneChat = {
              _id: chat._id,
              isGroupChat: chat.isGroupChat,
              createdAt: chat.createdAt,
              updatedAt: chat.updatedAt,
              lastMessageId: chat.lastMessageId ?? null,
              user: otherUser
                ? {
                    _id: otherUser._id,
                    name: otherUser.name,
                    email: otherUser.email,
                    profileImage: otherUser.profileImage,
                    isOnline: otherUser.isOnline,
                    tokenIdentifier: otherUser.tokenIdentifier,
                    _creationTime: otherUser._creationTime,
                  }
                : null,
              lastMessage: lastMessage
                ? {
                    _id: lastMessage._id,
                    content: lastMessage.content,
                    createdAt: lastMessage.createdAt,
                    senderId: lastMessage.senderId,
                    type: lastMessage.type,
                  }
                : null,
            };
            oneOnOneChats.push(oneOnOneChat);
          }
        })
      );
  
      return {
        user1v1chats: oneOnOneChats,
        usergroupschats: groups,
      };
    },
  });


export const createConversation = mutation({
  args: {
    participants: v.array(v.id("users")),
    isGroupChat: v.boolean(),
    groupName: v.optional(v.string()),
    groupImage: v.optional(v.string()),
    adminId: v.optional(v.id("users")),
  },
  handler: async (ctx, args): Promise<Chat> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    const me = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!me) throw new ConvexError("User not found");

    // Check for existing conversation
    const existingConversation = await ctx.db
      .query("chats")
      .filter((q) =>
        q.and(
          q.eq(q.field("isGroupChat"), args.isGroupChat),
          q.or(
            q.eq(q.field("participants"), args.participants),
            q.eq(q.field("participants"), args.participants.reverse())
          )
        )
      )
      .first();

    if (existingConversation) {
      return await formatExistingChat(ctx, existingConversation, me._id);
    }

    
    const newChatData = {
      participants: args.participants,
      isGroupChat: args.isGroupChat,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      lastMessageId: undefined,
      lastMessage: undefined,
      name:'',
      image:'',
      adminId: args.adminId as Id<"users">,
    };

    if (args.isGroupChat) {
      if (!args.groupName || !args.adminId) {
        throw new ConvexError("Group name and admin ID are required for group chats");
      }
      newChatData.name = args.groupName;
      newChatData.adminId = args.adminId as Id<"users">;
      if (args.groupImage) {
        newChatData.image = await ctx.storage.getUrl(args.groupImage) as string;
      }
    }
    const newChatId = await ctx.db.insert("chats", newChatData);
    console.log("newChatId", newChatId);

    return await formatNewChat(ctx, newChatId, args.isGroupChat, me._id);
  },
});

async function formatExistingChat(
  ctx: any,
  chat: any,
  currentUserId: Id<"users">
): Promise<Chat> {
  const lastMessage = chat.lastMessageId
    ? await ctx.db.get(chat.lastMessageId)
    : null;

  if (chat.isGroupChat) {
    const users = await Promise.all(
      chat.participants.map((id: Id<"users">) => ctx.db.get(id))
    )
    return {
      _id: chat._id,
      isGroupChat: true,
      name: chat.name!,
      image: chat.image ?? "",
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      users,
      groupAdminId: chat.adminId!,
      numberOfMembers: chat.participants.length,
      lastMessageId: chat.lastMessageId,
      lastMessage: lastMessage ? formatMessage(lastMessage) : null,
    };
  } else {
    const otherUser = await ctx.db.get(
      chat.participants.find((id: Id<"users">) => id !== currentUserId)
    );
    return {
      _id: chat._id,
      isGroupChat: false,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      lastMessageId: chat.lastMessageId,
      user: otherUser,
      lastMessage: lastMessage ? formatMessage(lastMessage) : null,
    };
  }
}

async function formatNewChat(
  ctx: any,
  chatId: Id<"chats">,
  isGroupChat: boolean,
  currentUserId: Id<"users">
): Promise<Chat> {
  const chat = await ctx.db.get(chatId);
  return formatExistingChat(ctx, chat, currentUserId);
}

function formatMessage(message: any): Message {
  return {
    _id: message._id,
    content: message.content,
    createdAt: message.createdAt,
    senderId: message.senderId,
    type: message.type,
  };
}

export const generateUploadUrl = mutation(async (ctx) => {
	return await ctx.storage.generateUploadUrl();
});


export const removeUserFromGroup = mutation({
  args: { chatId: v.id("chats"), userId: v.id("users") },
  handler: async (ctx, { chatId, userId }) => {

    const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new ConvexError("Unauthorized");

		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
			.unique();

		if (!user) throw new ConvexError("User not found");
    // Fetch the chat
    const chat = await ctx.db.get(chatId);
    if (!chat) {
      throw new Error("Chat not found");
    }
    if (!chat.isGroupChat) {
      throw new Error("This is not a group chat");
    }

    // Check if the user is in the chat
    if (!chat.participants.includes(userId)) {
      throw new Error("User is not a member of this chat");
    }

    // Remove the user from the chat's participants
    const updatedParticipants = chat.participants.filter(id => id !== userId);
    
    // Update the chat
    await ctx.db.patch(chatId, { 
      participants: updatedParticipants,
      updatedAt: Date.now()
    });

    // If the removed user was the admin and there are still participants, assign a new admin
    if (chat.adminId === userId && updatedParticipants.length > 0) {
      const newAdminId = updatedParticipants[0];
      await ctx.db.patch(chatId, { adminId: newAdminId });
    }

    // If there are no participants left, delete the chat
    if (updatedParticipants.length === 0) {
      await ctx.db.delete(chatId);
      return { success: true, chatDeleted: true };
    }

    return { success: true, chatDeleted: false };
  },
});

export const makeUserAdmin = mutation({
  args: { chatId: v.id("chats"), userId: v.id("users") },
  handler: async (ctx, { chatId, userId }) => {
    const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new ConvexError("Unauthorized");

		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
			.unique();

		if (!user) throw new ConvexError("User not found");

    const chat = await ctx.db.get(chatId);
    if (!chat || !chat.isGroupChat) {
      throw new Error("Invalid chat");
    }

    await ctx.db.patch(chatId, { adminId: userId });
    return { success: true };
  },
});



