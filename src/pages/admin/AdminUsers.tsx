
import React, { useState } from 'react';
import { User } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { adminAPI } from '../../services/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface AdminUsersProps {
  users: User[];
  refreshData: () => Promise<void>;
}

const AdminUsers: React.FC<AdminUsersProps> = ({ users, refreshData }) => {
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const toggleUserStatus = async (userId: string, currentStatus: 'active' | 'inactive') => {
    try {
      setIsUpdating(userId);
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await adminAPI.updateUserStatus(userId, newStatus);
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      await refreshData();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    } finally {
      setIsUpdating(null);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>;
      case 'seller':
        return <Badge className="bg-blue-100 text-blue-800">Seller</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-800">Customer</Badge>;
    }
  };

  const getStatusBadge = (status: 'active' | 'inactive') => {
    return status === 'active' ? (
      <Badge className="bg-green-100 text-green-800">Active</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Inactive</Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">User</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Role</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      <div className="font-medium">
                        {user.first_name} {user.last_name}
                      </div>
                    </td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{getRoleBadge(user.role)}</td>
                    <td className="p-2">{getStatusBadge(user.status)}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={user.status === 'active' ? 'destructive' : 'default'}
                          onClick={() => toggleUserStatus(user._id, user.status)}
                          disabled={isUpdating === user._id || user.role === 'admin'}
                        >
                          {isUpdating === user._id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              Updating...
                            </>
                          ) : user.status === 'active' ? (
                            'Deactivate'
                          ) : (
                            'Activate'
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminUsers;
