
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link"
import { redirect } from "next/navigation";


export default async function Home() {
  const { getUser} = getKindeServerSession(); 
  const user = await getUser();
  if(user){
    redirect('/chat');
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
   
      <main className="flex-1">
        <section className="container mx-auto px-6 py-12 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Effortless Team Communication
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Chatter is a fast, web-based chat application that helps teams collaborate and stay connected. Get started
              for free today.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <Link
                href="#"
                className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                prefetch={false}
              >
                Sign Up
              </Link>
              <Link
                href="#"
                className="inline-flex items-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                prefetch={false}
              >
                Login
              </Link>
            </div>
          </div>
        </section>
        <section className="bg-muted py-12 sm:py-16 lg:py-24">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12" id="features">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Features that Matter
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Chatter is packed with features to help your team communicate effectively and stay connected.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-background p-6 shadow-sm transition-all hover:bg-accent hover:text-accent-foreground">
                <WebcamIcon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">Real-time Chat</h3>
                <p className="mt-2 text-muted-foreground">
                  Instant messaging for your team. Stay connected and collaborate in real-time.
                </p>
              </div>
              <div className="rounded-lg bg-background p-6 shadow-sm transition-all hover:bg-accent hover:text-accent-foreground">
                <FileIcon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">File Sharing</h3>
                <p className="mt-2 text-muted-foreground">
                  Share files, documents, and media with your team. Keep everything organized and accessible.
                </p>
              </div>
              <div className="rounded-lg bg-background p-6 shadow-sm transition-all hover:bg-accent hover:text-accent-foreground">
                <VideoIcon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">Video Calls</h3>
                <p className="mt-2 text-muted-foreground">
                  Seamless video conferencing for your team. Stay connected face-to-face.
                </p>
              </div>
              <div className="rounded-lg bg-background p-6 shadow-sm transition-all hover:bg-accent hover:text-accent-foreground">
                <MailsIcon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">Notifications</h3>
                <p className="mt-2 text-muted-foreground">
                  Stay up-to-date with real-time notifications. Never miss an important message.
                </p>
              </div>
              <div className="rounded-lg bg-background p-6 shadow-sm transition-all hover:bg-accent hover:text-accent-foreground">
                <SearchIcon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">Search</h3>
                <p className="mt-2 text-muted-foreground">
                  Quickly find past conversations, files, and more with our powerful search functionality.
                </p>
              </div>
              <div className="rounded-lg bg-background p-6 shadow-sm transition-all hover:bg-accent hover:text-accent-foreground">
                <SmartphoneIcon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">Mobile Apps</h3>
                <p className="mt-2 text-muted-foreground">
                  Stay connected on the go with our iOS and Android mobile apps.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="container mx-auto px-6 py-12 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Get Started for Free
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Sign up for Chatter and start communicating with your team today. No credit card required.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <Link
                href="#"
                className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                prefetch={false}
              >
                Sign Up
              </Link>
              <Link
                href="#"
                className="inline-flex items-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                prefetch={false}
              >
                Login
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-muted py-6 sm:py-8 lg:py-10">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <p className="text-sm text-muted-foreground">&copy; 2024 Chatter. All rights reserved.</p>
            <nav className="flex space-x-4">
              <Link href="#" className="text-sm font-medium hover:text-primary transition-colors" prefetch={false}>
                Privacy
              </Link>
              <Link href="#" className="text-sm font-medium hover:text-primary transition-colors" prefetch={false}>
                Terms
              </Link>
              <Link href="#" className="text-sm font-medium hover:text-primary transition-colors" prefetch={false}>
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FileIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  )
}


function MailsIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="13" x="6" y="4" rx="2" />
      <path d="m22 7-7.1 3.78c-.57.3-1.23.3-1.8 0L6 7" />
      <path d="M2 8v11c0 1.1.9 2 2 2h14" />
    </svg>
  )
}


function MenuIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}


function SearchIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}


function SmartphoneIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  )
}


function VideoIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </svg>
  )
}


function WebcamIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="10" r="8" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 22h10" />
      <path d="M12 22v-4" />
    </svg>
  )
}


function XIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}