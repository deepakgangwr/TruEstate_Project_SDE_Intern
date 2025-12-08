import React, { useMemo } from 'react';
import { RotateCcw, ChevronDown } from 'lucide-react';

const FilterBar = ({ filters, options, onFilterChange, onReset }) => {
  
  const defaults = {
    regions: ["North", "South", "East", "West", "Central"],
    categories: ["Clothing", "Electronics", "Beauty"],
    paymentMethods: ["Credit Card", "Wallet", "UPI", "Cash", "Debit Card", "Net Banking"],
    tags: ["Sale", "New", "Discounted", "Popular", "organic", "skincare", "makeup", "fragrance-free", "unisex", "cotton", "fashion", "casual", "formal", "smart"]
  };

  const ageRanges = ["0-18", "19-25", "26-35", "36-45", "46-60", "60+"];
  const dateRanges = ["Last 24 Hours", "Last 7 Days", "This Month", "Last 3 Months"];

  const getOptions = (apiData, fallbackData) =>
    apiData?.length ? apiData : fallbackData;

  const categoryTagsMap = {
    Beauty: ["organic", "skincare", "makeup", "fragrance-free"],
    Clothing: ["unisex", "cotton", "fashion", "casual", "formal"],
    Electronics: ["smart"]
  };

  const visibleTags = useMemo(() => {
    const allTags = getOptions(options.tags, defaults.tags);
    if (filters.category && categoryTagsMap[filters.category]) {
      return allTags.filter(tag => categoryTagsMap[filters.category].includes(tag));
    }
    return allTags;
  }, [filters.category, options.tags]);

  return (
    <div className="
      w-full 
      p-4 
      flex flex-wrap items-center gap-3 
      border-b border-gray-200 
      bg-white/70 
      backdrop-blur-md 
      shadow-sm 
      sticky top-16 z-20 
      transition-all
    ">
      {/* RESET BUTTON */}
      <button
        onClick={onReset}
        className="
          p-2 rounded-full 
          text-gray-400 
          hover:bg-gray-100 hover:text-red-500 
          transition-all 
          shadow-sm
        "
        title="Reset Filters"
      >
        <RotateCcw size={16} />
      </button>

      {/* SELECT FIELDS */}
      <FilterSelect
        label="Customer Region"
        value={filters.region}
        onChange={(val) => onFilterChange("region", val)}
        options={getOptions(options.regions, defaults.regions)}
      />

      <FilterSelect
        label="Gender"
        value={filters.gender}
        onChange={(val) => onFilterChange("gender", val)}
        options={["Male", "Female", "Other"]}
      />

      <FilterSelect
        label="Age Range"
        value={filters.ageRange}
        onChange={(val) => onFilterChange("ageRange", val)}
        options={ageRanges}
      />

      <FilterSelect
        label="Product Category"
        value={filters.category}
        onChange={(val) => {
          onFilterChange("category", val);
          onFilterChange("tags", ""); // clear tags
        }}
        options={getOptions(options.categories, defaults.categories)}
      />

      <FilterSelect
        label="Tags"
        value={filters.tags}
        onChange={(val) => onFilterChange("tags", val)}
        options={visibleTags}
      />

      <FilterSelect
        label="Payment Method"
        value={filters.paymentMethod}
        onChange={(val) => onFilterChange("paymentMethod", val)}
        options={getOptions(options.paymentMethods, defaults.paymentMethods)}
      />

      <FilterSelect
        label="Date"
        value={filters.dateRange}
        onChange={(val) => onFilterChange("dateRange", val)}
        options={dateRanges}
      />

      {/* SORT */}
      <div className="ml-auto flex items-center gap-2">
        <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>

        <select
          className="
            text-sm font-medium 
            bg-transparent 
            text-gray-700 
            border-none outline-none 
            focus:ring-0 
            cursor-pointer 
            hover:text-blue-700 
            transition-all
          "
          onChange={(e) => onFilterChange("sortBy", e.target.value)}
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
  //  BEAUTIFIED SELECT COMPONENT
const FilterSelect = ({ label, value, onChange, options = [] }) => (
  <div className="relative group">
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={`
        appearance-none 
        px-4 py-1.5 pr-8 
        rounded-lg 
        text-xs font-medium 
        border transition-all cursor-pointer
        shadow-sm
      
        ${value 
          ? "border-blue-500 text-blue-700 bg-blue-50" 
          : "border-gray-200 text-gray-600 bg-gray-50 hover:bg-gray-100"
        }

        focus:outline-none 
        focus:ring-2 focus:ring-blue-300 
        focus:border-blue-500
      `}
    >
      <option value="">
        {value ? `All ${label}s` : label}
      </option>

      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>

    {/* Dropdown Arrow */}
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 group-hover:text-gray-600">
      <ChevronDown size={12} />
    </div>
  </div>
);

export default FilterBar;
