import { cn } from "@/lib/utils";
import { AnimatePresence, m, motion } from "framer-motion";
import { Avatar, AvatarImage } from "../components/ui/avatar";
import { useSelectedChat } from "../store/useSelectedUser";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

import {  useRef } from "react";



const MessageList = () => {

	const {selectedChat}=useSelectedChat();

    
	const { user: currentUser } = useKindeBrowserClient();
    
	const messageContainerRef = useRef<HTMLDivElement>(null);

	
	
	

	return (
		<div ref={messageContainerRef} className='w-full overflow-y-auto overflow-x-hidden h-full flex flex-col'>
			
			<AnimatePresence>
				{
					selectedChat?.messages?.map((message, index) => (
						<motion.div
							key={index}
							layout
							initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
							animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
							exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
							transition={{
								opacity: { duration: 0.1 },
								layout: {
									type: "spring",
									bounce: 0.3,
									duration: selectedChat.messages ? selectedChat?.messages?.indexOf(message) * 0.05 + 0.2:0
									
								},
							}}
							style={{
								originX: 0.5,
								originY: 0.5,
							}}
							className={cn(
								"flex flex-col gap-2 p-4 whitespace-pre-wrap",
								message.senderId === currentUser?.id ? "items-end" : "items-start"
							)}
						>
							<div className='flex gap-3 items-center'>
								{message.senderId === selectedChat?.user?.id && (
									<Avatar className='flex justify-center items-center'>
										<AvatarImage
											src={selectedChat?.user?.profileImage || "/user-placeholder.png"}
											alt='User Image'
											className='border-2 border-white rounded-full'
										/>
									</Avatar>
								)}
								{message.type === "text" ? (
									<span className='bg-accent p-3 rounded-md max-w-xs'>{message.content}</span>
								) : (
									<><img
											src={message.content}
											alt='Message Image'
											className='border p-2 rounded h-40 md:h-52 object-cover' /></>
								)}

                                
								{message.senderId === currentUser?.id && (
									<Avatar className='flex justify-center items-center'>
										<AvatarImage
											src={currentUser?.picture || "/user-placeholder.png"}
											alt='User Image'
											className='border-2 border-white rounded-full'
										/>
									</Avatar>
								)}
							</div>
						</motion.div>
					))}

				
			</AnimatePresence>
		</div>
	);
};
export default MessageList;