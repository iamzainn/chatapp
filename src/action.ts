"use server";


import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "./lib/db";

export async function sendMessageAction(message: string, receiverUserId: string, isGroupChat: boolean) {
	const { getUser } = getKindeServerSession();
	const user = await getUser();
  
	if (!user) return { success: false, message: "User not authenticated" };
  
	const senderId = user.id;
  
	// Check if chat exists
	let chat = await prisma.chat.findFirst({
	  where: {
		isGroupChat: isGroupChat,
		OR: [
		  {
			AND: [
			  { users: { some: { userId: senderId } } },
			  { users: { some: { userId: receiverUserId } } }
			]
		  },
		  {
			AND: [
			  { users: { some: { userId: receiverUserId } } },
			  { users: { some: { userId: senderId } } }
			]
		  }
		]
	  },
	  include: {
		users: true
	  }
	});
  
	// If chat doesn't exist, create a new one
	if (!chat) {
		chat = await prisma.chat.create({
		  data: {
			isGroupChat: isGroupChat,
			users: {
			  create: [
				{ user: { connect: { id: senderId } } },
				{ user: { connect: { id: receiverUserId } } }
			  ]
			}
		  },
		  include: {
			users: true // include users to reflect the changes
		  }
		});
	  }
  
	
	const newMessage = await prisma.message.create({
	  data: {
		content: message,
		senderId: senderId,
		chatId: chat?.id as number
	  }
	});
  	
  
	return { success: true, message: "Message sent successfully" };
  }