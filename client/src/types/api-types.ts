
import { Bar, CartItem, Line, Order, Pie, Product, ShippingInfo, Stats, User } from "./types";

export type CustomError = {
    status: number;
    data: {
      message: string;
      success: boolean;
    };
  };

export type MessageResponse = {
    success: boolean;
    message: string;
}

export type DeleteUserRequest = {
    userId: string;
    adminUserId: string;
}

export type UserResponse = {
    success: boolean;
    data: User;
}

export type latestProducts = {
    latestProducts: Product[];
}

export type LatestProductsResponse = {
    success: boolean;
    data: latestProducts | undefined;
}

export type allProducts = {
    products: Product[];
}

export type AllProductsResponse = {
    success: boolean;
    data: {
        products: Product[];
        totalPage: number;
    }
}

export type ProductResponse = {
    product: Product;
}

export type ProductDetailsResponse = {
    success: boolean;
    data: ProductResponse | undefined;
}

export type UpdateProductRequest = {
    userId: string;
    productId: string;
    formData: FormData;//FormData is a built-in object in JavaScript that allows to send key-value pairs of data to the server
}

export type DeleteProductRequest = {
    userId: string;
    productId: string;
}

export type allCategories = {
    categories: string[];
}

export type CategoriesResponse ={
    success: boolean;
    data: allCategories | undefined;
}

export type SearchProductsResponse = AllProductsResponse & {
    totalPage: number;
}

export type SearchProductsRequest = {
    price: number;
    page: number;
    category: string;
    search: string;
    sort: string;
}

export type NewProductRequest = {
    formData: FormData;
    _id: string;
}

export type NewOrderRequest = {
    shippingInfo: ShippingInfo;
    orderItems: CartItem[];
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    user: string;
}

export type UpdateOrderRequest = {
    userId: string;
    orderId: string;
  };

  export type AllOrdersResponse = {
    success: boolean;
    data: {
        orders: Order[];
    }
  }

  export type  OrderDetailsResponse = {
    success: boolean;
    data: {
        order: Order;
    }
  }

  export type AllUsersResponse ={
    sucess: boolean;
    data: {
        users: User[];
    }
  }

  export type StatsResponse = {
    success: boolean;
    data: Stats;
  };

  export type PieResponse = {
    success: boolean;
    data: Pie;
  };
  
  export type BarResponse = {
    success: boolean;
    data: Bar;
  };
  
  export type LineResponse = {
    success: boolean;
    data: Line;
  };




