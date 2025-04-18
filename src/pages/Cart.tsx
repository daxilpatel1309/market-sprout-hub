
import { useCart } from '../contexts/CartContext';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Loader2 } from 'lucide-react';
import { orderAPI } from '../services/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, isLoading, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      await orderAPI.placeOrder();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    }
  };

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
            <ShoppingCart className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
        </div>

        {cart.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Your cart is empty.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              {cart.map((item) => (
                <Card key={item.product_id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="h-20 w-20 object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/80?text=No+Image";
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.product_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="h-fit">
              <CardHeader>
                <h2 className="text-xl font-semibold">Order Summary</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-4">
                    <span>Total</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleCheckout}>
                  Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
