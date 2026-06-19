/**
 * Core Type Definitions for Sweet Delights Luxury Bakery
 */

export interface Product {
  id: string;
  name: string;
  category: 'Cakes' | 'Sweets' | 'Savouries';
  description: string;
  price: number; // Base price for smallest weight/option
  rating: number;
  image: string;
  gallery: string[];
  ingredients: string[];
  shelfLife: string;
  weightOptions: string[]; // e.g. ['500g', '1Kg', '2Kg'] or ['Pack of 6', 'Pack of 12']
  priceMultipliers: Record<string, number>; // weightOption -> multiplier (e.g. { '500g': 1, '1Kg': 1.8, '2Kg': 3.5 })
  reviews: Review[];
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  weight: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'flat';
  value: number;
  minOrderValue: number;
}

export interface PlannerRequest {
  id: string;
  userId?: string;
  eventType: string;
  eventDate: string;
  guests: number;
  cakeRequirement: string;
  sweetRequirement: string;
  savouriesRequirement: string;
  themeSelection: string;
  customNotes: string;
  budgetRange: string;
  deliveryAddress: string;
  createdAt: string;
  status: 'Pending' | 'Approved' | 'Declined' | 'Completed';
  aiSuggestions: {
    recommendedCake: string;
    recommendedSweets: string;
    recommendedSavouries: string;
    estimatedPrice: number;
  };
}

export interface Order {
  id: string;
  userId?: string;
  userName: string;
  email: string;
  items: {
    productId: string;
    productName: string;
    image: string;
    price: number;
    quantity: number;
    weight: string;
  }[];
  couponApplied?: string;
  discountAmount: number;
  taxAmount: number;
  deliveryFee: number;
  subtotal: number;
  total: number;
  paymentMethod: 'COD' | 'UPI' | 'Card';
  paymentStatus: 'Pending' | 'Paid';
  deliveryAddress: {
    street: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  orderStatus: 'Placed' | 'Processing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  isAdmin: boolean;
  addresses: {
    id: string;
    street: string;
    city: string;
    postalCode: string;
    phone: string;
    isDefault?: boolean;
  }[];
}
