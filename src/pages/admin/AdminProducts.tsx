
import React, { useState } from 'react';
import { Product } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { productAPI } from '../../services/api';
import { toast } from 'sonner';
import { Loader2, AlertCircle, Check, X } from 'lucide-react';

interface AdminProductsProps {
  products: Product[];
  refreshData: () => Promise<void>;
}

const AdminProducts: React.FC<AdminProductsProps> = ({ products, refreshData }) => {
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const updateProductStatus = async (productId: string, status: 'approved' | 'rejected') => {
    try {
      setIsUpdating(productId);
      await productAPI.updateProductStatus(productId, status);
      toast.success(`Product ${status} successfully`);
      await refreshData();
    } catch (error) {
      console.error('Error updating product status:', error);
      toast.error('Failed to update product status');
    } finally {
      setIsUpdating(null);
    }
  };

  const getStatusBadge = (status: Product['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const pendingProducts = products.filter(p => p.status === 'pending');
  const approvedProducts = products.filter(p => p.status === 'approved');
  const rejectedProducts = products.filter(p => p.status === 'rejected');

  const renderProductTable = (products: Product[]) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Seller</th>
            <th className="text-left p-2">Price</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="border-b hover:bg-muted/50">
              <td className="p-2">
                <div className="flex items-center space-x-3">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-10 w-10 object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/40?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="h-10 w-10 bg-muted flex items-center justify-center rounded">
                      <AlertCircle className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <span className="font-medium">{product.name}</span>
                </div>
              </td>
              <td className="p-2">
                {typeof product.seller_id === 'object' && product.seller_id.email ? 
                  product.seller_id.email : 'Unknown'}
              </td>
              <td className="p-2">
                ${typeof product.price === 'number' 
                  ? product.price.toFixed(2) 
                  : product.price.$numberDecimal 
                    ? parseFloat(product.price.$numberDecimal).toFixed(2)
                    : '0.00'}
              </td>
              <td className="p-2">{getStatusBadge(product.status)}</td>
              <td className="p-2">
                <div className="flex gap-2">
                  {product.status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="bg-green-100 hover:bg-green-200 text-green-800 border-green-300"
                        onClick={() => updateProductStatus(product._id, 'approved')}
                        disabled={isUpdating === product._id}
                      >
                        {isUpdating === product._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4 mr-1" />
                        )}
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="bg-red-100 hover:bg-red-200 text-red-800 border-red-300"
                        onClick={() => updateProductStatus(product._id, 'rejected')}
                        disabled={isUpdating === product._id}
                      >
                        {isUpdating === product._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4 mr-1" />
                        )}
                        Reject
                      </Button>
                    </>
                  )}
                  {(product.status === 'approved' || product.status === 'rejected') && (
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => updateProductStatus(product._id, product.status === 'approved' ? 'rejected' : 'approved')}
                      disabled={isUpdating === product._id}
                    >
                      {isUpdating === product._id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : product.status === 'approved' ? (
                        <X className="h-4 w-4 mr-1" />
                      ) : (
                        <Check className="h-4 w-4 mr-1" />
                      )}
                      {product.status === 'approved' ? 'Reject' : 'Approve'}
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pending Products</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingProducts.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No pending products.</p>
          ) : (
            renderProductTable(pendingProducts)
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Approved Products</CardTitle>
        </CardHeader>
        <CardContent>
          {approvedProducts.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No approved products.</p>
          ) : (
            renderProductTable(approvedProducts)
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rejected Products</CardTitle>
        </CardHeader>
        <CardContent>
          {rejectedProducts.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No rejected products.</p>
          ) : (
            renderProductTable(rejectedProducts)
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProducts;
