import React, { useEffect, useRef } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { useSelectedChat } from "@/store/useSelectedChat";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import MessageItem from "./MessageItem";
import MessageSkeleton from "./MessageSkeletonComponent";

const MessageList: React.FC = () => {
  const { selectedChat } = useSelectedChat();
  const messages = useQuery(api.messages.fetchChatMessages, selectedChat ? { chatId: selectedChat._id } : "skip");
  const me = useQuery(api.users.getMe);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!selectedChat) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Select a chat to start messaging</p>
      </div>
    );
  }

  if (messages === undefined) {
    return <MessageSkeleton count={5} />;
  }

  return (
    <div ref={messageContainerRef} className='w-full overflow-y-auto overflow-x-hidden h-full flex flex-col'>
      <AnimatePresence>
        {messages.map((message, index) => (
          <MessageItem
            key={message._id}
            message={message}
            isCurrentUser={message.senderId === me?._id}
            showSenderInfo={selectedChat.isGroupChat}
            isLastMessage={index === messages.length - 1}
            ref={index === messages.length - 1 ? lastMessageRef : null}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default MessageList;