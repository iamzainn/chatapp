"use client";


import React, { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";
import MessageContainer from "./MessageContainer";
import { useSelectedChat } from "@/store/useSelectedUser";




interface ChatLayoutProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  chats: Chat[]
  users:User[]
  groups:Group[]
}

export function ChatLayout({
  defaultLayout = [320, 480],
  defaultCollapsed = true,
  navCollapsedSize,
  chats,
  users,
  groups
}: ChatLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [isMobile, setIsMobile] = useState(false);
   const {selectedChat} =useSelectedChat();

  useEffect(() => {
    
    const checkScreenWidth = () => {
      
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkScreenWidth();

    // Event listener for screen width changes
    window.addEventListener("resize", checkScreenWidth);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(
          sizes
        )}`;
      }}
      className="h-full items-stretch"
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsedSize={navCollapsedSize}
        collapsible={true}
        minSize={isMobile ? 0 : 24}
        maxSize={isMobile ? 8 : 30}
        onCollapse={() => {
          setIsCollapsed(true);
        
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            true
          )}`;
        }}
        onExpand={() => {
          setIsCollapsed(false);
        
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            false
          )}`;
        }}
        className={cn(
          isCollapsed && "min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out"
        )}
      >
        <Sidebar isCollapsed={isCollapsed} chats={chats} users={users} groups={groups} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
				{!selectedChat && (
					<div className='flex justify-center items-center h-full w-full px-10'>
						<div className='flex flex-col justify-center items-center gap-4'>
							<img src='/logo.png' alt='Logo' className='w-full md:w-2/3 lg:w-1/2' />
							<p className='text-muted-foreground text-center'>Click on a chat to view the messages</p>
						</div>
					</div>
				)}
				{selectedChat && <MessageContainer />}
			</ResizablePanel>
      
    </ResizablePanelGroup>
  );
}