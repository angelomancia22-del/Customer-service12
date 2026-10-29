import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Product } from '../types';
import { X, SlidersHorizontal, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AdjustStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const AdjustStockModal: React.FC<AdjustStockModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const { adjustStockDirect } = useInventory();
  const [newStock, setNewStock] = useState<number>(0);
  const [reason, setReason] = useState<string>('Physical count shelf audit');
  const [clerk, setClerk] = useState<string>('Supervisor / Auditor');

  useEffect(() => {
    if (product) {
      setNewStock(product.currentStock);
      setReason('Physical count shelf audit');
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const currentStock = product.currentStock;
  const delta = newStock - currentStock;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adjustStockDirect(product.id, Number(newStock), reason, clerk);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-neutral-200 max-w-md w-full shadow-2xl p-6 space-y-5 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div>
            <h2 className="text-base font-bold text-neutral-900 font-display">
              Physical Stock Audit Adjustment
            </h2>
            <p className="text-neutral-500">
              Reconcile system inventory with physical shelf counting (Research Problem 2)
            </p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center gap-3">
            <img
              src={product.image}
              alt={product.name}
              className="w-12 h-12 rounded object-cover border border-neutral-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <h4 className="font-semibold text-neutral-900">{product.name}</h4>
              <p className="text-[11px] font-mono-numbers text-neutral-500">
                SKU: {product.sku} · Location: {product.locationBin}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-500 mb-1">
                System Current Stock
              </label>
              <div className="px-3 py-2 bg-neutral-100 rounded-lg text-neutral-800 font-mono-numbers font-bold text-sm">
                {currentStock} {product.unit}s
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Actual Counted Stock
              </label>
              <input
                type="number"
                min="0"
                required
                value={newStock}
                onChange={e => setNewStock(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-neutral-900 font-mono-numbers font-bold text-sm focus:outline-none focus:ring-1 focus:ring-rose-800"
              />
            </div>
          </div>

          <div className="p-3 rounded-lg border flex items-center justify-between font-mono-numbers text-xs">
            <span className="text-neutral-600">Inventory Discrepancy:</span>
            <span
              className={`font-bold ${
                delta > 0
                  ? 'text-emerald-700'
                  : delta < 0
                  ? 'text-rose-700'
                  : 'text-neutral-700'
              }`}
            >
              {delta > 0 ? `+${delta} surplus` : delta < 0 ? `${delta} shortage` : '0 (Exact Match)'}
            </span>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Audit Reason / Discrepancy Justification
            </label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-rose-800"
            >
              <option value="Physical count shelf audit">Regular Monthly Shelf Audit Count</option>
              <option value="Found unrecorded units from previous shift">Found Unrecorded Units from Previous Shift</option>
              <option value="Damaged/broken tester write-off">Damaged / Broken Tester Packaging Write-Off</option>
              <option value="Expired batch removal">Expired Batch Removal & Quarantine</option>
              <option value="Sample tester distribution">Representative Display Tester Allocation</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Authorized Auditor / Staff Name
            </label>
            <input
              type="text"
              required
              value={clerk}
              onChange={e => setClerk(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-800"
            />
          </div>

          <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium text-neutral-600 hover:text-neutral-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-rose-900 hover:bg-rose-800 rounded-lg transition-colors"
            >
              Post Audit Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
