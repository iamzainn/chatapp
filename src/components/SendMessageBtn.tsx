import React from 'react';
import { Loader2, SendHorizontal } from "lucide-react";
import { Button } from "../components/ui/button";
import { cn } from "@/lib/utils";

interface SendButtonProps {
  isLoading: boolean;
  onClick: () => void;
  showSend: boolean;
}

const SendButton: React.FC<SendButtonProps> = ({ isLoading, onClick, showSend }) => {
  return (
    <Button
      disabled={isLoading}
      onClick={onClick}
      type="submit"
      size="icon"
      className={cn(
        "shrink-0",
        !showSend && "hidden"
      )}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <SendHorizontal className="h-4 w-4" />
      )}
    </Button>
  );
};

export default SendButton;