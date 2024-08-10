'use client';
import React, { useRef, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { ThumbsUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { useSelectedChat } from "@/store/useSelectedChat";
import { toast } from "./ui/use-toast";
import { useFileUpload } from "./useFileUpload";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import SendButton from "./SendMessageBtn";
import FilePreviewDialog from "./FIlePreviewDialog";
import MessageInput from "./MessageInput";

interface Message {
  content: string;
  type: "text" | "image" | "video" | "audio" | "file";
}

const ChatBottomBar: React.FC = () => {
  const [message, setMessage] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { selectedChat } = useSelectedChat();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { uploadFile, isUploading } = useFileUpload();
  const sendMessages = useMutation(api.messages.sendMessages);

  useEffect(() => {
    handleResize();
  }, [message]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);
    
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setIsDialogOpen(true);
    } else {
      setPreviewUrl(null);
      setIsDialogOpen(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedChat) {
      toast({
        title: "Error",
        description: "No chat selected.",
        variant: "destructive",
      });
      return;
    }

    const messages: Message[] = [];

    if (message.trim()) {
      messages.push({ content: message.trim(), type: "text" });
    }

    if (file) {
      try {
        const fileUrl = await uploadFile(file);
        // console.log(fileUrl);
        if (fileUrl) {
          messages.push({
            content: fileUrl,
            type: file.type.startsWith("image/") ? "image" : "file"
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload file. Please try again.",
          variant: "destructive",
        });
        return;
      }
    }

    if (messages.length === 0) return;

    try {
      await sendMessages({
        chatId: selectedChat._id,
        messages: messages,
      });

      setMessage("");
      setFile(null);
      setPreviewUrl(null);
      resetTextareaHeight();
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResize = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${Math.min(textAreaRef.current.scrollHeight, 200)}px`;
    }
  };

  const resetTextareaHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="p-4 bg-background border-t">
      <FilePreviewDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        file={file}
        previewUrl={previewUrl}
        onRemove={() => {
          setFile(null);
          setPreviewUrl(null);
          setIsDialogOpen(false);
        }}
      />

      <AnimatePresence>
        <form className="flex items-end space-x-2" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
          <MessageInput
            message={message}
            setMessage={setMessage}
            textAreaRef={textAreaRef}
            handleKeyDown={handleKeyDown}
            file={file}
            setFile={setFile}
            setPreviewUrl={setPreviewUrl}
            handleFileChange={handleFileChange}
          />

          <SendButton
            isLoading={isUploading}
            onClick={handleSendMessage}
            showSend={!!message.trim() || !!file}
          />

          {!message.trim() && !file && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => handleSendMessage()}
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
          )}
        </form>
      </AnimatePresence>
    </div>
  );
};

export default ChatBottomBar;