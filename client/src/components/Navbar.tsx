import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import pfp from '../assets/header.png';
import logo from '../assets/logo.png';

const Navbar: React.FC = () => {
  const location = useLocation();
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
              {isHomepage && (
                <>
                  <Link to="/tasks/new" className="hover:text-[#974FD0] transition">New Task</Link>
                  <Link to="/tasks" className="hover:text-[#974FD0] transition">All Tasks</Link>
                </>
              )}
              {isMyTask && (
                <Link to="/tasks/new" className="hover:text-[#974FD0] transition">New Task</Link>
              )}
              {isNewOrEdit && (
                <Link to="/tasks" className="hover:text-[#974FD0] transition">All Tasks</Link>
              )}
            </div>
            
            <div>
              <img 
                src={pfp} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover border border-gray-200" 
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;