
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { wishlistAPI } from '../services/api';
import { useState } from 'react';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  inWishlist?: boolean;
  onWishlistUpdate?: () => void;
}

const ProductCard = ({ product, inWishlist = false, onWishlistUpdate }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(inWishlist);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  
  // Format price safely
  const formatPrice = (price: any): string => {
    // If price is already a number, format it
    if (typeof price === 'number') {
      return price.toFixed(2);
    }
    // If price is a string that can be converted to a number
    if (typeof price === 'string' && !isNaN(parseFloat(price))) {
      return parseFloat(price).toFixed(2);
    }
    // Default value if price is invalid
    console.warn(`Invalid price format for product ${product._id}: ${price}`);
    return '0.00';
  };
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }
    
    try {
      setIsAddingToCart(true);
      await addToCart(product._id);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("Please login to manage wishlist");
      return;
    }
    
    try {
      setIsWishlistLoading(true);
      
      if (isInWishlist) {
        await wishlistAPI.removeFromWishlist(product._id);
        toast.success("Removed from wishlist");
      } else {
        await wishlistAPI.addToWishlist(product._id);
        toast.success("Added to wishlist");
      }
      
      setIsInWishlist(!isInWishlist);
      if (onWishlistUpdate) {
        onWishlistUpdate();
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    } finally {
      setIsWishlistLoading(false);
    }
  };
  
  return (
    <Card className="overflow-hidden card-hover">
      <Link to={`/products/${product._id}`}>
        <div className="relative aspect-square overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/300x300?text=No+Image";
              }}
            />
          ) : (
            <img 
              src="https://via.placeholder.com/300x300?text=No+Image" 
              alt={product.name} 
              className="h-full w-full object-cover"
            />
          )}
          
          {isAuthenticated && (
            <Button 
              size="icon" 
              variant="ghost" 
              className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full" 
              onClick={toggleWishlist}
              disabled={isWishlistLoading}
            >
              <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-secondary text-secondary' : ''}`} />
            </Button>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium">
              {product.rating_avg ? product.rating_avg.toFixed(1) : 'N/A'}
            </span>
          </div>
          
          <h3 className="mt-2 font-medium line-clamp-1">{product.name}</h3>
          
          <div className="mt-1 font-semibold">${formatPrice(product.price)}</div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full" 
            size="sm" 
            onClick={handleAddToCart} 
            disabled={isAddingToCart || product.stock <= 0}
          >
            {isAddingToCart ? (
              <span className="flex items-center gap-1">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                Adding...
              </span>
            ) : product.stock <= 0 ? (
              "Out of Stock"
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ProductCard;
