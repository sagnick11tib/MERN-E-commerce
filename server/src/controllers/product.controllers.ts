import { Request, Response, NextFunction } from "express";
import { asyncHandlerPromise } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { NewProductRequestBody } from "../types/types.js";
import { uploadOnCloudinary, uploadOnCloudinaryNotDelete } from "../utils/cloudinary.js";
import { Product } from "../models/product.models.js";
import { rm } from "fs";


const newProduct = asyncHandlerPromise(async (req: Request< {}, {}, NewProductRequestBody >, res: Response, next: NextFunction) => {

    const { name, price, description, category, stock } = req.body;

    if (!name || !price || !description || !category || !stock) {
                                                                
                                                                // if photos are uploaded but fields are empty then delete the photos
                                                                
                                                                
                                                                throw new ApiError(400, "Please fill all fields")
                                                            
                                                            };

    const  photosLocalPath: string[] = (req.files as Express.Multer.File[]).map((file: Express.Multer.File) => file.path);

    if ( !photosLocalPath ) throw new ApiError(400, "Please upload photos");

    if ( photosLocalPath.length < 1 ) throw new ApiError(400, "Please upload atleast one photo");

    if ( photosLocalPath.length > 5 ) throw new ApiError(400, "Please upload maximum 5 photos");

    const photos = await Promise.all(
                                      photosLocalPath.map( async ( path )=> {
                                            const uploadPhoto = await uploadOnCloudinaryNotDelete(path);

                                            if ( !uploadPhoto ) throw new ApiError(500, "Error in uploading photos");

                                            return { public_id: uploadPhoto.public_id, url: uploadPhoto.url }; 
                                      })
    );

    const product = await Product.create({
        name,
        price,
        description,
        category,
        stock,
        photos
    });

    if ( !product ) throw new ApiError(500, "Error in creating product");

    return res.status(201).json(new ApiResponse(201, { product }, "Product created successfully"));

});

export { newProduct };