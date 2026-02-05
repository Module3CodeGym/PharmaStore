/**
 * API Service with Mock Implementation
 * Simulates API calls with delays
 */

import {
    mockProducts,
    mockInventory,
    mockOrders,
    mockCustomers,
    mockStaff,
    mockRevenueData,
    mockDashboardStats
} from './mockData';

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Products API
export const productsApi = {
    getAll: async () => {
        await delay();
        return { success: true, data: mockProducts };
    },

    getById: async (id) => {
        await delay();
        const product = mockProducts.find(p => p.id === id);
        return product
            ? { success: true, data: product }
            : { success: false, error: 'Product not found' };
    },

    create: async (productData) => {
        await delay();
        const newProduct = {
            id: `P${String(mockProducts.length + 1).padStart(3, '0')}`,
            ...productData,
            createdAt: new Date().toISOString().split('T')[0]
        };
        mockProducts.push(newProduct);
        return { success: true, data: newProduct };
    },

    update: async (id, productData) => {
        await delay();
        const index = mockProducts.findIndex(p => p.id === id);
        if (index !== -1) {
            mockProducts[index] = { ...mockProducts[index], ...productData };
            return { success: true, data: mockProducts[index] };
        }
        return { success: false, error: 'Product not found' };
    },

    delete: async (id) => {
        await delay();
        const index = mockProducts.findIndex(p => p.id === id);
        if (index !== -1) {
            mockProducts.splice(index, 1);
            return { success: true };
        }
        return { success: false, error: 'Product not found' };
    }
};

// Inventory API
export const inventoryApi = {
    getAll: async () => {
        await delay();
        return { success: true, data: mockInventory };
    },

    addBatch: async (batchData) => {
        await delay();
        const newBatch = {
            id: `INV${String(mockInventory.length + 1).padStart(3, '0')}`,
            ...batchData,
            importDate: new Date().toISOString().split('T')[0],
            status: 'Available'
        };
        mockInventory.push(newBatch);
        return { success: true, data: newBatch };
    },

    updateBatch: async (id, batchData) => {
        await delay();
        const index = mockInventory.findIndex(item => item.id === id);
        if (index !== -1) {
            mockInventory[index] = { ...mockInventory[index], ...batchData };
            return { success: true, data: mockInventory[index] };
        }
        return { success: false, error: 'Batch not found' };
    }
};

// Orders API
export const ordersApi = {
    getAll: async () => {
        await delay();
        return { success: true, data: mockOrders };
    },

    getById: async (id) => {
        await delay();
        const order = mockOrders.find(o => o.id === id);
        return order
            ? { success: true, data: order }
            : { success: false, error: 'Order not found' };
    },

    updateStatus: async (id, status) => {
        await delay();
        const index = mockOrders.findIndex(o => o.id === id);
        if (index !== -1) {
            mockOrders[index].status = status;
            return { success: true, data: mockOrders[index] };
        }
        return { success: false, error: 'Order not found' };
    },

    create: async (orderData) => {
        await delay();
        const newOrder = {
            id: `ORD${String(mockOrders.length + 1).padStart(3, '0')}`,
            ...orderData,
            orderDate: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            status: 'Pending'
        };
        mockOrders.push(newOrder);
        return { success: true, data: newOrder };
    }
};

// Customers API
export const customersApi = {
    getAll: async () => {
        await delay();
        return { success: true, data: mockCustomers };
    },

    getById: async (id) => {
        await delay();
        const customer = mockCustomers.find(c => c.id === id);
        return customer
            ? { success: true, data: customer }
            : { success: false, error: 'Customer not found' };
    },

    getPurchaseHistory: async (customerId) => {
        await delay();
        const customerOrders = mockOrders.filter(o => o.customerId === customerId);
        return { success: true, data: customerOrders };
    },

    updatePoints: async (id, points) => {
        await delay();
        const index = mockCustomers.findIndex(c => c.id === id);
        if (index !== -1) {
            mockCustomers[index].loyaltyPoints = points;
            return { success: true, data: mockCustomers[index] };
        }
        return { success: false, error: 'Customer not found' };
    }
};

// Staff API
export const staffApi = {
    getAll: async () => {
        await delay();
        return { success: true, data: mockStaff };
    },

    create: async (staffData) => {
        await delay();
        const newStaff = {
            id: `U${String(mockStaff.length + 1).padStart(3, '0')}`,
            ...staffData,
            status: 'Active',
            createdAt: new Date().toISOString().split('T')[0]
        };
        mockStaff.push(newStaff);
        return { success: true, data: newStaff };
    },

    update: async (id, staffData) => {
        await delay();
        const index = mockStaff.findIndex(s => s.id === id);
        if (index !== -1) {
            mockStaff[index] = { ...mockStaff[index], ...staffData };
            return { success: true, data: mockStaff[index] };
        }
        return { success: false, error: 'Staff not found' };
    },

    deactivate: async (id) => {
        await delay();
        const index = mockStaff.findIndex(s => s.id === id);
        if (index !== -1) {
            mockStaff[index].status = 'Inactive';
            return { success: true, data: mockStaff[index] };
        }
        return { success: false, error: 'Staff not found' };
    }
};

// Dashboard API
export const dashboardApi = {
    getStats: async () => {
        await delay();
        return { success: true, data: mockDashboardStats };
    },

    getRevenueData: async (period = 'daily') => {
        await delay();
        return {
            success: true,
            data: period === 'daily' ? mockRevenueData.daily : mockRevenueData.monthly
        };
    },

    getLowStockItems: async () => {
        await delay();
        const lowStock = mockInventory.filter(item => item.status === 'Low Stock');
        return { success: true, data: lowStock };
    },

    getExpiringItems: async () => {
        await delay();
        const expiring = mockInventory.filter(item => item.status === 'Expiring Soon');
        return { success: true, data: expiring };
    }
};

// Auth API
export const authApi = {
    login: async (email, password) => {
        await delay();
        const user = mockStaff.find(s => s.email === email);
        if (user) {
            return {
                success: true,
                data: {
                    user,
                    token: 'mock-jwt-token-' + Date.now()
                }
            };
        }
        return { success: false, error: 'Invalid credentials' };
    },

    logout: async () => {
        await delay();
        return { success: true };
    }
};

// System Logs API
export const systemLogsApi = {
    getLogs: async () => {
        await delay();
        // Try to get from localStorage
        const storedLogs = localStorage.getItem('systemLogs');
        let logs = storedLogs ? JSON.parse(storedLogs) : [];

        // If empty, init with mock data
        if (logs.length === 0) {
            logs = [
                { id: 1, user: 'Admin', action: 'Đăng nhập hệ thống', module: 'Auth', timestamp: '2023-10-25 08:30:15', details: 'IP: 192.168.1.1' },
                { id: 2, user: 'Admin', action: 'Cập nhật giá thuốc Panadol', module: 'Products', timestamp: '2023-10-25 09:15:22', details: 'Giá cũ: 10.000, Giá mới: 12.000' },
                { id: 3, user: 'Kho', action: 'Nhập kho lô A001', module: 'Inventory', timestamp: '2023-10-25 10:05:00', details: 'SL: 500 viên' },
                { id: 4, user: 'Dược sĩ Lan', action: 'Tạo đơn hàng #DH005', module: 'Orders', timestamp: '2023-10-25 10:45:30', details: 'Khách hàng: Nguyễn Văn B' },
                { id: 5, user: 'Admin', action: 'Thêm nhân viên mới', module: 'Staff', timestamp: '2023-10-25 11:20:10', details: 'User: nv_banhang' },
            ];
            localStorage.setItem('systemLogs', JSON.stringify(logs));
        }

        // Sort by timestamp desc
        return { success: true, data: logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) };
    },

    logAction: async (logData) => {
        // user, action, module, details
        // Get current logs
        const storedLogs = localStorage.getItem('systemLogs');
        const logs = storedLogs ? JSON.parse(storedLogs) : [];

        const newLog = {
            id: Date.now(),
            timestamp: new Date().toLocaleString('vi-VN'),
            ...logData
        };

        logs.unshift(newLog); // Add to beginning
        localStorage.setItem('systemLogs', JSON.stringify(logs));

        return { success: true };
    }
};
