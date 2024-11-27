import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadOnCloudinary = async (path) => {
    try {
      if (!path) throw new Error('File path is missing');
  
      const response = await cloudinary.uploader.upload(path, { resource_type: 'auto' });  
      // Remove the temporary file after upload
      fs.unlinkSync(path);
      return response;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      fs.unlinkSync(path); // Clean up the file in case of an error
      return null;
    }
}; 

