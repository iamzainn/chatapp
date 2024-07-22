import { NextResponse } from "next/server";
import jwksClient from "jwks-rsa";
import jwt from "jsonwebtoken";
import { redis } from "@/lib/db";
import { ifError } from "assert";
// import prisma from "@/lib/db";
// import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";





const client = jwksClient({
  jwksUri: `${process.env.KINDE_ISSUER_URL}/.well-known/jwks.json`,
});

export async function POST(req: Request) {
  try {
    // Get the token from the request
    const token = await req.text();

    // Decode the token
    // const { header } = jwt.decode(token, { complete: true });
    const jwtDecoded = jwt.decode(token, { complete: true });

    if (!jwtDecoded) {
      throw new Error("Invalid token");
    }
    const { header } = jwtDecoded;
    

    const { kid } = header;

    // Verify the token
    const key = await client.getSigningKey(kid);
    const signingKey = key.getPublicKey();
    const event =  jwt.verify(token, signingKey) as jwt.JwtPayload;

    
    switch (event?.type) {
     
        
      case "user.created":
        
         {
            try{ 

                const user= (event.data.user);
                console.log("user from kinde",user)
            
                const userId = `user:${user.id}`;
    
                const existingUser = await redis.hgetall(userId);

                console.log("existing user : ",existingUser);
    
                if (!existingUser || Object.keys(existingUser).length === 0) {
                
                await redis.hset(userId, {
                    id: user.id,
                    email: user.email,
                    name: user.first_name,
                    image: user.picture ?? `https://as2.ftcdn.net/v2/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.webp`  
                });
                
                
                
    
                
            
                }



            }catch(error){
             console.log(error) 
            

            }
  
          break;
         }
         case "user.updated":

         {
           const user= (event.data.user);
           const userId = `user:${user.id}`;

           const existingUser = await redis.hgetall(userId);

           if(!existingUser){
            throw new Error("Db not consist of already user")
           }
           if(existingUser){
            await redis.hset(userId, {
                id: user.id,
                email: user.email,
                name: user.first_name ,
                image: user.picture ?? `https://as2.ftcdn.net/v2/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.webp`  
            });
           }
       
             
           
           
   
           
       
           
   
         break;
        }  
        
        case 'user.deleted':
           
        {

            const user= (event.data.user);
           const userId = `user:${user.id}`;

           const existingUser = await redis.hgetall(userId);
           console.log("existing user : ",existingUser);

           if(!existingUser){
            throw new Error("Db not consist of already user")
           }
           if(existingUser){
            
            await redis.hdel(userId);
           }    

           
        }
   
       
          
      default:
       
        break;
    }

  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return NextResponse.json({ message: err.message }, { status: 400 });
    }
  }
  return NextResponse.json({ status: 200, statusText: "success" });
}