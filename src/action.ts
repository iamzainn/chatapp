"use server";



import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import crypto from "crypto"

import {  currentUser } from "@clerk/nextjs/server";

function cleanS3Url(url:string) {
	try {
	  const urlObject = new URL(url);
	  const pathParts = urlObject.pathname.split('/');
	  const filename = pathParts[pathParts.length - 1];
	  return `${urlObject.origin}/${filename}`;
	} catch (error) {
	  console.error('Invalid URL:', error);
	  return null;
	}
  }


const s3Client = new S3Client({
	region: process.env.BUCKET_REGION!,
	credentials: {
	  accessKeyId: process.env.ACCESS_KEY!,
	  secretAccessKey: process.env.SECRET_ACCESS_KEY!,
	},
  })
  const maxFileSize = 1048576 * 10 // 1 MB

  const allowedFileTypes = [
	"image/jpeg",
	"image/png",
	"video/mp4",
	"video/quicktime",
	"image/webp"
  ]

  type GetSignedURLParams = {
	fileType: string
	fileSize: number
	checksum: string
  }


  export async function getSignedURL({
	fileType,
	fileSize,
	checksum,
  }: GetSignedURLParams) {

	const user = await currentUser();

	if (!user) {
	  return { failure: "User not found" }
	}

       
	// first just make sure in our code that we're only allowing the file types we want
	if (!allowedFileTypes.includes(fileType)) {
	  return { failure: "File type not allowed" }
	}
  
	if (fileSize > maxFileSize) {
	  return { failure: "File size too large" }
	}
	
const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex")

  
	const putObjectCommand = new PutObjectCommand({
	  Bucket: process.env.BUCKET_NAME!,
	  Key: generateFileName(),
	  ContentType: fileType,
	  ContentLength: fileSize,
	  ChecksumSHA256: checksum,
	  // Let's also add some metadata which is stored in s3.
	  Metadata: {
		userId: user?.id
	  },


	  


	}


  )

  const url = await getSignedUrl(
	s3Client,
	putObjectCommand,
	{ expiresIn: 60 } 
  )

  return {success: {url}}
}

