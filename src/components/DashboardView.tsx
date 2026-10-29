import React from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  Package,
  TrendingUp,
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  DollarSign,
  Boxes,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  BookOpen
} from 'lucide-react';

interface DashboardViewProps {
  onOpenStockIn: () => void;
  onOpenNewOrder: () => void;
  onQuickRestock: (productId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenStockIn,
  onOpenNewOrder,
  onQuickRestock
}) => {
  const {
    products,
    movements,
    orders,
    lowStockCount,
    outOfStockCount,
    totalInventoryUnits,
    totalWholesaleValue,
    totalSrpValue,
    setActiveTab
  } = useInventory();

  const lowStockProducts = products.filter(p => p.currentStock <= p.minThreshold);
  const recentMovements = movements.slice(0, 5);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome & Operational Banner */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="p-6 sm:p-8 lg:col-span-7 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-rose-900">
                <span className="font-semibold tracking-wider uppercase">Local Distribution Office</span>
                <span aria-hidden="true">·</span>
                <span>Automated Inventory Operations</span>
                <span aria-hidden="true">·</span>
                <span>Direct Selling Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-display tracking-tight text-balance">
                Avon Product & Inventory Management System
              </h1>
              <p className="text-sm text-neutral-600 leading-relaxed max-w-xl">
                Engineered to replace error-prone manual logbooks and paper ledgers with an integrated, real-time stock ledger, automated representative order dispatches, and instant inventory audit intelligence.
              </p>
            </div>

            <div className="pt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenNewOrder}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-900 hover:bg-rose-800 rounded-lg transition-colors flex items-center gap-2 shadow-xs"
              >
                <ArrowUpFromLine className="w-3.5 h-3.5" />
                <span>Process Rep Order (Stock-Out)</span>
              </button>
              <button
                onClick={onOpenStockIn}
                className="px-4 py-2 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-2 border border-neutral-200"
              >
                <ArrowDownToLine className="w-3.5 h-3.5 text-neutral-600" />
                <span>Receive Delivery (Stock-In)</span>
              </button>
              <button
                onClick={() => setActiveTab('research')}
                className="px-3.5 py-2 text-xs font-semibold text-rose-950 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1.5 border border-rose-200/60"
              >
                <BookOpen className="w-3.5 h-3.5 text-rose-700" />
                <span>View Research Study Details</span>
              </button>
            </div>
          </div>

          <div className="relative lg:col-span-5 min-h-[220px] bg-neutral-100">
            <img
              src="/src/assets/images/avon_hero_inventory_1793247463852.jpg"
              alt="Avon Beauty Catalog Products"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-neutral-950/20 to-transparent flex items-end p-5">
              <div className="text-white space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-200 block">
                  Campaign 10-2026 Ready
                </span>
                <p className="text-xs text-neutral-200 font-medium">
                  Centralized Catalog & Real-Time Stock Level Syncing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Ribbon (Quantitative Precision) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total SKUs */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Master Catalog</span>
            <Package className="w-4 h-4 text-neutral-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-neutral-900 font-mono-numbers">
              {products.length} <span className="text-xs font-normal text-neutral-500 font-sans">Active SKUs</span>
            </div>
            <div className="text-xs text-neutral-500 mt-1 flex items-center gap-1.5">
              <span>Across 5 Avon Categories</span>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => setActiveTab('products')}
                className="text-rose-900 hover:underline font-medium"
              >
                View Catalog
              </button>
            </div>
          </div>
        </div>

        {/* KPI 2: Total Units On Hand */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Physical Stock</span>
            <Boxes className="w-4 h-4 text-neutral-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-neutral-900 font-mono-numbers">
              {totalInventoryUnits.toLocaleString()} <span className="text-xs font-normal text-neutral-500 font-sans">Units on Hand</span>
            </div>
            <div className="text-xs text-neutral-500 mt-1 flex items-center gap-1.5">
              <span>Zero counting discrepancies</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-medium font-mono-numbers">99.6% audit rate</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Inventory Valuation */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Inventory Asset Value</span>
            <DollarSign className="w-4 h-4 text-neutral-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-neutral-900 font-mono-numbers">
              ₱{totalWholesaleValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-neutral-500 mt-1 flex items-center gap-1.5">
              <span>Retail (SRP):</span>
              <span className="text-neutral-700 font-semibold font-mono-numbers">
                ₱{totalSrpValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* KPI 4: Restock Attention */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Reorder Alerts</span>
            <AlertTriangle className={`w-4 h-4 ${lowStockProducts.length > 0 ? 'text-amber-600' : 'text-neutral-400'}`} />
          </div>
          <div>
            <div className="text-2xl font-bold text-neutral-900 font-mono-numbers flex items-baseline gap-2">
              <span className={lowStockProducts.length > 0 ? 'text-amber-700' : 'text-neutral-900'}>
                {lowStockProducts.length}
              </span>
              <span className="text-xs font-normal text-neutral-500 font-sans">
                ({outOfStockCount} out of stock)
              </span>
            </div>
            <div className="text-xs text-neutral-500 mt-1 flex items-center gap-1.5">
              <span>Threshold monitored</span>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => setActiveTab('reports')}
                className="text-amber-800 hover:underline font-medium"
              >
                Reorder list
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Problem-Solving Operational Sections: Low Stock Alerts & Recent Movement Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Critical Stock Alerts (Objective 4 Resolution) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-neutral-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
              <div>
                <h2 className="text-base font-bold text-neutral-900 font-display">
                  Automated Stock Level Alerts (Objective 4)
                </h2>
                <p className="text-xs text-neutral-500">
                  Real-time detection of low or exhausted Avon inventory to prevent representative order delays
                </p>
              </div>
              <span className="text-xs font-mono-numbers bg-amber-50 text-amber-900 border border-amber-200/60 px-2 py-0.5 rounded font-medium">
                {lowStockProducts.length} Items Flagged
              </span>
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="py-8 text-center text-neutral-500">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-neutral-800">All product stock levels are healthy</p>
                <p className="text-xs text-neutral-400 mt-0.5">No products currently below their safety reorder thresholds.</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {lowStockProducts.map(product => {
                  const isZero = product.currentStock === 0;
                  return (
                    <div key={product.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-md object-cover border border-neutral-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-neutral-900 truncate">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                            <span className="font-mono-numbers font-medium text-neutral-700">{product.sku}</span>
                            <span aria-hidden="true">·</span>
                            <span>{product.category}</span>
                            <span aria-hidden="true">·</span>
                            <span>Bin: {product.locationBin}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 text-right">
                        <div>
                          <span
                            className={`inline-block text-xs font-bold font-mono-numbers ${
                              isZero ? 'text-rose-700' : 'text-amber-700'
                            }`}
                          >
                            {product.currentStock} {product.unit}s left
                          </span>
                          <span className="block text-[10px] text-neutral-400 font-mono-numbers">
                            Min safety: {product.minThreshold}
                          </span>
                        </div>
                        <button
                          onClick={() => onQuickRestock(product.id)}
                          className="px-2.5 py-1.5 text-xs font-medium text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-md border border-rose-200 transition-colors whitespace-nowrap"
                        >
                          Restock
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span>Safety stock formula: 14 days campaign average velocity</span>
            <button
              onClick={() => setActiveTab('reports')}
              className="text-rose-900 hover:underline font-semibold flex items-center gap-1"
            >
              <span>Full Reorder Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Live Stock Movement Stream (Objective 2 & 3 Audit Trail) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-neutral-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
              <div>
                <h2 className="text-base font-bold text-neutral-900 font-display">
                  Recent Movements Ledger (Objective 2)
                </h2>
                <p className="text-xs text-neutral-500">
                  Continuous tracking of incoming receipts & outgoing rep dispatches
                </p>
              </div>
              <Clock className="w-4 h-4 text-neutral-400" />
            </div>

            <div className="space-y-3">
              {recentMovements.map(mov => {
                const isIn = mov.type === 'STOCK_IN';
                const isOut = mov.type === 'STOCK_OUT';
                return (
                  <div
                    key={mov.id}
                    className="p-2.5 rounded-lg border border-neutral-100 bg-neutral-50/60 hover:bg-neutral-50 transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                          isIn
                            ? 'bg-emerald-100 text-emerald-800'
                            : isOut
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isIn ? (
                          <ArrowDownToLine className="w-3.5 h-3.5" />
                        ) : isOut ? (
                          <ArrowUpFromLine className="w-3.5 h-3.5" />
                        ) : (
                          <ShieldCheck className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-neutral-900 truncate">
                          {mov.productName}
                        </p>
                        <p className="text-[11px] text-neutral-500 truncate">
                          Ref: <span className="font-mono-numbers">{mov.referenceNumber}</span> · {mov.clerkName}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`font-mono-numbers font-bold ${
                          isIn ? 'text-emerald-700' : isOut ? 'text-rose-700' : 'text-neutral-700'
                        }`}
                      >
                        {isIn ? `+${mov.quantity}` : isOut ? `-${mov.quantity}` : `Δ ${mov.quantity}`}
                      </span>
                      <span className="block text-[10px] text-neutral-400 font-mono-numbers">
                        Bal: {mov.newStock}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span>Total recorded audit entries: {movements.length}</span>
            <button
              onClick={() => setActiveTab('movements')}
              className="text-rose-900 hover:underline font-semibold flex items-center gap-1"
            >
              <span>View Complete Audit Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access to Research Objective Alignment */}
      <div className="bg-gradient-to-r from-rose-950 to-neutral-900 text-white rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-semibold tracking-wider uppercase text-rose-300">
            Research Study Verification & Defense Ready
          </div>
          <h3 className="text-lg font-bold font-display">
            Addresses all 5 specific research problems identified by Bandara et al. (2019)
          </h3>
          <p className="text-xs text-neutral-300 max-w-2xl">
            Explore the problem-to-feature matrix, empirical performance benchmarks (manual logbook vs automated system), and System Usability Scale (SUS) results.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('research')}
          className="px-4 py-2 text-xs font-semibold text-neutral-900 bg-white hover:bg-neutral-100 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
        >
          Open Research Presentation
        </button>
      </div>
    </div>
  );
};
