import { ChatLayout } from "@/components/chat-layout";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { USERS, User } from "../../lib/dummy";
import { redis } from "@/lib/db";


async function getUsers(myId:string): Promise<User[]> {
	const userKeys: string[] = [];
	let cursor = "0";

	do {
		const [nextCursor, keys] = await redis.scan(cursor, { match: "user:*", type: "hash", count: 100 });
		cursor = nextCursor;
		userKeys.push(...keys);
	} while (cursor !== "0");


	

	const pipeline = redis.pipeline();
	userKeys.forEach((key) => pipeline.hgetall(key));
	const results = (await pipeline.exec()) as User[];

	const users: User[] = [];
	for (const user of results) {
		// exclude the current user from the list of users in the sidebar
		if (user.id !== myId) {
			users.push(user);
		}
	}
	return users;
}

export const chatPage = async () => {
    const { getUser} = getKindeServerSession(); 
    const user = await getUser();
    const allUsers = await getUsers(user?.id as string);
  


    
  

    if(!user){
        redirect('/')
    }


    const layout = cookies().get("react-resizable-panels:layout");
    const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
    
  return (
    <main className='flex h-screen flex-col items-center justify-center p-4 md:px-24 py-32 gap-4'>
  

    <div className='z-10 border rounded-lg max-w-5xl w-full min-h-[85vh] text-sm'>
      <ChatLayout defaultLayout={defaultLayout}navCollapsedSize={8} users={allUsers} />
    </div>
  </main>
  )
}

export default chatPage;

