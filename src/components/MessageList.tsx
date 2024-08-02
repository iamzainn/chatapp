import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useSelectedChat } from "@/store/useSelectedUser";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { pusherClient } from '@/lib/pusher-client';
import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchChatMessages } from "@/action";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

type ExtendedChat = Chat & { messages?: Message[] };

const fetchMessages = async (chatId: number): Promise<Message[]> => {
  try {
    return await fetchChatMessages(chatId);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    throw new Error('Failed to fetch messages');
  }
};

const MessageList = () => {
  const { selectedChat, addMessage } = useSelectedChat();
  const { user: currentUser } = useKindeBrowserClient();
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: messages, isLoading, isError, error } = useQuery<Message[], Error>({
    queryKey: ['messages', selectedChat?.id],
    queryFn: () => fetchMessages(selectedChat?.id as number),
    enabled: !!selectedChat?.id,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, 
  });

  useEffect(() => {
    if (selectedChat) {
      const channel = pusherClient.subscribe(`chat-${selectedChat.id}`);
      channel.bind('new-message', (newMessage: Message) => {
        queryClient.setQueryData(['messages', selectedChat.id], (oldData: Message[] | undefined) => {
          if (!oldData) return [newMessage];
          return [...oldData, newMessage];
        });
        addMessage(newMessage);
      });

      return () => {
        pusherClient.unsubscribe(`chat-${selectedChat.id}`);
      };
    }
  }, [selectedChat, addMessage, queryClient]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col gap-4 p-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className={cn("flex gap-3 items-center", index % 2 === 0 ? "justify-start" : "justify-end")}>
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-16 w-[200px]" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error?.message || 'An error occurred while fetching messages. Please try again.'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div ref={messageContainerRef} className='w-full overflow-y-auto overflow-x-hidden h-full flex flex-col'>
      <AnimatePresence>
        {messages?.map((message, index) => (
          <motion.div
            key={message.id}
            ref={index === messages.length - 1 ? lastMessageRef : null}
            layout
            initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
            transition={{
              opacity: { duration: 0.1 },
              layout: {
                type: "spring",
                bounce: 0.3,
                duration: messages ? messages.indexOf(message) * 0.05 + 0.2 : 0
              },
            }}
            style={{ originX: 0.5, originY: 0.5 }}
            className={cn(
              "flex flex-col gap-2 p-4 whitespace-pre-wrap",
              message.senderId === currentUser?.id ? "items-end" : "items-start"
            )}
          >
            <div className='flex gap-3 items-center'>
              {message.senderId === selectedChat?.user?.id && (
                <Avatar className='flex justify-center items-center'>
                  <AvatarImage
                    src={selectedChat?.user?.profileImage || "/user-placeholder.png"}
                    alt='User Image'
                    className='border-2 border-white rounded-full'
                  />
                </Avatar>
              )}
              {message.type === "text" ? (
                <span className='bg-accent p-3 rounded-md max-w-xs break-words'>{message.content}</span>
              ) : (
                <img
                  src={message.content}
                  alt='Message Image'
                  className='border p-2 rounded h-40 md:h-52 object-cover'
                />
              )}
              {message.senderId === currentUser?.id && (
                <Avatar className='flex justify-center items-center'>
                  <AvatarImage
                    src={currentUser?.picture || "/user-placeholder.png"}
                    alt='User Image'
                    className='border-2 border-white rounded-full'
                  />
                </Avatar>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {isLoading && (
        <div className="flex justify-center items-center p-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default MessageList;