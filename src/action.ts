"use server";


import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "./lib/db";
import { revalidatePath } from "next/cache";


export async function fetchData(userId: string): Promise<ChatResponse> {
	try {
		// Fetch all non-group chats where the user is a participant
		const chats = await prisma.chat.findMany({
		  where: {
			isGroupChat: false,
			users: {
			  some: {
				userId: userId,
			  }
			}
		  },
		  include: {
			users: {
			  include: {
				user: {
				  select: {
					id: true,
					firstName: true,
					lastName: true,
					email: true,
					profileImage: true,
				  }
				}
			  }
			},
			messages: true
		  }
		});
	
		// Fetch all groups where the user is a member
		const groups = await prisma.group.findMany({
		  where: {
			users: {
			  some: {
				userId: userId,
			  }
			}
		  },
		  include: {
			users: {
			  select: {
				user: {
				  select: {
					id: true,
					firstName: true,
					lastName: true,
					email: true,
					profileImage: true,
				  }
				}
			  }
			},
			groupAdmin: {
			  select: {
				id: true,
				firstName: true,
				lastName: true,
				email: true,
				profileImage: true,
			  }
			},
			chats: {
			  include: {
				messages: true,
				users: {
				  include: {
					user: {
					  select: {
						id: true,
						firstName: true,
						lastName: true,
						email: true,
						profileImage: true,
					  }
					}
				  }
				}
			  }
			}
		  }
		});
	
		// Transform non-group chats
		const transformedChats: Chat[] = chats.map(chat => {
		  const chatUsers = chat.users.map(userChat => userChat.user);
		  const otherUser = chatUsers.find(u => u.id !== userId);
	
		  return {
			id: chat.id,
			isGroupChat: chat.isGroupChat,
			createdAt: chat.createdAt,
			updateAt: chat.updatedAt,
			messages: chat.messages.map(message => ({
			  id: message.id,
			  content: message.content,
			  createdAt: message.createdAt,
			  updatedAt: message.updatedAt,
			  senderId: message.senderId,
			  type: message.type,
			  chatId: message.chatId
			})),
			user: otherUser
		  };
		});
	
		const transformedGroups: Group[] = groups.map(group => {
		  const groupChat = group.chats[0]; // Assuming one chat per group for simplicity
	
		  return {
			id: group.id,
			name: group.name,
			image: group.image as string,
			createdAt: group.createdAt,
			updatedAt: group.updatedAt,
			groupAdminId: group.groupAdminId,
			numberOfMembers: group.users.length,
			chat: groupChat
			  ? {
				  id: groupChat.id,
				  isGroupChat: groupChat.isGroupChat,
				  createdAt: groupChat.createdAt,
				  updateAt: groupChat.updatedAt,
				  messages: groupChat.messages.map(message => ({
					id: message.id,
					content: message.content,
					createdAt: message.createdAt,
					updatedAt: message.updatedAt,
					senderId: message.senderId,
					type: message.type,
					chatId: message.chatId
				  })),
				  users: groupChat.users.map(userChat => userChat.user)
				}
			  : undefined
		  };
		});
	
		return {
		  groups: transformedGroups,
		  chats: transformedChats
		};
	
	  } catch (error) {
		console.error('Error fetching user data:', error);
		return {
		  groups: [],
		  chats: []
		};
	  }
  }
  

export async function sendMessageAction(message: string, receiverUserId: string, isGroupChat: boolean) {
	const { getUser } = getKindeServerSession();
	const user = await getUser();
  
	if (!user) return { success: false, message: "User not authenticated" };
  
	const senderId = user.id;
  
	
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
		chatId: chat?.id as number,
		type: "text"
	  }
	});
  	
  
	return { success: true, message: "Message sent successfully" };
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
  export async function fetchGroupDetails(chatId: number) {
	try {
	  // First, check if the chat is a group chat
	  const chat = await prisma.chat.findUnique({
		where: { id: chatId },
		select: { isGroupChat: true, groupId: true }
	  })
  
	  if (!chat) {
		throw new Error('Chat not found')
	  }
  
	  if (!chat.isGroupChat || !chat.groupId) {
		throw new Error('This is not a group chat')
	  }
  
	  // Fetch group details
	  const groupDetails = await prisma.group.findUnique({
		where: { id: chat.groupId },
		select: {
		  id: true,
		  name: true,
		  image: true,
		  createdAt: true,
		  updatedAt: true,
		  groupAdminId: true,
		  // We're not fetching users as per the requirement
		}
	  })
  
	  if (!groupDetails) {
		throw new Error('Group details not found')
	  }
  
	  return groupDetails
  
	} catch (error) {
	  console.error('Error fetching group details:', error)
	  throw error
	}
  }

  export async function leaveGroup(userId: string, groupId: number) {
	try {
	  // Check if the user is in the group
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
  
	  // Revalidate paths
	  revalidatePath('/chat')
	  revalidatePath('/', 'layout')
  
	  return { success: true, message: 'Successfully left the group' }
	} catch (error) {
	  console.error('Error leaving group:', error)
	  throw error
	}
}