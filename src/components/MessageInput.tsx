'use client';
import React from 'react';
import { Paperclip, X } from "lucide-react";
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
      className="flex-grow relative"
    >
      <div className="relative">
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
        <div className="absolute right-2 bottom-2 flex items-center space-x-1">
          <label className="cursor-pointer">
            <Paperclip
              size={20}
              className={cn(
                "text-muted-foreground hover:text-foreground transition-colors",
                file && "text-primary"
              )}
            />
            <input
              type="file"
              className="hidden"
              name="media"
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
              onChange={handleFileChange}
            />
          </label>
          <EmojiPicker
            onChange={(emoji: string) => {
              setMessage(prev => prev + emoji);
              textAreaRef.current?.focus();
            }}
          />
        </div>
      </div>
      {file && (
        <div className="absolute -top-8 left-0 bg-background p-1 rounded-md shadow-md flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">{file.name}</span>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => {
              setFile(null);
              setPreviewUrl(null);
            }}
          >
            <X size={16} className="text-destructive" />
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default MessageInput;