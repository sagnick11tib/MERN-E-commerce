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

const deleteOnCloudinary = async (url: string): Promise<void> => {
  try {
    // Getting public Id
    const publicId: string = String(url.split("/").pop()?.split(".")[0]);
    console.log("This is public Id of thumbnail", publicId);

    // Validating Public ID
    if (!publicId) {
      return console.log("No public Id present");
    }

    // Delete the file using the public ID
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(result);
  } catch (error) {
    console.log((error as Error).message);
  }
};

//upload image url to cloudinary
const uploadImageUrlOnCloudinary = async (imageUrl: string): Promise<CloudinaryUploadResponse | null> => {
  try {
    const response = await cloudinary.uploader.upload(imageUrl, {
      resource_type: "auto"
    });
    return response;
  } catch (error) {
    return null;
  }
};


export { uploadOnCloudinary, uploadOnCloudinaryNotDelete, deleteOnCloudinary, uploadImageUrlOnCloudinary };
