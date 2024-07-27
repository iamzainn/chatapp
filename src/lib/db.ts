
import { PrismaClient } from '@prisma/client'



import { createClient } from '@supabase/supabase-js'


// Create a single supabase client for interacting with your database
export const supabase = createClient("https://socjukiensqxpqzbcjln.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvY2p1a2llbnNxeHBxemJjamxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE3NjM3NTQsImV4cCI6MjAzNzMzOTc1NH0.QA-yzJYNqSNVsUss89nN7egJDNHbc2S9o0nm3pL9DvE" );






const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma


