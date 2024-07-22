"use server";

import { Message } from "../src/lib/dummy";
import { redis } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function sendMessageAction(formdata:FormData) {
	const { getUser } = getKindeServerSession();
	const user = await getUser();

	if (!user) return { success: false, message: "User not authenticated" };

	const senderId = user.id;

    const receiverId = formdata.get("receiverId") as string;
    const content = formdata.get("content") as string;
    const messageType = formdata.get("messageType") as string;

	const conversationId = `conversation:${[senderId, receiverId].sort().join(":")}`;

    

	

	const conversationExists = await redis.exists(conversationId);

	if (!conversationExists) {
		await redis.hset(conversationId, {
			participant1: senderId,
			participant2: receiverId,
		});

		await redis.sadd(`user:${senderId}:conversations`, conversationId);
		await redis.sadd(`user:${receiverId}:conversations`, conversationId);
	}

	// Generate a unique message id
	const messageId = `message:${Date.now()}:${Math.random().toString(36).substring(2, 9)}`;
	const timestamp = Date.now();

	// Create the message hash
	await redis.hset(messageId, {
		senderId,
		content,
		timestamp,
		messageType,
	});

	await redis.zadd(`${conversationId}:messages`, { score: timestamp, member: JSON.stringify(messageId) });

	

	return { success: true, conversationId, messageId };
}