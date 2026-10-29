import React, { useState, useMemo } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Product, ProductCategory } from '../types';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  SlidersHorizontal,
  Barcode,
  ArrowUpDown,
  Check,
  AlertTriangle,
  X
} from 'lucide-react';

interface CatalogViewProps {
  onOpenAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onAdjustStock: (product: Product) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  onOpenAddProduct,
  onEditProduct,
  onAdjustStock
}) => {
  const { products, deleteProduct } = useInventory();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStockFilter, setSelectedStockFilter] = useState<string>('All');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [barcodeFound, setBarcodeFound] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const categories: (ProductCategory | 'All')[] = [
    'All',
    'Fragrance',
    'Skincare',
    'Color Cosmetics',
    'Personal Care',
    'Fashion & Home'
  ];

  // Barcode / SKU quick lookup simulator
  const handleBarcodeLookup = (code: string) => {
    setBarcodeInput(code);
    const match = products.find(
      p => p.sku.toLowerCase() === code.trim().toLowerCase()
    );
    if (match) {
      setSearchQuery(match.sku);
      setBarcodeFound(`Found: ${match.name} (${match.currentStock} units on hand)`);
    } else {
      setBarcodeFound(`SKU "${code}" not found in current catalog.`);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }

      // Stock status filter
      if (selectedStockFilter === 'In Stock' && product.currentStock <= product.minThreshold) {
        return false;
      }
      if (selectedStockFilter === 'Low Stock' && (product.currentStock === 0 || product.currentStock > product.minThreshold)) {
        return false;
      }
      if (selectedStockFilter === 'Out of Stock' && product.currentStock > 0) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesSku = product.sku.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesLocation = product.locationBin.toLowerCase().includes(q);
        return matchesName || matchesSku || matchesDesc || matchesLocation;
      }

      return true;
    });
  }, [products, selectedCategory, selectedStockFilter, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Primary Objective Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-rose-900 mb-1">
            <span className="font-semibold uppercase tracking-wider">Research Objective 1</span>
            <span aria-hidden="true">·</span>
            <span>Centralized Master Product Database</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 font-display">
            Avon Product Master Catalog
          </h1>
          <p className="text-xs text-neutral-500">
            Unified repository for SKUs, wholesale representative costs, SRP pricing, and warehouse bin locations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAddProduct}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-rose-900 hover:bg-rose-800 rounded-lg transition-colors flex items-center gap-2 shadow-xs whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Avon Product</span>
          </button>
        </div>
      </div>

      {/* Barcode & Fast SKU Lookup Bar */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <Barcode className="w-4 h-4 text-neutral-500" />
            <span className="font-semibold text-neutral-800">Quick Barcode / SKU Scanner:</span>
            <span className="text-neutral-400 hidden sm:inline">Simulate physical handheld scanning at counter</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. AVN-FRG-001"
              value={barcodeInput}
              onChange={e => setBarcodeInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleBarcodeLookup(barcodeInput);
              }}
              className="px-3 py-1.5 text-xs border border-neutral-300 rounded-md font-mono-numbers focus:outline-none focus:ring-1 focus:ring-rose-800"
            />
            <button
              onClick={() => handleBarcodeLookup(barcodeInput)}
              className="px-3 py-1.5 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-md whitespace-nowrap"
            >
              Scan / Lookup
            </button>
          </div>
        </div>

        {/* Quick Sample Clickable Barcodes */}
        <div className="mt-2.5 pt-2 border-t border-neutral-100 flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
          <span>Quick scan samples:</span>
          {products.slice(0, 4).map(p => (
            <button
              key={p.id}
              onClick={() => handleBarcodeLookup(p.sku)}
              className="font-mono-numbers px-2 py-0.5 rounded bg-neutral-100 hover:bg-rose-50 hover:text-rose-900 text-neutral-700 border border-neutral-200 transition-colors"
            >
              {p.sku}
            </button>
          ))}
          {barcodeFound && (
            <span className="text-rose-900 font-medium ml-2">
              {barcodeFound}
            </span>
          )}
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by product name, SKU, category, or bin..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Stock Status Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg shrink-0">
            {['All', 'In Stock', 'Low Stock', 'Out of Stock'].map(status => (
              <button
                key={status}
                onClick={() => setSelectedStockFilter(status)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedStockFilter === status
                    ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-neutral-400 font-medium shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Category:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap text-xs ${
                selectedCategory === cat
                  ? 'bg-rose-900 text-white font-semibold'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="text-neutral-400 ml-auto shrink-0 font-mono-numbers">
            Showing {filteredProducts.length} of {products.length} products
          </span>
        </div>
      </div>

      {/* Centralized Master Catalog Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-600 uppercase text-[11px] font-semibold tracking-wider">
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-3">SKU</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-right">Rep Wholesale</th>
                <th className="py-3 px-3 text-right">SRP Price</th>
                <th className="py-3 px-3 text-right">Gross Margin</th>
                <th className="py-3 px-3 text-center">Stock on Hand</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Location Bin</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-neutral-500">
                    <Package className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                    <p className="font-medium text-neutral-700">No matching products found</p>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Try adjusting your search query or category filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => {
                  const isOutOfStock = product.currentStock === 0;
                  const isLowStock = product.currentStock > 0 && product.currentStock <= product.minThreshold;
                  const marginPercent = Math.round(((product.srp - product.wholesalePrice) / product.srp) * 100);

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-neutral-50/70 transition-colors group"
                    >
                      {/* Product Name & Visual */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded-md object-cover border border-neutral-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0 max-w-xs">
                            <span className="font-semibold text-neutral-900 block truncate">
                              {product.name}
                            </span>
                            <span className="text-[11px] text-neutral-500 block truncate">
                              {product.campaign} · {product.unit}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-3 font-mono-numbers font-medium text-neutral-800 whitespace-nowrap">
                        {product.sku}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3 text-neutral-600 whitespace-nowrap">
                        {product.category}
                      </td>

                      {/* Wholesale Cost */}
                      <td className="py-3 px-3 text-right font-mono-numbers font-medium text-neutral-900 whitespace-nowrap">
                        ₱{product.wholesalePrice.toFixed(2)}
                      </td>

                      {/* SRP */}
                      <td className="py-3 px-3 text-right font-mono-numbers font-semibold text-rose-950 whitespace-nowrap">
                        ₱{product.srp.toFixed(2)}
                      </td>

                      {/* Margin */}
                      <td className="py-3 px-3 text-right font-mono-numbers text-emerald-700 font-medium whitespace-nowrap">
                        {marginPercent}%
                      </td>

                      {/* Stock on Hand */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span
                          className={`font-mono-numbers font-bold ${
                            isOutOfStock
                              ? 'text-rose-700'
                              : isLowStock
                              ? 'text-amber-700'
                              : 'text-neutral-900'
                          }`}
                        >
                          {product.currentStock}
                        </span>
                        <span className="text-[10px] text-neutral-400 block font-mono-numbers">
                          min: {product.minThreshold}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {isOutOfStock ? (
                          <span className="text-xs font-semibold text-rose-700 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 inline-block" />
                            Out of Stock
                          </span>
                        ) : isLowStock ? (
                          <span className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                            In Stock
                          </span>
                        )}
                      </td>

                      {/* Location Bin */}
                      <td className="py-3 px-3 text-neutral-500 text-[11px] whitespace-nowrap">
                        {product.locationBin}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onAdjustStock(product)}
                            title="Adjust physical audit count"
                            className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEditProduct(product)}
                            title="Edit product details"
                            className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setProductToDelete(product)}
                            title="Delete product"
                            className="p-1.5 text-neutral-400 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-neutral-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-neutral-200 max-w-sm w-full p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="font-bold text-neutral-900 text-sm">Delete Avon Product</h3>
              <button
                onClick={() => setProductToDelete(null)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-neutral-600">
              Are you sure you want to remove <strong className="text-neutral-900">{productToDelete.name}</strong> ({productToDelete.sku}) from the master database?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-3 py-1.5 font-medium text-neutral-600 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteProduct(productToDelete.id);
                  setProductToDelete(null);
                }}
                className="px-3.5 py-1.5 font-semibold text-white bg-rose-900 hover:bg-rose-800 rounded-lg transition-colors"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
