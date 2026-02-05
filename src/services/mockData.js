/**
 * Mock Data for Pharmacy Admin Dashboard
 * This file contains mock data for all modules until backend is integrated
 */

// Products Data
export const mockProducts = [
    {
        id: 'P001',
        name: 'Paracetamol 500mg',
        activeIngredient: 'Paracetamol',
        dosage: '500mg',
        packaging: 'Hộp 10 vỉ x 10 viên',
        category: 'OTC',
        price: 15000,
        manufacturer: 'Domesco',
        registrationNumber: 'VD-12345-17',
        description: 'Thuốc giảm đau, hạ sốt',
        imageUrl: '/images/paracetamol.jpg',
        createdAt: '2024-01-15'
    },
    {
        id: 'P002',
        name: 'Amoxicillin 500mg',
        activeIngredient: 'Amoxicillin',
        dosage: '500mg',
        packaging: 'Hộp 2 vỉ x 10 viên',
        category: 'Kê đơn',
        price: 45000,
        manufacturer: 'Imexpharm',
        registrationNumber: 'VD-23456-18',
        description: 'Kháng sinh nhóm Penicillin',
        imageUrl: '/images/amoxicillin.jpg',
        createdAt: '2024-01-20'
    },
    {
        id: 'P003',
        name: 'Vitamin C 1000mg',
        activeIngredient: 'Ascorbic Acid',
        dosage: '1000mg',
        packaging: 'Hộp 3 vỉ x 10 viên',
        category: 'TPCN',
        price: 120000,
        manufacturer: 'DHG Pharma',
        registrationNumber: 'TP-34567-19',
        description: 'Bổ sung vitamin C',
        imageUrl: '/images/vitamin-c.jpg',
        createdAt: '2024-02-01'
    },
    {
        id: 'P004',
        name: 'Ibuprofen 400mg',
        activeIngredient: 'Ibuprofen',
        dosage: '400mg',
        packaging: 'Hộp 5 vỉ x 10 viên',
        category: 'OTC',
        price: 35000,
        manufacturer: 'Traphaco',
        registrationNumber: 'VD-45678-20',
        description: 'Thuốc giảm đau, kháng viêm',
        imageUrl: '/images/ibuprofen.jpg',
        createdAt: '2024-02-10'
    }
];

// Inventory/Stock Data
export const mockInventory = [
    {
        id: 'INV001',
        productId: 'P001',
        productName: 'Paracetamol 500mg',
        batchNumber: 'B2024-001',
        quantity: 500,
        expiryDate: '2025-12-31',
        shelfLocation: 'A1',
        supplier: 'Nhà cung cấp ABC',
        importPrice: 12000,
        importDate: '2024-01-15',
        status: 'Available'
    },
    {
        id: 'INV002',
        productId: 'P002',
        productName: 'Amoxicillin 500mg',
        batchNumber: 'B2024-002',
        quantity: 8,
        expiryDate: '2024-06-30',
        shelfLocation: 'B2',
        supplier: 'Nhà cung cấp XYZ',
        importPrice: 38000,
        importDate: '2024-01-20',
        status: 'Expiring Soon'
    },
    {
        id: 'INV003',
        productId: 'P003',
        productName: 'Vitamin C 1000mg',
        batchNumber: 'B2024-003',
        quantity: 200,
        expiryDate: '2026-03-15',
        shelfLocation: 'C1',
        supplier: 'Nhà cung cấp ABC',
        importPrice: 95000,
        importDate: '2024-02-01',
        status: 'Available'
    },
    {
        id: 'INV004',
        productId: 'P004',
        productName: 'Ibuprofen 400mg',
        batchNumber: 'B2024-004',
        quantity: 5,
        expiryDate: '2025-08-20',
        shelfLocation: 'A3',
        supplier: 'Nhà cung cấp XYZ',
        importPrice: 28000,
        importDate: '2024-02-10',
        status: 'Low Stock'
    }
];

// Orders Data
export const mockOrders = [
    {
        id: 'ORD001',
        orderDate: '2024-02-05',
        customerId: 'C001',
        customerName: 'Nguyễn Văn A',
        customerPhone: '0901234567',
        customerAddress: '123 Đường ABC, Q.1, TP.HCM',
        items: [
            { productId: 'P001', productName: 'Paracetamol 500mg', quantity: 2, price: 15000 },
            { productId: 'P003', productName: 'Vitamin C 1000mg', quantity: 1, price: 120000 }
        ],
        subtotal: 150000,
        shippingFee: 30000,
        discount: 0,
        total: 180000,
        paymentMethod: 'COD',
        status: 'Pending',
        createdAt: '2024-02-05T10:30:00'
    },
    {
        id: 'ORD002',
        orderDate: '2024-02-04',
        customerId: 'C002',
        customerName: 'Trần Thị B',
        customerPhone: '0912345678',
        customerAddress: '456 Đường XYZ, Q.3, TP.HCM',
        items: [
            { productId: 'P002', productName: 'Amoxicillin 500mg', quantity: 1, price: 45000 }
        ],
        subtotal: 45000,
        shippingFee: 25000,
        discount: 5000,
        total: 65000,
        paymentMethod: 'Online',
        status: 'Confirmed',
        createdAt: '2024-02-04T14:20:00'
    },
    {
        id: 'ORD003',
        orderDate: '2024-02-03',
        customerId: 'C003',
        customerName: 'Lê Văn C',
        customerPhone: '0923456789',
        customerAddress: '789 Đường DEF, Q.5, TP.HCM',
        items: [
            { productId: 'P004', productName: 'Ibuprofen 400mg', quantity: 3, price: 35000 }
        ],
        subtotal: 105000,
        shippingFee: 30000,
        discount: 10000,
        total: 125000,
        paymentMethod: 'COD',
        status: 'Delivering',
        createdAt: '2024-02-03T09:15:00'
    }
];

// Customers Data
export const mockCustomers = [
    {
        id: 'C001',
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@email.com',
        phone: '0901234567',
        address: '123 Đường ABC, Q.1, TP.HCM',
        loyaltyPoints: 150,
        totalOrders: 12,
        totalSpent: 2450000,
        registrationDate: '2023-06-15',
        lastPurchase: '2024-02-05'
    },
    {
        id: 'C002',
        name: 'Trần Thị B',
        email: 'tranthib@email.com',
        phone: '0912345678',
        address: '456 Đường XYZ, Q.3, TP.HCM',
        loyaltyPoints: 85,
        totalOrders: 8,
        totalSpent: 1200000,
        registrationDate: '2023-08-20',
        lastPurchase: '2024-02-04'
    },
    {
        id: 'C003',
        name: 'Lê Văn C',
        email: 'levanc@email.com',
        phone: '0923456789',
        address: '789 Đường DEF, Q.5, TP.HCM',
        loyaltyPoints: 220,
        totalOrders: 25,
        totalSpent: 4800000,
        registrationDate: '2023-03-10',
        lastPurchase: '2024-02-03'
    }
];

// Staff/Users Data
export const mockStaff = [
    {
        id: 'U001',
        name: 'Admin User',
        email: 'admin@pharmacare.com',
        phone: '0900000001',
        role: 'admin',
        status: 'Active',
        createdAt: '2023-01-01'
    },
    {
        id: 'U002',
        name: 'Dược sĩ Nguyễn Thị D',
        email: 'duocsi.d@pharmacare.com',
        phone: '0900000002',
        role: 'pharmacist',
        status: 'Active',
        createdAt: '2023-02-15'
    },
    {
        id: 'U003',
        name: 'Nhân viên kho Trần Văn E',
        email: 'nhanvien.e@pharmacare.com',
        phone: '0900000003',
        role: 'pharmacist',
        status: 'Active',
        createdAt: '2023-03-20'
    }
];

// Revenue Data for Dashboard Charts
export const mockRevenueData = {
    daily: [
        { date: '2024-02-01', revenue: 1200000 },
        { date: '2024-02-02', revenue: 1500000 },
        { date: '2024-02-03', revenue: 980000 },
        { date: '2024-02-04', revenue: 1350000 },
        { date: '2024-02-05', revenue: 1680000 }
    ],
    monthly: [
        { month: 'Jan', revenue: 35000000 },
        { month: 'Feb', revenue: 28000000 },
        { month: 'Mar', revenue: 42000000 },
        { month: 'Apr', revenue: 38000000 },
        { month: 'May', revenue: 45000000 }
    ]
};

// Dashboard Statistics
export const mockDashboardStats = {
    totalRevenue: 45000000,
    newOrders: 12,
    lowStockCount: 3,
    expiringCount: 2,
    pendingOrders: 5,
    completedOrders: 28
};
