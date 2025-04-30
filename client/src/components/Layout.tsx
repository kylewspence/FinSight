// src/components/Layout.tsx
import { Link, Outlet, useLocation } from 'react-router-dom';

// use icons for login and signup

export default function Layout() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/signup';
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className=" text-black shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="font-bold text-xl">
              FinSight
            </Link>

            <div className="flex space-x-4">
              <Link
                to="/dashboard"
                className="px-3 py-2 rounded hover:bg-gray-700">
                Dashboard
              </Link>
              <Link to="/login" className="px-3 py-2 rounded hover:bg-gray-700">
                Login
              </Link>
              <Link
                to="/signup"
                className="px-3 py-2 rounded hover:bg-gray-700">
                Sign Up
              </Link>
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
