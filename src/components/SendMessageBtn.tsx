import { Loader2, SendHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface SendButtonProps {
  isLoading: boolean;
  showSend: boolean;
}

const SendButton: React.FC<SendButtonProps> = ({ isLoading, showSend }) => {
  return (
    <Button
      disabled={isLoading}
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