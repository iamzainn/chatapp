import { Avatar, AvatarImage } from "../components/ui/avatar";
import { Info, X } from "lucide-react";
import {USERS} from '../lib/dummy';
import { useSelectedChat } from "@/store/useSelectedUser";



const ChatTopBar = () => {
	// const { selectedUser, setSelectedUser } = useSelectedUser();
	const {selectedChat,setSelectedChat}=useSelectedChat();


    
	
	return (
		<div className='w-full h-20 flex p-4 justify-between items-center border-b'>
			<div className='flex items-center gap-2'>
				<Avatar className='flex justify-center items-center'>
					<AvatarImage
						src={selectedChat?.user?.profileImage || "/user-placeholder.png"}
						alt='User Image'
						className='w-10 h-10 object-cover rounded-full'
					/>
				</Avatar>
				<span className='font-medium'>{selectedChat?.user?.firstName}</span>
			</div>

			<div className='flex gap-2'>
				<Info className='text-muted-foreground cursor-pointer hover:text-primary' />
				<X
					className='text-muted-foreground cursor-pointer hover:text-primary'
					onClick={() => setSelectedChat(null)}
				/>
			</div>
		</div>
	);
};
export default ChatTopBar;