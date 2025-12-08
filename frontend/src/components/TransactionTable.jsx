import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CopyButton = ({ text, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center justify-center p-1 rounded hover:bg-gray-100 transition-colors ${className}`}
      title="Copy to clipboard"
    >
      {copied ? (
        <Check size={12} className="text-green-600" />
      ) : (
        <Copy size={12} className="text-gray-400 hover:text-gray-600" />
      )}
    </button>
  );
};

const TransactionTable = ({ data, loading }) => {
  if (loading) return (
    <div className="flex-1 flex items-center justify-center p-20 bg-white">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
    </div>
  );
  
  if (!data || data.length === 0) return (
    <div className="flex-1 flex flex-col items-center justify-center p-20 text-gray-400 bg-white text-sm">
       <p>No transactions found.</p>
    </div>
  );

  return (
    <div className="overflow-x-auto bg-white flex-1 border-t border-gray-200">
      <table className="min-w-max w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-[#F9FAFB] text-gray-600 text-xs font-semibold border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 font-medium">Transaction ID</th>
            <th className="px-6 py-4 font-medium">Date</th>
            <th className="px-6 py-4 font-medium">Customer ID</th>
            <th className="px-6 py-4 font-medium">Customer name</th>
            <th className="px-6 py-4 font-medium">Phone Number</th>
            <th className="px-6 py-4 font-medium">Gender</th>
            <th className="px-6 py-4 font-medium">Age</th>
            <th className="px-6 py-4 font-medium">Product Category</th>
            <th className="px-6 py-4 font-medium">Quantity</th>
            <th className="px-6 py-4 font-medium">Total Amount</th>
            <th className="px-6 py-4 font-medium">Customer region</th>
            <th className="px-6 py-4 font-medium">Product ID</th>
            <th className="px-6 py-4 font-medium">Employee name</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item) => (
            <tr key={item._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-gray-500 text-xs">
                {item._id.substring(item._id.length - 8).toUpperCase()}
              </td>
              <td className="px-6 py-4 text-gray-500 text-xs">
                {new Date(item.meta.date).toISOString().split('T')[0]}
              </td>
              <td className="px-6 py-4 text-gray-900 font-medium text-xs">
                {item.customer.id || 'CUST12016'}
              </td>
              <td className="px-6 py-4 text-gray-900 font-medium text-sm">
                {item.customer.name}
              </td>
              {/* Phone with Copy Button */}
              <td className="px-6 py-4 text-gray-500 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span>{item.customer.phone}</span>
                  <CopyButton text={item.customer.phone} />
                </div>
              </td>
              <td className="px-6 py-4 text-gray-600 text-sm">
                {item.customer.gender}
              </td>
              <td className="px-6 py-4 text-gray-600 text-sm">
                {item.customer.age}
              </td>
              {/* Bold Category */}
              <td className="px-6 py-4 text-gray-900 font-bold text-sm">
                {item.product.category}
              </td>
              {/* Bold Quantity "01" */}
              <td className="px-6 py-4 text-gray-900 font-bold pl-8 text-sm">
                {item.sales.quantity.toString().padStart(2, '0')}
              </td>
              <td className="px-6 py-4 text-gray-900 font-bold text-sm">
                ₹ {item.sales.totalAmount.toLocaleString()}
              </td>
              <td className="px-6 py-4 text-gray-900 font-medium text-sm">
                {item.customer.region}
              </td>
              <td className="px-6 py-4 text-gray-900 font-medium text-xs">
                {item.product.id || 'PROD0001'}
              </td>
              <td className="px-6 py-4 text-gray-900 font-medium text-xs">
                {item.meta.employeeName || 'Harsh Agrawal'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;


