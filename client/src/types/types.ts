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
    mainPhoto: {url: string}
    subPhotos?: string;
    _id: string;
    ratings: number;
    numOfReviews: number;
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
    phoneno: number;
  };

export type OrderItem = Omit<CartItem, "stock"> & { _id: string };  //Omit is a utility type that creates a new type by picking all properties from the original type except the ones we specify

export type Order = {
    orderItems: OrderItem[];
    shippingInfo: ShippingInfo;
    subtotal: number;
    tax: number;
    shippingcharges: number;
    discount: number;
    total: number;
    status: string;
    user: {
        name: string;
        _id: string;
    };
    _id: string;
};

 type CountAndChange = {
    revenue: number;
    product: number;
    user: number;
    order: number;
  };

 type LatestTransaction = {
    _id: string;
    amount: number;
    discount: number;
    quantity: number;
    status: string;
  };

  export type Stats = {
    categoryCount: Record<string, number>[];
    changePercent: CountAndChange;
    count: CountAndChange;
    chart: {
      order: number[];
      revenue: number[];
    };
    userRatio: {
      male: number;
      female: number;
    };
    latestTransaction: LatestTransaction[];
  };

  type OrderFullfillment = {
    processing: number;
    shipped: number;
    delivered: number;
  };
  
  type RevenueDistribution = {
    netMargin: number;
    discount: number;
    productionCost: number;
    burnt: number;
    marketingCost: number;
  };
  
  type UsersAgeGroup = {
    teen: number;
    adult: number;
    old: number;
  };

  export type Pie = {
    orderFullfillment: OrderFullfillment;
    productCategories: Record<string, number>[];
    stockAvailability: {
      inStock: number;
      outOfStock: number;
    };
    revenueDistribution: RevenueDistribution;
    usersAgeGroup: UsersAgeGroup;
    adminCustomer: {
      admin: number;
      customer: number;
    };
  }

  export type Bar = {
    users: number[];
    products: number[];
    orders: number[];
  };
  export type Line = {
    users: number[];
    products: number[];
    discount: number[];
    revenue: number[];
  };

  export type Review = {
    _id: string;
    rating: number;
    comment: string;
    product: string;
    user: {
      name: string;
      photo: string;
      _id: string;
    };
    likedBy?: string[];
    reviewPhotos?: {
      public_id: string;
      url: string;
    }[];
  };

    


