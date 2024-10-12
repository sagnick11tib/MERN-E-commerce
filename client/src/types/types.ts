export type User = {
    name: string;
    email: string;
    photo: string;
    gender: string;
    role: string;
    dob: string;
    _id: string;
}

export interface Product {
    name: string;
    price: number;
    stock: number;
    description: string;
    category: string;
    mainPhoto: string;
    subPhotos?: string;
    _id: string;
}

export type CartItem = {
    productId: string;
    mainPhoto: string;
    subPhotos?: string;
    name: string;
    price: number;
    quantity: number;
    stock: number;
}

export type ShippingInfo = {
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
  };

export type OrderItem = Omit<CartItem, "stock"> & { _id: string };  //Omit is a utility type that creates a new type by picking all properties from the original type except the ones we specify

export type Order = {
    orderItems: OrderItem[];
    shippingInfo: ShippingInfo;
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    status: string;
    user: {
        name: string;
        _id: string;
    };
    _id: string;
};
  