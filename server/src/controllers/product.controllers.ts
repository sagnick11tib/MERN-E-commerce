import { Request, Response, NextFunction } from "express";
import { asyncHandlerPromise } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { BaseQuery, NewProductRequestBody, SearchRequestQuery } from "../types/types.js";
import { uploadOnCloudinary, uploadOnCloudinaryNotDelete, deleteOnCloudinary } from "../utils/cloudinary.js";
import { Product } from "../models/product.models.js";
import { rm } from "fs";
import { faker } from "@faker-js/faker";
import { nodeCache } from "../app.js";
import { invalidateCache } from "../utils/invalidCache.js";


const newProduct = asyncHandlerPromise(async (req: Request<{}, {}, NewProductRequestBody>, res: Response, next: NextFunction) => {

  // Explicitly type `req.files` to ensure TypeScript knows the expected structure
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const { name, price, description, category, stock } = req.body;

  // Validate form fields
  if (!name || !price || !description || !category || !stock) {
      // Delete uploaded files if fields are missing
      if (files?.['mainPhoto'] && files['mainPhoto'].length > 0) {
          await deleteOnCloudinary(files['mainPhoto'][0].path);
      }
      if (files?.['subPhotos'] && files['subPhotos'].length > 0) {
          for (const file of files['subPhotos']) {
              await deleteOnCloudinary(file.path);
          }
      }
      throw new ApiError(400, "Please fill all fields");
  }

  // Ensure mainPhoto is uploaded
  if (!files?.['mainPhoto'] || files['mainPhoto'].length < 1) {
      throw new ApiError(400, "Please upload a main photo");
  }

  // Ensure at least one sub-photo is uploaded
  if (!files?.['subPhotos'] || files['subPhotos'].length < 1) {
      throw new ApiError(400, "Please upload at least one sub-photo");
  }

  // Limit to max 5 sub-photos
  if (files['subPhotos'].length > 5) {
      throw new ApiError(400, "Please upload a maximum of 5 sub-photos");
  }

  // Upload photos to Cloudinary
  const mainPhotoUpload = await uploadOnCloudinaryNotDelete(files['mainPhoto'][0].path);
  if (!mainPhotoUpload) {
      throw new ApiError(500, "Error in uploading main photo");
  }

  const mainPhoto = {
      public_id: mainPhotoUpload.public_id,
      url: mainPhotoUpload.url,
  };

  const subPhotos = await Promise.all(
      files['subPhotos'].map(async (file) => {
          const uploadPhoto = await uploadOnCloudinaryNotDelete(file.path);
          if (!uploadPhoto) {
              throw new ApiError(500, "Error in uploading sub-photos");
          }
          return { public_id: uploadPhoto.public_id, url: uploadPhoto.url };
      })
  );

  // Create product in the database
  const product = await Product.create({
      name,
      price,
      description,
      category,
      stock,
      mainPhoto,
      subPhotos,
  });

  if (!product) {
      throw new ApiError(500, "Error in creating product");
  }

  // Invalidate cache if necessary
  invalidateCache({ product: true, admin: true });

  // Send response
  return res.status(201).json(new ApiResponse(201, { product }, "Product created successfully"));
});

const checkFileComeOrNot = asyncHandlerPromise(async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.files)
    return res.status(200).json(new ApiResponse(200, { message: "File received" }, "File received successfully"));
});



const getLatestProducts = asyncHandlerPromise(async (req: Request, res: Response, next: NextFunction) => {
    ///Revalidate on New , update or delete of product & on new Order

    let latestProducts;

    if( nodeCache.has( "latest-products" ) ) {

        latestProducts = JSON.parse(nodeCache.get("latest-products") as string);

    } else {
        // throw new Error("No products found");
        latestProducts = await Product.find().sort({ createdAt: -1 }).limit(5); //-1 for descending order and 1 for ascending order

        if ( !latestProducts ) throw new ApiError(404, "No products found");
        console.log(latestProducts)
        nodeCache.set( "latest-products", JSON.stringify(latestProducts) ); // cache the latest products for 1 hour
    }

    return res.status(200).json(new ApiResponse(200, { latestProducts }, "Latest products fetched successfully"));

});

const getAllCategories = asyncHandlerPromise(async (req:Request, res:Response, next:NextFunction)=> {

    let categories;

    if(nodeCache.has("categories")) categories = JSON.parse(nodeCache.get("categories") as string)
    else{
         categories = await Product.distinct("category") // it find all the distinct categories from the category field of the product model
        //distinct is a method of mongoose which is used to find all the distinct values of a field in a collection
    
        if (!categories) throw new ApiError(404, "No categories found");

        nodeCache.set("categories", JSON.stringify(categories));
    }
   

    return res.status(200).json(new ApiResponse(200, { categories }, "Categories fetched successfully"));

});

const getAdminProducts = asyncHandlerPromise(async (req:Request, res:Response, next:NextFunction)=> {

    let products;

    if(nodeCache.has("all-products")) products = JSON.parse(nodeCache.get("all-products") as string) 
    else {
         products = await Product.find();

        if (!products) throw new ApiError(404, "No products found");

        nodeCache.set("all-products", JSON.stringify(products))
    }

    return res.status(200).json(new ApiResponse(200, { products }, "Products fetched successfully"));
});

const getSingleProduct = asyncHandlerPromise(async (req:Request, res:Response)=> {

    const id = req.params.id;

     let product;

     const key = `product-${id}`;


     if(nodeCache.has(key)) product = JSON.parse(nodeCache.get(key) as string)
     else{

         product = await Product.findById(id);

         if (!product) throw new ApiError(404, "Product not found");

         nodeCache.set(key,JSON.stringify(product))
     }

    return res.status(200).json(new ApiResponse(200, { product }, "Product fetched successfully"));
});

const updateProduct = asyncHandlerPromise(async (req: Request, res: Response, next: NextFunction) => {

  const { id } = req.params;

  const { name, price, stock, category, description } = req.body;

  if (!name || !price || !description || !category || !stock)  throw new ApiError(400, "Please fill all fields");
  
  // Ensure `req.files` exists and contains the fields we need
  if (!req.files || !("mainPhoto" in req.files) || !("subPhotos" in req.files)) throw new ApiError(400, "Please upload photos correctly");
  
  // Get main photo and sub-photos from `req.files`
  const mainPhotoFile = (req.files as { [fieldname: string]: Express.Multer.File[] })["mainPhoto"]?.[0];

  const subPhotosFiles = (req.files as { [fieldname: string]: Express.Multer.File[] })["subPhotos"];

  if (!mainPhotoFile)  throw new ApiError(400, "Please upload a main photo");
  
  if (!subPhotosFiles || subPhotosFiles.length < 1)  throw new ApiError(400, "Please upload at least one sub-photo");
  
  if (subPhotosFiles.length > 5) throw new ApiError(400, "Please upload a maximum of 5 sub-photos");

  // Find product by ID
  const product = await Product.findById(id);

  if (!product) throw new ApiError(404, "Product not found");

  // Upload new photos to Cloudinary
  const mainPhotoUpload = await uploadOnCloudinaryNotDelete(mainPhotoFile.path);

  if (!mainPhotoUpload) throw new ApiError(500, "Error in uploading main photo");
  
  const mainPhoto = {
      public_id: mainPhotoUpload.public_id,
      url: mainPhotoUpload.url,
  };

  const subPhotos = await Promise.all(
      subPhotosFiles.map(async (file) => {
          const uploadPhoto = await uploadOnCloudinaryNotDelete(file.path);
          if (!uploadPhoto) {
              throw new ApiError(500, "Error in uploading sub-photos");
          }
          return { public_id: uploadPhoto.public_id, url: uploadPhoto.url };
      })
  );

  // Update the product in the database
  const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
          $set: {
              name,
              price,
              description,
              category,
              stock,
              mainPhoto,
              subPhotos,
          },
      },
      { new: true }
  );

  if (!updatedProduct) throw new ApiError(500, "Error in updating product");
  
  // Delete old photos from Cloudinary
  const oldPhotoIds = [];

  if (product.mainPhoto?.public_id) oldPhotoIds.push(product.mainPhoto.public_id);
  
  if (product.subPhotos && Array.isArray(product.subPhotos)) {
      product.subPhotos.forEach((photo) => {
          if (photo.public_id) {
              oldPhotoIds.push(photo.public_id);
          }
      });
  }

  await Promise.all(
      oldPhotoIds.map(async (public_id) => {
          await deleteOnCloudinary(public_id);
      })
  );

  // Invalidate cache if necessary
  invalidateCache({ product: true, productId: String(product._id), admin: true });

  // Send response
  return res.status(200).json(new ApiResponse(200, { updatedProduct }, "Product updated successfully"));
});


const deleteProduct = asyncHandlerPromise(async (req: Request, res: Response, next: NextFunction) => {

  const product = await Product.findById(req.params.id);

  if (!product) {
      throw new ApiError(404, "Product not found");
  }

  // Collect all photo public IDs from mainPhoto and subPhotos
  const photoIds = [];

  if (product.mainPhoto?.public_id) {
      photoIds.push(product.mainPhoto.public_id);
  }

  if (product.subPhotos && Array.isArray(product.subPhotos)) {
      product.subPhotos.forEach((photo) => {
          if (photo.public_id) {
              photoIds.push(photo.public_id);
          }
      });
  }

  // Delete photos from Cloudinary
  await Promise.all(photoIds.map(async (public_id) => {
      await deleteOnCloudinary(public_id);
  }));

  // Delete product from the database
  await product.deleteOne();

  // Invalidate cache if necessary
  invalidateCache({ product: true, productId: String(product._id), admin: true });

  // Send response
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

// const generateRandomProducts = async (count: number = 10): Promise<void> => {
//     const products = [];
  
//     for (let i = 0; i < count; i++) {
//       const product = {
//         name: faker.commerce.productName(),
//         photo: "uploads\\5ee9c9d2-851d-4371-8a0b-7317016206e6.jpg",
//         price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//         stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//         category: faker.commerce.department(),
//         description: faker.commerce.productDescription(), // Add description field
//         createdAt: new Date(faker.date.past()),
//         updatedAt: new Date(faker.date.recent()),
//         __v: 0,
//       };
  
//       products.push(product);
//     }
  
//     await Product.create(products);
  
//     console.log({ success: true });
//   };

// const deleteRandomsProducts = async (count: number = 10) => {
//   const products = await Product.find({}).skip(2);

//   for (let i = 0; i < products.length; i++) {
//     const product = products[i];
//     await product.deleteOne();
//   }

//   console.log({ succecss: true });
// };

// //generateRandomProducts(40);
// //deleteRandomsProducts(38);

export { newProduct, checkFileComeOrNot, getLatestProducts, deleteProduct, getAllCategories, getAdminProducts, getAllProducts, getSingleProduct, updateProduct };