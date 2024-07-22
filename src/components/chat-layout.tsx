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
import { useSelectedUser } from "@/store/useSelectedUser";
import { User } from "@/lib/dummy";



interface ChatLayoutProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  users: User[];
}

export function ChatLayout({
  defaultLayout = [320, 480],
  defaultCollapsed = true,
  navCollapsedSize,
  users,
}: ChatLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  const [isMobile, setIsMobile] = useState(false);
  const {selectedUser} = useSelectedUser();

  

  useEffect(() => {
    
    const checkScreenWidth = () => {
        console.log("check screen width")
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
        //   console.log("collapse")
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            true
          )}`;
        }}
        onExpand={() => {
          setIsCollapsed(false);
        //   console.log("expand")
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            false
          )}`;
        }}
        className={cn(
          isCollapsed && "min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out"
        )}
      >
        <Sidebar isCollapsed={isCollapsed} users={users} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
				{!selectedUser && (
					<div className='flex justify-center items-center h-full w-full px-10'>
						<div className='flex flex-col justify-center items-center gap-4'>
							<img src='/logo.png' alt='Logo' className='w-full md:w-2/3 lg:w-1/2' />
							<p className='text-muted-foreground text-center'>Click on a chat to view the messages</p>
						</div>
					</div>
				)}
				{selectedUser && <MessageContainer />}
			</ResizablePanel>
      
    </ResizablePanelGroup>
  );
}