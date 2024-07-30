import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MoreVertical, UserMinus, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { promoteToAdmin, removeMemberFromGroup } from '@/action';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
}

interface GroupMembersListProps {
  users: User[];
  adminId: string | null;
  groupId: number;
}

type RemoveMemberResult = { success: boolean; message: string };
type PromoteToAdminResult = { success: boolean; message: string };

const UserListItem: React.FC<{
  user: User;
  isAdmin: boolean;
  isCurrentUserAdmin: boolean;
  currentUserId: string | undefined;
  onRemove: () => void;
  onPromote: () => void;
  isLoading: boolean;
}> = ({ user, isAdmin, isCurrentUserAdmin, currentUserId, onRemove, onPromote, isLoading }) => (
  <li className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary/20 transition-colors">
    <Avatar className="h-10 w-10">
      <AvatarImage src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} />
      <AvatarFallback>{user.firstName[0]}</AvatarFallback>
    </Avatar>
    <div className="flex-grow">
      <span className="text-sm font-medium">{user.firstName} {user.lastName}</span>
      <p className="text-xs text-muted-foreground">{user.email}</p>
    </div>
    {isAdmin && (
      <Badge variant="secondary" className="mr-2">Admin</Badge>
    )}
    {isCurrentUserAdmin && user.id !== currentUserId && (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isLoading}>
                  {isLoading ? <Skeleton className="h-4 w-4 rounded-full" /> : <MoreVertical className="h-4 w-4" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onRemove}>
                  <UserMinus className="mr-2 h-4 w-4" />
                  Remove from group
                </DropdownMenuItem>
                {!isAdmin && (
                  <DropdownMenuItem onClick={onPromote}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Make admin
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipTrigger>
          <TooltipContent>
            <p>Manage user</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )}
  </li>
);

export const GroupMembersList: React.FC<GroupMembersListProps> = ({ users, adminId, groupId }) => {
  const { user: currentUser } = useKindeBrowserClient();
  const queryClient = useQueryClient();

  const { mutateAsync: removeMutation,  isPending: removeLoading} = useMutation<RemoveMemberResult, Error, { userId: string }>({
    mutationFn: ({ userId }) => removeMemberFromGroup(userId, groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupDetails', groupId] });
    },
  });

  const { mutateAsync: promoteMutation,  isPending: promoteLoading}= useMutation<PromoteToAdminResult, Error, { userId: string }>({
    mutationFn: ({ userId }) => promoteToAdmin(userId, groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupDetails', groupId] });
    },
  });

  const handleRemoveMember = (userId: string) => {
    removeMutation({ userId });
  };

  const handlePromoteToAdmin = (userId: string) => {
    promoteMutation({ userId });
  };

  const isCurrentUserAdmin = currentUser?.id === adminId;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Group Members</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 max-h-60 overflow-y-auto">
          {users.map((user) => (
            <UserListItem
              key={user.id}
              user={user}
              isAdmin={user.id === adminId}
              isCurrentUserAdmin={isCurrentUserAdmin}
              currentUserId={currentUser?.id}
              onRemove={() => handleRemoveMember(user.id)}
              onPromote={() => handlePromoteToAdmin(user.id)}
              isLoading={removeLoading|| promoteLoading}
            />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};