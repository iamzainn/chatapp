import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";


const chatPage = async () => {
    const { getUser} = getKindeServerSession(); 
    const user = await getUser();

    if(!user){
        redirect('/')
    }
  return (
    <div>
      <p>welcome</p>
    </div>
  )
}


