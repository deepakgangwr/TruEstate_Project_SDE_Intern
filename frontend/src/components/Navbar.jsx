import React from "react";
import { Search } from "lucide-react";

const Navbar = ({ onSearch }) => {
  return (
    <header className="
      h-16 
      backdrop-blur-md bg-white/70 
      border-b border-gray-200 
      shadow-sm 
      flex items-center justify-between 
      px-6 sticky top-0 z-20 transition-all
    ">
      {/* Title */}
      <h1 className="text-[1.35rem] font-semibold tracking-wide text-gray-800">
        Sales Management System
      </h1>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        
        {/* Search Bar */}
        <div 
          className="
            relative group
          "
        >
          <Search 
            size={18}
            className="
              absolute left-3 top-1/2 -translate-y-1/2 
              text-gray-400 group-focus-within:text-blue-700 
              transition-all
            " 
          />

          <input
            type="text"
            placeholder="Search by Name, Phone…"
            onChange={(e) => onSearch(e.target.value)}
            className="
              pl-10 pr-4 py-2 w-64 text-sm 
              bg-white/60 
              border border-gray-300 
              rounded-xl 
              shadow-sm 
              focus:outline-none 
              focus:ring-2 focus:ring-blue-700/40 
              focus:border-blue-700 
              focus:bg-white
              transition-all
            "
          />
        </div>

      </div>
    </header>
  );
};

export default Navbar;


