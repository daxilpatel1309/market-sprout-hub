
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  wishlistItems?: string[];
  onWishlistUpdate?: () => void;
  isLoading?: boolean;
}

const ProductGrid = ({ 
  products, 
  wishlistItems = [], 
  onWishlistUpdate,
  isLoading = false 
}: ProductGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-muted aspect-square rounded-md"></div>
            <div className="mt-2 h-4 bg-muted rounded-md w-3/4"></div>
            <div className="mt-2 h-4 bg-muted rounded-md w-1/2"></div>
            <div className="mt-4 h-8 bg-muted rounded-md"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-muted-foreground">No products found</h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product._id} 
          product={product} 
          inWishlist={wishlistItems.includes(product._id)}
          onWishlistUpdate={onWishlistUpdate}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
