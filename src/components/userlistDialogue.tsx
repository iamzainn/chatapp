import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";


import { ImageIcon, MessageSquareDiff } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { getOrCreateChat, getOrCreateGroup } from "@/action";
import { useSelectedChat } from "@/store/useSelectedUser";
import { supabase } from "@/lib/db";


export const UserListDialog = ({users}:{users:User[]}) => {

    
	const [groupName, setGroupName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [renderedImage, setRenderedImage] = useState("");
    const [selectedUsers,setSelectedUsers] = useState<string[]>([]);
    const {setSelectedChat} = useSelectedChat();  
	const imgRef = useRef<HTMLInputElement>(null);
	const dialogCloseRef = useRef<HTMLButtonElement>(null);

    const UploadImage = async()=>{
    const { data, error } = await supabase.storage
    .from("chatappbucket")
    .upload("public/" + selectedImage?.name, selectedImage as File);


    if (data) {
      console.log(JSON.stringify(data,null,2));
      return `https://socjukiensqxpqzbcjln.supabase.co/storage/v1/object/public/${data.fullPath}`
    } else if (error) {
      console.log(error);
    }
    };
	
	const handleCreateConversation = async () => {
	
		setIsLoading(true);
		 try {
		  if(selectedUsers.length < 0){
            throw new Error("unable to create chat");
          }	
          if(selectedUsers.length==1){
            const receieverId = selectedUsers[0];
            const newChat= await getOrCreateChat(receieverId);
            setSelectedChat(newChat as unknown as Chat);
            return;
          }
		  if(selectedUsers.length>1){  
           const grpimgUrl = await UploadImage() || "" ;
           const result = await getOrCreateGroup(selectedUsers,groupName,grpimgUrl);
        //    setSelectedChat(result.chats[0] as unknown as Chat);
           return
          }
			
		} catch (err) {
			
		} finally {
			setIsLoading(false); 
		}
	};

	useEffect(() => {
		if (!selectedImage) return setRenderedImage("");
		const reader = new FileReader();
		reader.onload = (e) => setRenderedImage(e.target?.result as string);
		reader.readAsDataURL(selectedImage);
	}, [selectedImage]);

	return (
		<Dialog>
			<DialogTrigger>
				<MessageSquareDiff size={20} />
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					
					<DialogClose ref={dialogCloseRef} />
					<DialogTitle>Users</DialogTitle>
				</DialogHeader>

				<DialogDescription>Start a new chat</DialogDescription>
				{renderedImage && (
					<div className='w-16 h-16 relative mx-auto'>
						<Image src={renderedImage} fill alt='user image' className='rounded-full object-cover' />
					</div>
				)}
				
				<input
					type='file'
					accept='image/*'
					ref={imgRef}
					hidden
					onChange={(e) => setSelectedImage(e.target.files![0])}
				/>
				{selectedUsers.length > 1 && (
					<>
						<Input
							placeholder='Group Name'
							value={groupName}
							onChange={(e) => setGroupName(e.target.value)}
						/>
						<Button className='flex gap-2' onClick={() => imgRef.current?.click()}>
							<ImageIcon size={20} />
							Group Image
						</Button>
					</>
				)}
				<div className='flex flex-col gap-3 overflow-auto max-h-60'>
					{users?.map((user) => (
						<div
							key={user.id}
							className={`flex gap-3 items-center p-2 rounded cursor-pointer active:scale-95 
								transition-all ease-in-out duration-300
							${selectedUsers.includes(user.id) ? "bg-green-primary" : ""}`}
							onClick={() => {
								if (selectedUsers.includes(user.id)) {
									setSelectedUsers(selectedUsers.filter((id) => id !== user.id));
								} else {
									setSelectedUsers([...selectedUsers, user.id]);
								}
							}}
						>
							<Avatar className='overflow-visible'>
								

								<AvatarImage src={user.profileImage} className='rounded-full object-cover' />
								<AvatarFallback>
									<div className='animate-pulse bg-gray-tertiary w-full h-full rounded-full'></div>
								</AvatarFallback>
							</Avatar>

							<div className='w-full '>
								<div className='flex items-center justify-between'>
									<p className='text-md font-medium'>{user.firstName || user.email.split("@")[0]}</p>
								</div>
							</div>
						</div>
					))}
				</div>
				<div className='flex justify-between'>
					<Button variant={"outline"}>Cancel</Button>
					<Button
						onClick={handleCreateConversation}
						disabled={selectedUsers.length === 0 || (selectedUsers.length > 1 && !groupName) || isLoading}
					>
						
						{isLoading ? (
							<div className='w-5 h-5 border-t-2 border-b-2  rounded-full animate-spin' />
						) : (
							groupName ?"Create Group Chat" :"Create Chat"
						)}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
export default UserListDialog;