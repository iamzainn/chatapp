import React, { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Paperclip, SendHorizontal, ThumbsUp, X } from "lucide-react";
import EmojiPicker from "../components/EmojiPicker";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { getSignedURL, sendMessageAction } from "@/action";
import { useSelectedChat } from "@/store/useSelectedUser";
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";

const ChatBottomBar: React.FC = () => {
  const [message, setMessage] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedChat,addMessage } = useSelectedChat();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

 const createFileUrl = async(file?:File):Promise<any>=>{
	const computeSHA256 = async (file: File) => {
	  const buffer = await file.arrayBuffer();
	  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
	  const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray
	   .map((b) => b.toString(16).padStart(2, "0"))
	  .join("");
	  return hashHex;
	};
	   if (file) {
		const checksum = await computeSHA256(file);
		const signedURLResult = await getSignedURL({checksum:checksum,fileSize:file.size,fileType:file.type})
		if (signedURLResult.failure !== undefined) {
		console.error(signedURLResult.failure)
		return
		}
	  
		const { url } = signedURLResult.success
		console.log({url})
		
		try{
		
		const res=	await fetch(url, {
		  method: "PUT",
		  headers: {
			"Content-Type": file.type,
		  },
		  body: file,
		  })
		  console.log(res);
		  return res.url;
	
  
		}catch(e){
		console.log(e);
		}
  
	  }
	
	}
  

  const handleSendMessage = async (content?: string) => {
    setIsLoading(true);
    
    try {
      const isGroupChat = selectedChat?.isGroupChat ?? false;
      const hasAnyFile = !!file;
      const chatId = selectedChat?.id as number;
      const messageContent = content ?? message;
      let fileUrl = "";
      const fileType = hasAnyFile ? file?.type : "";

      if (hasAnyFile) {
        fileUrl = await createFileUrl(file);
      }
      const result = await sendMessageAction(chatId, isGroupChat, hasAnyFile, messageContent, fileUrl, fileType);
    if (result.success) {
      result.messages.forEach(message => {
        addMessage(message);
      });
    }
      setMessage("");
      setFile(null);
      setPreviewUrl(null);
      resetTextareaHeight();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">File Preview</DialogTitle>
          </DialogHeader>
          <div className="mt-4 overflow-hidden max-h-[calc(100vh-200px)]">
            <div className="flex justify-center items-center">
              {file?.type.startsWith("image/") ? (
                <img src={previewUrl as string} alt="Selected file" className="max-w-full max-h-full object-contain" />
              ) : file?.type.startsWith("video/") ? (
                <video src={previewUrl as string} controls className="max-w-full max-h-full" />
              ) : null}
            </div>
          </div>
          <Button variant="destructive" onClick={() => {
            setFile(null);
            setPreviewUrl(null);
            setIsDialogOpen(false);
          }}>
            Remove File
          </Button>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        <form className="flex items-end space-x-2">
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
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
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
                    setMessage(message + emoji);
                    textAreaRef.current?.focus();
                  }}
                />
              </div>
            </div>
            {file && (
              <div className="absolute -top-8 left-0 bg-background p-1 rounded-md shadow-md flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">{file.name}</span>
                <Button
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

          <Button
            disabled={isLoading}
            onClick={() => handleSendMessage()}
            type="submit"
            size="icon"
            className={cn(
              "shrink-0",
              (!message.trim() && !file) && "hidden"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizontal className="h-4 w-4" />
            )}
          </Button>

          {!message.trim() && !file && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => handleSendMessage("👍")}
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