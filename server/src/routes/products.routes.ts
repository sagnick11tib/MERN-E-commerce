import { Router } from 'express';


import { adminOnly } from '../middlewares/auth.middleware.js';
import { productUpload } from '../middlewares/multer.middleware.js';

const router = Router();

import { newProduct, getLatestProducts, getAllCategories, getAdminProducts, getSingleProduct, updateProduct, deleteProduct } from '../controllers/product.controllers.js';



router.route("/new").post( productUpload.array("photos", 5), newProduct);
router.route("/all").get()
router.route("/latest").get(getLatestProducts)
router.route("/categories").get(getAllCategories)
router.route("/admin-products").get(getAdminProducts)

router.route("/:id").get(getSingleProduct).put(productUpload.array("photos", 5),updateProduct).delete(deleteProduct)

router.route("/reviews/:id").get()
router.route("/review/new/:id").post()
router.route("/review/:id").delete()

export default router;

