
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Button } from '@/components/ui/button';
import { 
  User, 
  ShoppingCart, 
  Heart, 
  Package, 
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartCount } = useCart();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            ShopNow
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="block md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Home
          </Link>
          
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <Link 
                  to="/admin/dashboard" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname.startsWith('/admin') ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  Admin Dashboard
                </Link>
              )}
              
              {user?.role === 'seller' && (
                <Link 
                  to="/seller/dashboard" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname.startsWith('/seller') ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  Seller Dashboard
                </Link>
              )}

              <div className="flex items-center space-x-4">
                <Link 
                  to="/wishlist" 
                  className="text-muted-foreground hover:text-primary transition-colors relative"
                >
                  <Heart className="h-5 w-5" />
                </Link>
                
                <Link 
                  to="/cart" 
                  className="text-muted-foreground hover:text-primary transition-colors relative"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                </Link>
                
                <Link 
                  to="/orders" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Package className="h-5 w-5" />
                </Link>
                
                <Link 
                  to="/profile" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <User className="h-5 w-5" />
                </Link>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={logout}
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              
              <Link to="/signup">
                <Button>Signup</Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 top-16 z-50 bg-background md:hidden">
            <nav className="flex flex-col p-6 space-y-6">
              <Link 
                to="/" 
                className="text-lg font-medium transition-colors hover:text-primary"
                onClick={toggleMenu}
              >
                Home
              </Link>
              
              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin/dashboard" 
                      className="text-lg font-medium transition-colors hover:text-primary"
                      onClick={toggleMenu}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  
                  {user?.role === 'seller' && (
                    <Link 
                      to="/seller/dashboard" 
                      className="text-lg font-medium transition-colors hover:text-primary"
                      onClick={toggleMenu}
                    >
                      Seller Dashboard
                    </Link>
                  )}
                  
                  <Link 
                    to="/wishlist" 
                    className="text-lg font-medium transition-colors hover:text-primary flex items-center space-x-2"
                    onClick={toggleMenu}
                  >
                    <Heart className="h-5 w-5" />
                    <span>Wishlist</span>
                  </Link>
                  
                  <Link 
                    to="/cart" 
                    className="text-lg font-medium transition-colors hover:text-primary flex items-center space-x-2"
                    onClick={toggleMenu}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Cart {getCartCount() > 0 && `(${getCartCount()})`}</span>
                  </Link>
                  
                  <Link 
                    to="/orders" 
                    className="text-lg font-medium transition-colors hover:text-primary flex items-center space-x-2"
                    onClick={toggleMenu}
                  >
                    <Package className="h-5 w-5" />
                    <span>Orders</span>
                  </Link>
                  
                  <Link 
                    to="/profile" 
                    className="text-lg font-medium transition-colors hover:text-primary flex items-center space-x-2"
                    onClick={toggleMenu}
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                  
                  <button 
                    className="text-lg font-medium transition-colors hover:text-primary flex items-center space-x-2"
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-4">
                  <Link 
                    to="/login" 
                    onClick={toggleMenu}
                  >
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  
                  <Link 
                    to="/signup" 
                    onClick={toggleMenu}
                  >
                    <Button className="w-full">Signup</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
