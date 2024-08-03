import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from './ui/button';
import { removeMemberFromGroup, promoteToAdmin } from '../action';
import { useToast } from "../components/ui/use-toast";
import { Loader2, UserMinus, UserPlus } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

interface User {
  id: string;
  firstName: string;
  profileImage?: string;
}

interface GML {
  users: User[];
  groupId: number;
  adminId: string;
}

export const GroupMembersList: React.FC<GML> = ({ users, groupId, adminId }) => {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useKindeBrowserClient();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const isCurrentUserAdmin = user?.id === adminId;

  const handleAction = async (action: 'remove' | 'promote', userId: string) => {
    if (!isCurrentUserAdmin) return;

    setLoadingStates(prev => ({ ...prev, [userId]: true }));
    try {
      if (action === 'remove') {
        await removeMemberFromGroup(userId, groupId);
        toast({ title: "Success", description: "Member removed from the group." });
      } else if (action === 'promote') {
        await promoteToAdmin(userId, groupId);
        toast({ title: "Success", description: "Member promoted to admin." });
      }
      router.refresh(); // Revalidate and update the UI
    } catch (error) {
      console.error(`Failed to ${action} member:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} member. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div className="p-4 bg-secondary/5">
      <h3 className="font-semibold mb-2">Group Members</h3>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.profileImage} alt={user.firstName} />
                <AvatarFallback>{user.firstName[0]}</AvatarFallback>
              </Avatar>
              <span>{user.firstName}</span>
              {user.id === adminId && <span className="text-xs text-muted-foreground ml-2">(Admin)</span>}
            </div>
            {isCurrentUserAdmin && user.id !== adminId && (
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleAction('remove', user.id)}
                  disabled={loadingStates[user.id]}
                >
                  {loadingStates[user.id] ? <Loader2 className="animate-spin" size={16} /> : <UserMinus size={16} />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleAction('promote', user.id)}
                  disabled={loadingStates[user.id]}
                >
                  {loadingStates[user.id] ? <Loader2 className="animate-spin" size={16} /> : <UserPlus size={16} />}
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};