import { Router } from 'express';


import { adminOnly } from '../middlewares/auth.middleware.js';
import { fieldUpload } from '../middlewares/multer.middleware.js';

const router = Router();

import { newProduct, checkFileComeOrNot, deleteProduct, getLatestProducts, getAllCategories, getAdminProducts, getAllProducts, getSingleProduct, updateProduct, newReview, deleteReview, allReviewsOfProduct } from '../controllers/product.controllers.js';
import { de } from '@faker-js/faker';


router.route("/new").post( adminOnly,fieldUpload.fields([{name: "mainPhoto",maxCount:1},{name:"subPhotos",maxCount:5}]), newProduct);
router.route("/check").post(fieldUpload.fields([{name: "mainPhoto",maxCount:1},{name:"subPhotos",maxCount:5}]),checkFileComeOrNot);
 router.route("/all").get(getAllProducts)
 router.route("/latest").get(getLatestProducts)
 router.route("/categories").get(getAllCategories)
 router.route("/admin-products").get(adminOnly,getAdminProducts)
 router.route("/:id").get(getSingleProduct).put(adminOnly,fieldUpload.fields([{name: "mainPhoto",maxCount:1},{name:"subPhotos",maxCount:5}]),updateProduct).delete(adminOnly,deleteProduct)


router.route("/reviews/:id").get(allReviewsOfProduct)
router.route("/review/new/:productId").post(newReview)
router.route("/review/:reviewId").delete(deleteReview)


// router.route("/random").get(generateRandomProducts)
// router.route("/random").delete(deleteRandomsProducts)

export default router;

