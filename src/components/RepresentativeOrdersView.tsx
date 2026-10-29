import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { RepresentativeOrder, Product, Representative } from '../types';
import {
  ArrowUpFromLine,
  Plus,
  Printer,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  DollarSign,
  Package,
  FileText,
  Clock,
  Trash2,
  X
} from 'lucide-react';

interface OrderLineInput {
  productId: string;
  quantity: number;
}

export const RepresentativeOrdersView: React.FC<{
  onOpenNewOrderModal?: () => void;
}> = () => {
  const {
    products,
    representatives,
    orders,
    createRepresentativeOrder,
    dispatchOrder
  } = useInventory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRepId, setSelectedRepId] = useState<string>(representatives[0]?.id || '');
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Credit' | 'Partial'>('Paid');
  const [orderNotes, setOrderNotes] = useState('');
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [viewingSlipOrder, setViewingSlipOrder] = useState<RepresentativeOrder | null>(null);

  const [orderLines, setOrderLines] = useState<OrderLineInput[]>([
    {
      productId: products.find(p => p.currentStock > 0)?.id || products[0]?.id || '',
      quantity: 2
    }
  ]);

  const handleAddLine = () => {
    const available = products.find(
      p => p.currentStock > 0 && !orderLines.some(l => l.productId === p.id)
    );
    setOrderLines(prev => [
      ...prev,
      {
        productId: available ? available.id : products[0]?.id || '',
        quantity: 1
      }
    ]);
  };

  const handleRemoveLine = (index: number) => {
    if (orderLines.length === 1) return;
    setOrderLines(prev => prev.filter((_, i) => i !== index));
  };

  const handleLineChange = (index: number, field: keyof OrderLineInput, val: any) => {
    setOrderLines(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  // Calculations
  const selectedRep = representatives.find(r => r.id === selectedRepId);

  let currentWholesaleSum = 0;
  let currentSrpSum = 0;
  let hasStockError = false;
  let stockErrorMessage = '';

  orderLines.forEach(line => {
    const prod = products.find(p => p.id === line.productId);
    if (prod) {
      currentWholesaleSum += prod.wholesalePrice * line.quantity;
      currentSrpSum += prod.srp * line.quantity;
      if (line.quantity > prod.currentStock) {
        hasStockError = true;
        stockErrorMessage = `Quantity for "${prod.name}" exceeds current available stock (${prod.currentStock} units on hand).`;
      }
    }
  });

  const repProfit = currentSrpSum - currentWholesaleSum;

  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasStockError) {
      return;
    }

    try {
      const createdOrder = createRepresentativeOrder({
        representativeId: selectedRepId,
        items: orderLines.map(l => ({
          productId: l.productId,
          quantity: Number(l.quantity)
        })),
        paymentStatus,
        notes: orderNotes,
        autoDispatch
      });

      setIsModalOpen(false);
      // Reset form
      setOrderLines([
        {
          productId: products.find(p => p.currentStock > 0)?.id || products[0]?.id || '',
          quantity: 2
        }
      ]);
      setOrderNotes('');

      // Auto-open dispatch slip directly with the created order
      if (createdOrder) {
        setViewingSlipOrder(createdOrder);
      }
    } catch (err: any) {
      console.error('Error creating order', err);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-rose-900 mb-1">
            <span className="font-semibold uppercase tracking-wider">Research Objectives 2 & 3</span>
            <span aria-hidden="true">·</span>
            <span>Outgoing Representative Order Dispatch</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 font-display">
            Avon Representative Orders & Dispatch
          </h1>
          <p className="text-xs text-neutral-500">
            Process representative campaign orders, calculate wholesale vs retail margin, and auto-deduct stock upon release.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-rose-900 hover:bg-rose-800 rounded-lg transition-colors flex items-center gap-2 shadow-xs whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Rep Order / Dispatch</span>
        </button>
      </div>

      {/* Orders List Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-neutral-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
              Representative Order Records ({orders.length})
            </h2>
          </div>
          <span className="text-xs text-neutral-400 font-mono-numbers">
            Auto-deducted upon dispatch
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50 text-neutral-600 font-semibold uppercase text-[11px] border-b border-neutral-200">
                <th className="py-3 px-4">Order # & Date</th>
                <th className="py-3 px-3">Representative</th>
                <th className="py-3 px-3">Items Summary</th>
                <th className="py-3 px-3 text-right">Office Wholesale (₱)</th>
                <th className="py-3 px-3 text-right">Catalog SRP (₱)</th>
                <th className="py-3 px-3 text-right">Rep Commission (₱)</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Dispatch Slip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-neutral-500">
                    No representative orders recorded yet.
                  </td>
                </tr>
              ) : (
                orders.map(order => {
                  const isDispatched = order.status === 'Dispatched' || order.status === 'Completed';

                  return (
                    <tr key={order.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-neutral-900 font-mono-numbers block">
                          {order.orderNumber}
                        </span>
                        <span className="text-[11px] text-neutral-500 font-mono-numbers">
                          {order.date}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-semibold text-neutral-900 block">
                          {order.representativeName}
                        </span>
                        <span className="text-[11px] text-neutral-500 font-mono-numbers">
                          {order.representativeCode}
                        </span>
                      </td>

                      <td className="py-3 px-3 max-w-xs">
                        <p className="text-[11px] text-neutral-600 truncate">
                          {order.items
                            .map(item => `${item.productName} (x${item.quantity})`)
                            .join(', ')}
                        </p>
                        <span className="text-[10px] text-neutral-400 font-mono-numbers">
                          {order.items.reduce((s, i) => s + i.quantity, 0)} total units
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right font-mono-numbers font-medium text-neutral-900 whitespace-nowrap">
                        ₱{order.totalWholesale.toFixed(2)}
                      </td>

                      <td className="py-3 px-3 text-right font-mono-numbers text-neutral-600 whitespace-nowrap">
                        ₱{order.totalSrp.toFixed(2)}
                      </td>

                      <td className="py-3 px-3 text-right font-mono-numbers font-semibold text-emerald-700 whitespace-nowrap">
                        +₱{order.repEarnings.toFixed(2)}
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                            order.paymentStatus === 'Paid'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                              : 'bg-amber-50 text-amber-800 border border-amber-200/60'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        {isDispatched ? (
                          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Dispatched
                          </span>
                        ) : (
                          <button
                            onClick={() => dispatchOrder(order.id)}
                            className="px-2.5 py-1 text-xs font-semibold text-white bg-rose-900 hover:bg-rose-800 rounded transition-colors"
                          >
                            Dispatch Now
                          </button>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setViewingSlipOrder(order)}
                          className="px-2.5 py-1 text-xs font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded border border-neutral-200 transition-colors inline-flex items-center gap-1.5"
                        >
                          <Printer className="w-3 h-3 text-neutral-500" />
                          <span>Receipt Slip</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-neutral-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h2 className="text-base font-bold text-neutral-900 font-display">
                  Create Avon Representative Order
                </h2>
                <p className="text-xs text-neutral-500">
                  Instant stock deduction & earnings calculation for counter pickup
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrderSubmit} className="space-y-5 text-xs">
              {/* Rep selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Select Representative
                  </label>
                  <select
                    value={selectedRepId}
                    onChange={e => setSelectedRepId(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-rose-800"
                  >
                    {representatives.map(rep => (
                      <option key={rep.id} value={rep.id}>
                        {rep.fullName} ({rep.repCode}) - {rep.tier}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Payment Method / Status
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={e => setPaymentStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-rose-800"
                  >
                    <option value="Paid">Paid in Cash / GCash / Card</option>
                    <option value="Credit">Rep Credit Account (Charge to Term)</option>
                    <option value="Partial">Partial Deposit</option>
                  </select>
                </div>
              </div>

              {/* Order Lines */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-neutral-700 text-[11px]">
                    Products in Order
                  </span>
                  <button
                    type="button"
                    onClick={handleAddLine}
                    className="px-2.5 py-1 text-xs font-semibold text-rose-900 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Item</span>
                  </button>
                </div>

                {orderLines.map((line, idx) => {
                  const targetProd = products.find(p => p.id === line.productId);
                  const isStockInsufficient = targetProd && line.quantity > targetProd.currentStock;

                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
                    >
                      <div className="flex-1">
                        <label className="block text-[11px] text-neutral-500 mb-1">
                          Product ({targetProd ? `${targetProd.currentStock} in stock` : ''})
                        </label>
                        <select
                          value={line.productId}
                          onChange={e => handleLineChange(idx, 'productId', e.target.value)}
                          className="w-full px-2 py-1.5 border border-neutral-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-rose-800"
                        >
                          {products.map(p => (
                            <option key={p.id} value={p.id} disabled={p.currentStock === 0}>
                              {p.name} ({p.sku}) {p.currentStock === 0 ? '- [OUT OF STOCK]' : `[${p.currentStock} left]`}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="w-24">
                        <label className="block text-[11px] text-neutral-500 mb-1">Qty</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={line.quantity}
                          onChange={e => handleLineChange(idx, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                          className={`w-full px-2 py-1.5 border rounded text-center font-mono-numbers focus:outline-none ${
                            isStockInsufficient
                              ? 'border-rose-500 bg-rose-50 text-rose-900'
                              : 'border-neutral-200 bg-white'
                          }`}
                        />
                      </div>

                      <div className="w-28 text-right sm:pt-4 font-mono-numbers">
                        <span className="text-[10px] text-neutral-400 block">Wholesale:</span>
                        <span className="font-semibold text-neutral-900">
                          ₱{((targetProd?.wholesalePrice || 0) * line.quantity).toFixed(2)}
                        </span>
                      </div>

                      <div className="sm:pt-4">
                        <button
                          type="button"
                          onClick={() => handleRemoveLine(idx)}
                          disabled={orderLines.length === 1}
                          className="p-1.5 text-neutral-400 hover:text-rose-700 disabled:opacity-30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {hasStockError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{stockErrorMessage}</span>
                </div>
              )}

              {/* Pricing Totals Box */}
              <div className="p-4 bg-neutral-100 rounded-lg space-y-2 font-mono-numbers">
                <div className="flex justify-between text-neutral-600">
                  <span>Customer Catalog Value (SRP):</span>
                  <span>₱{currentSrpSum.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-800 font-semibold">
                  <span>Representative Wholesale Payable:</span>
                  <span>₱{currentWholesaleSum.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-800 font-bold border-t border-neutral-200 pt-1.5 text-sm">
                  <span>Representative Direct Profit:</span>
                  <span>+₱{repProfit.toFixed(2)}</span>
                </div>
              </div>

              {/* Instant Dispatch Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoDispatch"
                  checked={autoDispatch}
                  onChange={e => setAutoDispatch(e.target.checked)}
                  className="rounded border-neutral-300 text-rose-900 focus:ring-rose-800"
                />
                <label htmlFor="autoDispatch" className="text-xs text-neutral-700 cursor-pointer">
                  <strong className="text-neutral-900">Immediate Counter Release:</strong> Deduct physical stock from inventory database right now
                </label>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-medium text-neutral-600 hover:text-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={hasStockError}
                  className="px-5 py-2 font-semibold text-white bg-rose-900 hover:bg-rose-800 rounded-lg disabled:opacity-50"
                >
                  Confirm & Release Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt / Dispatch Slip View */}
      {viewingSlipOrder && (
        <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-neutral-200 max-w-xl w-full p-6 shadow-2xl space-y-5 text-neutral-900">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 no-print">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                Official Order & Dispatch Voucher
              </span>
              <button
                onClick={() => setViewingSlipOrder(null)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Slip Content */}
            <div className="space-y-4 print-only font-sans">
              <div className="text-center pb-3 border-b border-neutral-200">
                <h2 className="text-lg font-bold font-display uppercase tracking-widest text-neutral-900">
                  AVON DISTRIBUTION OFFICE
                </h2>
                <p className="text-[11px] text-neutral-500">
                  Local Direct Selling Inventory & Logistics Center
                </p>
                <div className="mt-2 text-xs font-mono-numbers font-semibold">
                  ORDER SLIP: {viewingSlipOrder.orderNumber}
                </div>
              </div>

              <div className="grid grid-cols-2 text-xs py-2 gap-2 border-b border-neutral-100">
                <div>
                  <span className="text-neutral-500 block">Representative:</span>
                  <span className="font-bold">{viewingSlipOrder.representativeName}</span>
                  <span className="block text-neutral-500 font-mono-numbers">
                    Code: {viewingSlipOrder.representativeCode}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-neutral-500 block">Date & Status:</span>
                  <span className="font-semibold">{viewingSlipOrder.date}</span>
                  <span className="block text-emerald-700 font-bold">
                    {viewingSlipOrder.status} ({viewingSlipOrder.paymentStatus})
                  </span>
                </div>
              </div>

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500 uppercase text-[10px]">
                    <th className="py-2">Item Description</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Wholesale</th>
                    <th className="py-2 text-right">SRP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-mono-numbers">
                  {viewingSlipOrder.items.map((it, i) => (
                    <tr key={i}>
                      <td className="py-2 pr-2">
                        <span className="font-sans font-medium text-neutral-900 block">{it.productName}</span>
                        <span className="text-[10px] text-neutral-400 font-sans">{it.sku}</span>
                      </td>
                      <td className="py-2 text-center font-bold">{it.quantity}</td>
                      <td className="py-2 text-right">₱{it.subtotalWholesale.toFixed(2)}</td>
                      <td className="py-2 text-right">₱{it.subtotalSrp.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t border-neutral-200 pt-3 space-y-1 text-xs font-mono-numbers">
                <div className="flex justify-between text-neutral-600">
                  <span>Total SRP Catalog Value:</span>
                  <span>₱{viewingSlipOrder.totalSrp.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-neutral-900 text-sm">
                  <span>Representative Net Amount Due:</span>
                  <span>₱{viewingSlipOrder.totalWholesale.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-800 font-semibold">
                  <span>Your Projected Earnings:</span>
                  <span>₱{viewingSlipOrder.repEarnings.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-6 grid grid-cols-2 gap-8 text-[11px] text-neutral-500 border-t border-neutral-200">
                <div className="border-t border-neutral-300 pt-1 text-center">
                  Released by: {viewingSlipOrder.processedBy}
                </div>
                <div className="border-t border-neutral-300 pt-1 text-center">
                  Received by: {viewingSlipOrder.representativeName}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 no-print">
              <button
                onClick={() => setViewingSlipOrder(null)}
                className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-900 hover:bg-rose-800 rounded-lg flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
