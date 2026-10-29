import React from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  X,
  ArrowDownToLine,
  ArrowUpFromLine,
  PackagePlus,
  SlidersHorizontal,
  BookOpen
} from 'lucide-react';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (
    action: 'stock-in' | 'order' | 'add-product' | 'audit' | 'research'
  ) => void;
}

export const NewTransactionModal: React.FC<NewTransactionModalProps> = ({
  isOpen,
  onClose,
  onSelectAction
}) => {
  if (!isOpen) return null;

  const actions = [
    {
      id: 'order' as const,
      title: 'Process Representative Order (Stock-Out)',
      description: 'Fulfill Avon representative counter orders with instant margin calculations and automatic stock deduction.',
      icon: ArrowUpFromLine,
      color: 'bg-rose-50 text-rose-900 border-rose-200 hover:border-rose-300'
    },
    {
      id: 'stock-in' as const,
      title: 'Receive Incoming Delivery (Stock-In)',
      description: 'Log deliveries from Avon Central Logistics Hub to automatically update on-hand inventory levels.',
      icon: ArrowDownToLine,
      color: 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:border-neutral-300'
    },
    {
      id: 'add-product' as const,
      title: 'Add New Avon Product to Master List',
      description: 'Create a new catalog SKU with wholesale cost, retail SRP, category, and minimum stock threshold.',
      icon: PackagePlus,
      color: 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:border-neutral-300'
    },
    {
      id: 'audit' as const,
      title: 'Shelf Inventory Audit & Reconciliation',
      description: 'Record physical counting adjustments to eliminate discrepancies between shelf and database.',
      icon: SlidersHorizontal,
      color: 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:border-neutral-300'
    },
    {
      id: 'research' as const,
      title: 'View Research Study & Methodology',
      description: 'Review the research paper background, Bandara citation, 5 specific problems, and empirical benchmarks.',
      icon: BookOpen,
      color: 'bg-neutral-900 text-white border-neutral-800 hover:bg-neutral-800'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-neutral-200 max-w-lg w-full shadow-2xl p-6 space-y-4 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div>
            <h2 className="text-base font-bold text-neutral-900 font-display">
              Select Office Transaction
            </h2>
            <p className="text-neutral-500">
              Execute routine inventory operations or consult academic documentation
            </p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {actions.map(act => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={() => {
                  onSelectAction(act.id);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-lg border text-left transition-all flex items-start gap-3 ${act.color}`}
              >
                <div className="w-8 h-8 rounded-md bg-white/80 border border-neutral-200/50 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight mb-0.5">{act.title}</h4>
                  <p className="text-[11px] opacity-80 leading-relaxed">{act.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
