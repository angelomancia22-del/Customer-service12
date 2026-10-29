import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { ProductCategory, Product } from '../types';
import {
  FileText,
  Printer,
  Download,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Boxes,
  CheckCircle2
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const {
    products,
    movements,
    orders,
    representatives,
    totalInventoryUnits,
    totalWholesaleValue,
    totalSrpValue,
    lowStockCount
  } = useInventory();

  const [activeReportTab, setActiveReportTab] = useState<
    'valuation' | 'reorder' | 'velocity' | 'representatives'
  >('valuation');

  // 1. Valuation Report by Category
  const categories: ProductCategory[] = [
    'Fragrance',
    'Skincare',
    'Color Cosmetics',
    'Personal Care',
    'Fashion & Home'
  ];

  const categoryValuation = categories.map(cat => {
    const catProducts = products.filter(p => p.category === cat);
    const units = catProducts.reduce((sum, p) => sum + p.currentStock, 0);
    const wholesaleVal = catProducts.reduce((sum, p) => sum + p.currentStock * p.wholesalePrice, 0);
    const srpVal = catProducts.reduce((sum, p) => sum + p.currentStock * p.srp, 0);
    const marginAvg = srpVal > 0 ? ((srpVal - wholesaleVal) / srpVal) * 100 : 0;

    return {
      category: cat,
      skuCount: catProducts.length,
      units,
      wholesaleVal,
      srpVal,
      marginAvg
    };
  });

  // 2. Reorder Recommendations
  const reorderList = products
    .filter(p => p.currentStock <= p.minThreshold)
    .map(p => {
      // Suggested order qty to reach safety max or 3x threshold
      const targetLevel = (p.maxCapacity || p.minThreshold * 4);
      const suggestedOrderQty = Math.max(10, targetLevel - p.currentStock);
      const estimatedCost = suggestedOrderQty * p.wholesalePrice;
      const urgency = p.currentStock === 0 ? 'CRITICAL - OUT OF STOCK' : 'HIGH - BELOW MIN';

      return {
        ...p,
        suggestedOrderQty,
        estimatedCost,
        urgency
      };
    });

  const totalProcurementBudget = reorderList.reduce((sum, item) => sum + item.estimatedCost, 0);
  const totalUnitsToOrder = reorderList.reduce((sum, item) => sum + item.suggestedOrderQty, 0);

  // 3. Fast-Moving & Turnover
  const velocityList = [...products].sort((a, b) => b.totalSold - a.totalSold);

  // 4. Representative Sales Performance
  const repPerformance = representatives.map(rep => {
    const repOrders = orders.filter(o => o.representativeId === rep.id);
    const totalPurchasedWholesale = repOrders.reduce((sum, o) => sum + o.totalWholesale, 0);
    const totalSrpRetail = repOrders.reduce((sum, o) => sum + o.totalSrp, 0);
    const totalCommission = repOrders.reduce((sum, o) => sum + o.repEarnings, 0);

    return {
      ...rep,
      orderCount: repOrders.length,
      totalPurchasedWholesale,
      totalSrpRetail,
      totalCommission
    };
  });

  // CSV Export for active report
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    let filename = '';

    if (activeReportTab === 'valuation') {
      filename = 'Avon_Inventory_Valuation_Report';
      headers = ['Category', 'Active SKUs', 'Units in Stock', 'Wholesale Cost (PHP)', 'Retail SRP (PHP)', 'Margin %'];
      rows = categoryValuation.map(c => [
        `"${c.category}"`,
        c.skuCount,
        c.units,
        c.wholesaleVal.toFixed(2),
        c.srpVal.toFixed(2),
        c.marginAvg.toFixed(1)
      ]);
    } else if (activeReportTab === 'reorder') {
      filename = 'Avon_Stock_Reorder_Recommendations';
      headers = ['SKU', 'Product Name', 'Category', 'Current Stock', 'Min Threshold', 'Suggested Order Qty', 'Unit Cost', 'Budget Needed', 'Urgency'];
      rows = reorderList.map(r => [
        `"${r.sku}"`,
        `"${r.name.replace(/"/g, '""')}"`,
        `"${r.category}"`,
        r.currentStock,
        r.minThreshold,
        r.suggestedOrderQty,
        r.wholesalePrice.toFixed(2),
        r.estimatedCost.toFixed(2),
        `"${r.urgency}"`
      ]);
    } else if (activeReportTab === 'velocity') {
      filename = 'Avon_Product_Sales_Velocity';
      headers = ['SKU', 'Product Name', 'Category', 'Total Units Sold', 'Current Stock', 'Wholesale Price', 'SRP'];
      rows = velocityList.map(v => [
        `"${v.sku}"`,
        `"${v.name.replace(/"/g, '""')}"`,
        `"${v.category}"`,
        v.totalSold,
        v.currentStock,
        v.wholesalePrice.toFixed(2),
        v.srp.toFixed(2)
      ]);
    } else {
      filename = 'Avon_Representative_Performance_Report';
      headers = ['Rep Code', 'Full Name', 'Tier', 'Orders Processed', 'Wholesale Volume (PHP)', 'Catalog SRP (PHP)', 'Rep Earnings (PHP)'];
      rows = repPerformance.map(rp => [
        `"${rp.repCode}"`,
        `"${rp.fullName}"`,
        `"${rp.tier}"`,
        rp.orderCount,
        rp.totalPurchasedWholesale.toFixed(2),
        rp.totalSrpRetail.toFixed(2),
        rp.totalCommission.toFixed(2)
      ]);
    }

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-rose-900 mb-1">
            <span className="font-semibold uppercase tracking-wider">Research Objective 5</span>
            <span aria-hidden="true">·</span>
            <span>Instant Organized Operational Reports</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 font-display">
            Avon Management Reports & Analytics
          </h1>
          <p className="text-xs text-neutral-500">
            Real-time generation of inventory valuations, reorder schedules, and representative sales metrics to empower office purchasing decisions.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-900 hover:bg-rose-800 rounded-lg flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Segmented Tabs */}
      <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg overflow-x-auto text-xs no-print">
        <button
          onClick={() => setActiveReportTab('valuation')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeReportTab === 'valuation'
              ? 'bg-white text-neutral-900 shadow-xs font-semibold'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Inventory Valuation</span>
        </button>

        <button
          onClick={() => setActiveReportTab('reorder')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeReportTab === 'reorder'
              ? 'bg-white text-neutral-900 shadow-xs font-semibold'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>Restock Recommendations ({reorderList.length})</span>
        </button>

        <button
          onClick={() => setActiveReportTab('velocity')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeReportTab === 'velocity'
              ? 'bg-white text-neutral-900 shadow-xs font-semibold'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Sales Velocity & Turnover</span>
        </button>

        <button
          onClick={() => setActiveReportTab('representatives')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeReportTab === 'representatives'
              ? 'bg-white text-neutral-900 shadow-xs font-semibold'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Representative Distribution</span>
        </button>
      </div>

      {/* Printable Report Header for Official Use */}
      <div className="hidden print-only text-center pb-4 border-b border-neutral-300">
        <h2 className="text-xl font-bold font-display uppercase tracking-widest text-neutral-900">
          AVON DISTRIBUTION MANAGEMENT REPORT
        </h2>
        <p className="text-xs text-neutral-600">
          Generated on {new Date().toLocaleDateString()} · Official Record of Avon Office Inventory
        </p>
      </div>

      {/* REPORT 1: Inventory Valuation */}
      {activeReportTab === 'valuation' && (
        <div className="space-y-6">
          {/* Executive Totals Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-neutral-200">
              <span className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">
                Total Physical Inventory
              </span>
              <span className="text-2xl font-bold text-neutral-900 font-mono-numbers">
                {totalInventoryUnits} Units
              </span>
              <span className="text-[11px] text-neutral-400 block mt-1">Across 5 Category Lines</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-neutral-200">
              <span className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">
                Office Wholesale Capital Asset
              </span>
              <span className="text-2xl font-bold text-neutral-900 font-mono-numbers">
                ₱{totalWholesaleValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-[11px] text-neutral-400 block mt-1">Acquisition Investment</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-neutral-200">
              <span className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">
                Total Catalog Retail Value (SRP)
              </span>
              <span className="text-2xl font-bold text-rose-950 font-mono-numbers">
                ₱{totalSrpValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-[11px] text-emerald-700 block mt-1 font-mono-numbers font-medium">
                ₱{(totalSrpValue - totalWholesaleValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} projected network margin
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-neutral-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                Category Inventory Valuation Breakdown
              </h3>
            </div>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 text-neutral-600 font-semibold uppercase text-[11px] border-b border-neutral-200">
                  <th className="py-3 px-4">Avon Category</th>
                  <th className="py-3 px-3 text-center">SKUs</th>
                  <th className="py-3 px-3 text-center">Units in Stock</th>
                  <th className="py-3 px-3 text-right">Wholesale Cost (₱)</th>
                  <th className="py-3 px-3 text-right">Retail SRP (₱)</th>
                  <th className="py-3 px-4 text-right">Average Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-mono-numbers">
                {categoryValuation.map(cat => (
                  <tr key={cat.category} className="hover:bg-neutral-50/50">
                    <td className="py-3 px-4 font-sans font-semibold text-neutral-900">
                      {cat.category}
                    </td>
                    <td className="py-3 px-3 text-center text-neutral-600">{cat.skuCount}</td>
                    <td className="py-3 px-3 text-center font-bold text-neutral-900">{cat.units}</td>
                    <td className="py-3 px-3 text-right">₱{cat.wholesaleVal.toFixed(2)}</td>
                    <td className="py-3 px-3 text-right text-neutral-700">₱{cat.srpVal.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-medium text-emerald-700">
                      {cat.marginAvg.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 2: Restock Recommendations */}
      {activeReportTab === 'reorder' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200/70 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Restock Procurement Summary (Objective 4 Resolution)</span>
              </div>
              <p className="text-amber-800">
                {reorderList.length} products require restocking to prevent representative fulfillment bottlenecks.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-neutral-500 block text-[11px]">Recommended Budget:</span>
              <span className="text-base font-bold text-amber-950 font-mono-numbers">
                ₱{totalProcurementBudget.toFixed(2)} ({totalUnitsToOrder} units)
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 text-neutral-600 font-semibold uppercase text-[11px] border-b border-neutral-200">
                  <th className="py-3 px-4">Product Name & SKU</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3 text-center">Current Stock</th>
                  <th className="py-3 px-3 text-center">Safety Min</th>
                  <th className="py-3 px-3 text-center font-bold text-rose-950">Suggested Reorder</th>
                  <th className="py-3 px-3 text-right">Unit Wholesale (₱)</th>
                  <th className="py-3 px-4 text-right">Procurement Total (₱)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {reorderList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-neutral-500">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                      All product inventories are currently above safety thresholds.
                    </td>
                  </tr>
                ) : (
                  reorderList.map(item => (
                    <tr key={item.id} className="hover:bg-neutral-50/50">
                      <td className="py-3 px-4">
                        <span className="font-semibold text-neutral-900 block">{item.name}</span>
                        <span className="text-[11px] font-mono-numbers text-neutral-500">{item.sku}</span>
                      </td>
                      <td className="py-3 px-3 text-neutral-600">{item.category}</td>
                      <td className="py-3 px-3 text-center font-mono-numbers font-bold text-rose-700">
                        {item.currentStock}
                      </td>
                      <td className="py-3 px-3 text-center font-mono-numbers text-neutral-500">
                        {item.minThreshold}
                      </td>
                      <td className="py-3 px-3 text-center font-mono-numbers font-bold text-neutral-900 bg-amber-50/50">
                        +{item.suggestedOrderQty} units
                      </td>
                      <td className="py-3 px-3 text-right font-mono-numbers text-neutral-700">
                        ₱{item.wholesalePrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono-numbers font-bold text-neutral-900">
                        ₱{item.estimatedCost.toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 3: Sales Velocity & Turnover */}
      {activeReportTab === 'velocity' && (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-neutral-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
              Product Movement & Sales Ranking
            </h3>
          </div>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50 text-neutral-600 font-semibold uppercase text-[11px] border-b border-neutral-200">
                <th className="py-3 px-4 w-12 text-center">Rank</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-center">Units Sold to Reps</th>
                <th className="py-3 px-3 text-center">Current Stock</th>
                <th className="py-3 px-3 text-right">Rep Wholesale (₱)</th>
                <th className="py-3 px-4 text-right">Gross Revenue Generated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-mono-numbers">
              {velocityList.map((prod, idx) => (
                <tr key={prod.id} className="hover:bg-neutral-50/50">
                  <td className="py-3 px-4 text-center font-bold text-neutral-500">{idx + 1}</td>
                  <td className="py-3 px-4 font-sans">
                    <span className="font-semibold text-neutral-900 block">{prod.name}</span>
                    <span className="text-[11px] font-mono-numbers text-neutral-500">{prod.sku}</span>
                  </td>
                  <td className="py-3 px-3 font-sans text-neutral-600">{prod.category}</td>
                  <td className="py-3 px-3 text-center font-bold text-neutral-900">{prod.totalSold}</td>
                  <td className="py-3 px-3 text-center text-neutral-600">{prod.currentStock}</td>
                  <td className="py-3 px-3 text-right">₱{prod.wholesalePrice.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-800">
                    ₱{(prod.totalSold * prod.srp).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* REPORT 4: Representative Performance */}
      {activeReportTab === 'representatives' && (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-neutral-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
              Representative Sales & Fulfillment Ledger
            </h3>
          </div>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50 text-neutral-600 font-semibold uppercase text-[11px] border-b border-neutral-200">
                <th className="py-3 px-4">Representative</th>
                <th className="py-3 px-3">Leadership Tier</th>
                <th className="py-3 px-3 text-center">Orders Placed</th>
                <th className="py-3 px-3 text-right">Wholesale Volume</th>
                <th className="py-3 px-3 text-right">Catalog SRP Value</th>
                <th className="py-3 px-4 text-right">Rep Commission Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-mono-numbers">
              {repPerformance.map(rep => (
                <tr key={rep.id} className="hover:bg-neutral-50/50">
                  <td className="py-3 px-4 font-sans">
                    <span className="font-semibold text-neutral-900 block">{rep.fullName}</span>
                    <span className="text-[11px] font-mono-numbers text-neutral-500">{rep.repCode}</span>
                  </td>
                  <td className="py-3 px-3 font-sans text-neutral-600">{rep.tier}</td>
                  <td className="py-3 px-3 text-center font-bold text-neutral-900">{rep.orderCount}</td>
                  <td className="py-3 px-3 text-right">₱{rep.totalPurchasedWholesale.toFixed(2)}</td>
                  <td className="py-3 px-3 text-right text-neutral-700">₱{rep.totalSrpRetail.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-800">
                    +₱{rep.totalCommission.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
