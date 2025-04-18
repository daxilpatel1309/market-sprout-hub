
import { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import { Product } from '../types';
import Navbar from '../components/Navbar';
import ProductGrid from '../components/ProductGrid';
import { toast } from 'sonner';

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productAPI.getProducts();
        console.log("Fetched products:", data);
        // Make sure we're working with an array of products
        if (Array.isArray(data)) {
          setProducts(data.filter(product => product && product.status === 'approved'));
        } else {
          console.error("Unexpected product data format:", data);
          setProducts([]);
          toast.error("Error retrieving products");
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        toast.error("Error retrieving products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="mb-12">
          <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-8 mb-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold mb-4">Welcome to ShopNow</h1>
              <p className="text-lg mb-6">Discover amazing products from our sellers and get them delivered to your doorstep.</p>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>
          <ProductGrid 
            products={products} 
            wishlistItems={wishlistItems}
            isLoading={isLoading}
          />
        </section>
      </main>
      <footer className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>&copy; 2023 ShopNow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
