import { User } from '../models/user.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { NextFunction, Request, Response } from 'express';

const adminOnly = asyncHandler(async (req:Request,
                                      res:Response,
                                      next:NextFunction
                                     )=>{
                                        const { _id } = req.query;
                                        
                                        if(!_id) throw new ApiError(400, "User id is required");

                                        const user = await User.findById(_id);

                                        if(!user) throw new ApiError(404, "User not found");

                                        if(user.role !== "admin") throw new ApiError(403, "Unauthorized");

                                        //return res.status(200).json(new ApiResponse(200, {user}, "Admin verified"));
                                        next();
                                        });
            
                                       
                                        
 export { adminOnly };                                       