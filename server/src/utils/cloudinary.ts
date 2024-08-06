import { strictEqual } from "assert";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fs from "fs";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string, 
  api_key: process.env.CLOUDINARY_API_KEY as string, 
  api_secret: process.env.CLOUDINARY_API_SECRET as string
});

// Define the type for the upload function's response
interface CloudinaryUploadResponse extends UploadApiResponse {

}

// Function to upload a file to Cloudinary
const uploadOnCloudinary = async (localFilePath: string | undefined): Promise<CloudinaryUploadResponse | null> => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    if (localFilePath) fs.unlinkSync(localFilePath);
    return null;
  }
};

const uploadOnCloudinaryNotDelete = async (localFilePath: string | undefined): Promise<CloudinaryUploadResponse | null> => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });
    return response;
  } catch (error) {
    return null;
  }
};


export { uploadOnCloudinary, uploadOnCloudinaryNotDelete };
