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