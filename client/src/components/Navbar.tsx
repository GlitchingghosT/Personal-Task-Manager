import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import pfp from '../assets/header.png';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, email, signOut } = useAuth();
  const path = location.pathname;

  const isHomepage = path === '/';
  const isMyTask = path === '/tasks';
  const isNewOrEdit = path === '/tasks/new' || path.startsWith('/tasks/edit/');

  return (
    <nav className="bg-[#FAF9FB] border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <Link to="/" className="flex items-center">
            <img src={logo} alt="TaskDuty Logo" className="h-8 object-contain" />
          </Link>
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
              {token && isHomepage && (
                <>
                  <Link to="/tasks/new" className="hover:text-[#974FD0] transition">New Task</Link>
                  <Link to="/tasks" className="hover:text-[#974FD0] transition">All Tasks</Link>
                </>
              )}
              {token && isMyTask && (
                <Link to="/tasks/new" className="hover:text-[#974FD0] transition">New Task</Link>
              )}
              {token && isNewOrEdit && (
                <Link to="/tasks" className="hover:text-[#974FD0] transition">All Tasks</Link>
              )}
            </div>
            
            {token ? (
              <div className="flex items-center gap-3">
                <img
                  src={pfp}
                  alt=""
                  className="hidden h-10 w-10 rounded-full border border-gray-200 object-cover sm:block"
                />
                <span className="hidden max-w-40 truncate text-sm text-gray-600 md:block">{email}</span>
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    navigate('/login');
                  }}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-[#974FD0] hover:text-[#974FD0]"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 text-sm font-semibold">
                <Link to="/login" className="text-gray-600 transition hover:text-[#974FD0]">Sign in</Link>
                <Link to="/signup" className="rounded-lg bg-[#974FD0] px-4 py-2.5 text-white transition hover:bg-[#833bbd]">
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;