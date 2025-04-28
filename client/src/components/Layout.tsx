// src/components/Layout.tsx
import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className=" text-black shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="font-bold text-xl">FinSight</Link>
            
            <div className="flex space-x-4">
              <Link to="/dashboard" className="px-3 py-2 rounded hover:bg-gray-700">Dashboard</Link>
            
              <Link to="/login" className="px-3 py-2 rounded hover:bg-gray-700">Login</Link>
              <Link to="/signup" className="px-3 py-2 rounded hover:bg-gray-700">Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}