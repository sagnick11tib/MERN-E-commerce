import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';

const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const errors = err.errors || [];

    res.status(statusCode)
       .json({
                status: 'error',
                statusCode,
                message,
                errors
       });
};

export default errorHandler;