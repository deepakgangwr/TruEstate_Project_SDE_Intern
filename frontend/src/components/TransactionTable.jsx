import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';


const CopyButton = ({ text, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy"
      className={`
        inline-flex items-center justify-center 
        p-1.5 rounded-md
        bg-gray-50 
        hover:bg-gray-100 active:bg-gray-200 
        transition-all shadow-sm 
        ${className}
      `}
    >
      {copied ? (
        <Check size={12} className="text-green-600 animate-scaleIn" />
      ) : (
        <Copy size={12} className="text-gray-500 hover:text-gray-700" />
      )}
    </button>
  );
};


const TransactionTable = ({ data, loading }) => {
  if (loading)
    return (
      <div className="flex-1 flex items-center justify-center p-20 bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );

  if (!data || data.length === 0)
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20 text-gray-400 bg-white">
        <p>No transactions found.</p>
      </div>
    );

  return (
    <div className="overflow-x-auto bg-white flex-1 border-t border-gray-200 rounded-lg shadow-sm">
      <table className="min-w-max w-full text-left text-sm whitespace-nowrap">
        
        {/* ================= HEADER ================= */}
        <thead className="
          bg-gray-50 
          text-gray-600 text-xs font-semibold 
          border-b border-gray-200
        ">
          <tr>
            {[
              "Transaction ID", "Date", "Customer ID", "Customer Name",
              "Phone Number", "Gender", "Age", "Product Category",
              "Quantity", "Total Amount", "Customer Region",
              "Product ID", "Employee Name"
            ].map((title) => (
              <th
                key={title}
                className="px-6 py-4 font-medium tracking-wide"
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>

        {/* ================= BODY ================= */}
        <tbody className="divide-y divide-gray-100">
          {data.map((item) => (
            <tr
              key={item._id}
              className="
                hover:bg-gray-50 
                transition-all 
                hover:shadow-sm
              "
            >
              {/* TRANSACTION ID */}
              <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                {item._id.substring(item._id.length - 8).toUpperCase()}
              </td>

              {/* DATE */}
              <td className="px-6 py-4 text-gray-600 text-xs">
                {new Date(item.meta.date).toISOString().split("T")[0]}
              </td>

              {/* CUSTOMER ID */}
              <td className="px-6 py-4 text-gray-900 font-medium text-xs">
                {item.customer.id || "CUST12016"}
              </td>

              {/* CUSTOMER NAME */}
              <td className="px-6 py-4 text-gray-900 font-medium text-sm">
                {item.customer.name}
              </td>

              {/* PHONE NUMBER WITH COPY */}
              <td className="px-6 py-4 text-gray-700 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span>{item.customer.phone}</span>
                  <CopyButton text={item.customer.phone} />
                </div>
              </td>

              {/* GENDER */}
              <td className="px-6 py-4 text-gray-600 text-sm">
                {item.customer.gender}
              </td>

              {/* AGE */}
              <td className="px-6 py-4 text-gray-600 text-sm">
                {item.customer.age}
              </td>

              {/* CATEGORY */}
              <td className="px-6 py-4 text-gray-900 font-semibold text-sm">
                {item.product.category}
              </td>

              {/* QUANTITY */}
              <td className="px-6 py-4 text-gray-900 font-semibold text-sm pl-8">
                {item.sales.quantity.toString().padStart(2, "0")}
              </td>

              {/* TOTAL AMOUNT */}
              <td className="px-6 py-4 text-gray-900 font-bold text-sm">
                ₹ {item.sales.totalAmount.toLocaleString()}
              </td>

              {/* REGION */}
              <td className="px-6 py-4 text-gray-800 font-medium text-sm">
                {item.customer.region}
              </td>

              {/* PRODUCT ID */}
              <td className="px-6 py-4 text-gray-700 font-medium text-xs">
                {item.product.id || "PROD0001"}
              </td>

              {/* EMPLOYEE NAME */}
              <td className="px-6 py-4 text-gray-700 font-medium text-xs">
                {item.meta.employeeName || "Harsh Agrawal"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
