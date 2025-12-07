import React, { useMemo } from 'react';
import { RotateCcw, ChevronDown, X } from 'lucide-react'; // Added 'X' icon if you want to use it later

const FilterBar = ({ filters, options, onFilterChange, onReset }) => {
  
  // 1. Fallback Defaults
  const defaults = {
    regions: ["North", "South", "East", "West", "Central"],
    categories: ["Clothing", "Electronics", "Beauty"],
    paymentMethods: ["Credit Card", "Wallet", "UPI", "Cash", "Debit Card", "Net Banking"],
    tags: ["Sale", "New", "Discounted", "Popular", "organic", "skincare", "makeup", "fragrance-free", "unisex", "cotton", "fashion", "casual", "formal", "smart"]
  };

  const ageRanges = ["0-18", "19-25", "26-35", "36-45", "46-60", "60+"];
  const dateRanges = ["Last 24 Hours", "Last 7 Days","This Month","Last 3 Months"];

  const getOptions = (apiData, fallbackData) => {
    return (apiData && apiData.length > 0) ? apiData : fallbackData;
  };

  // 2. Smart Tag Logic
  const categoryTagsMap = {
    "Beauty": ["organic", "skincare", "makeup", "fragrance-free"],
    "Clothing": ["unisex", "cotton", "fashion", "casual", "formal"],
    "Electronics": ["smart"],
  };

  const visibleTags = useMemo(() => {
    const allTags = getOptions(options.tags, defaults.tags);
    if (filters.category && categoryTagsMap[filters.category]) {
       const allowedTags = categoryTagsMap[filters.category];
       return allTags.filter(tag => allowedTags.includes(tag));
    }
    return allTags;
  }, [filters.category, options.tags]);

  return (
    <div className="bg-white p-4 border-b border-gray-200 flex flex-wrap gap-3 items-center shadow-sm z-10">
      <button 
        onClick={onReset}
        className="p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500 rounded-full transition-colors"
        title="Reset Filters"
      >
        <RotateCcw size={16} />
      </button>

      {/* 1. Customer Region */}
      <FilterSelect 
        label="Customer Region" 
        value={filters.region} 
        onChange={(val) => onFilterChange('region', val)}
        options={getOptions(options.regions, defaults.regions)} 
      />
      
      {/* 2. Gender */}
      <FilterSelect 
        label="Gender" 
        value={filters.gender} 
        onChange={(val) => onFilterChange('gender', val)}
        options={['Male', 'Female','Other']}
      />

      {/* 3. Age Range */}
      <FilterSelect 
        label="Age Range" 
        value={filters.ageRange} 
        onChange={(val) => onFilterChange('ageRange', val)}
        options={ageRanges} 
      />

      {/* 4. Product Category */}
      <FilterSelect 
        label="Product Category" 
        value={filters.category} 
        onChange={(val) => {
            onFilterChange('category', val);
            onFilterChange('tags', ''); // Reset tags when category changes
        }}
        options={getOptions(options.categories, defaults.categories)}
      />

      {/* 5. Tags */}
      <FilterSelect 
        label="Tags" 
        value={filters.tags} 
        onChange={(val) => onFilterChange('tags', val)}
        options={visibleTags} 
      />

      {/* 6. Payment Method */}
      <FilterSelect 
        label="Payment Method" 
        value={filters.paymentMethod} 
        onChange={(val) => onFilterChange('paymentMethod', val)}
        options={getOptions(options.paymentMethods, defaults.paymentMethods)}
      />

      {/* 7. Date */}
      <FilterSelect 
        label="Date" 
        value={filters.dateRange} 
        onChange={(val) => onFilterChange('dateRange', val)}
        options={dateRanges} 
      />
      
      {/* Sort Dropdown */}
      <div className="ml-auto flex items-center gap-2">
        <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
        <select 
          className="text-sm font-medium border-none focus:ring-0 cursor-pointer text-gray-700 bg-transparent hover:text-green-700 outline-none"
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
          value={filters.sortBy || "date"}
        >
          <option value="name">Customer Name (A-Z)</option>
          <option value="date">Date (Newest)</option>
          <option value="quantity">Quantity (High-Low)</option>
        </select>
      </div>
    </div>
  );
};

// --- IMPROVED FILTER SELECT COMPONENT ---
const FilterSelect = ({ label, value, onChange, options = [] }) => (
  <div className="relative group">
    <select 
      value={value || ""} 
      onChange={(e) => onChange(e.target.value)}
      className={`appearance-none px-4 py-1.5 pr-8 border rounded-md text-xs font-medium focus:outline-none focus:border-gray-400 transition-shadow cursor-pointer ${
        value 
          ? 'border-green-500 text-green-700 bg-green-50' // Active Style
          : 'border-gray-200 text-gray-600 bg-gray-50 hover:bg-gray-100' // Inactive Style
      }`}
    >
      {/* FIX: Added "(All)" to make it clear this option resets the filter.
         This ensures the user knows they can click it to go back.
      */}
      <option value="" className="text-gray-400">
        {value ? `All ${label}s` : label}
      </option>
      
      {options.map((opt) => (
        <option key={opt} value={opt} className="text-gray-900">
          {opt}
        </option>
      ))}
    </select>
    
    {/* Dropdown Arrow */}
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
      <ChevronDown size={12} />
    </div>
  </div>
);

export default FilterBar;

