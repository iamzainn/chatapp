import { AnimatePresence, motion } from "framer-motion";
import { Image as ImageIcon, Loader, SendHorizontal, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { Textarea } from "../components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import EmojiPicker from "../components/EmojiPicker";
import { Button } from "../components/ui/button";
import useSound from "use-sound";
import { usePreferences } from "@/store/usePreferences";

// import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { USERS } from "@/lib/dummy";
// import { pusherClient } from "@/lib/pusher";
// import { Message } from "../lib/";

const ChatBottomBar = () => {
	const [message, setMessage] = useState("");
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	// const { selectedUser } = useSelectedUser();
    const selectedUser = USERS[0];
	const { user: currentUser } = useKindeBrowserClient();

	const { soundEnabled } = usePreferences();
	// const queryClient = useQueryClient();

	const [imgUrl, setImgUrl] = useState("");

	const [playSound1] = useSound("/sounds/keystroke1.mp3");
	const [playSound2] = useSound("/sounds/keystroke2.mp3");
	const [playSound3] = useSound("/sounds/keystroke3.mp3");
	const [playSound4] = useSound("/sounds/keystroke4.mp3");

	const [playNotificationSound] = useSound("/sounds/notification.mp3");

	const playSoundFunctions = [playSound1, playSound2, playSound3, playSound4];

	const playRandomKeyStrokeSound = () => {
		const randomIndex = Math.floor(Math.random() * playSoundFunctions.length);
		soundEnabled && playSoundFunctions[randomIndex]();
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
							type='submit'
							onClick={() => {
								// sendMessage({ content: imgUrl, messageType: "image", receiverId: selectedUser?.id! });
								// setImgUrl("");
							}}
						>
							Send
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<AnimatePresence>
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
					<Textarea
						autoComplete='off'
						placeholder='Aa'
						rows={1}
						className='w-full border rounded-full flex items-center h-9 resize-none overflow-hidden
						bg-background min-h-0'
						value={message}
						
						onChange={(e) => {
							setMessage(e.target.value);
							playRandomKeyStrokeSound();
						}}
						ref={textAreaRef}
					/>
					<div className='absolute right-2 bottom-0.5'>
						<EmojiPicker
							onChange={(emoji) => {
								setMessage(message + emoji);
								if (textAreaRef.current) {
									textAreaRef.current.focus();
								}
							}}
						/>
					</div>
				</motion.div>

				{message.trim() ? (
					<Button
						className='h-9 w-9 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0'
						variant={"ghost"}
						size={"icon"}
						
					>
						<SendHorizontal size={20} className='text-muted-foreground' />
					</Button>
				) : (
					<Button
						className='h-9 w-9 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0'
						variant={"ghost"}
						size={"icon"}
					>
						{(
							<ThumbsUp
								size={20}
								className='text-muted-foreground'
								onClick={() => {
								// sendMessage({ content: "👍", messageType: "text", receiverId: selectedUser?.id! });
								}}
							/>
						)}
						
					</Button>
				)}
			</AnimatePresence>
		</div>
	);
};
export default ChatBottomBar;