
import { toast } from "sonner";
import { 
  User, 
  Product, 
  Order, 
  Review, 
  Category,
  AuthResponse,
  CartItem
} from "../types";

const API_URL = "http://localhost:8085";

// Helper to get the auth token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// Helper for headers including auth token if available
const getHeaders = (includeToken: boolean = true): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (includeToken) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Handle API responses consistently
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json();
    const errorMessage = error.message || "An error occurred";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
  return await response.json() as T;
};

// Auth APIs
export const authAPI = {
  signup: async (userData: Omit<User, "_id" | "status">): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: getHeaders(false),
      body: JSON.stringify(userData),
    });
    return handleResponse<AuthResponse>(response);
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: getHeaders(false),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<AuthResponse>(response);
  },

  getProfile: async (): Promise<User> => {
    const response = await fetch(`${API_URL}/customer/profile`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<User>(response);
  },
};

// Product APIs
export const productAPI = {
  getProducts: async (): Promise<Product[]> => {
    const response = await fetch(`${API_URL}/products`, {
      method: "GET",
      headers: getHeaders(false),
    });
    return handleResponse<Product[]>(response);
  },

  getProductById: async (productId: string): Promise<Product> => {
    const response = await fetch(`${API_URL}/products/${productId}`, {
      method: "GET",
      headers: getHeaders(false),
    });
    return handleResponse<Product>(response);
  },

  // Seller product APIs
  addProduct: async (product: Omit<Product, "_id" | "rating_avg" | "status">): Promise<Product> => {
    const response = await fetch(`${API_URL}/seller/products`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(product),
    });
    return handleResponse<Product>(response);
  },

  updateProduct: async (productId: string, product: Partial<Product>): Promise<Product> => {
    const response = await fetch(`${API_URL}/seller/products/${productId}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(product),
    });
    return handleResponse<Product>(response);
  },

  deleteProduct: async (productId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/seller/products/${productId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse<void>(response);
  },

  getSellerProducts: async (): Promise<Product[]> => {
    const response = await fetch(`${API_URL}/seller/products/my`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<Product[]>(response);
  },

  // Admin product APIs
  getAllProductsAdmin: async (): Promise<Product[]> => {
    const response = await fetch(`${API_URL}/admin/products`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<Product[]>(response);
  },

  updateProductStatus: async (productId: string, status: 'approved' | 'rejected'): Promise<Product> => {
    const response = await fetch(`${API_URL}/admin/products/${productId}/status`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse<Product>(response);
  }
};

// Cart APIs
export const cartAPI = {
  addToCart: async (productId: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/cart/${productId}`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse<{ message: string }>(response);
  },

  removeFromCart: async (productId: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/cart/${productId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse<{ message: string }>(response);
  },

  getCart: async (): Promise<CartItem[]> => {
    const response = await fetch(`${API_URL}/cart`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<CartItem[]>(response);
  },
};

// Wishlist APIs
export const wishlistAPI = {
  addToWishlist: async (productId: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/wishlist/${productId}`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse<{ message: string }>(response);
  },

  removeFromWishlist: async (productId: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/wishlist/${productId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse<{ message: string }>(response);
  },

  getWishlist: async (): Promise<Product[]> => {
    const response = await fetch(`${API_URL}/wishlist`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<Product[]>(response);
  },
};

// Order APIs
export const orderAPI = {
  placeOrder: async (): Promise<Order> => {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse<Order>(response);
  },

  getOrders: async (): Promise<Order[]> => {
    const response = await fetch(`${API_URL}/orders`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<Order[]>(response);
  },

  getOrderById: async (orderId: string): Promise<Order> => {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<Order>(response);
  },

  // Seller order APIs
  getSellerOrders: async (): Promise<Order[]> => {
    const response = await fetch(`${API_URL}/seller/orders`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<Order[]>(response);
  },

  updateOrderStatus: async (orderId: string, status: Order['status']): Promise<Order> => {
    const response = await fetch(`${API_URL}/seller/orders/${orderId}/status`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse<Order>(response);
  },

  // Admin order APIs
  getAllOrdersAdmin: async (): Promise<Order[]> => {
    const response = await fetch(`${API_URL}/admin/orders`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<Order[]>(response);
  },
};

// Review APIs
export const reviewAPI = {
  submitReview: async (productId: string, rating: number, comment: string): Promise<Review> => {
    const response = await fetch(`${API_URL}/reviews`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ product_id: productId, rating, comment }),
    });
    return handleResponse<Review>(response);
  },

  getReviewsByProduct: async (productId: string): Promise<Review[]> => {
    const response = await fetch(`${API_URL}/reviews/${productId}`, {
      method: "GET",
      headers: getHeaders(false),
    });
    return handleResponse<Review[]>(response);
  },
};

// Admin user APIs
export const adminAPI = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_URL}/admin/users`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<User[]>(response);
  },

  updateUserStatus: async (userId: string, status: 'active' | 'inactive'): Promise<User> => {
    const response = await fetch(`${API_URL}/admin/users/${userId}/status`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse<User>(response);
  },
};

// Category APIs
export const categoryAPI = {
  getCategories: async (): Promise<Category[]> => {
    const response = await fetch(`${API_URL}/categories`, {
      method: "GET",
      headers: getHeaders(false),
    });
    return handleResponse<Category[]>(response);
  },

  // Admin category APIs
  createCategory: async (name: string, parent?: string): Promise<Category> => {
    const response = await fetch(`${API_URL}/admin/categories`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ name, parent }),
    });
    return handleResponse<Category>(response);
  },

  updateCategory: async (categoryId: string, name: string, parent?: string): Promise<Category> => {
    const response = await fetch(`${API_URL}/admin/categories/${categoryId}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ name, parent }),
    });
    return handleResponse<Category>(response);
  },

  deleteCategory: async (categoryId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/admin/categories/${categoryId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse<void>(response);
  },
};
