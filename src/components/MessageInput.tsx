'use client';
import React from 'react';
import { Paperclip, Smile, X } from "lucide-react";
import EmojiPicker from "../components/EmojiPicker";
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";
import { Button } from './ui/button';
import { motion } from 'framer-motion';

interface MessageInputProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  message,
  setMessage,
  textAreaRef,
  handleKeyDown,
  file,
  setFile,
  setPreviewUrl,
  handleFileChange
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1 }}
      transition={{
        opacity: { duration: 0.5 },
        layout: { type: "spring", bounce: 0.15 },
      }}
      className="flex-grow relative flex items-center space-x-2"
    >
      <EmojiPicker
        onChange={(emoji: string) => {
          setMessage(prev => prev + emoji);
          textAreaRef.current?.focus();
        }}
      >
        
      </EmojiPicker>

      <div className="relative flex-grow">
        <Textarea
          name="content"
          placeholder="Type your message..."
          rows={1}
          onKeyDown={handleKeyDown}
          value={message}
          className="pr-10 resize-none min-h-[40px] max-h-[200px] py-2 px-3"
          onChange={(e) => setMessage(e.target.value)}
          ref={textAreaRef}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <label className="cursor-pointer relative">
            <input
              type="file"
              className="hidden"
              name="media"
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
              onChange={handleFileChange}
            />
            <Paperclip
              size={20}
              className={cn(
                "text-muted-foreground hover:text-foreground transition-colors",
                file && "text-primary"
              )}
            />
            {file && (
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="h-4 w-4 p-0 absolute -top-2 -right-2 rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setFile(null);
                  setPreviewUrl(null);
                }}
              >
                <X size={10} />
              </Button>
            )}
          </label>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageInput;