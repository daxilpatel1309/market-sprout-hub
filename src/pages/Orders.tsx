
import { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import { Order } from '../types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Package, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderAPI.getOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
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
            <Package className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">My Orders</h1>
        </div>

        <div className="space-y-4">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No orders found.
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order._id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Order #{order._id.slice(-8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.total_price.toFixed(2)}</p>
                        <p className="text-sm capitalize text-muted-foreground">
                          Status: {order.status}
                        </p>
                      </div>
                    </div>
                    <div className="divide-y">
                      {order.items.map((item) => (
                        <div key={item.product_id} className="py-3">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <p className="font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Orders;
