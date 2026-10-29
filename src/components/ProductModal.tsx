import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Product, ProductCategory } from '../types';
import { X, Package, Image as ImageIcon } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  productToEdit
}) => {
  const { addProduct, updateProduct } = useInventory();

  const isEditing = !!productToEdit;

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Fragrance');
  const [campaign, setCampaign] = useState('Campaign 10-2026');
  const [description, setDescription] = useState('');
  const [wholesalePrice, setWholesalePrice] = useState(300);
  const [srp, setSrp] = useState(499);
  const [currentStock, setCurrentStock] = useState(25);
  const [minThreshold, setMinThreshold] = useState(15);
  const [locationBin, setLocationBin] = useState('Aisle 1 - Bay A1');
  const [unit, setUnit] = useState('Bottle');
  const [image, setImage] = useState(
    '/src/assets/images/avon_fragrance_flacon_1793247464878.jpg'
  );

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setSku(productToEdit.sku);
      setCategory(productToEdit.category);
      setCampaign(productToEdit.campaign);
      setDescription(productToEdit.description);
      setWholesalePrice(productToEdit.wholesalePrice);
      setSrp(productToEdit.srp);
      setCurrentStock(productToEdit.currentStock);
      setMinThreshold(productToEdit.minThreshold);
      setLocationBin(productToEdit.locationBin);
      setUnit(productToEdit.unit);
      setImage(productToEdit.image);
    } else {
      // Defaults for new product
      setName('');
      setSku(`AVN-${Math.floor(100 + Math.random() * 900)}`);
      setCategory('Fragrance');
      setCampaign('Campaign 10-2026');
      setDescription('');
      setWholesalePrice(320);
      setSrp(499);
      setCurrentStock(30);
      setMinThreshold(15);
      setLocationBin('Aisle 1 - Bay B1');
      setUnit('Bottle');
      setImage('/src/assets/images/avon_fragrance_flacon_1793247464878.jpg');
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const sampleImages = [
    { label: 'Fragrance Flacon', url: '/src/assets/images/avon_fragrance_flacon_1793247464878.jpg' },
    { label: 'Skincare Serum', url: '/src/assets/images/avon_skincare_serum_1793247465858.jpg' },
    { label: 'Lipstick & Compact', url: '/src/assets/images/avon_cosmetics_palette_1793247465550.jpg' },
    { label: 'Hero Collection', url: '/src/assets/images/avon_hero_inventory_1793247463852.jpg' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && productToEdit) {
      updateProduct(productToEdit.id, {
        name,
        sku,
        category,
        campaign,
        description,
        wholesalePrice: Number(wholesalePrice),
        srp: Number(srp),
        minThreshold: Number(minThreshold),
        locationBin,
        unit,
        image
      });
    } else {
      addProduct({
        name,
        sku,
        category,
        campaign,
        description,
        wholesalePrice: Number(wholesalePrice),
        srp: Number(srp),
        currentStock: Number(currentStock),
        minThreshold: Number(minThreshold),
        locationBin,
        unit,
        image
      });
    }

    onClose();
  };

  const calculatedMargin =
    srp > 0 ? Math.round(((srp - wholesalePrice) / srp) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-neutral-200 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div>
            <h2 className="text-base font-bold text-neutral-900 font-display">
              {isEditing ? 'Edit Avon Product Details' : 'Add New Avon Product to Master Database'}
            </h2>
            <p className="text-neutral-500">
              {isEditing
                ? 'Update specifications, pricing or bin location'
                : 'Centralize catalog record to synchronize pricing and stock tracking'}
            </p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-neutral-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rare Pearls Eau de Parfum (50ml)"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Avon SKU / Code
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={e => setSku(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg font-mono-numbers focus:outline-none focus:ring-1 focus:ring-rose-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-rose-800"
              >
                <option value="Fragrance">Fragrance</option>
                <option value="Skincare">Skincare</option>
                <option value="Color Cosmetics">Color Cosmetics</option>
                <option value="Personal Care">Personal Care</option>
                <option value="Fashion & Home">Fashion & Home</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Campaign / Brochure
              </label>
              <input
                type="text"
                value={campaign}
                onChange={e => setCampaign(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Packaging Unit
              </label>
              <input
                type="text"
                value={unit}
                onChange={e => setUnit(e.target.value)}
                placeholder="Bottle, Tube, Jar, Piece"
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Representative Wholesale Cost (₱)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={wholesalePrice}
                onChange={e => setWholesalePrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg font-mono-numbers focus:outline-none focus:ring-1 focus:ring-rose-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Suggested Retail Price SRP (₱)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={srp}
                onChange={e => setSrp(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg font-mono-numbers focus:outline-none focus:ring-1 focus:ring-rose-800"
              />
            </div>

            {!isEditing && (
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Initial Stock Count
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={currentStock}
                  onChange={e => setCurrentStock(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg font-mono-numbers focus:outline-none focus:ring-1 focus:ring-rose-800"
                />
              </div>
            )}

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Low-Stock Alert Threshold
              </label>
              <input
                type="number"
                min="1"
                required
                value={minThreshold}
                onChange={e => setMinThreshold(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg font-mono-numbers focus:outline-none focus:ring-1 focus:ring-rose-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Warehouse Bin Location
              </label>
              <input
                type="text"
                value={locationBin}
                onChange={e => setLocationBin(e.target.value)}
                placeholder="Aisle 1 - Bay B2"
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-neutral-700 mb-1">
                Product Image Asset
              </label>
              <div className="grid grid-cols-4 gap-2">
                {sampleImages.map((img, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setImage(img.url)}
                    className={`relative rounded-lg overflow-hidden border p-1 text-center transition-all ${
                      image === img.url
                        ? 'border-rose-900 ring-2 ring-rose-900/30 bg-rose-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.label}
                      className="w-full h-14 object-cover rounded"
                      referrerPolicy="no-referrer"
                    />
                    <span className="block text-[10px] text-neutral-600 truncate mt-1">
                      {img.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-neutral-700 mb-1">
                Product Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Key ingredients, fragrance notes, and benefits..."
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-800"
              />
            </div>
          </div>

          {/* Pricing summary */}
          <div className="p-3 bg-neutral-100 rounded-lg flex items-center justify-between font-mono-numbers text-xs">
            <span className="text-neutral-600">
              Representative Profit Margin:
            </span>
            <span className="font-bold text-emerald-800">
              {calculatedMargin}% (₱{(srp - wholesalePrice).toFixed(2)} per unit)
            </span>
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
              {isEditing ? 'Save Product Changes' : 'Add to Catalog Database'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
