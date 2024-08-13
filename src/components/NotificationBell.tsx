
import { useState } from 'react'
import { Bell } from 'lucide-react'
import { useQuery, useMutation, useConvexAuth } from 'convex/react'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { api } from '../../convex/_generated/api'
import { Skeleton } from './ui/skeleton'


const NotificationBell = () => {
  const [open, setOpen] = useState(false)
  const { isLoading,isAuthenticated } = useConvexAuth();
  const unreadNotifications = useQuery(api.notifications.getUnreadNotifications,isAuthenticated ? undefined : "skip");
  const markAsRead = useMutation(api.notifications.markAllNotificationsAsRead);

  if (isLoading) {
    return <Skeleton className="h-full w-full" />
  } 

  const handleMarkAsRead = async () => {
    await markAsRead();
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadNotifications && unreadNotifications.length > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Notifications</h3>
          <Button variant="outline" size="sm" onClick={handleMarkAsRead}>
            Mark all as read
          </Button>
        </div>
        <ScrollArea className="h-[300px]">
          {unreadNotifications && unreadNotifications.length > 0 ? (
            unreadNotifications.map((notification) => (
              <div key={notification._id} className="py-2 border-b">
                <p className="text-sm">{notification.content}</p>
                <p className="text-xs text-gray-500">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No new notifications</p>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

export default NotificationBell