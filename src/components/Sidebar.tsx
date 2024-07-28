import { ScrollArea } from "./ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
// import useSound from "use-sound";
import { usePreferences } from "@/store/usePreferences";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useSelectedChat } from "@/store/useSelectedUser";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import UserListDialog from "./userlistDialogue";

interface SidebarProps {
	isCollapsed: boolean;
	chats: Chat[];
	users: User[];
	groups: Group[];
}

const Sidebar = ({ isCollapsed, chats, users, groups }: SidebarProps) => {
	// const [playClickSound] = useSound("/sounds/mouse-click.mp3");
	// const { soundEnabled } = usePreferences();
	const { selectedChat, setSelectedChat } = useSelectedChat();
	const { user } = useKindeBrowserClient();

	const handleChatClick = (item:any ) => {
		// soundEnabled && playClickSound();
		console.log(item);
		if ('user' in item) {
			setSelectedChat(item);
		} else {
			console.log("Group chat selected: ", item);
			setSelectedChat(item.chat as Chat);
		}
	};


	return (
		<div className='group relative flex flex-col h-full gap-4 p-2 max-h-full overflow-auto bg-background'>
			{!isCollapsed && (
				<div className='flex justify-between p-2 items-center'>
					<div className='flex gap-2 items-center text-2xl w-full'>
						<p className='font-medium'>Chats</p>
						<div className="flex ml-auto items-center justify-center gap-2">
							<UserListDialog users={users}></UserListDialog>
						</div>
					</div>
				</div>
			)}

			<ScrollArea className='gap-2 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2'>
				{[...chats, ...groups].map((item, idx) => {
					const isGroup = 'groupAdminId' in item;
					const isSelected = selectedChat?.id === item.id;

					return isCollapsed ? (
						<TooltipProvider key={idx}>
							<Tooltip delayDuration={0}>
								<TooltipTrigger asChild>
									<div
										className={cn(isSelected && "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white shrink")}
										onClick={() => handleChatClick(item)}
									>
										<Avatar className='my-1 flex justify-center items-center'>
											<AvatarImage
												src={isGroup ? item.image : item.user?.profileImage || "/chat.user-placeholder.png"}
												alt={isGroup ? 'Group Image' : 'User Image'}
												className='border-2 border-white rounded-full w-10 h-10'
											/>
											<AvatarFallback>{isGroup ? item.name[0] : item.user?.firstName[0]}</AvatarFallback>
										</Avatar>
										<span className='sr-only'>{isGroup ? item.name : item.user?.firstName}</span>
									</div>
								</TooltipTrigger>
								<TooltipContent side='right' className='flex items-center gap-4'>
									{isGroup ? item.name : item.user?.firstName}
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					) : (
						<Button
							key={idx}
							variant={"grey"}
							size='xl'
							className={cn(
								"w-full justify-start gap-4 my-1",
								isSelected && "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white shrink"
							)}
							onClick={() => handleChatClick(item)}
						>
							<Avatar className='flex justify-center items-center'>
								<AvatarImage
									src={isGroup ? item.image : item.user?.profileImage || "/chat.user-placeholder.png"}
									alt={isGroup ? 'Group Image' : 'User Image'}
									className='w-10 h-10'
								/>
								<AvatarFallback>{isGroup ? item.name[0] : item.user?.firstName[0]}</AvatarFallback>
							</Avatar>
							<div className='flex flex-col max-w-28'>
								<span>{isGroup ? item.name : item.user?.firstName}</span>
							</div>
						</Button>
					);
				})}
			</ScrollArea>

			<div className='mt-auto'>
				<div className='flex justify-between items-center gap-2 md:px-6 py-2'>
					{!isCollapsed && (
						<div className='hidden md:flex gap-2 items-center '>
							<Avatar className='flex justify-center items-center'>
								<AvatarImage
									src={user?.picture || "/chat.user-placeholder.png"}
									alt='avatar'
									referrerPolicy='no-referrer'
									className='w-8 h-8 border-2 border-white rounded-full'
								/>
							</Avatar>
							<p className='font-bold'>
								{user?.given_name}
							</p>
						</div>
					)}
					<div className='flex'>
						<LogoutLink>
							<LogOut size={22} cursor={"pointer"} />
						</LogoutLink>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;