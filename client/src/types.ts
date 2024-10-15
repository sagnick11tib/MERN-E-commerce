// export type OrderItemType = {
//     name: string;
//     mainPhoto: string;
//     price: number;
//     quantity: number;
//     _id: string;
// }

// export type OrderType = {
//     name: string;
//     address: string;
//     city: string;
//     country: string;
//     state: string;
//     pinCode: number;
//     status: "Processing" | "Shipped" | "Delivered";
//     subtotal: number;
//     discount: number;
//     shippingcharges: number;
//     tax: number;
//     total: number;
//     orderItems: OrderItemType[];
//     _id: string;
// };

export type ShippingInfo = {
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: number;
    landmark?: string // optional
    addresstype: "Home" | "Work";
    phoneno: number;
  };

// export type Order = {
//     orderItems: OrderItemType[];
//     shippingInfo: ShippingInfo;
//     subtotal: number;
//     tax: number;
//     shippingcharges: number;
//     discount: number;
//     total: number;
//     status: string;
//     user: {
//       name: string;
//       _id: string;
//     };
//     _id: string;
//   };