"use server";


import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "./lib/db";
import { revalidatePath } from "next/cache";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import crypto from "crypto"
import { MessageType } from "@prisma/client";
import { pusher } from '@/lib/pusher';
import {  currentUser } from "@clerk/nextjs/server";

function cleanS3Url(url:string) {
	try {
	  const urlObject = new URL(url);
	  const pathParts = urlObject.pathname.split('/');
	  const filename = pathParts[pathParts.length - 1];
	  return `${urlObject.origin}/${filename}`;
	} catch (error) {
	  console.error('Invalid URL:', error);
	  return null;
	}
  }


const s3Client = new S3Client({
	region: process.env.AWS_BUCKET_REGION!,
	credentials: {
	  accessKeyId: process.env.AWS_ACCESS_KEY!,
	  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	},
  })
  const maxFileSize = 1048576 * 10 // 1 MB

  const allowedFileTypes = [
	"image/jpeg",
	"image/png",
	"video/mp4",
	"video/quicktime",
	"image/webp"
  ]

  type GetSignedURLParams = {
	fileType: string
	fileSize: number
	checksum: string
  }


  export async function getSignedURL({
	fileType,
	fileSize,
	checksum,
  }: GetSignedURLParams) {

	const user = await currentUser();

	if (!user) {
	  return { failure: "User not found" }
	}

       
	// first just make sure in our code that we're only allowing the file types we want
	if (!allowedFileTypes.includes(fileType)) {
	  return { failure: "File type not allowed" }
	}
  
	if (fileSize > maxFileSize) {
	  return { failure: "File size too large" }
	}
	
const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex")

  
	const putObjectCommand = new PutObjectCommand({
	  Bucket: process.env.AWS_BUCKET_NAME!,
	  Key: generateFileName(),
	  ContentType: fileType,
	  ContentLength: fileSize,
	  ChecksumSHA256: checksum,
	  // Let's also add some metadata which is stored in s3.
	  Metadata: {
		userId: user?.id
	  },


	  


	}


  )

  const url = await getSignedUrl(
	s3Client,
	putObjectCommand,
	{ expiresIn: 60 } 
  )

  return {success: {url}}
}



  export async function fetchChatMessages(chatId: number): Promise<Message[]> {
	try {
	  const messages = await prisma.message.findMany({
		where: {
		  chatId: chatId
		},
		orderBy: {
		  createdAt: 'asc'
		},
		select: {
		  id: true,
		  content: true,
		  createdAt: true,
		  updatedAt: true,
		  senderId: true,
		  chatId: true,
		  type: true
		}
	  });
  
	  return messages.map(message => ({
		...message,
		type: message.type as 'text' | 'image' | 'video'
	  }));
	} catch (error) {
	  console.error('Error fetching chat messages:', error);
	  return [];
	}
  }

  

  export async function sendMessageAction(
	chatId: number,
	isGroupChat: boolean,
	hasAnyFile: boolean,
	message?: string,
	fileUrl?: string,
	fileType?: string
  ): Promise<SendMessageResult> {
	const { getUser } = getKindeServerSession();
	const user = await getUser();
  
	if (!user) {
	  throw new Error("User not authenticated");
	}
  
	const senderId = user.id;
  
	// Find the chat
	const chat = await prisma.chat.findFirst({
	  where: {
		id: chatId,
		isGroupChat,
		users: {
		  some: {
			userId: senderId,
		  },
		},
	  },
	});
  
	if (!chat) {
	  throw new Error("Chat not found");
	}
  
	// Prepare message data
	const messageData = [];
  
	if (hasAnyFile && fileUrl) {
	  const cleanedUrl = cleanS3Url(fileUrl);
	  const fileMessageType: MessageType = fileType?.includes("video") ? MessageType.video : MessageType.image;
	  messageData.push({
		content: cleanedUrl as string,
		senderId,
		chatId: chat.id,
		type: fileMessageType,
	  });
	}
  
	if (message) {
	  messageData.push({
		content: message,
		senderId,
		chatId: chat.id,
		type: MessageType.text,
	  });
	}
  
	// Create messages in a single transaction
	let createdMessages: Message[] = [];
  if (messageData.length > 0) {
    createdMessages = await prisma.$transaction(
      messageData.map((data) => prisma.message.create({ data   }))
    );

    createdMessages.forEach((message) => {
      pusher.trigger(`chat-${chatId}`, 'new-message', message);
    });
  }
  revalidatePath("/chat");
  return { success: true, messages: createdMessages };
  }
	  

  export async function getOrCreateChat( receiverId: string) {
	const { getUser } = getKindeServerSession();
	const user = await getUser();
  
	if (!user) return { success: false, message: "User not authenticated" };
  
	const userId = user.id;
	try {
	  // Check if a chat already exists between the two users
	  const existingChat = await prisma.chat.findFirst({
		where: {
		  isGroupChat: false,
		  users: {
			some: {
			  userId: userId,
			},
		  },
		  AND: {
			users: {
			  some: {
				userId: receiverId,
			  },
			},
		  },
		},
		include: {
		  users: {
			include: {
			  user: true,
			},
		  },
		  messages: true,
		},
	  });
  
	  if (existingChat) {
		return existingChat;
	  }
  
	  // If no chat exists, create a new one
	  const newChat = await prisma.chat.create({
		data: {
		  isGroupChat: false,
		  users: {
			create: [
			  { user: { connect: { id: userId } } },
			  { user: { connect: { id: receiverId } } },
			],
		  },
		},
		include: {
		  users: {
			include: {
			  user: true,
			},
		  },
		  messages: true,
		},
	  });
      revalidatePath("/chat");
	  return newChat;
	} catch (error) {
	  console.error('Error creating or fetching chat:', error);
	  throw new Error('Could not create or fetch chat');
	} finally {
	  await prisma.$disconnect();
	}
  }

  export async function getOrCreateGroup(usersIds: string[], groupName: string, groupImgUrl: string) {
	const { getUser } = getKindeServerSession();
	const user = await getUser();
  
	if (!user) return { success: false, message: "User not authenticated" };
  
	const groupAdminId = user.id;

	const Ids = [...usersIds,groupAdminId];
	   


	try {
	  // Check if a group with the same name and users already exists
	  const existingGroup = await prisma.group.findFirst({
		where: {
		  name: groupName,
		  users: {
			every: {
			  userId: {
				in: Ids,
			  },
			},
		  },
		},
		include: {
		  users: {
			include: {
			  user: true,
			},
		  },
		  chats: {
			include: {
			  users: {
				include: {
				  user: true,
				},
			  },
			  messages: true,
			},
		  },
		  messages: true,
		},
	  });
  
	  if (existingGroup) {
		return existingGroup;
	  }
  
	  // Create a new group if no existing group is found
	  const newGroup = await prisma.group.create({
		data: {
		  name: groupName,
		  image: groupImgUrl,
		  groupAdminId: groupAdminId,
		  users: {
			create: Ids.map(userId => ({
			  user: { connect: { id: userId } },
			})),
		  },
		  chats: {
			create: {
			  isGroupChat: true,
			  users: {
				create: Ids.map(userId => ({
				  user: { connect: { id: userId } },
				})),
			  },
			},
		  },
		},
		include: {
		  users: {
			include: {
			  user: true,
			},
		  },
		  chats: {
			include: {
			  users: {
				include: {
				  user: true,
				},
			  },
			  messages: true,
			},
		  },
		  messages: true,
		},
	  });
  
	  return newGroup;
	} catch (error) {
	  console.error('Error creating or fetching group:', error);
	  throw new Error('Could not create or fetch group');
	} finally {
	  await prisma.$disconnect();
	}
  }
 
  export async function leaveGroup(userId: string, groupId: number) {
	try {
	
	  const groupUser = await prisma.groupUser.findUnique({
		where: {
		  userId_groupId: {
			userId: userId,
			groupId: groupId,
		  },
		},
	  })

	  console.log(groupUser);
  
	  if (!groupUser) {

		throw new Error('User is not in this group')
	  }
  
	  // Start a transaction
	  await prisma.$transaction(async (prisma) => {
		// Remove the user from the group
		await prisma.groupUser.delete({
		  where: {
			userId_groupId: {
			  userId: userId,
			  groupId: groupId,
			},
		  },
		})
  
		// Check if the leaving user is the group admin
		const group = await prisma.group.findUnique({
		  where: { id: groupId },
		  select: { groupAdminId: true },
		})
  
		if (group && group.groupAdminId === userId) {
		  // If the leaving user is the admin, set groupAdminId to null
		  await prisma.group.update({
			where: { id: groupId },
			data: { groupAdminId: null },
		  })
		}
  
		// Remove the user from all chats associated with this group
		await prisma.userChat.deleteMany({
		  where: {
			userId: userId,
			chat: {
			  groupId: groupId,
			},
		  },
		})
	  })
  	  
	  revalidatePath('/chat', 'layout');
	  return { success: true, message: 'Successfully left the group' }
	} catch (error) {
	  console.error('Error leaving group:', error)
	  throw error
	}
}
export async function removeMemberFromGroup(userId: string, groupId: number) {
	try {
	  await prisma.groupUser.delete({
		where: {
		  userId_groupId: {
			userId,
			groupId,
		  },
		},
	  });
	  revalidatePath('/chat', 'layout');
	  return { success: true, message: 'Member removed successfully' };
	  
	} catch (error) {
	  console.error('Error removing member from group:', error);
	  throw error;
	}
  }


export async function promoteToAdmin(userId: string, groupId: number) {
	try {
	  await prisma.group.update({
		where: { id: groupId },
		data: { groupAdminId: userId },
	  });
	  revalidatePath('/chat', 'layout');
	  return { success: true, message: 'Member promoted to admin successfully' };

	  
	} catch (error) {
	  console.error('Error promoting member to admin:', error);
	  throw error;
	}
  }
  

  export async function updateLogoutStatus(userId:string) {
	if(!userId) {
		return;
	}	
	await prisma.user.update({
		where: {
			id: userId
		},
		data: {
			isActive: false
		}
	})
  }