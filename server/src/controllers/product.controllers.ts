import { Request, Response, NextFunction } from "express";
import { asyncHandlerPromise } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { NewProductRequestBody } from "../types/types.js";
import { uploadOnCloudinary, uploadOnCloudinaryNotDelete, deleteOnCloudinary } from "../utils/cloudinary.js";
import { Product } from "../models/product.models.js";
import { rm } from "fs";


const newProduct = asyncHandlerPromise(async (req: Request< {}, {}, NewProductRequestBody >, res: Response, next: NextFunction) => {

    const { name, price, description, category, stock } = req.body;

    if (!name || !price || !description || !category || !stock) {
                                                                
                                                                // if photos are uploaded but fields are empty then delete the photos
                                                                
                                                                if (req.files) {
                                                                    const photosLocalPath: string[] = (req.files as Express.Multer.File[]).map((file: Express.Multer.File) => file.path);
                                                                    
                                                                    photosLocalPath.forEach( async ( path )=> {
                                                                        await deleteOnCloudinary(path);
                                                                        rm(path, (err) => {
                                                                            if (err) throw new ApiError(500, "Error in deleting photos");
                                                                        });
                                                                    });
                                                                }

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

const getLatestProducts = asyncHandlerPromise(async (req: Request, res: Response, next: NextFunction) => {

    const latestProducts = await Product.find().sort({ createdAt: -1 }).limit(5); //-1 for descending order and 1 for ascending order

    if ( !latestProducts ) throw new ApiError(404, "No products found");

    return res.status(200).json(new ApiResponse(200, { latestProducts }, "Latest products fetched successfully"));

});

const getAllCategories = asyncHandlerPromise(async (req:Request, res:Response, next:NextFunction)=> {
    const categories = await Product.distinct("category") // it find all the distinct categories from the category field of the product model
    //distinct is a method of mongoose which is used to find all the distinct values of a field in a collection

    if (!categories) throw new ApiError(404, "No categories found");

    return res.status(200).json(new ApiResponse(200, { categories }, "Categories fetched successfully"));

});

const getAdminProducts = asyncHandlerPromise(async (req:Request, res:Response, next:NextFunction)=> {
    const products = await Product.find();

    if (!products) throw new ApiError(404, "No products found");

    return res.status(200).json(new ApiResponse(200, { products }, "Products fetched successfully"));
});

const getSingleProduct = asyncHandlerPromise(async (req:Request, res:Response, next:NextFunction)=> {

    const product = await Product.findById(req.params.id);

    if (!product) throw new ApiError(404, "Product not found");

    return res.status(200).json(new ApiResponse(200, { product }, "Product fetched successfully"));
});

const updateProduct = asyncHandlerPromise(async (req:Request, res:Response, next:NextFunction)=> {

    const { id } = req.params;
    
    const { name, price, stock, category, description} = req.body;

    if ( !name || !price || !description || !category || !stock ) throw new ApiError(400, "Please fill all fields");

    const photosLocalPath = (req.files as Express.Multer.File[]).map((file: Express.Multer.File) => file.path);

    if ( !photosLocalPath ) throw new ApiError(400, "Please upload photos");

    if ( photosLocalPath.length < 1 ) throw new ApiError(400, "Please upload atleast one photo");

    if ( photosLocalPath.length > 5 ) throw new ApiError(400, "Please upload maximum 5 photos");

    const product = await Product.findById(id);

    if ( !product ) throw new ApiError(404, "Product not found");

    let newPhotos = [];

    if ( photosLocalPath.length > 0 ) {

        newPhotos = await Promise.all(

                photosLocalPath.map(async (path)=> {
                    
                    const uploadPhoto = await uploadOnCloudinaryNotDelete(path);

                    if ( !uploadPhoto ) throw new ApiError(500, "Error in uploading photos");

                    return { public_id: uploadPhoto.public_id, url: uploadPhoto.url };
                })
        );

        const oldPhotos = product.photos.map( photo => photo.public_id );

        const updatedProduct = await Product.findByIdAndUpdate( id, {
            $set: {
                name,
                price,
                description,
                category,
                stock,
                photos: newPhotos
            }
        }, { new: true });

        if ( !updatedProduct ) throw new ApiError(500, "Error in updating product");

        await Promise.all(oldPhotos.map( async ( public_id )=> {

            await deleteOnCloudinary(public_id);

        }));
        
        return res.status(200).json(new ApiResponse(200, { updatedProduct }, "Product updated successfully"));

    } else {
            
        throw new ApiError(400, " Error can't update product without photos");
    }
    
});

const deleteProduct = asyncHandlerPromise(async (req:Request, res:Response, next:NextFunction)=> {

        const product = await Product.findById(req.params.id);

        if (!product) throw new ApiError(404, "Product not found");

        const photoIds = product.photos.map( photo => photo.public_id );

        await Promise.all(photoIds.map( async ( public_id )=>{

            await deleteOnCloudinary(public_id);

        }));

        await product.deleteOne();

        return res.status(200).json(new ApiResponse(200, {}, "Product deleted successfully"));

});


export { newProduct, getLatestProducts, getAllCategories, getAdminProducts, getSingleProduct, updateProduct, deleteProduct };