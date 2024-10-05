import { Request, Response, NextFunction } from "express"
import { ControllerType } from "../types/types.js" 
// Higher-order function that takes an async funcction (fn) as a parameter
const asyncHandler = (fn: (req:Request, res:Response, next:NextFunction)=> Promise<any>) =>{
    // Returns a new async function
    return async (req: Request, res: Response, next: NextFunction)=>{
        try {
            // await the async function and pass the upper function's parameters means return the result of the async function
            await fn(req, res, next)
        } catch (error: any) {
            // If an error occurs, catch it and send a response with the error message
            res.status(error.statusCode  || 500)
               .json({ success: false, message: error.message})
        }
    }
}

// const asyncHandler = (fn: ControllerType)=> (req: Request, res: Response, next: NextFunction)=> {
//         return Promise.resolve(fn(req, res, next)).catch((error)=> next(error))
//     }


export { asyncHandler }