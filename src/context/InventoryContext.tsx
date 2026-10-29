import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Representative,
  StockMovement,
  RepresentativeOrder,
  StockInBatch
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_REPRESENTATIVES,
  INITIAL_MOVEMENTS,
  INITIAL_ORDERS
} from '../data/mockData';

interface InventoryContextType {
  products: Product[];
  representatives: Representative[];
  movements: StockMovement[];
  orders: RepresentativeOrder[];
  batches: StockInBatch[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  // Actions
  addProduct: (productData: Omit<Product, 'id' | 'totalSold' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  recordStockIn: (data: {
    batchNumber: string;
    supplierHub: string;
    receivedBy: string;
    items: {
      productId: string;
      quantityReceived: number;
      costPerUnit: number;
      lotNumber: string;
      expiryDate?: string;
    }[];
  }) => void;
  createRepresentativeOrder: (orderData: {
    representativeId: string;
    items: { productId: string; quantity: number }[];
    paymentStatus: 'Paid' | 'Credit' | 'Partial';
    notes?: string;
    autoDispatch?: boolean;
  }) => RepresentativeOrder;
  dispatchOrder: (orderId: string) => void;
  adjustStockDirect: (productId: string, newStock: number, reason: string, clerk: string) => void;
  resetToDemoData: () => void;
  // Derived helpers
  lowStockCount: number;
  outOfStockCount: number;
  totalInventoryUnits: number;
  totalWholesaleValue: number;
  totalSrpValue: number;
}

const STORAGE_KEY_PRODUCTS = 'avon_inventory_products_v1';
const STORAGE_KEY_REPS = 'avon_inventory_reps_v1';
const STORAGE_KEY_MOVEMENTS = 'avon_inventory_movements_v1';
const STORAGE_KEY_ORDERS = 'avon_inventory_orders_v1';
const STORAGE_KEY_BATCHES = 'avon_inventory_batches_v1';

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved products', e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [representatives, setRepresentatives] = useState<Representative[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_REPS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved representatives', e);
      }
    }
    return INITIAL_REPRESENTATIVES;
  });

  const [movements, setMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MOVEMENTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved movements', e);
      }
    }
    return INITIAL_MOVEMENTS;
  });

  const [orders, setOrders] = useState<RepresentativeOrder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved orders', e);
      }
    }
    return INITIAL_ORDERS;
  });

  const [batches, setBatches] = useState<StockInBatch[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BATCHES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved batches', e);
      }
    }
    return [
      {
        id: 'batch-init-01',
        batchNumber: 'DEL-HUB-2026-089',
        supplierHub: 'Avon Central Logistics Hub',
        receivedDate: '2026-10-28 09:15',
        receivedBy: 'Office Admin (A. Mancia)',
        totalUnits: 20,
        totalCost: 8400.00,
        status: 'Verified',
        items: [
          {
            productId: 'prod-001',
            productName: 'Rare Pearls Eau de Parfum (50ml)',
            sku: 'AVN-FRG-001',
            quantityReceived: 20,
            costPerUnit: 420.00,
            lotNumber: 'LOT-2026-B812',
            expiryDate: '2029-05-30'
          }
        ]
      }
    ];
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_REPS, JSON.stringify(representatives));
  }, [representatives]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MOVEMENTS, JSON.stringify(movements));
  }, [movements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BATCHES, JSON.stringify(batches));
  }, [batches]);

  const addProduct = (productData: Omit<Product, 'id' | 'totalSold' | 'updatedAt'>) => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
      totalSold: 0,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setProducts(prev => [newProduct, ...prev]);

    // Initial stock movement record if stock > 0
    if (productData.currentStock > 0) {
      const initialMovement: StockMovement = {
        id: `mov-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        type: 'STOCK_IN',
        productId: newId,
        productName: newProduct.name,
        productSku: newProduct.sku,
        quantity: productData.currentStock,
        previousStock: 0,
        newStock: productData.currentStock,
        referenceNumber: 'INITIAL-STOCK',
        clerkName: 'System Setup',
        notes: 'Initial inventory baseline recording'
      };
      setMovements(prev => [initialMovement, ...prev]);
    }
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            ...updates,
            updatedAt: new Date().toISOString().split('T')[0]
          };
        }
        return item;
      })
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const recordStockIn = (data: {
    batchNumber: string;
    supplierHub: string;
    receivedBy: string;
    items: {
      productId: string;
      quantityReceived: number;
      costPerUnit: number;
      lotNumber: string;
      expiryDate?: string;
    }[];
  }) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const today = new Date().toISOString().split('T')[0];
    const newMovements: StockMovement[] = [];

    // Update each product stock
    setProducts(prev => {
      const updated = [...prev];
      data.items.forEach(item => {
        const index = updated.findIndex(p => p.id === item.productId);
        if (index !== -1) {
          const target = updated[index];
          const prevQty = target.currentStock;
          const newQty = prevQty + item.quantityReceived;

          updated[index] = {
            ...target,
            currentStock: newQty,
            wholesalePrice: item.costPerUnit > 0 ? item.costPerUnit : target.wholesalePrice,
            lastStockInDate: today,
            updatedAt: today
          };

          newMovements.push({
            id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            timestamp: nowStr,
            type: 'STOCK_IN',
            productId: target.id,
            productName: target.name,
            productSku: target.sku,
            quantity: item.quantityReceived,
            previousStock: prevQty,
            newStock: newQty,
            referenceNumber: data.batchNumber,
            clerkName: data.receivedBy,
            notes: `Received from ${data.supplierHub}. Lot: ${item.lotNumber}`
          });
        }
      });
      return updated;
    });

    // Record batch
    const totalUnits = data.items.reduce((sum, i) => sum + i.quantityReceived, 0);
    const totalCost = data.items.reduce((sum, i) => sum + i.quantityReceived * i.costPerUnit, 0);

    const detailedBatchItems = data.items.map(i => {
      const prod = products.find(p => p.id === i.productId);
      return {
        productId: i.productId,
        productName: prod ? prod.name : 'Unknown Product',
        sku: prod ? prod.sku : 'SKU',
        quantityReceived: i.quantityReceived,
        costPerUnit: i.costPerUnit,
        lotNumber: i.lotNumber,
        expiryDate: i.expiryDate
      };
    });

    const newBatch: StockInBatch = {
      id: `batch-${Date.now()}`,
      batchNumber: data.batchNumber,
      supplierHub: data.supplierHub,
      receivedDate: nowStr,
      receivedBy: data.receivedBy,
      items: detailedBatchItems,
      totalUnits,
      totalCost,
      status: 'Verified'
    };

    setBatches(prev => [newBatch, ...prev]);
    setMovements(prev => [...newMovements, ...prev]);
  };

  const createRepresentativeOrder = (orderData: {
    representativeId: string;
    items: { productId: string; quantity: number }[];
    paymentStatus: 'Paid' | 'Credit' | 'Partial';
    notes?: string;
    autoDispatch?: boolean;
  }): RepresentativeOrder => {
    const rep = representatives.find(r => r.id === orderData.representativeId);
    if (!rep) throw new Error('Representative not found');

    const orderNum = `ORD-AVN-2026-${Math.floor(100 + Math.random() * 900)}`;
    const today = new Date().toISOString().split('T')[0];
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    let totalWholesale = 0;
    let totalSrp = 0;

    const orderItems = orderData.items.map(item => {
      const prod = products.find(p => p.id === item.productId);
      if (!prod) throw new Error(`Product ${item.productId} not found`);

      const subtotalWholesale = prod.wholesalePrice * item.quantity;
      const subtotalSrp = prod.srp * item.quantity;

      totalWholesale += subtotalWholesale;
      totalSrp += subtotalSrp;

      return {
        productId: prod.id,
        productName: prod.name,
        sku: prod.sku,
        unitPriceWholesale: prod.wholesalePrice,
        unitPriceSrp: prod.srp,
        quantity: item.quantity,
        subtotalWholesale,
        subtotalSrp
      };
    });

    const repEarnings = totalSrp - totalWholesale;

    const newOrder: RepresentativeOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      representativeId: rep.id,
      representativeName: rep.fullName,
      representativeCode: rep.repCode,
      date: today,
      status: orderData.autoDispatch ? 'Dispatched' : 'Approved',
      items: orderItems,
      totalWholesale,
      totalSrp,
      repEarnings,
      paymentStatus: orderData.paymentStatus,
      processedBy: 'Office Dispatch Counter',
      notes: orderData.notes || 'Order placed via system counter'
    };

    setOrders(prev => [newOrder, ...prev]);

    // Update rep order count
    setRepresentatives(prev =>
      prev.map(r => (r.id === rep.id ? { ...r, totalOrdersCount: r.totalOrdersCount + 1 } : r))
    );

    // If auto-dispatched, immediately deduct inventory
    if (orderData.autoDispatch) {
      const newMovements: StockMovement[] = [];
      setProducts(prev => {
        const updated = [...prev];
        orderItems.forEach(item => {
          const index = updated.findIndex(p => p.id === item.productId);
          if (index !== -1) {
            const current = updated[index];
            const prevStock = current.currentStock;
            const newStock = Math.max(0, prevStock - item.quantity);

            updated[index] = {
              ...current,
              currentStock: newStock,
              totalSold: current.totalSold + item.quantity,
              updatedAt: today
            };

            newMovements.push({
              id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              timestamp: nowStr,
              type: 'STOCK_OUT',
              productId: current.id,
              productName: current.name,
              productSku: current.sku,
              quantity: item.quantity,
              previousStock: prevStock,
              newStock,
              referenceNumber: orderNum,
              clerkName: 'Office Dispatch Counter',
              notes: `Representative dispatch: ${rep.fullName} (${rep.repCode})`
            });
          }
        });
        return updated;
      });

      setMovements(prev => [...newMovements, ...prev]);
    }

    return newOrder;
  };

  const dispatchOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order || order.status === 'Dispatched' || order.status === 'Completed') return;

    const today = new Date().toISOString().split('T')[0];
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newMovements: StockMovement[] = [];

    // Deduct stock
    setProducts(prev => {
      const updated = [...prev];
      order.items.forEach(item => {
        const index = updated.findIndex(p => p.id === item.productId);
        if (index !== -1) {
          const current = updated[index];
          const prevStock = current.currentStock;
          const newStock = Math.max(0, prevStock - item.quantity);

          updated[index] = {
            ...current,
            currentStock: newStock,
            totalSold: current.totalSold + item.quantity,
            updatedAt: today
          };

          newMovements.push({
            id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            timestamp: nowStr,
            type: 'STOCK_OUT',
            productId: current.id,
            productName: current.name,
            productSku: current.sku,
            quantity: item.quantity,
            previousStock: prevStock,
            newStock,
            referenceNumber: order.orderNumber,
            clerkName: 'Warehouse Dispatcher',
            notes: `Dispatched order for ${order.representativeName}`
          });
        }
      });
      return updated;
    });

    setMovements(prev => [...newMovements, ...prev]);

    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: 'Dispatched' } : o))
    );
  };

  const adjustStockDirect = (productId: string, newStock: number, reason: string, clerk: string) => {
    const today = new Date().toISOString().split('T')[0];
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    const prevStock = prod.currentStock;
    const delta = Math.abs(newStock - prevStock);

    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, currentStock: newStock, updatedAt: today } : p))
    );

    const movement: StockMovement = {
      id: `mov-${Date.now()}`,
      timestamp: nowStr,
      type: 'ADJUSTMENT',
      productId: prod.id,
      productName: prod.name,
      productSku: prod.sku,
      quantity: delta,
      previousStock: prevStock,
      newStock,
      referenceNumber: `ADJ-${Math.floor(1000 + Math.random() * 9000)}`,
      clerkName: clerk || 'Inventory Officer',
      notes: reason || 'Physical count audit reconciliation'
    };

    setMovements(prev => [movement, ...prev]);
  };

  const resetToDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setRepresentatives(INITIAL_REPRESENTATIVES);
    setMovements(INITIAL_MOVEMENTS);
    setOrders(INITIAL_ORDERS);
    localStorage.removeItem(STORAGE_KEY_PRODUCTS);
    localStorage.removeItem(STORAGE_KEY_REPS);
    localStorage.removeItem(STORAGE_KEY_MOVEMENTS);
    localStorage.removeItem(STORAGE_KEY_ORDERS);
    localStorage.removeItem(STORAGE_KEY_BATCHES);
  };

  // Derived metrics
  const lowStockCount = products.filter(p => p.currentStock > 0 && p.currentStock <= p.minThreshold).length;
  const outOfStockCount = products.filter(p => p.currentStock === 0).length;
  const totalInventoryUnits = products.reduce((sum, p) => sum + p.currentStock, 0);
  const totalWholesaleValue = products.reduce((sum, p) => sum + p.currentStock * p.wholesalePrice, 0);
  const totalSrpValue = products.reduce((sum, p) => sum + p.currentStock * p.srp, 0);

  return (
    <InventoryContext.Provider
      value={{
        products,
        representatives,
        movements,
        orders,
        batches,
        activeTab,
        setActiveTab,
        addProduct,
        updateProduct,
        deleteProduct,
        recordStockIn,
        createRepresentativeOrder,
        dispatchOrder,
        adjustStockDirect,
        resetToDemoData,
        lowStockCount,
        outOfStockCount,
        totalInventoryUnits,
        totalWholesaleValue,
        totalSrpValue
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
