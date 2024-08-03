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
import { ImageIcon, MessageSquareDiff, UserPlus, Search, User, MessageCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { getOrCreateChat, getOrCreateGroup } from "@/action";
import { useSelectedChat } from "@/store/useSelectedUser";
import { supabase } from "@/lib/db";

export const UserListDialog = ({ users }: { users: User[] }) => {
  const [groupName, setGroupName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [renderedImage, setRenderedImage] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { setSelectedChat } = useSelectedChat();
  const imgRef = useRef<HTMLInputElement>(null);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  const [searchTerm, setSearchTerm] = useState("");

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

	const filteredUsers = searchTerm
    ? users.filter(
        (user) =>
          user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
        <MessageCircle size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogClose ref={dialogCloseRef} />
          <DialogTitle className="text-2xl font-bold">Start a New Chat</DialogTitle>
          <DialogDescription>Search for users to start a conversation</DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search users by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>

          {selectedUsers.length > 1 && (
            <div className="space-y-4 mb-6">
              <Input
                placeholder="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full"
              />
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {renderedImage ? (
                      <Image
                        src={renderedImage}
                        width={100}
                        height={100}
                        alt="Group image"
                        className="mb-3 rounded-full object-cover"
                      />
                    ) : (
                      <ImageIcon size={64} className="mb-3 text-gray-400" />
                    )}
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => setSelectedImage(e.target.files![0])}
                  />
                </label>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`flex gap-3 items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out ${
                    selectedUsers.includes(user.id)
                      ? "bg-green-100 dark:bg-green-900"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => {
                    if (selectedUsers.includes(user.id)) {
                      setSelectedUsers(selectedUsers.filter((id) => id !== user.id));
                    } else {
                      setSelectedUsers([...selectedUsers, user.id]);
                    }
                  }}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.profileImage} alt={user.firstName || user.email.split("@")[0]} />
                    <AvatarFallback>{user.firstName?.[0] || user.email[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      {user.firstName || user.email.split("@")[0]}
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">{user.email}</p>
                  </div>
                  {selectedUsers.includes(user.id) && (
                    <div className="flex-shrink-0">
                      <span className="inline-block h-6 w-6 rounded-full bg-green-600 text-white text-center leading-6">
                        ✓
                      </span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center text-gray-500 py-8">
                <User size={48} className="mb-2" />
                <p className="text-center">
                  {searchTerm
                    ? "No users found. Try a different search term."
                    : "Enter a name or email to search for users."}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => dialogCloseRef.current?.click()}>
            Cancel
          </Button>
          <Button type="submit"
            onClick={handleCreateConversation}
            disabled={selectedUsers.length === 0 || (selectedUsers.length > 1 && !groupName) || isLoading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus size={20} className="mr-2" />
                {selectedUsers.length > 1 ? "Create Group" : "Start Chat"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

	
	
};
export default UserListDialog;