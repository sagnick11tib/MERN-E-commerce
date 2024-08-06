import { Router } from 'express';

const router = Router();

import{
    newUser,
    getAllUsers,
    getUser,
    deleteUser
} from "../controllers/user.controllers.js" ;

import { upload } from '../middlewares/multer.middleware.js';
import { adminOnly } from '../middlewares/auth.middleware.js';

//router.route("/new").post(newUser);
router.route("/new").post(upload.single('photo'),newUser);
router.route("/all").get(adminOnly,getAllUsers);
router.route("/:id").get(getUser).delete(deleteUser);

export default router;


