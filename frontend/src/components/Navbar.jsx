import React from 'react';
import { Search } from 'lucide-react';

const Navbar = ({ onSearch }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="text-xl font-bold text-gray-800">Sales Management System</h1>
      
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600" size={18} />
          <input 
            type="text" 
            placeholder="Search by Name, Phone..." 
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
          />
        </div>

      </div>
    </header>
  );
};

export default Navbar;

