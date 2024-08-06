import { query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

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

     
  
      if (!user) {
        throw new ConvexError("User not found");
      }
      
  
  
      // Fetch all chats
      let chats = await ctx.db
        .query("chats")
        .order("desc")
        .collect();
  
      // Filter chats to include only those where the user is a participant
      chats = chats.filter((chat) => chat.participants.includes(user._id));
  
      const oneOnOneChats: OneOnOneChat[] = [];
      const groups: GroupChat[] = [];
  
      // Process each chat
      await Promise.all(
        chats.map(async (chat) => {
          const lastMessage = chat.lastMessageId
            ? await ctx.db.get(chat.lastMessageId)
            : null;
  
          if (chat.isGroupChat) {
            // Process group chat
            const groupChat: GroupChat = {
              id: chat._id,
              name: chat.name ?? "",
              image: chat.image ?? "",
              createdAt: chat.createdAt,
              updatedAt: chat.updatedAt,
              groupAdminId: chat.adminId ?? null,
              numberOfMembers: chat.participants.length,
              lastMessageId: chat.lastMessageId ?? null,
              lastMessage: lastMessage
                ? {
                    content: lastMessage.content,
                    createdAt: lastMessage.createdAt,
                    senderId: lastMessage.senderId,
                    type: lastMessage.type,
                  }
                : null,
            };
            groups.push(groupChat);
          } else {
            // Process one-on-one chat
            const otherUserId = chat.participants.find((id) => id !== user._id);
            const otherUser = otherUserId
              ? await ctx.db.get(otherUserId)
              : null;
  
            const oneOnOneChat: OneOnOneChat = {
              id: chat._id,
              isGroupChat: chat.isGroupChat,
              createdAt: chat.createdAt,
              updatedAt: chat.updatedAt,
              participants: chat.participants,
              lastMessageId: chat.lastMessageId ?? null,
              user: otherUser
                ? {
                    id: otherUser._id,
                    name: otherUser.name,
                    email: otherUser.email,
                    profileImage: otherUser.profileImage,
                    isOnline: otherUser.isOnline,
                  }
                : null,
              lastMessage: lastMessage
                ? {
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
        usergroups: groups,
      };
    },
  });