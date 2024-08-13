import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Message, User } from "@/convexlibs/dbtypes";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSelectedChat } from "@/store/useSelectedChat";

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
  showSenderInfo: boolean;
  isLastMessage: boolean;
  me:User;
}

const MessageItem = forwardRef<HTMLDivElement, MessageItemProps>(
  ({ message, isCurrentUser, showSenderInfo, isLastMessage ,me}, ref) => {
    const { selectedChat } = useSelectedChat();

    const renderAvatar = (senderId: string) => {
      let user: User | undefined;
      if (selectedChat?.isGroupChat) {
        // console.log("selectedChat : "+JSON.stringify(selectedChat,null,2));
        user = selectedChat?.users.find((u) => u._id === senderId);
      } else {
        
         user = selectedChat?.user._id ===senderId ? selectedChat?.user : me;
      }

      return (
        <Avatar className='flex justify-center items-center'>
          <AvatarImage
            src={user?.profileImage || ""}
            alt='User Image'
            className='border-2 border-white rounded-full'
          />
          <AvatarFallback>{user?.name[0] || '?'}</AvatarFallback> 
        </Avatar>
      );
    };

    const renderMessageContent = () => {
      if (message.type === "text") {
        return <span className='bg-accent p-3 rounded-md max-w-xs break-words'>{message.content}</span>;
      } else if (message.type === "image") {
        return (
          <img
            src={message.content}
            alt='Message Image'
            className='border p-2 rounded h-40 md:h-52 object-cover'
          />
        );
      } else if (message.type === "link") {
        return <span className='break-words p-3 rounded-md max-w-xs bg-accent'><a className="text-blue-600 rounded-md" target="_blank" href={message.content}>
          {message.content}
          </a></span>;
      }
      else{
        return <span className='bg-accent p-3 rounded-md max-w-xs break-words'>{message.content}</span>;
      }
    };

    return (
      <motion.div
        ref={isLastMessage ? ref : null}
        layout
        initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
        transition={{
          opacity: { duration: 0.1 },
          layout: {
            type: "spring",
            bounce: 0.3,
            duration: 0.2
          },
        }}
        style={{ originX: 0.5, originY: 0.5 }}
        className={cn(
          "flex flex-col gap-2 p-4 whitespace-pre-wrap",
          isCurrentUser ? "items-end" : "items-start"
        )}
      >
        <div className={cn('flex gap-3 items-end', isCurrentUser && 'flex-row-reverse')}>
          {renderAvatar(message.senderId)}
          <div className="flex flex-col">
            {showSenderInfo && !isCurrentUser && (
           
            <></>
            )}
            {renderMessageContent()}
            <span className="text-xs text-muted-foreground mt-1">
              {new Date(message.createdAt).toLocaleString([], { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }
);

MessageItem.displayName = "MessageItem";

export default MessageItem;