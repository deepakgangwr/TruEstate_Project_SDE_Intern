import React, { useState } from 'react';
import { LayoutDashboard, Radio, FileText, Settings, ShieldCheck, FileInput, ChevronDown, ChevronUp, PlayCircle, Users, ClipboardCheck, XCircle, CheckCircle, File, FileCheck } from 'lucide-react';

const Sidebar = () => {
  const [isServicesOpen, setIsServicesOpen] = useState(true);
  const [isInvoicesOpen, setIsInvoicesOpen] = useState(true);

  return (
    <div className="w-64 bg-gray-50 h-screen border-r border-gray-200 hidden md:flex flex-col sticky top-0 font-sans z-20 shrink-0">
      {/* Logo Section */}
      <div className="h-16 flex items-center px-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
            V
          </div>
          <div className="flex flex-col justify-center leading-none">
            <div className="font-bold text-gray-900 text-[15px]">Vault</div>
            <div className="text-[11px] text-gray-500 mt-1">Deepak Gangwar</div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-5 space-y-1 overflow-y-auto custom-scrollbar">
        <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" />
        <NavItem icon={<Users size={18} />} label="Nexus" />
        <NavItem icon={<PlayCircle  size={18} />} label="Intake" />

        {/* Services Dropdown Header */}
        <div className='bg-white m-2 rounded-2xl'>
          <button
            onClick={() => setIsServicesOpen(!isServicesOpen)}
            className="w-full flex items-center justify-between mt-6 mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-600"
          >
            <NavItem icon={<ClipboardCheck size={18} />} label="Services" />
            {isServicesOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>

          {/* Services List (Collapsible) */}
          {isServicesOpen && (
            <div className="space-y-0 px-6">
              {/* Active Item: Pre-active */}
              <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r"></div>
                <button className="w-full flex items-center gap-3 px-6 py-1.5 text-sm font-medium  text-gray-500">
                  <PlayCircle size={18} strokeWidth={1.5} />
                  Pre-active
                </button>
              </div>
              <NavItem icon={<Settings size={18} />} label="Active" />
              <NavItem icon={<XCircle size={18} />} label="Blocked" />
              <NavItem icon={<CheckCircle size={18} />} label="Closed" />
            </div>
          )}
        </div>

        {/* Invoices Dropdown Header */}
        
        <div className='bg-white m-2 rounded-2xl'>
        <button
          onClick={() => setIsInvoicesOpen(!isInvoicesOpen)}
          className="w-full flex items-center justify-between mt-6 mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-600"
        >
          <NavItem icon={<FileText size={18} />} label="Invoices" />
          {isInvoicesOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>

        {isInvoicesOpen && (
          <div className="space-y-0 px-5">
            <NavItem
              icon={<FileCheck size={18} strokeWidth={3} className="text-black" />}
              label={<span className="font-bold text-black">Proforma Invoices</span>}
            />

            <NavItem
              icon={<FileCheck size={18} />}
              label="Final Invoices"
            />
          </div>
        )}

      </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-100 mt-auto">
        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
          <div className="w-8 h-8 rounded-full bg-gray-300 border border-white shadow-sm" />
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label }) => (
  <button className="w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
    {icon}
    {label}
  </button>
);

export default Sidebar;

