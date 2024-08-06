import multer from "multer";
import { v4 as uuid } from "uuid";


const storage = multer.diskStorage({
    destination: function (req, file, callback){
        callback(null, "./public/temp")
        
    },
    filename: function (req, file, callback){
        const id = uuid();
        const extName = file.originalname.split(".").pop();
        callback(null, `${id}.${extName}`) // callback(1st argument, 2nd argument) 
    }
});

const productStorage = multer.diskStorage({
    destination: function (req, file, callback){
        callback(null, "./uploads")
    },
    filename: function (req, file, callback){
        const id = uuid();
        const extName = file.originalname.split(".").pop();
        callback(null, `${id}.${extName}`)
    }
})


export const upload = multer({storage: storage}) 
export const productUpload = multer({storage: productStorage})