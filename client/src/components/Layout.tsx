// src/components/Layout.tsx
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from './useUser';
import { Button } from './ui/button';

// use icons for login and sign up

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, handleSignOut } = useUser();
  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/signup';

  const handleLogout = () => {
    handleSignOut();
    navigate('/login');
  };
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className=" text-black shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="font-bold text-xl">
              <img
                src="/FinSight.png"
                alt="FinSight"
                className="h-20 w-auto mb-1"
              />
            </Link>

            <div className="flex space-x-4">
              <Link
                to="/dashboard"
                className="px-3 py-2 rounded hover:bg-gray-700">
                Dashboard - temp
              </Link>
              <div className="flex items-center gap-2">
                <span>Welcome, {user?.username}</span>
                <Button onClick={handleLogout}>Logout</Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-1">
        {isAuthPage ? (
          <div className="max-w-md mx-auto mt-10 px-4">
            <Outlet />
          </div>
        ) : (
          <div className="container mx-auto px-4 py-6">
            <Outlet />
          </div>
        )}
      </main>
    </div>
  );
}
