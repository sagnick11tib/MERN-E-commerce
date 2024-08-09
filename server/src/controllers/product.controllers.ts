import { Request, Response, NextFunction } from "express";
import { asyncHandlerPromise } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { BaseQuery, NewProductRequestBody, SearchRequestQuery } from "../types/types.js";
import { uploadOnCloudinary, uploadOnCloudinaryNotDelete, deleteOnCloudinary } from "../utils/cloudinary.js";
import { Product } from "../models/product.models.js";
import { rm } from "fs";
import { faker } from "@faker-js/faker";


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

const getAllProducts = asyncHandlerPromise(async (req:Request<{}, {}, SearchRequestQuery>, res:Response, next:NextFunction)=> {
         
    const {search, sort, category, price} = req.query;

    const page = Number(req.query.page) || 1;

    const limit = Number(process.env.PRODUCT_PER_PAGE) || 10; // 10 products per page

    const skip = (page - 1) * limit; // skip the products which are already shown on the previous page // 1st page skip 0 products, 2nd page skip 10 products, 3rd page skip 20 products and so on

    const baseQuery: BaseQuery = {};

    if ( search ) { 
        baseQuery.name = {
            $regex: search as string,
            $options: "i",
        };
    }

    if ( price ) {
        baseQuery.price = { 
            $lte: Number(price)
        }
    }

    if ( category ) {
        baseQuery.category = category as string;
    }


    const productsPromise = await Product.find(baseQuery)
                                         .sort(sort && { price: sort === "asc" ? 1 : -1 }) // && is used to check if sort is present or not if present then sort the products according to the price in ascending or descending order
                                         .limit(limit) // limit the products to 10 per page
                                         .skip(skip); // skip the products which are already shown on the previous page


    const [ products, filteredOnlyProduct  ] = await Promise.all([  // Promise.all is used to run multiple promises at the same time
        productsPromise, // find all the products which are filtered according to the search query and limit and skip so that we can get the products for the current page
        Product.find(baseQuery), // find all the products which are filtered according to the search query but without limit and skip so that we can get the total number of products
    ]);

    const totalPage = Math.ceil(filteredOnlyProduct.length / limit);

    if ( products.length < 1 ) throw new ApiError(404, "No products found");

    if ( !products || !filteredOnlyProduct ) throw new ApiError(404, "No products found");

    return res.status(200).json(new ApiResponse(200, { products, totalPage }, "Products fetched successfully"));

});

const generateRandomProducts = async (count: number = 10): Promise<void> => {
    const products = [];
  
    for (let i = 0; i < count; i++) {
      const product = {
        name: faker.commerce.productName(),
        photo: "uploads\\5ee9c9d2-851d-4371-8a0b-7317016206e6.jpg",
        price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
        stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
        category: faker.commerce.department(),
        description: faker.commerce.productDescription(), // Add description field
        createdAt: new Date(faker.date.past()),
        updatedAt: new Date(faker.date.recent()),
        __v: 0,
      };
  
      products.push(product);
    }
  
    await Product.create(products);
  
    console.log({ success: true });
  };

const deleteRandomsProducts = async (count: number = 10) => {
  const products = await Product.find({}).skip(2);

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    await product.deleteOne();
  }

  console.log({ succecss: true });
};

//generateRandomProducts(40);
//deleteRandomsProducts(38);



export { newProduct, getLatestProducts, getAllCategories, getAdminProducts, getSingleProduct, updateProduct, deleteProduct, getAllProducts };