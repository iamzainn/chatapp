import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	users: defineTable({
	  email: v.string(),
	  name: v.string(),
	  profileImage: v.string(),
	  isOnline: v.boolean(),
	  tokenIdentifier: v.string(),
	})
	  .index("by_email", ["email"])
	  .index("by_tokenIdentifier", ["tokenIdentifier"]),

	  chats: defineTable({	
	  createdAt: v.number(),
	  updatedAt: v.number(),
	  UnreadNotifications : v.optional(v.object({totals:v.number(),senderId:v.optional(v.id("users"))})),
	  isGroupChat: v.boolean(),
	  name: v.optional(v.string()), // For group chats
	  image: v.optional(v.string()), // For group chats
	  participants: v.array(v.id("users")),
	  lastMessageId: v.optional(v.id("messages")),
	  adminId: v.optional(v.id("users")), // For group chats
	})
	  .index("by_participants", ["participants"])
	  .index("by_adminId", ["adminId"]),
  
	messages: defineTable({
	  content: v.string(),
	  createdAt: v.number(),
	  senderId: v.id("users"),
	  chatId: v.id("chats"),
	  type: v.string(), // "text" | "image" | "video" | "link" | "file"
	})
	  .index("by_chatId", ["chatId"])
	  .index("by_senderId", ["senderId"])
	  .index("by_createdAt", ["createdAt"]),

	  notifications: defineTable({
		userId: v.id("users"),
		type: v.string(), // e.g., "new_message", "group_invite", etc.
		chatId: v.optional(v.id("chats")),
		messageId: v.optional(v.id("messages")),
		senderId: v.optional(v.id("users")),
		content: v.string(),
		isRead: v.boolean(),
		createdAt: v.number(),
	  })
		.index("by_userId", ["userId"])
		.index("by_userId_and_isRead", ["userId", "isRead"])
		.index("by_createdAt", ["createdAt"])
	
	
  });