
export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  role: 'customer' | 'seller' | 'admin';
  status: 'active' | 'inactive';
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number | { $numberDecimal: string } | any;
  stock: number;
  seller_id: string | { email: string; [key: string]: any } | null;
  category_id: string;
  images: string[];
  rating_avg: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  _id: string;
  customer_id: string;
  items: CartItem[];
  total_price: number | { $numberDecimal: string } | any;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed';
  created_at: string;
}

export interface Review {
  _id: string;
  product_id: string;
  customer_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Category {
  _id: string;
  name: string;
  parent?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
