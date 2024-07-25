import { AnimatePresence, motion } from "framer-motion";
import { Image as ImageIcon, Loader2, SendHorizontal, ThumbsUp } from "lucide-react";
import Image from "next/image";

import {  useRef, useState } from "react";
import EmojiPicker from "../components/EmojiPicker";
import { Button } from "../components/ui/button";

import { usePreferences } from "@/store/usePreferences";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

import { useFormStatus } from "react-dom";
import { Input } from "./ui/input";
import { useSelectedUser } from "@/store/useSelectedUser";
import { sendMessageAction } from "@/action";


const ChatBottomBar = () => {
	const [message, setMessage] = useState("");
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	
	const [isGroupChat, setIsGroupChat] = useState(false);
	const [isloading, setIsLoading] = useState(false);

	const { selectedUser } = useSelectedUser();
	
	
    
	

	
	

	const [imgUrl, setImgUrl] = useState("");

	


	const handleSendMessage = async(content:string,receiverId:string,isGroupChat:boolean)=>{
		setIsLoading(true)
		try{
			await sendMessageAction(content,receiverId,isGroupChat)
			setMessage("")
		}catch(e){
			console.log(e)
		}
		finally{
			setIsLoading(false)
		}
	}


	const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			await handleSendMessage(message,selectedUser?.id as string,isGroupChat)
			setMessage("");
		}

		if (e.key === "Enter" && e.shiftKey) {
			e.preventDefault();
			setMessage(message + "\n");

			
		}
	};
	const handleResize = () => {
		if (textAreaRef.current) {
		  textAreaRef.current.style.height = 'auto';
		  textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
		}
	  };

	

	

	
	

	return (
		<div className='p-2 flex justify-between w-full items-center gap-2'>
			<Dialog open={!!imgUrl}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Image Preview</DialogTitle>
					</DialogHeader>
					<div className='flex justify-center items-center relative h-96 w-full mx-auto'>
						<Image src={imgUrl} alt='Image Preview' fill className='object-contain' />
					</div>

					<DialogFooter>
						<Button
							type='button'
							onClick={() => {
								
							}}
						>
							Send
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			
			<AnimatePresence>

				<form    
				 className='w-full flex items-center gap-2'>
						
				<motion.div
					layout
					initial={{ opacity: 0, scale: 1 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 1 }}
					transition={{
						opacity: { duration: 0.5 },
						layout: {
							type: "spring",
							bounce: 0.15,
						},
					}}
					className='w-full relative'
				>
				<textarea
				name="content"
				autoComplete="off"
				placeholder="Type your message..."
				rows={message.trim() === '' && 1 ||  1}
				onKeyDown={handleKeyDown}
				value={message}
				className="w-full px-4 py-4 rounded-lg  resize-none overflow-hidden bg-transparent"
				onChange={(e) => {
				  setMessage(e.target.value);
				  handleResize();
				}}
				ref={textAreaRef}
			  />
				
					
				</motion.div>
				<EmojiPicker onChange={function (emoji: string): void {
						setMessage(message + emoji);
						textAreaRef.current?.focus();
					} }></EmojiPicker>

				{message.trim() ? (
					
                    <Button
					   disabled={isloading}
					   onClick={async ()=>{
						   await handleSendMessage(message,selectedUser?.id as string,isGroupChat)
					   }}
					   type="submit"
						className='h-9 w-9 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0'
						variant={"ghost"}
						size={"icon"}
						
					>
					{isloading ?<Loader2 size={20} className='text-muted-foreground animate-spin'></Loader2> :	<SendHorizontal size={20} className='text-muted-foreground' />}
					</Button>
					
				) : (
					
					
					
					<>
					
					<Button
					   type="button"
						className='h-9 w-9 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0'
						variant={"ghost"}
						size={"icon"}
					>
						{(
							<ThumbsUp
								size={20}
								className='text-muted-foreground'
								onClick={() => {
								    handleSendMessage("👍",selectedUser?.id as string,isGroupChat)
								}}
							/>
						)}
						
					</Button>
					</>
					

				)}
				</form>
			   
				
			</AnimatePresence>
		</div>
	);
};
export default ChatBottomBar;


