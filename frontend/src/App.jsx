import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';
import TransactionTable from './components/TransactionTable';
import Pagination from './components/Pagination';
import { Info } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/transactions';

function App() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ totalPages: 1, page: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({ regions: [], categories: [], paymentMethods: [], tags: [] });
  const [filters, setFilters] = useState({
    page: 1, limit: 10, search: '', 
    region: '', gender: '', category: '', 
    paymentMethod: '', sortBy: 'date', order: 'desc',
    ageRange: '', tags: '', dateRange: '' 
  });

  useEffect(() => {
    axios.get(`${API_BASE_URL}/options`)
      .then(res => {
        setOptions(res.data); 
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (filters.search && filters.search.length > 0 && filters.search.length < 2) {
           setLoading(false); return;
        }

        const params = { ...filters };

        if (filters.ageRange) {
          if (filters.ageRange === '60+') { params.minAge = 60; }
          else {
             const [min, max] = filters.ageRange.split('-');
             params.minAge = min; params.maxAge = max;
          }
          delete params.ageRange;
        }

        if (filters.dateRange) {
          const now = new Date();
          let start = new Date();
          
          switch(filters.dateRange) {
            case 'Last 24 Hours':
              start.setHours(now.getHours() - 24);
              break;
            case 'Last 7 Days':
              start.setDate(now.getDate() - 7);
              break;
            case 'This Month':
              start.setDate(1);
              break;
            case 'Last 3 Months':
              start.setMonth(now.getMonth() - 3);
              break;
            default:
              start = null;
          }

          if (start) {
            params.startDate = start.toISOString();
            params.endDate = now.toISOString();
          }
          delete params.dateRange; 
        }

        const response = await axios.get(API_BASE_URL, { params });
        setData(response.data.data);
        setMeta(response.data.meta);
      } catch (error) {
        console.error("Error loading data", error);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(loadData, 400); 
    return () => clearTimeout(timer);
  }, [filters]);

  const stats = useMemo(() => {
    if (!data || !data.length) return { units: 0, amount: 0, discount: 0, count: 0 };
    return data.reduce((acc, curr) => ({
      units: acc.units + curr.sales.quantity,
      amount: acc.amount + curr.sales.totalAmount,
      discount: acc.discount + curr.sales.discount,
      count: data.length
    }), { units: 0, amount: 0, discount: 0, count: 0 });
  }, [data]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value, page: 1 };
      if (key === 'sortBy') newFilters.order = (value === 'name') ? 'asc' : 'desc';
      return newFilters;
    });
  };

  const handleReset = () => {
    setFilters({ 
      page: 1, limit: 10, search: '', 
      region: '', gender: '', category: '', 
      paymentMethod: '', sortBy: 'date', order: 'desc',
      ageRange: '', tags: '', dateRange: '' 
    });
  };

  return (
    <div className="flex h-screen bg-[#F3F4F6] font-sans text-gray-900 text-sm overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Navbar onSearch={(val) => handleFilterChange('search', val)} />
        
        <div className="z-10 shadow-sm">
          <FilterBar 
            filters={filters} 
            options={options} 
            onFilterChange={handleFilterChange} 
            onReset={handleReset}
          />
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar p-6">
          <div className="flex flex-wrap items-start justify-start gap-4 mb-6">
            <StatCard label="Total units sold" value={stats.units.toString()} />
            <StatCard label="Total Amount" value={`₹${stats.amount.toLocaleString()} (${stats.count} SRs)`} />
            <StatCard label="Total Discount" value={`₹${stats.discount.toLocaleString()} (${stats.count} SRs)`} />
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <TransactionTable data={data} loading={loading} />
            <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={(p) => setFilters(prev => ({ ...prev, page: p }))} />
          </div>
        </div>
      </main>
    </div>
  );
}
const StatCard = ({ label, value }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col gap-1 min-w-[220px]">
    <div className="flex justify-between items-center">
      <span className="text-gray-600 font-semibold text-xs uppercase tracking-wide">{label}</span>
      <Info size={14} className="text-gray-300 cursor-pointer hover:text-gray-500" />
    </div>
    <div className="text-xl font-bold text-gray-900 mt-1">{value}</div>
  </div>
);

export default App;

