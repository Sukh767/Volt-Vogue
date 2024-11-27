import fs from "fs";
import cloudinary from "../lib/cloudinary.js"; // Adjust path as needed

export const uploadOnCloudinary = async (path) => {
  try {
    if (!path) throw new Error("File path is missing");

    const response = await cloudinary.uploader.upload(path, { resource_type: "auto" });

    // Remove the temporary file after upload
    fs.unlinkSync(path);
    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    // Ensure temporary files are cleaned up in case of an error
    if (fs.existsSync(path)) fs.unlinkSync(path);
    return null;
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`Deleted ${publicId} from Cloudinary`);
    return result;
  } catch (error) {
    console.error(`Failed to delete ${publicId} from Cloudinary`, error);
    throw error;
  }
};
