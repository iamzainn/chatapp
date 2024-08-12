import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";


export const fetchChatMessages = query({

    args: { chatId: v.id("chats") },
    handler: async (ctx, args) => {

     const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new ConvexError("Unauthorized");

		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
			.unique();

		if (!user) throw new ConvexError("User not found");

      const messages = await ctx.db
        .query("messages")
        .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
        .collect();


      return messages;
    },
  });

  const messageSchema = v.object({
    content: v.string(),
    type: v.union(v.literal("text"), v.literal("image"), v.literal("video"), v.literal("audio"), v.literal("file")),
  });
  
  // Define the input schema for the mutation
  const inputSchema = v.object({
    chatId: v.id("chats"),
    messages: v.array(messageSchema),
  });
  


export const sendMessages = mutation({
  args: inputSchema,
  handler: async (ctx, args) => {
    // Authenticate the user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    // Fetch the current user
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    // Verify the chat exists and the user is a participant
    const chat = await ctx.db.get(args.chatId);
    if (!chat) {
      throw new ConvexError("Chat not found");
    }
    if (!chat.participants.includes(user._id)) {
      throw new ConvexError("User is not a participant in this chat");
    }

    // Prepare to store messages and update chat
    const messageIds: Id<"messages">[] = [];
    const currentTime = Date.now();

    // Store each message
    for (const message of args.messages) {
      const messageId = await ctx.db.insert("messages", {
        content: message.content,
        type: message.type,
        senderId: user._id,
        chatId: args.chatId,
        createdAt: currentTime,
      });
      messageIds.push(messageId);
    }

    // Update the chat with the last message info
    if (messageIds.length > 0) {
      await ctx.db.patch(args.chatId, {
        lastMessageId: messageIds[messageIds.length - 1],
        updatedAt: currentTime,
      });

      // Create notifications for other participants
      const otherParticipants = chat.participants.filter(
        (participantId) => participantId !== user._id
      );

      const notificationPromises = otherParticipants.map((participantId) =>
        ctx.db.insert("notifications", {
          userId: participantId,
          type: "new_message",
          chatId: args.chatId,
          messageId: messageIds[messageIds.length - 1],
          senderId: user._id,
          content: `New message from ${user.name}`,
          isRead: false,
          createdAt: currentTime,
        })
      );

      // Use Promise.all for efficient batch insertion of notifications
      await Promise.all(notificationPromises);
    }

    return { messageIds };
  },
});