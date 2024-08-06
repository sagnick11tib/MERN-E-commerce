import { asyncHandler, asyncHandlerPromise } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { NewUserRequestBody } from "../types/types.js";
import { Request, Response, NextFunction } from 'express';
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const newUser = asyncHandler(async ( 
                    req: Request<{},{},NewUserRequestBody>,
                    res: Response,
                    )=>{

                        const {  name, email, _id, gender, dob  } = req.body
                     
                        if( !_id || !name || !email || !gender || !dob) throw new ApiError(400, "All fields are required ")
                        
                        let user = await User.findById(_id)

                        if(user) return res.status(201).json( new ApiResponse(201, {user}, `Welcome back ${user.name}`));

                        const photoLocalPath: any = req.file?.path; // path of the uploaded photo
                       
                        if(!photoLocalPath) throw new ApiError(400, "Photo is required")

                        const photo = await uploadOnCloudinary(photoLocalPath);

                        if(!photo) throw new ApiError(500, "Photo upload failed");

                        user = await User.create({
                            name,
                            email,
                            gender,
                            dob: new Date(dob),
                            _id,
                            photo: photo.url
                        });

                        return res.status(201)
                                  .json(new ApiResponse(201, {user}, "User created successfully"));
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

                                        return res.status(200).json(new ApiResponse(200, {user}, "User fetched successfully"))
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