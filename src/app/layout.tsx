import type { Metadata } from "next";

import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import "../styles/globals.css";

import { Toaster } from "@/components/ui/toaster"




import { ThemeProvider } from "@/components/theme-provider"

import Header from "@/components/Header";
import ConvexClientProvider from "@/components/ConvexClerkProvider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Next chat app",
  description: "Generated by zain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <ConvexClientProvider>
      <html lang="en" suppressHydrationWarning>
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}>
      

          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            

            
              <Header></Header>
            {children} 
            
            </ThemeProvider>
            <Toaster />
        </body>
    </html>
    </ConvexClientProvider>
  );
}
