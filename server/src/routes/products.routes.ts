import { Router } from 'express';


import { adminOnly } from '../middlewares/auth.middleware.js';
import { upload, productUpload } from '../middlewares/multer.middleware.js';

const router = Router();

import { newProduct } from '../controllers/product.controllers.js';



router.route("/new").post(adminOnly, productUpload.array("photos", 5), newProduct);
router.route("/all").get()
router.route("/latest").get()
router.route("/categories").get()
router.route("/admin-products").get()

router.route("/:id").get().put().delete()

router.route("/reviews/:id").get()
router.route("/review/new/:id").post()
router.route("/review/:id").delete()

export default router;

//Router.route("/").post()