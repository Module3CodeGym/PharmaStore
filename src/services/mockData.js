// Initial Mock Data
const initialProducts = [
    { id: 1, name: 'Paracetamol 500mg', sku: 'P001', price: 5.00, stock: 120, category: 'Pain Relievers', description: 'Effective for fever and mild pain.' },
    { id: 2, name: 'Amoxicillin 250mg', sku: 'A002', price: 12.50, stock: 5, category: 'Antibiotics', description: 'Broad-spectrum antibiotic.' },
    { id: 3, name: 'Vitamin C 1000mg', sku: 'V003', price: 8.00, stock: 45, category: 'Supplements', description: 'Boosts immune system.' },
    { id: 4, name: 'Ibuprofen 400mg', sku: 'I004', price: 6.50, stock: 2, category: 'Pain Relievers', description: 'Anti-inflammatory drug.' },
    { id: 5, name: 'Cetirizine 10mg', sku: 'C005', price: 4.20, stock: 80, category: 'Allergy', description: 'Relieves allergy symptoms.' },
];

const initialInventory = initialProducts.map(p => ({
    id: p.id,
    productId: p.id,
    name: p.name,
    sku: p.sku,
    stock: p.stock,
    unit: 'Box',
    lastUpdated: '2023-10-26',
    status: p.stock === 0 ? 'Out of Stock' : p.stock < 10 ? 'Low Stock' : 'In Stock'
}));

const initialCustomers = [
    { id: 1, name: 'Nguyen Van A', phone: '0901234567', points: 120, lastPurchase: '2023-10-25', totalSpend: 450.00 },
    { id: 2, name: 'Tran Thi B', phone: '0912345678', points: 340, lastPurchase: '2023-10-22', totalSpend: 1200.00 },
    { id: 3, name: 'Le Van C', phone: '0987654321', points: 50, lastPurchase: '2023-10-15', totalSpend: 120.00 },
];

const initialEmployees = [
    { id: 1, name: 'Admin User', email: 'admin@pharmacare.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Pharmacist One', email: 'staff1@pharmacare.com', role: 'Staff', status: 'Active' },
    { id: 3, name: 'Intern User', email: 'intern@pharmacare.com', role: 'Intern', status: 'Inactive' },
];

const initialLogs = [
    { id: 1, action: 'Product Added', target: 'Paracetamol 500mg', user: 'Admin User', date: '2023-10-26 10:30', details: 'Added new SKU P001' },
];

const initialOrders = [
    {
        id: 101,
        customerName: 'Nguyen Van A',
        date: '2023-10-26',
        total: 150.00,
        status: 'Pending',
        items: 3,
        shippingAddress: '123 Đường Láng, Đống Đa, Hà Nội',
        phoneNumber: '0901234567',
        paymentMethod: 'Tiền mặt (COD)',
        itemsList: [
            { id: 1, name: 'Paracetamol 500mg', quantity: 2, price: 50.00 },
            { id: 3, name: 'Vitamin C 1000mg', quantity: 1, price: 50.00 }
        ]
    },
    {
        id: 102,
        customerName: 'Tran Thi B',
        date: '2023-10-25',
        total: 240.50,
        status: 'Shipping',
        items: 2,
        shippingAddress: '456 Lê Lợi, Quận 1, TP. HCM',
        phoneNumber: '0912345678',
        paymentMethod: 'Chuyển khoản ngân hàng',
        itemsList: [
            { id: 2, name: 'Amoxicillin 250mg', quantity: 10, price: 12.50 },
            { id: 5, name: 'Cetirizine 10mg', quantity: 20, price: 5.75 }
        ]
    },
    {
        id: 103,
        customerName: 'Le Van C',
        date: '2023-10-24',
        total: 85.00,
        status: 'Cancelled',
        items: 1,
        shippingAddress: '789 Trần Hưng Đạo, Đà Nẵng',
        phoneNumber: '0987654321',
        paymentMethod: 'Ví điện tử Momo',
        itemsList: [
            { id: 1, name: 'Paracetamol 500mg', quantity: 17, price: 5.00 }
        ]
    }
];

// Helper to simulate delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Status Flow
const STATUS_LEVELS = {
    'Pending': 1,
    'Processing': 2,
    'Shipping': 3,
    'Done': 4,
    'Cancelled': 0
};

// "Database" in memory
let db = {
    products: [...initialProducts],
    inventory: [...initialInventory],
    customers: [...initialCustomers],
    employees: [...initialEmployees],
    logs: [...initialLogs],
    orders: [...initialOrders]
};

export const mockApi = {
    // PRODUCTS
    getProducts: async () => {
        await delay();
        return [...db.products];
    },
    getProductById: async (id) => {
        await delay();
        return db.products.find(p => p.id === parseInt(id));
    },
    addProduct: async (product, username) => {
        await delay();
        const newProduct = { ...product, id: Date.now() };
        db.products.push(newProduct);

        db.inventory.push({
            id: newProduct.id,
            productId: newProduct.id,
            name: newProduct.name,
            sku: newProduct.sku,
            stock: parseInt(newProduct.stock),
            unit: 'Box',
            lastUpdated: new Date().toISOString().split('T')[0],
            status: parseInt(newProduct.stock) === 0 ? 'Out of Stock' : parseInt(newProduct.stock) < 10 ? 'Low Stock' : 'In Stock'
        });

        db.logs.unshift({
            id: Date.now(),
            action: 'Product Added',
            target: newProduct.name,
            user: username || 'Current User',
            date: new Date().toLocaleString(),
            details: `Thêm sản phẩm mới ${newProduct.sku} với giá $${newProduct.price}`
        });

        return newProduct;
    },
    updateProduct: async (id, updates, username) => {
        await delay();
        const index = db.products.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            const oldProduct = { ...db.products[index] };
            db.products[index] = { ...db.products[index], ...updates };

            // Generate detailed log
            const changes = [];
            if (updates.name && updates.name !== oldProduct.name) changes.push(`tên (${oldProduct.name} -> ${updates.name})`);
            if (updates.price && parseFloat(updates.price) !== oldProduct.price) changes.push(`giá ($${oldProduct.price} -> $${updates.price})`);
            if (updates.stock && parseInt(updates.stock) !== oldProduct.stock) changes.push(`tồn kho (${oldProduct.stock} -> ${updates.stock})`);

            if (changes.length > 0) {
                db.logs.unshift({
                    id: Date.now(),
                    action: 'Product Updated',
                    target: db.products[index].name,
                    user: username || 'Current User',
                    date: new Date().toLocaleString(),
                    details: `Cập nhật ${changes.join(', ')}`
                });
            }

            const invIndex = db.inventory.findIndex(i => i.productId === parseInt(id));
            if (invIndex !== -1) {
                db.inventory[invIndex].name = updates.name || db.inventory[invIndex].name;
                db.inventory[invIndex].sku = updates.sku || db.inventory[invIndex].sku;
                if (updates.stock !== undefined) {
                    const newStock = parseInt(updates.stock);
                    db.inventory[invIndex].stock = newStock;
                    db.inventory[invIndex].status = newStock === 0 ? 'Out of Stock' : newStock < 10 ? 'Low Stock' : 'In Stock';
                }
            }
            return db.products[index];
        }
        throw new Error('Product not found');
    },
    deleteProduct: async (id, username) => {
        await delay();
        const product = db.products.find(p => p.id === parseInt(id));
        if (!product) throw new Error('Product not found');
        db.products = db.products.filter(p => p.id !== parseInt(id));
        db.inventory = db.inventory.filter(i => i.productId !== parseInt(id));
        db.logs.unshift({
            id: Date.now(),
            action: 'Product Deleted',
            target: product.name,
            user: username || 'Current User',
            date: new Date().toLocaleString(),
            details: `Xóa sản phẩm ${product.sku} khỏi hệ thống`
        });
        return true;
    },

    // INVENTORY
    getInventory: async () => {
        await delay();
        return [...db.inventory];
    },
    updateStock: async (id, quantity, type = 'add') => {
        await delay();
        const index = db.inventory.findIndex(i => i.id === parseInt(id));
        if (index !== -1) {
            let current = db.inventory[index].stock;
            let change = parseInt(quantity);
            let newStock = type === 'add' ? current + change : current - change;
            if (newStock < 0) newStock = 0;

            db.inventory[index].stock = newStock;
            db.inventory[index].status = newStock === 0 ? 'Out of Stock' : newStock < 10 ? 'Low Stock' : 'In Stock';
            db.inventory[index].lastUpdated = new Date().toISOString().split('T')[0];

            const prodIndex = db.products.findIndex(p => p.id === db.inventory[index].productId);
            if (prodIndex !== -1) {
                db.products[prodIndex].stock = newStock;
            }

            db.logs.unshift({
                id: Date.now(),
                action: 'Stock Updated',
                target: db.inventory[index].name,
                user: 'Current User',
                date: new Date().toLocaleString(),
                details: `Stock ${type === 'add' ? 'increased' : 'decreased'} by ${quantity}. New stock: ${newStock}`
            });

            return db.inventory[index];
        }
        throw new Error('Inventory item not found');
    },

    // CUSTOMERS
    getCustomers: async () => {
        await delay();
        return [...db.customers];
    },
    getCustomerById: async (id) => {
        await delay();
        return db.customers.find(c => c.id === parseInt(id));
    },
    addCustomer: async (customer, username) => {
        await delay();
        const newCustomer = {
            ...customer,
            id: Date.now(),
            points: 0,
            lastPurchase: 'N/A',
            totalSpend: 0
        };
        db.customers.push(newCustomer);
        db.logs.unshift({
            id: Date.now(),
            action: 'Customer Created',
            target: newCustomer.name,
            user: username || 'Current User',
            date: new Date().toLocaleString(),
            details: `Đăng ký khách hàng mới: ${newCustomer.phone}`
        });
        return newCustomer;
    },
    updateCustomer: async (id, updates, username) => {
        await delay();
        const index = db.customers.findIndex(c => c.id === parseInt(id));
        if (index !== -1) {
            const oldCustomer = { ...db.customers[index] };
            db.customers[index] = { ...db.customers[index], ...updates };

            const changes = [];
            if (updates.name && updates.name !== oldCustomer.name) changes.push(`tên (${oldCustomer.name} -> ${updates.name})`);
            if (updates.phone && updates.phone !== oldCustomer.phone) changes.push(`SĐT (${oldCustomer.phone} -> ${updates.phone})`);

            if (changes.length > 0) {
                db.logs.unshift({
                    id: Date.now(),
                    action: 'Customer Updated',
                    target: db.customers[index].name,
                    user: username || 'Current User',
                    date: new Date().toLocaleString(),
                    details: `Cập nhật ${changes.join(', ')}`
                });
            }
            return db.customers[index];
        }
        throw new Error('Customer not found');
    },
    deleteCustomer: async (id, username) => {
        await delay();
        const customer = db.customers.find(c => c.id === parseInt(id));
        if (!customer) throw new Error('Customer not found');
        db.customers = db.customers.filter(c => c.id !== parseInt(id));
        db.logs.unshift({
            id: Date.now(),
            action: 'Customer Deleted',
            target: customer.name,
            user: username || 'Current User',
            date: new Date().toLocaleString(),
            details: `Xóa thông tin khách hàng khỏi hệ thống`
        });
        return true;
    },

    // EMPLOYEES
    getEmployees: async () => {
        await delay();
        return [...db.employees];
    },
    getEmployeeById: async (id) => {
        await delay();
        return db.employees.find(e => e.id === parseInt(id));
    },
    addEmployee: async (employee, username) => {
        await delay();
        const newEmployee = { ...employee, id: Date.now(), status: 'Active' };
        db.employees.push(newEmployee);
        db.logs.unshift({
            id: Date.now(),
            action: 'Employee Added',
            target: newEmployee.name,
            user: username || 'Admin',
            date: new Date().toLocaleString(),
            details: `Thêm nhân viên mới (${newEmployee.role}): ${newEmployee.email}`
        });
        return newEmployee;
    },
    updateEmployee: async (id, updates, username) => {
        await delay();
        const index = db.employees.findIndex(e => e.id === parseInt(id));
        if (index !== -1) {
            const oldEmployee = { ...db.employees[index] };
            db.employees[index] = { ...db.employees[index], ...updates };

            const changes = [];
            if (updates.name && updates.name !== oldEmployee.name) changes.push(`tên (${oldEmployee.name} -> ${updates.name})`);
            if (updates.role && updates.role !== oldEmployee.role) changes.push(`vai trò (${oldEmployee.role} -> ${updates.role})`);
            if (updates.status && updates.status !== oldEmployee.status) changes.push(`trạng thái (${oldEmployee.status} -> ${updates.status})`);

            if (changes.length > 0) {
                db.logs.unshift({
                    id: Date.now(),
                    action: 'Employee Updated',
                    target: db.employees[index].name,
                    user: username || 'Admin',
                    date: new Date().toLocaleString(),
                    details: `Cập nhật ${changes.join(', ')}`
                });
            }
            return db.employees[index];
        }
        throw new Error('Employee not found');
    },
    deleteEmployee: async (id, username) => {
        await delay();
        const employee = db.employees.find(e => e.id === parseInt(id));
        if (!employee) throw new Error('Employee not found');
        db.employees = db.employees.filter(e => e.id !== parseInt(id));
        db.logs.unshift({
            id: Date.now(),
            action: 'Employee Deleted',
            target: employee.name,
            user: username || 'Admin',
            date: new Date().toLocaleString(),
            details: `Xóa nhân viên ${employee.name} khỏi hệ thống`
        });
        return true;
    },

    // LOGS
    getLogs: async () => {
        await delay();
        return [...db.logs];
    },

    // DASHBOARD STATS
    getStats: async () => {
        await delay();
        return {
            totalSales: db.customers.reduce((acc, c) => acc + c.totalSpend, 0),
            totalOrders: 150,
            totalProducts: db.products.length,
            newCustomers: db.customers.length
        };
    },

    // AUTHENTICATION
    login: async (username, password) => {
        await delay(800);
        // Simulating specific credentials for roles
        if (username === 'admin' && password === '123') {
            return { id: 1, name: 'Admin User', role: 'Admin', token: 'mock-jwt-admin' };
        }
        if (username === 'staff' && password === '123') {
            return { id: 2, name: 'Staff User', role: 'Staff', token: 'mock-jwt-staff' };
        }
        if (username === 'user' && password === '123') {
            return { id: 3, name: 'Regular User', role: 'User', token: 'mock-jwt-user' };
        }

        // Check registered users
        const user = db.users?.find(u => u.username === username && u.password === password);
        if (user) {
            return { ...user, token: `mock-jwt-${user.id}` };
        }

        throw new Error('Invalid username or password');
    },

    register: async (userData) => {
        await delay(800);
        if (!db.users) db.users = [];

        // Check existing
        if (db.users.find(u => u.username === userData.username)) {
            throw new Error('Username already exists');
        }

        const newUser = {
            id: Date.now(),
            name: userData.fullName || userData.username,
            username: userData.username,
            password: userData.password,
            role: 'User' // Default role
        };
        db.users.push(newUser);
        return { ...newUser, token: `mock-jwt-${newUser.id}` };
    },

    // ORDERS
    getOrders: async () => {
        await delay();
        return [...db.orders];
    },
    updateOrderStatus: async (id, status, username) => {
        await delay();
        const index = db.orders.findIndex(o => o.id === parseInt(id));
        if (index !== -1) {
            const currentStatus = db.orders[index].status;

            // Terminal checks
            if (currentStatus === 'Cancelled') throw new Error('Cannot change status of a cancelled order');
            if (currentStatus === 'Done') throw new Error('Order is already completed');

            // Directional check for primary flow (Pending -> Processing -> Shipping -> Done)
            const currentLevel = STATUS_LEVELS[currentStatus];
            const nextLevel = STATUS_LEVELS[status];

            if (status !== 'Cancelled') {
                if (nextLevel <= currentLevel) {
                    throw new Error(`Cannot revert order from ${currentStatus} back to ${status}`);
                }
            }

            const oldStatus = db.orders[index].status;
            db.orders[index].status = status;

            // Log the change
            const newLog = {
                id: Date.now(),
                action: 'Order Status Updated',
                target: `Order #${id}`,
                user: username || 'System',
                date: new Date().toLocaleString(),
                details: `Changed status from ${oldStatus} to ${status}`
            };
            db.logs.unshift(newLog); // Add to beginning of logs

            return db.orders[index];
        }
        throw new Error('Order not found');
    }
};
