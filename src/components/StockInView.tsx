import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  ArrowDownToLine,
  Plus,
  Trash2,
  CheckCircle2,
  Boxes,
  Truck,
  Calendar,
  AlertCircle,
  FileCheck
} from 'lucide-react';

interface StockInViewProps {
  initialProductId?: string | null;
  onClearInitialProduct?: () => void;
}

export interface StockInRow {
  productId: string;
  quantity: number;
  cost: number;
  lotNumber: string;
  expiryDate: string;
}

export const StockInView: React.FC<StockInViewProps> = ({
  initialProductId,
  onClearInitialProduct
}) => {
  const { products, batches, recordStockIn, setActiveTab } = useInventory();

  const [batchNumber, setBatchNumber] = useState<string>(
    `DEL-HUB-2026-${Math.floor(100 + Math.random() * 900)}`
  );
  const [supplierHub, setSupplierHub] = useState<string>(
    'Avon Central Logistics Hub (National DC)'
  );
  const [receivedBy, setReceivedBy] = useState<string>('Office Inventory Clerk');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initialProd = initialProductId
    ? products.find(p => p.id === initialProductId)
    : products[0];

  const [items, setItems] = useState<StockInRow[]>([
    {
      productId: initialProd?.id || products[0]?.id || '',
      quantity: 25,
      cost: initialProd?.wholesalePrice || 350,
      lotNumber: `LOT-2026-B${Math.floor(100 + Math.random() * 900)}`,
      expiryDate: '2029-06-30'
    }
  ]);

  const handleAddItemRow = () => {
    const defaultProduct = products[0];
    setItems(prev => [
      ...prev,
      {
        productId: defaultProduct?.id || '',
        quantity: 20,
        cost: defaultProduct?.wholesalePrice || 300,
        lotNumber: `LOT-2026-B${Math.floor(100 + Math.random() * 900)}`,
        expiryDate: '2029-06-30'
      }
    ]);
  };

  const handleRemoveRow = (index: number) => {
    if (items.length === 1) return;
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof StockInRow, value: any) => {
    setItems(prev => {
      const copy = [...prev];
      const target = { ...copy[index], [field]: value };

      // If product changed, update default cost
      if (field === 'productId') {
        const prod = products.find(p => p.id === value);
        if (prod) {
          target.cost = prod.wholesalePrice;
        }
      }

      copy[index] = target;
      return copy;
    });
  };

  const totalUnits = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const totalCost = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.cost) || 0),
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0 || totalUnits <= 0) {
      setErrorMessage('Please include at least one valid product line with quantity > 0');
      return;
    }
    setErrorMessage(null);

    recordStockIn({
      batchNumber,
      supplierHub,
      receivedBy,
      items: items.map(item => ({
        productId: item.productId,
        quantityReceived: Number(item.quantity),
        costPerUnit: Number(item.cost),
        lotNumber: item.lotNumber,
        expiryDate: item.expiryDate
      }))
    });

    setSuccessMessage(
      `Delivery ${batchNumber} successfully recorded! Inventory balances increased by ${totalUnits} units.`
    );

    // Reset form with new batch ID
    setBatchNumber(`DEL-HUB-2026-${Math.floor(100 + Math.random() * 900)}`);
    setItems([
      {
        productId: products[0]?.id || '',
        quantity: 20,
        cost: products[0]?.wholesalePrice || 300,
        lotNumber: `LOT-2026-B${Math.floor(100 + Math.random() * 900)}`,
        expiryDate: '2029-06-30'
      }
    ]);

    if (onClearInitialProduct) onClearInitialProduct();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header with Objective mapping */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-rose-900 mb-1">
            <span className="font-semibold uppercase tracking-wider">Research Objectives 2 & 3</span>
            <span aria-hidden="true">·</span>
            <span>Automated Stock-In Receiving</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 font-display">
            Incoming Stock Delivery Entry
          </h1>
          <p className="text-xs text-neutral-500">
            Log shipments from Avon Regional Logistics to instantly recalculate on-hand inventory and maintain an immutable ledger.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('movements')}
          className="px-3.5 py-2 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 rounded-lg transition-colors border border-neutral-200 flex items-center gap-2 self-start sm:self-auto"
        >
          <Boxes className="w-3.5 h-3.5 text-neutral-500" />
          <span>View Movement Ledger</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-rose-900">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-700 hover:text-rose-900 font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Stock-In Entry Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-neutral-100">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Delivery / PO Reference #
            </label>
            <input
              type="text"
              required
              value={batchNumber}
              onChange={e => setBatchNumber(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg font-mono-numbers focus:outline-none focus:ring-1 focus:ring-rose-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Source Hub / Supplier
            </label>
            <input
              type="text"
              required
              value={supplierHub}
              onChange={e => setSupplierHub(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Receiving Clerk / Staff
            </label>
            <input
              type="text"
              required
              value={receivedBy}
              onChange={e => setReceivedBy(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-800"
            />
          </div>
        </div>

        {/* Line Items Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
              Shipment Line Items
            </h3>
            <button
              type="button"
              onClick={handleAddItemRow}
              className="px-3 py-1.5 text-xs font-semibold text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-md border border-rose-200 flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Line Item</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-neutral-200 rounded-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold uppercase text-[11px]">
                  <th className="py-2.5 px-3">Product Name & Current Stock</th>
                  <th className="py-2.5 px-3 w-28 text-center">Qty Received</th>
                  <th className="py-2.5 px-3 w-32 text-right">Unit Wholesale (₱)</th>
                  <th className="py-2.5 px-3 w-32">Lot / Batch Code</th>
                  <th className="py-2.5 px-3 w-32">Expiry Date</th>
                  <th className="py-2.5 px-3 w-28 text-right">Subtotal</th>
                  <th className="py-2.5 px-2 w-12 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {items.map((row, index) => {
                  const targetProd = products.find(p => p.id === row.productId);
                  const subtotal = (Number(row.quantity) || 0) * (Number(row.cost) || 0);

                  return (
                    <tr key={index} className="hover:bg-neutral-50/50">
                      {/* Product Selector */}
                      <td className="py-2 px-3">
                        <select
                          value={row.productId}
                          onChange={e => handleItemChange(index, 'productId', e.target.value)}
                          className="w-full px-2 py-1.5 text-xs border border-neutral-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-rose-800"
                        >
                          {products.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.sku} - {p.name} (Stock: {p.currentStock})
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Quantity */}
                      <td className="py-2 px-3 text-center">
                        <input
                          type="number"
                          min="1"
                          required
                          value={row.quantity}
                          onChange={e => handleItemChange(index, 'quantity', Math.max(1, parseInt(e.target.value) || 0))}
                          className="w-20 px-2 py-1.5 text-xs border border-neutral-200 rounded-md text-center font-mono-numbers focus:outline-none focus:ring-1 focus:ring-rose-800"
                        />
                      </td>

                      {/* Unit Cost */}
                      <td className="py-2 px-3 text-right">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          value={row.cost}
                          onChange={e => handleItemChange(index, 'cost', parseFloat(e.target.value) || 0)}
                          className="w-24 px-2 py-1.5 text-xs border border-neutral-200 rounded-md text-right font-mono-numbers focus:outline-none focus:ring-1 focus:ring-rose-800"
                        />
                      </td>

                      {/* Lot / Batch Code */}
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          required
                          value={row.lotNumber}
                          onChange={e => handleItemChange(index, 'lotNumber', e.target.value)}
                          className="w-full px-2 py-1.5 text-xs border border-neutral-200 rounded-md font-mono-numbers focus:outline-none focus:ring-1 focus:ring-rose-800"
                        />
                      </td>

                      {/* Expiry */}
                      <td className="py-2 px-3">
                        <input
                          type="date"
                          value={row.expiryDate}
                          onChange={e => handleItemChange(index, 'expiryDate', e.target.value)}
                          className="w-full px-2 py-1.5 text-xs border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-800"
                        />
                      </td>

                      {/* Subtotal */}
                      <td className="py-2 px-3 text-right font-mono-numbers font-semibold text-neutral-900">
                        ₱{subtotal.toFixed(2)}
                      </td>

                      {/* Delete Row */}
                      <td className="py-2 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(index)}
                          disabled={items.length === 1}
                          className="p-1 text-neutral-400 hover:text-rose-700 disabled:opacity-30 disabled:hover:text-neutral-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Ribbon & Action */}
        <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs">
            <div>
              <span className="text-neutral-500 block">Total Units to Receive:</span>
              <span className="text-base font-bold text-neutral-900 font-mono-numbers">
                {totalUnits} Units
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block">Total Shipment Cost:</span>
              <span className="text-base font-bold text-neutral-900 font-mono-numbers">
                ₱{totalCost.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-semibold text-white bg-rose-900 hover:bg-rose-800 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <FileCheck className="w-4 h-4" />
            <span>Verify & Post Stock-In to Inventory</span>
          </button>
        </div>
      </form>

      {/* Historical Stock-In Batches Log */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 font-display">
              Verified Incoming Shipments History
            </h3>
            <p className="text-xs text-neutral-500">
              Audit log of previous delivery batches posted to the office database
            </p>
          </div>
          <Truck className="w-4 h-4 text-neutral-400" />
        </div>

        <div className="divide-y divide-neutral-100">
          {batches.map(batch => (
            <div key={batch.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-900 font-mono-numbers">
                    {batch.batchNumber}
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                    {batch.status}
                  </span>
                </div>
                <p className="text-neutral-500">
                  {batch.supplierHub} · Received by <span className="text-neutral-800 font-medium">{batch.receivedBy}</span> on {batch.receivedDate}
                </p>
                <div className="text-[11px] text-neutral-600">
                  Items: {batch.items.map(i => `${i.productName} (x${i.quantityReceived})`).join(', ')}
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <span className="font-bold text-neutral-900 font-mono-numbers text-sm block">
                  ₱{batch.totalCost.toFixed(2)}
                </span>
                <span className="text-neutral-400 font-mono-numbers text-[11px]">
                  {batch.totalUnits} Units Total
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
