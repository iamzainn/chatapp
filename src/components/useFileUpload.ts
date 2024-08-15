import { useState } from 'react';
import { getSignedURL } from "@/action";

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    try {
      const checksum = await computeSHA256(file);
      const signedURLResult = await getSignedURL({
        checksum: checksum,
        fileSize: file.size,
        fileType: file.type
      });

      if (signedURLResult.failure !== undefined) {
        console.log("File failed");
        throw new Error(signedURLResult.failure);
      }

      const { url } = signedURLResult.success;

      console.log("Attempting to upload to URL:", url);

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      return response.url.split('?')[0]; // Return the URL without query parameters
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading };
};

const computeSHA256 = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
};