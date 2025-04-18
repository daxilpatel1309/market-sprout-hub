
import { useState, useEffect } from 'react';
import { wishlistAPI } from '../services/api';
import { Product } from '../types';
import { Heart, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { toast } from 'sonner';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const data = await wishlistAPI.getWishlist();
      setWishlistItems(data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-primary/10 p-3 rounded-full">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">My Wishlist</h1>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center text-muted-foreground">
            Your wishlist is empty.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlistItems.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                inWishlist={true}
                onWishlistUpdate={fetchWishlist}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;
