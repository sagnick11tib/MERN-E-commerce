import { config } from "dotenv";
config()
import connectDB from "./db/index.js";
import { app } from "./app.js" 
import Razorpay from "razorpay";


export const razorInstance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY || "",
    key_secret: process.env.RAZORPAY_API_SECRET || "",  
});

const PORT = process.env.PORT || 8000;

const startServer = async () => {
    try {
        await connectDB()
        .then(()=> {
            app.listen(process.env.PORT || 8000, ()=> {
                console.log(`⚙️ Server is running at port : ${PORT}`)
            })
        })
    } catch (error) {
        console.log(`MONGO db connection failed !!! `, error);
        process.exit(1);
    }
};




// connectDB()
// .then(()=> {
//     app.listen(process.env.PORT || 8000, ()=> {
//         console.log(`⚙️ Server is running at port : ${PORT}`)
//     })
// })
// .catch((error)=> {
//     console.log(`MONGO db connection failed !!! `, error);
// })

export default startServer;