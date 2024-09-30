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

const singleStorage = multer.diskStorage({
    destination: function (req, file, callback){
        callback(null, "./uploads")
       // console.log("singleStorage", file)
    },
    filename: function (req, file, callback){
        const id = uuid();
        const extName = file.originalname.split(".").pop();
        callback(null, `${id}.${extName}`)
       //callback(null, "helllllo.jpg")
    },
});

const productStorage = multer.diskStorage({
    destination: function (req, file, callback){
        callback(null, "./uploads")
        console.log("productStorage", file)
    },
    filename: function (req, file, callback){
        const id = uuid();
        const extName = file.originalname.split(".").pop();
        callback(null, `${id}.${extName}`)
    }
})

const fieldStorage = multer.diskStorage({
    destination: function (req, file, callback){
        callback(null, "./uploads")
        //console.log("fieldStorage", file)
    },
    filename: function (req, file, callback){
        const id = uuid();
        const extName = file.originalname.split(".").pop();
        callback(null, `${id}.${extName}`)
    }
})


export const upload = multer({storage: storage,limits:{ fileSize: 1024 * 1024 * 5 }}) // 5mb
export const singleUpload = multer({storage: singleStorage,limits:{ fileSize: 1024 * 1024 * 5 }}) // 5mb
export const productUpload = multer({storage: productStorage,limits:{ fileSize: 1024 * 1024 * 5 }}) // 5mb

export const fieldUpload = multer({storage: fieldStorage,limits:{ fileSize: 1024 * 1024 * 5 }}) // 5mb