import React, { useState, useMemo } from 'react';
import { useInventory } from '../context/InventoryContext';
import { MovementType, StockMovement } from '../types';
import {
  Clock,
  ArrowDownToLine,
  ArrowUpFromLine,
  ShieldCheck,
  Search,
  Filter,
  Download,
  FileSpreadsheet
} from 'lucide-react';

export const MovementLedgerView: React.FC = () => {
  const { movements, products } = useInventory();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredMovements = useMemo(() => {
    return movements.filter(m => {
      if (filterType !== 'ALL' && m.type !== filterType) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          m.productName.toLowerCase().includes(q) ||
          m.productSku.toLowerCase().includes(q) ||
          m.referenceNumber.toLowerCase().includes(q) ||
          m.clerkName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [movements, filterType, searchQuery]);

  // Export to CSV function
  const exportLedgerToCSV = () => {
    const headers = [
      'Timestamp',
      'Movement Type',
      'SKU',
      'Product Name',
      'Quantity Delta',
      'Previous Balance',
      'New Balance',
      'Reference Number',
      'Authorized Clerk',
      'Notes'
    ];

    const rows = filteredMovements.map(m => [
      `"${m.timestamp}"`,
      `"${m.type}"`,
      `"${m.productSku}"`,
      `"${m.productName.replace(/"/g, '""')}"`,
      m.type === 'STOCK_OUT' ? -m.quantity : m.quantity,
      m.previousStock,
      m.newStock,
      `"${m.referenceNumber}"`,
      `"${m.clerkName}"`,
      `"${(m.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Avon_Stock_Movements_Ledger_${new Date().toISOString().split('T')[0]}.csv`
    );
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
            <span className="font-semibold uppercase tracking-wider">Research Objective 2 & 4</span>
            <span aria-hidden="true">·</span>
            <span>Traceable Stock Movement Audit Trail</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 font-display">
            Stock Movement & Transaction Ledger
          </h1>
          <p className="text-xs text-neutral-500">
            Immutable log recording every stock-in delivery, representative dispatch, and audit adjustment.
          </p>
        </div>

        <button
          onClick={exportLedgerToCSV}
          className="px-3.5 py-2 text-xs font-semibold text-neutral-800 bg-white hover:bg-neutral-50 rounded-lg transition-colors border border-neutral-200 flex items-center gap-2 shadow-xs whitespace-nowrap self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-neutral-500" />
          <span>Export Ledger (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by SKU, product name, reference #, or clerk..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-800"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg shrink-0 text-xs">
            {[
              { id: 'ALL', label: 'All Movements' },
              { id: 'STOCK_IN', label: 'Stock-In (Receipts)' },
              { id: 'STOCK_OUT', label: 'Stock-Out (Dispatches)' },
              { id: 'ADJUSTMENT', label: 'Adjustments' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                  filterType === tab.id
                    ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
          <span>
            Showing <strong className="font-mono-numbers text-neutral-800">{filteredMovements.length}</strong> recorded audit log entries
          </span>
          <span className="font-mono-numbers text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
            Audit Trail Active · 100% Traceability
          </span>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50 text-neutral-600 font-semibold uppercase text-[11px] border-b border-neutral-200">
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Product Name & SKU</th>
                <th className="py-3 px-3 text-center">Qty Change</th>
                <th className="py-3 px-3 text-center">Previous → New Stock</th>
                <th className="py-3 px-3">Reference / Doc #</th>
                <th className="py-3 px-3">Staff Clerk</th>
                <th className="py-3 px-4">Notes / Destination</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500">
                    <Clock className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                    <p className="font-medium text-neutral-700">No movement records match criteria</p>
                  </td>
                </tr>
              ) : (
                filteredMovements.map(m => {
                  const isIn = m.type === 'STOCK_IN';
                  const isOut = m.type === 'STOCK_OUT';
                  return (
                    <tr key={m.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono-numbers text-neutral-600 whitespace-nowrap">
                        {m.timestamp}
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded inline-flex items-center gap-1 ${
                            isIn
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                              : isOut
                              ? 'bg-rose-50 text-rose-800 border border-rose-200/60'
                              : 'bg-amber-50 text-amber-800 border border-amber-200/60'
                          }`}
                        >
                          {isIn ? '+' : isOut ? '-' : 'Δ'} {m.type.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-semibold text-neutral-900 block truncate max-w-xs">
                          {m.productName}
                        </span>
                        <span className="text-[11px] font-mono-numbers text-neutral-500">
                          {m.productSku}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center font-mono-numbers font-bold whitespace-nowrap">
                        <span
                          className={
                            isIn ? 'text-emerald-700' : isOut ? 'text-rose-700' : 'text-neutral-700'
                          }
                        >
                          {isIn ? `+${m.quantity}` : isOut ? `-${m.quantity}` : m.quantity}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center font-mono-numbers text-neutral-700 whitespace-nowrap">
                        <span className="text-neutral-400">{m.previousStock}</span>
                        <span className="mx-1 text-neutral-300">→</span>
                        <span className="font-bold text-neutral-900">{m.newStock}</span>
                      </td>

                      <td className="py-3 px-3 font-mono-numbers text-neutral-800 font-medium whitespace-nowrap">
                        {m.referenceNumber}
                      </td>

                      <td className="py-3 px-3 text-neutral-600 whitespace-nowrap">
                        {m.clerkName}
                      </td>

                      <td className="py-3 px-4 text-neutral-500 text-[11px] max-w-xs truncate">
                        {m.notes || '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
