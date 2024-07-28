import { AnimatePresence, motion } from "framer-motion";
import {  Loader2, SendHorizontal, ThumbsUp, } from "lucide-react";


import {  useRef, useState } from "react";
import EmojiPicker from "../components/EmojiPicker";
import { Button } from "../components/ui/button";


import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";


import {  getSignedURL, sendMessageAction } from "@/action";
import { useSelectedChat } from "@/store/useSelectedUser";


const ChatBottomBar = () => {
	const [message, setMessage] = useState("");
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const [file, setFile] = useState<File | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isloading, setIsLoading] = useState(false);
	const {selectedChat} = useSelectedChat();
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	
	


	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0] ?? null;
		setFile(selectedFile);
		
		if (previewUrl) {
		  URL.revokeObjectURL(previewUrl);
		}
		
		if (selectedFile) {
		  const url = URL.createObjectURL(selectedFile);
		  setPreviewUrl(url);
		  setIsDialogOpen(true);
		} else {
		  setPreviewUrl(null);
		  setIsDialogOpen(false);
		}
	  };

	  const createFileUrl = async(file?:File):Promise<any>=>{
		const computeSHA256 = async (file: File) => {
		  const buffer = await file.arrayBuffer();
		  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
		  const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hashHex = hashArray
		   .map((b) => b.toString(16).padStart(2, "0"))
		  .join("");
		  return hashHex;
	  };
			 if (file) {
			  const checksum = await computeSHA256(file);
			  const signedURLResult = await getSignedURL({checksum:checksum,fileSize:file.size,fileType:file.type})
			  if (signedURLResult.failure !== undefined) {
				console.error(signedURLResult.failure)
				return
			  }
		  
			  const { url } = signedURLResult.success
			  console.log({url})
			  
			  try{
				
				const res=	await fetch(url, {
					method: "PUT",
					headers: {
					  "Content-Type": file.type,
					},
					body: file,
				  })
				  console.log(res);
				  return res.url;
		
	
			  }catch(e){
				console.log(e);
			  }
	
			}
		
		}
	

	   const handleSendMessage = async(content?:string)=>{
		setIsLoading(true)
		
		try{
			const isGroupChat = selectedChat?.isGroupChat ?true:false;
			const receiverId = isGroupChat? undefined : selectedChat?.user?.id as string; 
			const hasAnyfile = file?true:false;
			const chatId = selectedChat?.id as number;
			const message = content ? content : "";
			let fileUrl = "";
			const fileType= hasAnyfile ? file?.type : "";
            if(hasAnyfile){
			fileUrl = await createFileUrl(file!);
			}



             
			

		await sendMessageAction(chatId,isGroupChat,hasAnyfile,message,receiverId,fileUrl,fileType);	
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
			await handleSendMessage(message);
			
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
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="flex items-center gap-2 justify-center">
            <DialogTitle className="pr-10">Preview</DialogTitle>
		  <div className="flex items-center gap-4" >
			<Button size={"sm"} variant={"destructive"} onClick={()=>{
				setFile(null);
				setIsDialogOpen(false);
			}} className="">Remove</Button>
			
		  </div>
          </DialogHeader>
          <div className="mt-4 overflow-hidden max-h-[calc(100vh-200px)]">
            <div className="flex justify-center items-center">
              {file?.type.startsWith("image/") ? (
                <img src={previewUrl as string} alt="Selected file" className="max-w-full max-h-full object-contain" />
              ) : file?.type.startsWith("video/") ? (
                <video src={previewUrl as string} controls className="max-w-full max-h-full" />
              ) : null}
            </div>
          </div>
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
					
					<label className="flex relative inline-block">
  <div className="relative">
    <svg
      className="w-5 h-5 hover:cursor-pointer transform-gpu active:scale-75 transition-all text-neutral-500"
      aria-label="Attach media"
      role="img"
      viewBox="0 0 20 20"
    >
      <title>Attach media</title>
      <path
        d="M13.9455 9.0196L8.49626 14.4688C7.16326 15.8091 5.38347 15.692 4.23357 14.5347C3.07634 13.3922 2.9738 11.6197 4.30681 10.2794L11.7995 2.78669C12.5392 2.04694 13.6745 1.85651 14.4289 2.60358C15.1833 3.3653 14.9855 4.4859 14.2458 5.22565L6.83367 12.6524C6.57732 12.9088 6.28435 12.8355 6.10124 12.6671C5.94011 12.4986 5.87419 12.1983 6.12322 11.942L11.2868 6.78571C11.6091 6.45612 11.6164 5.97272 11.3088 5.65778C10.9938 5.35749 10.5031 5.35749 10.1808 5.67975L4.99529 10.8653C4.13835 11.7296 4.1823 13.0626 4.95134 13.8316C5.77898 14.6592 7.03874 14.6446 7.903 13.7803L15.3664 6.32428C16.8678 4.81549 16.8312 2.83063 15.4909 1.4903C14.1799 0.179264 12.1584 0.106021 10.6496 1.60749L3.10564 9.16608C1.16472 11.1143 1.27458 13.9268 3.06169 15.7139C4.8488 17.4937 7.6613 17.6109 9.60955 15.6773L15.1027 10.1841C15.4103 9.87653 15.4103 9.30524 15.0881 9.00495C14.7878 8.68268 14.2677 8.70465 13.9455 9.0196Z"
        className="fill-current"
      ></path>
    </svg>
    {file && (
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center text-white text-[8px] font-bold">
        1
      </div>
    )}
  </div>
  <input
    className="bg-transparent flex-1 border-none outline-none hidden"
    name="media"
    type="file"
    accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
    onChange={handleFileChange}
  />
</label>
			      		
					
    
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

				{message.trim() || (file && previewUrl) ? (
					
                       <Button
					   disabled={isloading}
					   onClick={async ()=>{
						   await handleSendMessage(message)
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
								    handleSendMessage("like");
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


