import { Request, Response, NextFunction } from 'express';

export interface NewUserRequestBody {
    name: string;
    email: string;
    photo: string;
    gender: string;
    role: string;
    _id: string;
    dob: Date;
}

export interface NewProductRequestBody {
    name: string;
    category: string;
    price: number;
    stock: number;
    description: string;
  }

  export type SearchRequestQuery = {
    search?: string;
    price?: string;
    category?: string;
    sort?: string;
    page?: string;
  }

  export interface BaseQuery {
    name?: { $regex: string;
             $options: string;
           };
    price?: { $lte: number};
    category?: string;
  }

  export type InvalidateCacheProps = {
    product?: boolean;
    order?: boolean;
    admin?: boolean;
    review?: boolean;
    userId?: string;
    orderId?: string;
    productId?: string | string[];
  };

  export type ShippingInfoType = {
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: number;
  };

  export type OrderItemType = {
    name: string;
    photo: string;
    price: number;
    quantity: number;
    productId: string;
  };

  export interface NewOrderRequestBody{
    shippingInfo: ShippingInfoType;
    user: string;
    subTotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    status: string;
    orderItems: OrderItemType[];
  }

export type ControllerType = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void | Response<any, Record<string, any>>>;