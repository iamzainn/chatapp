import { query, mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";


export const getUnreadNotifications = query({
  args: {  },
  handler: async (ctx, args) => {
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

    return await ctx.db
      .query("notifications")
      .withIndex("by_userId_and_isRead", (q) => 
        q.eq("userId",user._id).eq("isRead", false)
      )
      .order("desc")
      .collect();
  },
});

// 2. Read all unread notifications for a user specific to a chatId
export const getUnreadNotificationsForChat = query({
  args: { userId: v.id("users"), chatId: v.id("chats") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notifications")
      .withIndex("by_userId_and_isRead", (q) => 
        q.eq("userId", args.userId).eq("isRead", false)
      )
      .filter((q) => q.eq(q.field("chatId"), args.chatId))
      .order("desc")
      .collect();
  },
});

// 3. Get all notifications for a user (read and unread)
export const getAllNotifications = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Mutations

// 1. Mark all unread notifications as read for a user
export const markAllNotificationsAsRead = mutation({
  args: {  },

  handler: async (ctx, args) => {

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
    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_userId_and_isRead", (q) => 
        q.eq("userId",user._id).eq("isRead", false)
      )
      .collect();

    for (const notification of unreadNotifications) {
      await ctx.db.patch(notification._id, { isRead: true });
    }

    return unreadNotifications.length;
  },
});


export const markChatNotificationsAsRead = mutation({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    const unreadNotifications = await ctx.db
      .query("notifications")
      
      .filter((q) => q.eq(q.field("chatId"), args.chatId))
      .collect();

    for (const notification of unreadNotifications) {
      await ctx.db.patch(notification._id, { isRead: true });
    }

    return unreadNotifications.length;
  },
});


export const createNotification = mutation({
  args: {
    userId: v.id("users"),
    type: v.string(),
    chatId: v.optional(v.id("chats")),
    messageId: v.optional(v.id("messages")),
    senderId: v.optional(v.id("users")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const notificationId = await ctx.db.insert("notifications", {
      ...args,
      isRead: false,
      createdAt: Date.now(),
    });
    return notificationId;
  },
});

export const deleteNotification = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.notificationId);
  },
});