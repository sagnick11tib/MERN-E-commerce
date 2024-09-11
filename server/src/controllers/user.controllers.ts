import { asyncHandler, asyncHandlerPromise } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { NewUserRequestBody } from "../types/types.js";
import { Request, Response, NextFunction } from 'express';
import { uploadOnCloudinary, uploadImageUrlOnCloudinary } from "../utils/cloudinary.js";

const newUser = asyncHandler(async (
  req: Request<{}, {}, NewUserRequestBody>,
  res: Response,
) => {
  const { name, email, _id, gender, dob, photo } = req.body;

  // Check if user already exists
  let user = await User.findById(_id);
  if (user) {
    return res.status(201).json(new ApiResponse(201, { user }, `Welcome back ${user.name}`));
  }

  if (!_id || !name || !email || !gender || !dob) {
    throw new ApiError(400, "All fields are required");
  }

  // Determine whether to use photo from URL or file upload
  let photoUrl;

  if (photo && typeof photo === 'string' && photo.startsWith("http")) {
    // If photo is a URL, upload it directly to Cloudinary
    const uploadedPhoto = await uploadImageUrlOnCloudinary(photo);

    if (!uploadedPhoto) throw new ApiError(500, "Photo upload failed");

    photoUrl = uploadedPhoto.url;
  } else {
    // Otherwise, expect a file upload
    const photoLocalPath: any = req.file?.path; // Path of the uploaded photo
    
    if (!photoLocalPath) throw new ApiError(400, "Photo is required");

    // Upload the file to Cloudinary
    const uploadedPhoto = await uploadOnCloudinary(photoLocalPath);
    
    if (!uploadedPhoto) throw new ApiError(500, "Photo upload failed");

    photoUrl = uploadedPhoto.url;
  }

  // Create a new user in the database
  user = await User.create({
    name,
    email,
    gender,
    dob: new Date(dob),
    _id,
    photo: photoUrl, // Store the photo URL in the database
  });

  return res.status(201).json(new ApiResponse(201, { user }, "User created successfully"));
});

const getAllUsers = asyncHandler(async (
                                        req: Request,
                                        res: Response
                                       )=> {
                                            const users = await User.find();

                                            return res.status(200).json(new ApiResponse(200, {users}, "All users fetched successfully"))
                                       }
);

const getUser = asyncHandlerPromise(async (
                                     req: Request,
                                     res: Response
                                   )=>{ 
                                        const { id } = req.params;

                                        if(!id) throw new ApiError(400, "User id is required");

                                        const user = await User.findById(id);

                                        if(!user) throw new ApiError(404, "User not found");

                                        return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"))
});

const deleteUser = asyncHandlerPromise(async (
                                        req: Request,
                                        res: Response
                                      )=>{
                                        const id = req.params.id;

                                        if(!id) throw new ApiError(400, "User id is required")

                                        const user = await User.findById(id);

                                        await user?.deleteOne();

                                        return res.status(200).json(new ApiResponse(200,{},"User Deleted Successfully"));
                                      })

export { newUser, getAllUsers, getUser, deleteUser }