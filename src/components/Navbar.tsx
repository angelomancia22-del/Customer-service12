import React from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  Boxes,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  Clock,
  BarChart3,
  BookOpen,
  AlertCircle
} from 'lucide-react';

interface NavbarProps {
  onOpenNewTransaction: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNewTransaction }) => {
  const { activeTab, setActiveTab, lowStockCount, outOfStockCount } = useInventory();
  const alertCount = lowStockCount + outOfStockCount;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-left group flex items-center gap-2.5"
            >
              <div className="w-9 h-9 rounded-lg bg-rose-900 text-white flex items-center justify-center font-bold text-lg tracking-wider">
                A
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-neutral-900 font-display block leading-tight">
                  AVON DISTRIBUTION
                </span>
                <span className="text-[11px] font-medium text-neutral-500 block leading-none">
                  Inventory & Product Operations
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Concise single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-rose-50 text-rose-900'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'products'
                  ? 'bg-rose-50 text-rose-900'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Catalog & Master List</span>
            </button>

            <button
              onClick={() => setActiveTab('stock-in')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'stock-in'
                  ? 'bg-rose-50 text-rose-900'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span>Stock-In (Receiving)</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-rose-50 text-rose-900'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <ArrowUpFromLine className="w-3.5 h-3.5" />
              <span>Rep Orders (Stock-Out)</span>
            </button>

            <button
              onClick={() => setActiveTab('movements')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'movements'
                  ? 'bg-rose-50 text-rose-900'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Audit Ledger</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'reports'
                  ? 'bg-rose-50 text-rose-900'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>Reports</span>
              {alertCount > 0 && (
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded font-mono-numbers">
                  {alertCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('research')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'research'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-rose-400" />
              <span>Research Paper</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenNewTransaction}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-rose-900 hover:bg-rose-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm flex items-center gap-2"
            >
              <span>+ New Transaction</span>
            </button>
          </div>
        </div>

        {/* Mobile subnavigation bar */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2.5 border-t border-neutral-100 text-xs no-scrollbar">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-rose-900 text-white' : 'text-neutral-600'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'products' ? 'bg-rose-900 text-white' : 'text-neutral-600'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('stock-in')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'stock-in' ? 'bg-rose-900 text-white' : 'text-neutral-600'
            }`}
          >
            Stock-In
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'orders' ? 'bg-rose-900 text-white' : 'text-neutral-600'
            }`}
          >
            Rep Orders
          </button>
          <button
            onClick={() => setActiveTab('movements')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'movements' ? 'bg-rose-900 text-white' : 'text-neutral-600'
            }`}
          >
            Ledger
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'reports' ? 'bg-rose-900 text-white' : 'text-neutral-600'
            }`}
          >
            Reports
          </button>
          <button
            onClick={() => setActiveTab('research')}
            className={`px-2.5 py-1 rounded whitespace-nowrap font-semibold ${
              activeTab === 'research' ? 'bg-neutral-900 text-white' : 'text-rose-900'
            }`}
          >
            Research Study
          </button>
        </div>
      </div>
    </header>
  );
};
