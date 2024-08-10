// components/GroupMembersDialog.tsx
import React from 'react';
import { useMutation } from 'convex/react';
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Users, UserMinus, UserPlus, Loader2, Router } from "lucide-react";
import { GroupChat } from '@/convexlibs/dbtypes';
import { Id } from '../../convex/_generated/dataModel';
import { api } from '../../convex/_generated/api';
import { useRouter } from 'next/navigation';

interface GroupMembersDialogProps {
  chat: GroupChat;
  currentUserId: Id<"users">;
}

const GroupMembersDialog: React.FC<GroupMembersDialogProps> = ({ chat, currentUserId }) => {
  const router = useRouter();
  const { toast } = useToast();
  const removeUser = useMutation(api.chats.removeUserFromGroup);
  const makeAdmin = useMutation(api.chats.makeUserAdmin);
//  console.log(currentUserId)

  const [loading, setLoading] = React.useState<Id<"users"> | null>(null);

  const isAdmin = chat.groupAdminId === currentUserId;

  const handleRemoveUser = async (userId: Id<"users">) => {
    setLoading(userId);
    try {
      await removeUser({ chatId: chat._id, userId });
      toast({ title: "User removed from group" });
       router.refresh()
    } catch (error) {
      toast({ title: "Failed to remove user", variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const handleMakeAdmin = async (userId: Id<"users">) => {
    setLoading(userId);
    try {
      await makeAdmin({ chatId: chat._id, userId });
      toast({ title: "User is now an admin" });
       router.refresh()
    } catch (error) {
      toast({ title: "Failed to make user admin", variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Users className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Group Members ({chat.users.length})</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] w-full pr-4">
          {chat.users.map((user) => (
            <div key={user._id} className="flex items-center space-x-4 py-3 border-b last:border-b-0">
              <Avatar>
                <AvatarImage src={user.profileImage} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex items-center space-x-2">
                {user.isOnline && (
                  <Badge variant="secondary" className="px-2 py-1">Active Now</Badge>
                )}
                {chat.groupAdminId === user._id && (
                  <Badge variant="default" className="px-2 py-1">Admin</Badge>
                )}
                {isAdmin && user._id !== currentUserId && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveUser(user._id)}
                      disabled={loading === user._id}
                      className="h-8 w-8"
                    >
                      {loading === user._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserMinus className="h-4 w-4" />}
                    </Button>
                    {chat.groupAdminId !== user._id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMakeAdmin(user._id)}
                        disabled={loading === user._id}
                        className="h-8 w-8"
                      >
                        {loading === user._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default GroupMembersDialog;