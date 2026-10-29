export type ProductCategory =
  | 'Fragrance'
  | 'Skincare'
  | 'Color Cosmetics'
  | 'Personal Care'
  | 'Fashion & Home';

export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Overstocked';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  campaign: string;
  description: string;
  wholesalePrice: number; // Cost / Rep purchase price
  srp: number; // Suggested Retail Price
  currentStock: number;
  minThreshold: number; // Low stock alert trigger
  maxCapacity?: number;
  locationBin: string;
  image: string;
  unit: string;
  totalSold: number;
  lastStockInDate?: string;
  updatedAt: string;
}

export type MovementType = 'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT' | 'RETURN';

export interface StockMovement {
  id: string;
  timestamp: string;
  type: MovementType;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  previousStock: number;
  newStock: number;
  referenceNumber: string;
  clerkName: string;
  notes?: string;
}

export interface Representative {
  id: string;
  repCode: string;
  fullName: string;
  phone: string;
  email: string;
  tier: 'Gold Executive' | 'Silver Leader' | 'Senior Representative' | 'Starter Rep';
  creditLimit: number;
  totalOrdersCount: number;
  joinedDate: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  unitPriceWholesale: number;
  unitPriceSrp: number;
  quantity: number;
  subtotalWholesale: number;
  subtotalSrp: number;
}

export interface RepresentativeOrder {
  id: string;
  orderNumber: string;
  representativeId: string;
  representativeName: string;
  representativeCode: string;
  date: string;
  status: 'Draft' | 'Approved' | 'Dispatched' | 'Completed' | 'Cancelled';
  items: OrderItem[];
  totalWholesale: number;
  totalSrp: number;
  repEarnings: number;
  paymentStatus: 'Paid' | 'Credit' | 'Partial';
  processedBy: string;
  notes?: string;
}

export interface StockInBatchItem {
  productId: string;
  productName: string;
  sku: string;
  quantityReceived: number;
  costPerUnit: number;
  lotNumber: string;
  expiryDate?: string;
}

export interface StockInBatch {
  id: string;
  batchNumber: string;
  supplierHub: string;
  receivedDate: string;
  receivedBy: string;
  items: StockInBatchItem[];
  totalUnits: number;
  totalCost: number;
  status: 'Received' | 'Verified';
}

export interface ProblemObjectivePair {
  id: number;
  problemTitle: string;
  problemDescription: string;
  objectiveTitle: string;
  objectiveDescription: string;
  systemFeature: string;
  resolutionMechanism: string;
  measuredBenefit: string;
}
