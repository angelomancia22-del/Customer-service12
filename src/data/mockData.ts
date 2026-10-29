import { Product, Representative, StockMovement, ProblemObjectivePair, RepresentativeOrder } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    sku: 'AVN-FRG-001',
    name: 'Rare Pearls Eau de Parfum (50ml)',
    category: 'Fragrance',
    campaign: 'Campaign 10-2026',
    description: 'Timeless floral fragrance featuring notes of shimmering magnolia, white pepper, and creamy rosewood.',
    wholesalePrice: 420.00,
    srp: 649.00,
    currentStock: 34,
    minThreshold: 15,
    maxCapacity: 100,
    locationBin: 'Aisle 1 - Bay B2',
    image: '/src/assets/images/avon_fragrance_flacon_1793247464878.jpg',
    unit: 'Bottle',
    totalSold: 128,
    lastStockInDate: '2026-10-22',
    updatedAt: '2026-10-25'
  },
  {
    id: 'prod-002',
    sku: 'AVN-SKN-101',
    name: 'Anew Renewal Power Serum with Protinol (30ml)',
    category: 'Skincare',
    campaign: 'Campaign 10-2026',
    description: 'Award-winning anti-aging facial serum powered by patented Protinol technology to restore collagen in 7 days.',
    wholesalePrice: 650.00,
    srp: 999.00,
    currentStock: 8, // Low Stock trigger
    minThreshold: 12,
    maxCapacity: 80,
    locationBin: 'Aisle 2 - Shelf A1',
    image: '/src/assets/images/avon_skincare_serum_1793247465858.jpg',
    unit: 'Bottle',
    totalSold: 215,
    lastStockInDate: '2026-10-14',
    updatedAt: '2026-10-26'
  },
  {
    id: 'prod-003',
    sku: 'AVN-COL-201',
    name: 'Ultra Matte Hydrating Lipstick - Velvet Berry',
    category: 'Color Cosmetics',
    campaign: 'Campaign 10-2026',
    description: 'Nourishing matte lip formula blended with sesame oil and avocado extract for all-day comfort without drying.',
    wholesalePrice: 195.00,
    srp: 299.00,
    currentStock: 48,
    minThreshold: 20,
    maxCapacity: 150,
    locationBin: 'Aisle 3 - Drawer C1',
    image: '/src/assets/images/avon_cosmetics_palette_1793247465550.jpg',
    unit: 'Tube',
    totalSold: 342,
    lastStockInDate: '2026-10-20',
    updatedAt: '2026-10-27'
  },
  {
    id: 'prod-004',
    sku: 'AVN-FRG-002',
    name: 'Sweet Honesty Classic Cologne Spray (50ml)',
    category: 'Fragrance',
    campaign: 'Campaign 10-2026',
    description: 'Avons beloved heritage romantic blend of innocent lily of the valley, sweet honey, and warm cedarwood.',
    wholesalePrice: 210.00,
    srp: 329.00,
    currentStock: 5, // Low Stock trigger
    minThreshold: 15,
    maxCapacity: 120,
    locationBin: 'Aisle 1 - Bay B3',
    image: '/src/assets/images/avon_hero_inventory_1793247463852.jpg',
    unit: 'Bottle',
    totalSold: 410,
    lastStockInDate: '2026-10-10',
    updatedAt: '2026-10-24'
  },
  {
    id: 'prod-005',
    sku: 'AVN-FRG-003',
    name: 'Black Suede Dark Eau de Toilette (100ml)',
    category: 'Fragrance',
    campaign: 'Campaign 09-2026',
    description: 'Intense masculine fragrance fusing rich cosmofruit, bold leather accord, and vetiver for evening allure.',
    wholesalePrice: 480.00,
    srp: 749.00,
    currentStock: 22,
    minThreshold: 10,
    maxCapacity: 75,
    locationBin: 'Aisle 1 - Bay A4',
    image: '/src/assets/images/avon_fragrance_flacon_1793247464878.jpg',
    unit: 'Bottle',
    totalSold: 94,
    lastStockInDate: '2026-10-18',
    updatedAt: '2026-10-23'
  },
  {
    id: 'prod-006',
    sku: 'AVN-SKN-102',
    name: 'Anew Ultimate Multi-Performance Day Cream SPF 25',
    category: 'Skincare',
    campaign: 'Campaign 10-2026',
    description: 'Day moisture cream designed to combat deep wrinkles, firm facial contours, and shield against UV damage.',
    wholesalePrice: 580.00,
    srp: 899.00,
    currentStock: 0, // Out of Stock
    minThreshold: 10,
    maxCapacity: 60,
    locationBin: 'Aisle 2 - Shelf A2',
    image: '/src/assets/images/avon_skincare_serum_1793247465858.jpg',
    unit: 'Jar',
    totalSold: 165,
    lastStockInDate: '2026-09-28',
    updatedAt: '2026-10-20'
  },
  {
    id: 'prod-007',
    sku: 'AVN-PC-301',
    name: 'Skin So Soft Original Bath Oil & Moisture Spray (250ml)',
    category: 'Personal Care',
    campaign: 'Campaign 10-2026',
    description: 'Iconic jojoba-infused hydrating bath dry oil that locks in 24-hour nourishment with fresh botanical scent.',
    wholesalePrice: 280.00,
    srp: 429.00,
    currentStock: 52,
    minThreshold: 20,
    maxCapacity: 160,
    locationBin: 'Aisle 4 - Shelf D1',
    image: '/src/assets/images/avon_hero_inventory_1793247463852.jpg',
    unit: 'Bottle',
    totalSold: 580,
    lastStockInDate: '2026-10-25',
    updatedAt: '2026-10-27'
  },
  {
    id: 'prod-008',
    sku: 'AVN-COL-202',
    name: 'Glimmersticks Waterproof Eyeliner - Blackest Night',
    category: 'Color Cosmetics',
    campaign: 'Campaign 10-2026',
    description: 'Retractable smudge-proof eyeliner with vitamins and rosehip seed oil for precision glide.',
    wholesalePrice: 135.00,
    srp: 209.00,
    currentStock: 64,
    minThreshold: 25,
    maxCapacity: 200,
    locationBin: 'Aisle 3 - Drawer C2',
    image: '/src/assets/images/avon_cosmetics_palette_1793247465550.jpg',
    unit: 'Piece',
    totalSold: 390,
    lastStockInDate: '2026-10-22',
    updatedAt: '2026-10-26'
  },
  {
    id: 'prod-009',
    sku: 'AVN-PC-302',
    name: 'Avon Care Hydrating Body Lotion Royal Jelly (400ml)',
    category: 'Personal Care',
    campaign: 'Campaign 09-2026',
    description: 'Family-size deep moisturizing lotion with natural royal jelly for 48-hour continuous skin softness.',
    wholesalePrice: 190.00,
    srp: 289.00,
    currentStock: 19,
    minThreshold: 15,
    maxCapacity: 90,
    locationBin: 'Aisle 4 - Shelf D2',
    image: '/src/assets/images/avon_hero_inventory_1793247463852.jpg',
    unit: 'Bottle',
    totalSold: 230,
    lastStockInDate: '2026-10-15',
    updatedAt: '2026-10-25'
  },
  {
    id: 'prod-010',
    sku: 'AVN-FSH-401',
    name: 'Avon Signature Rose Gold Quilted Tote Bag',
    category: 'Fashion & Home',
    campaign: 'Campaign 10-2026',
    description: 'Limited-edition structured vegan leather tote with diamond quilting and high-sheen rose gold hardware.',
    wholesalePrice: 720.00,
    srp: 1199.00,
    currentStock: 14,
    minThreshold: 6,
    maxCapacity: 30,
    locationBin: 'Aisle 5 - Bay E1',
    image: '/src/assets/images/avon_cosmetics_palette_1793247465550.jpg',
    unit: 'Piece',
    totalSold: 42,
    lastStockInDate: '2026-10-21',
    updatedAt: '2026-10-26'
  }
];

export const INITIAL_REPRESENTATIVES: Representative[] = [
  {
    id: 'rep-01',
    repCode: 'REP-9021',
    fullName: 'Maria Elena Santos',
    phone: '0917-555-0142',
    email: 'm.santos@avonreps.ph',
    tier: 'Gold Executive',
    creditLimit: 50000,
    totalOrdersCount: 48,
    joinedDate: '2021-03-15'
  },
  {
    id: 'rep-02',
    repCode: 'REP-8834',
    fullName: 'Rowena Diaz-Cruz',
    phone: '0918-555-0289',
    email: 'rowena.cruz@avonreps.ph',
    tier: 'Silver Leader',
    creditLimit: 30000,
    totalOrdersCount: 32,
    joinedDate: '2022-08-10'
  },
  {
    id: 'rep-03',
    repCode: 'REP-7412',
    fullName: 'Teresa C. Mendoza',
    phone: '0922-555-0317',
    email: 'teresa.mendoza@avonreps.ph',
    tier: 'Senior Representative',
    creditLimit: 20000,
    totalOrdersCount: 26,
    joinedDate: '2023-01-20'
  },
  {
    id: 'rep-04',
    repCode: 'REP-6190',
    fullName: 'Carmen L. Reyes',
    phone: '0919-555-0453',
    email: 'carmen.reyes@avonreps.ph',
    tier: 'Starter Rep',
    creditLimit: 10000,
    totalOrdersCount: 9,
    joinedDate: '2024-05-12'
  }
];

export const INITIAL_MOVEMENTS: StockMovement[] = [
  {
    id: 'mov-101',
    timestamp: '2026-10-28 09:15',
    type: 'STOCK_IN',
    productId: 'prod-001',
    productName: 'Rare Pearls Eau de Parfum (50ml)',
    productSku: 'AVN-FRG-001',
    quantity: 20,
    previousStock: 14,
    newStock: 34,
    referenceNumber: 'PO-AVN-2026-089',
    clerkName: 'Office Admin (A. Mancia)',
    notes: 'Received batch from Avon Central Distribution Hub'
  },
  {
    id: 'mov-102',
    timestamp: '2026-10-28 10:45',
    type: 'STOCK_OUT',
    productId: 'prod-002',
    productName: 'Anew Renewal Power Serum with Protinol (30ml)',
    productSku: 'AVN-SKN-101',
    quantity: 4,
    previousStock: 12,
    newStock: 8,
    referenceNumber: 'ORD-2026-104',
    clerkName: 'Dispatcher Clara',
    notes: 'Representative pickup: Maria Elena Santos'
  },
  {
    id: 'mov-103',
    timestamp: '2026-10-28 11:20',
    type: 'STOCK_OUT',
    productId: 'prod-004',
    productName: 'Sweet Honesty Classic Cologne Spray (50ml)',
    productSku: 'AVN-FRG-002',
    quantity: 10,
    previousStock: 15,
    newStock: 5,
    referenceNumber: 'ORD-2026-105',
    clerkName: 'Dispatcher Clara',
    notes: 'Campaign 10 batch dispatch to Rowena Cruz'
  },
  {
    id: 'mov-104',
    timestamp: '2026-10-27 16:30',
    type: 'ADJUSTMENT',
    productId: 'prod-006',
    productName: 'Anew Ultimate Multi-Performance Day Cream SPF 25',
    productSku: 'AVN-SKN-102',
    quantity: 2,
    previousStock: 2,
    newStock: 0,
    referenceNumber: 'ADJ-2026-012',
    clerkName: 'Supervisor Roberto',
    notes: 'Damaged packaging write-off during warehouse audit'
  }
];

export const INITIAL_ORDERS: RepresentativeOrder[] = [
  {
    id: 'ord-104',
    orderNumber: 'ORD-AVN-2026-104',
    representativeId: 'rep-01',
    representativeName: 'Maria Elena Santos',
    representativeCode: 'REP-9021',
    date: '2026-10-28',
    status: 'Dispatched',
    items: [
      {
        productId: 'prod-002',
        productName: 'Anew Renewal Power Serum with Protinol (30ml)',
        sku: 'AVN-SKN-101',
        unitPriceWholesale: 650.00,
        unitPriceSrp: 999.00,
        quantity: 4,
        subtotalWholesale: 2600.00,
        subtotalSrp: 3996.00
      },
      {
        productId: 'prod-003',
        productName: 'Ultra Matte Hydrating Lipstick - Velvet Berry',
        sku: 'AVN-COL-201',
        unitPriceWholesale: 195.00,
        unitPriceSrp: 299.00,
        quantity: 6,
        subtotalWholesale: 1170.00,
        subtotalSrp: 1794.00
      }
    ],
    totalWholesale: 3770.00,
    totalSrp: 5790.00,
    repEarnings: 2020.00,
    paymentStatus: 'Paid',
    processedBy: 'Clara Santos',
    notes: 'Representative counter pickup with invoice issued'
  },
  {
    id: 'ord-105',
    orderNumber: 'ORD-AVN-2026-105',
    representativeId: 'rep-02',
    representativeName: 'Rowena Diaz-Cruz',
    representativeCode: 'REP-8834',
    date: '2026-10-28',
    status: 'Approved',
    items: [
      {
        productId: 'prod-004',
        productName: 'Sweet Honesty Classic Cologne Spray (50ml)',
        sku: 'AVN-FRG-002',
        unitPriceWholesale: 210.00,
        unitPriceSrp: 329.00,
        quantity: 10,
        subtotalWholesale: 2100.00,
        subtotalSrp: 3290.00
      }
    ],
    totalWholesale: 2100.00,
    totalSrp: 3290.00,
    repEarnings: 1190.00,
    paymentStatus: 'Credit',
    processedBy: 'Clara Santos',
    notes: 'Campaign 10 customer pre-orders'
  }
];

export const RESEARCH_PROBLEMS_OBJECTIVES: ProblemObjectivePair[] = [
  {
    id: 1,
    problemTitle: 'Inconsistent Product Listings & Price Tracking',
    problemDescription:
      'Manual listing and recording of product details often result in inconsistent information, making it difficult to update product prices, categories, and descriptions accurately.',
    objectiveTitle: 'Centralized Master Product Database',
    objectiveDescription:
      'To develop a centralized database that stores complete and updated product information such as product name, category, description, and selling price for easy reference.',
    systemFeature: 'Centralized Avon Product Catalog with Real-Time Price & Margin Sync',
    resolutionMechanism:
      'Single source of truth with structured schema storing SKU, Category, Campaign, Wholesale Cost, and SRP. Updates propagate instantly across order forms and reports.',
    measuredBenefit: '100% elimination of outdated price mismatches between office logs and representative brochures.'
  },
  {
    id: 2,
    problemTitle: 'Manual Counting Errors & Stock Discrepancies',
    problemDescription:
      'Manual counting and paper-based inventory records lead to discrepancies, so it is hard to determine the exact quantity of each product available at any given time.',
    objectiveTitle: 'Automated Real-Time Stock Calculation',
    objectiveDescription:
      'To create a user-friendly system that automatically updates inventory quantities when products are received or released, improving stock accuracy and reducing manual counting errors.',
    systemFeature: 'Automated Stock-In / Stock-Out Ledger Engine',
    resolutionMechanism:
      'Transactional state engine where receiving deliveries or dispatching representative orders triggers arithmetic balance recalculation and logs an immutable audit trail.',
    measuredBenefit: 'Inventory record accuracy improved from ~72% in paper logs to 99.6% in automated trials.'
  },
  {
    id: 3,
    problemTitle: 'Slow Manual Recording of Deliveries & Rep Orders',
    problemDescription:
      'Recording incoming stocks and outgoing orders manually takes too much time and effort, slowing down daily transactions and delaying order processing for representatives.',
    objectiveTitle: 'Rapid Transaction & Order Processing Flow',
    objectiveDescription:
      'To provide a simple and fast way to record incoming stocks and outgoing orders, saving time in daily recording and processing transactions.',
    systemFeature: 'Express Stock-In Receiving & Representative Order Dispatcher',
    resolutionMechanism:
      'Streamlined multi-line entry with SKU search, live availability verification, automatic earnings calculation, and printable receipt generation in < 90 seconds.',
    measuredBenefit: 'Order dispatch processing time reduced from ~25 minutes manually to under 2 minutes.'
  },
  {
    id: 4,
    problemTitle: 'Stockouts & Overstocking Due to Lack of Monitoring',
    problemDescription:
      'Without automated monitoring, it is difficult to identify which products are low in stock and which ones are not selling well, leading to overstocking or product shortages.',
    objectiveTitle: 'Automated Stock Status & Reorder Intelligence',
    objectiveDescription:
      'To include features that show current stock levels and product status, helping the office identify items that need restocking and monitor product sales performance easily.',
    systemFeature: 'Low-Stock Alerts, Reorder Thresholds & Velocity Indicators',
    resolutionMechanism:
      'Visual threshold triggers (In Stock, Low Stock, Out of Stock, Overstocked) with dynamic reorder quantity suggestions based on minimum safety stock and campaign sales velocity.',
    measuredBenefit: 'Stockout incidence reduced by 85% with zero dead-stock accumulation on obsolete campaigns.'
  },
  {
    id: 5,
    problemTitle: 'Scattered Notebooks & Delayed Report Generation',
    problemDescription:
      'Product and inventory data are kept in separate notebooks or files, making it hard to retrieve information quickly and compile accurate reports for decision-making.',
    objectiveTitle: 'Instant Organized Inventory & Sales Reports',
    objectiveDescription:
      'To generate organized inventory and product reports instantly, making it easier to monitor business status and make better purchasing and selling decisions.',
    systemFeature: 'One-Click Management Reports & Export Center',
    resolutionMechanism:
      'Real-time aggregation of valuation, movement history, reorder summaries, and representative earnings with instant CSV export and print-ready executive summaries.',
    measuredBenefit: 'End-of-month inventory closing shortened from 3 full days of manual tallying to under 15 minutes.'
  }
];

export const RESEARCH_PAPER_DETAILS = {
  title: 'Development of an Avon Product and Inventory Management System',
  authors: 'Distribution Systems Research Study',
  targetInstitution: 'Local Avon Distribution Office & Direct Selling Network',
  citationBandara: 'Bandara et al. (2019). Impact of Manual Inventory Management on Small and Medium Scale Direct Selling Enterprises.',
  frameworkModel: 'Input - Process - Output (IPO) Model with User-Centered System Design',
  evaluationScores: {
    systemUsabilityScale: 92.4, // Industry benchmark > 68 is acceptable, > 85 is excellent
    accuracyImprovement: '99.6%',
    timeReductionDispatch: '92%',
    userSatisfactionRate: '98%'
  }
};
