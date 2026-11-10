// DATE
document.getElementById("currentDate").textContent =
    new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

// ADMIN DETAILS FROM LOGIN URL
const params = new URLSearchParams(window.location.search);
const email = params.get("email");

const adminEmail = email || "admin@greenora.com";

let adminName = adminEmail.split("@")[0];

adminName = adminName
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, letter => letter.toUpperCase());

document.getElementById("adminName").textContent = adminName;
document.getElementById("adminEmail").textContent = adminEmail;
document.getElementById("sidebarAdminEmail").textContent = adminEmail;


// PAGE NAVIGATION
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll(".page-section");
const pageTitle = document.getElementById("pageTitle");

function showPage(page) {
    sections.forEach(section => {
        section.classList.remove("active");
    });

    const selected = document.getElementById(page);
    if (!selected) return;

    selected.classList.add("active");

    navLinks.forEach(link => {
        link.classList.toggle("active", link.dataset.page === page);
    });

    const activeLink = document.querySelector(
        `.nav-links a[data-page="${page}"]`
    );

    pageTitle.textContent = activeLink
        ? activeLink.textContent.trim()
        : "Dashboard Overview";

    closeSidebar();
}

navLinks.forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault();
        showPage(this.dataset.page);
    });
});

// MOBILE SIDEBAR
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const menuBtn = document.getElementById("menuBtn");

menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("show");
});

function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
}

overlay.addEventListener("click", closeSidebar);


// PRODUCT DATA - DEMO PRODUCTS
let products = [
    {
        id: 1,
        name: "Fresh Organic Apples",
        category: "Fruits",
        price: 180,
        stock: 45,
        image: "images/apple.webp"
    },
    {
        id: 2,
        name: "Fresh Green Broccoli",
        category: "Vegetables",
        price: 90,
        stock: 28,
        image: "images/broccoli.webp"
    },
    {
        id: 3,
        name: "Organic Brown Rice",
        category: "Grains",
        price: 120,
        stock: 8,
        image: "images/rice.webp"
    },
    {
        id: 4,
        name: "Natural Fresh Milk",
        category: "Dairy",
        price: 65,
        stock: 0,
        image: "images/milk.webp"
    },
    {
        id: 5,
        name: "Organic Carrots",
        category: "Vegetables",
        price: 55,
        stock: 32,
        image: "images/carrot.webp"
    },
    {
        id: 6,
        name: "Fresh Bananas",
        category: "Fruits",
        price: 60,
        stock: 50,
        image: "images/banana.webp"
    },
    {
        id: 7,
        name: "Organic Honey",
        category: "Organic Foods",
        price: 250,
        stock: 15,
        image: "images/honey.webp"
    },
    {
        id: 8,
        name: "Organic Almonds",
        category: "Organic Foods",
        price: 350,
        stock: 20,
        image: "images/almonds.webp"
    }
];

// GET PRODUCT STATUS
function getProductStatus(stock) {
    if (stock === 0) return "Out of Stock";
    if (stock <= 10) return "Low Stock";
    return "In Stock";
}

// RENDER PRODUCTS
function renderProducts() {

    const tbody = document.getElementById("productsTableBody");
    if (!tbody) return;

    const search = document.getElementById("productSearch").value.toLowerCase();
    const category = document.getElementById("categoryFilter").value;
    const stockFilter = document.getElementById("stockFilter").value;

    const filtered = products.filter(product => {

        const matchesSearch = product.name.toLowerCase().includes(search);
        const matchesCategory = category === "all" || product.category === category;
        const matchesStock = stockFilter === "all" || getProductStatus(product.stock) === stockFilter;

        return matchesSearch && matchesCategory && matchesStock;
    });

    tbody.innerHTML = "";

    filtered.forEach(product => {

        const status = getProductStatus(product.stock);

        const statusClass =
            status === "In Stock" ? "stock-in" :
            status === "Low Stock" ? "stock-low" : "stock-out";

        const row = document.createElement("tr");

        const imageCell = document.createElement("td");
        const imageWrap = document.createElement("div");
        imageWrap.className = "product-info-cell";

        const image = document.createElement("img");
        image.className = "product-image";
        image.src = product.image;
        image.alt = product.name;
        image.onerror = function() {
            this.style.display = "none";
        };

        const name = document.createElement("span");
        name.className = "product-name";
        name.textContent = product.name;

        imageWrap.append(image, name);
        imageCell.appendChild(imageWrap);

        const categoryCell = document.createElement("td");
        categoryCell.className = "product-category-text";
        categoryCell.textContent = product.category;

        const priceCell = document.createElement("td");
        priceCell.textContent = "₹" + product.price;

        const stockCell = document.createElement("td");
        stockCell.textContent = product.stock + " units";

        const statusCell = document.createElement("td");
        const badge = document.createElement("span");
        badge.className = "stock-badge " + statusClass;
        badge.textContent = status;
        statusCell.appendChild(badge);

        const actionCell = document.createElement("td");
        const actions = document.createElement("div");
        actions.className = "product-actions";

        const editBtn = document.createElement("button");
        editBtn.className = "product-action-btn";
        editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
        editBtn.title = "Edit Product";
        editBtn.addEventListener("click", () => editProduct(product.id));

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "product-action-btn delete";
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
        deleteBtn.title = "Delete Product";
        deleteBtn.addEventListener("click", () => deleteProduct(product.id));

        actions.append(editBtn, deleteBtn);
        actionCell.appendChild(actions);

        row.append(
            imageCell,
            categoryCell,
            priceCell,
            stockCell,
            statusCell,
            actionCell
        );

        tbody.appendChild(row);
    });

    document.getElementById("noProducts").style.display =
        filtered.length ? "none" : "block";

    document.getElementById("productCountLabel").textContent =
        `Showing ${filtered.length} products`;

    updateProductStats();
}

// UPDATE PRODUCT COUNTS
function updateProductStats() {
    document.getElementById("totalProducts").textContent = products.length;

    document.getElementById("inStockProducts").textContent =
        products.filter(p => getProductStatus(p.stock) === "In Stock").length;

    document.getElementById("lowStockProducts").textContent =
        products.filter(p => getProductStatus(p.stock) === "Low Stock").length;

    document.getElementById("outStockProducts").textContent =
        products.filter(p => getProductStatus(p.stock) === "Out of Stock").length;
}

// OPEN MODAL
function openProductModal() {
    document.getElementById("productForm").reset();
    document.getElementById("editProductId").value = "";
    document.getElementById("modalTitle").textContent = "Add New Product";
    document.getElementById("productModal").classList.add("show");
}

// CLOSE MODAL
function closeProductModal() {
    document.getElementById("productModal").classList.remove("show");
}

// SAVE PRODUCT
document.getElementById("productForm").addEventListener("submit", function(e) {

    e.preventDefault();

    const id = document.getElementById("editProductId").value;

    const product = {
        id: id ? Number(id) : Date.now(),
        name: document.getElementById("productName").value.trim(),
        category: document.getElementById("productCategory").value,
        price: Number(document.getElementById("productPrice").value),
        stock: Number(document.getElementById("productStock").value),
        image: document.getElementById("productImage").value.trim() ||
               "images/default-product.webp"
    };

    if (id) {
        products = products.map(p => p.id === Number(id) ? product : p);
    } else {
        products.unshift(product);
    }

    renderProducts();
    closeProductModal();
    this.reset();
});

// EDIT PRODUCT
function editProduct(id) {

    const product = products.find(p => p.id === id);
    if (!product) return;

    document.getElementById("editProductId").value = product.id;
    document.getElementById("productName").value = product.name;
    document.getElementById("productCategory").value = product.category;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productStock").value = product.stock;
    document.getElementById("productImage").value = product.image;

    document.getElementById("modalTitle").textContent = "Edit Product";
    document.getElementById("productModal").classList.add("show");
}

// DELETE PRODUCT
function deleteProduct(id) {

    if (!confirm("Are you sure you want to delete this product?")) return;

    products = products.filter(product => product.id !== id);
    renderProducts();
}

// SEARCH AND FILTER
document.getElementById("productSearch").addEventListener("input", renderProducts);
document.getElementById("categoryFilter").addEventListener("change", renderProducts);
document.getElementById("stockFilter").addEventListener("change", renderProducts);

// INITIAL RENDER
renderProducts();



// ===================================
// GREENORA - ORDERS MANAGEMENT
// ===================================

let orders = [
    {
        id: "GR1001",
        customer: "Arun Kumar",
        phone: "9876543210",
        address: "Anna Nagar, Madurai",
        date: "2026-11-05",
        items: 3,
        amount: 2450,
        payment: "Paid",
        status: "Delivered"
    },
    {
        id: "GR1002",
        customer: "Priya Sharma",
        phone: "9876543211",
        address: "KK Nagar, Chennai",
        date: "2026-11-05",
        items: 2,
        amount: 1850,
        payment: "Pending",
        status: "Pending"
    },
    {
        id: "GR1003",
        customer: "Rahul Kumar",
        phone: "9876543212",
        address: "Velachery, Chennai",
        date: "2026-11-04",
        items: 5,
        amount: 3200,
        payment: "Paid",
        status: "Processing"
    },
    {
        id: "GR1004",
        customer: "Divya R",
        phone: "9876543213",
        address: "Gandhi Nagar, Coimbatore",
        date: "2026-11-04",
        items: 4,
        amount: 1450,
        payment: "Paid",
        status: "Shipped"
    },
    {
        id: "GR1005",
        customer: "Karthik S",
        phone: "9876543214",
        address: "Town Hall, Madurai",
        date: "2026-11-03",
        items: 2,
        amount: 950,
        payment: "Paid",
        status: "Delivered"
    },
    {
        id: "GR1006",
        customer: "Meena Devi",
        phone: "9876543215",
        address: "RS Puram, Coimbatore",
        date: "2026-11-03",
        items: 6,
        amount: 2800,
        payment: "Refunded",
        status: "Cancelled"
    },
    {
        id: "GR1007",
        customer: "Vijay Anand",
        phone: "9876543216",
        address: "Adyar, Chennai",
        date: "2026-11-02",
        items: 3,
        amount: 1750,
        payment: "Paid",
        status: "Shipped"
    },
    {
        id: "GR1008",
        customer: "Sneha M",
        phone: "9876543217",
        address: "Simmakkal, Madurai",
        date: "2026-11-01",
        items: 1,
        amount: 650,
        payment: "Paid",
        status: "Delivered"
    }
];

let activeOrderFilter = "All";
let selectedOrderId = null;

// SAFE TEXT FOR TABLE AND MODAL
function escapeOrderText(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// STATUS CLASS
function getOrderStatusClass(status) {
    const classes = {
        "Pending": "status-pending",
        "Processing": "status-processing",
        "Shipped": "status-shipped",
        "Delivered": "status-delivered",
        "Cancelled": "status-cancelled"
    };

    return classes[status] || "";
}

// PAYMENT CLASS
function getPaymentClass(payment) {
    const classes = {
        "Paid": "payment-paid",
        "Pending": "payment-pending",
        "Refunded": "payment-refunded"
    };

    return classes[payment] || "";
}

// UPDATE STATISTICS
function updateOrderStats() {

    document.getElementById("allOrdersCount").textContent =
        orders.length;

    document.getElementById("pendingOrdersCount").textContent =
        orders.filter(order => order.status === "Pending").length;

    document.getElementById("shippingOrdersCount").textContent =
        orders.filter(order => order.status === "Shipped").length;

    document.getElementById("deliveredOrdersCount").textContent =
        orders.filter(order => order.status === "Delivered").length;
}

// RENDER ORDERS
function renderOrders() {

    const tbody = document.getElementById("ordersTableBody");
    if (!tbody) return;

    const search = document.getElementById("orderSearch").value
        .trim().toLowerCase();

    const paymentFilter =
        document.getElementById("orderPaymentFilter").value;

    const sortValue =
        document.getElementById("orderSort").value;

    let filteredOrders = orders.filter(order => {

        const matchesSearch =
            order.id.toLowerCase().includes(search) ||
            order.customer.toLowerCase().includes(search);

        const matchesStatus =
            activeOrderFilter === "All" ||
            order.status === activeOrderFilter;

        const matchesPayment =
            paymentFilter === "All" ||
            order.payment === paymentFilter;

        return matchesSearch && matchesStatus && matchesPayment;
    });

    // SORT ORDERS
    if (sortValue === "newest") {
        filteredOrders.sort((a, b) => b.date.localeCompare(a.date));
    } else if (sortValue === "oldest") {
        filteredOrders.sort((a, b) => a.date.localeCompare(b.date));
    } else if (sortValue === "highest") {
        filteredOrders.sort((a, b) => b.amount - a.amount);
    } else if (sortValue === "lowest") {
        filteredOrders.sort((a, b) => a.amount - b.amount);
    }

    tbody.innerHTML = filteredOrders.map((order, index) => {

        const formattedDate = new Date(order.date + "T00:00:00")
            .toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });

        return `
            <tr style="animation-delay:${index * 0.045}s">

                <td class="order-id">#${escapeOrderText(order.id)}</td>

                <td class="order-customer">
                    ${escapeOrderText(order.customer)}
                </td>

                <td class="order-date">${formattedDate}</td>

                <td>${order.items} Items</td>

                <td>₹${order.amount.toLocaleString("en-IN")}</td>

                <td>
                    <span class="payment-status ${getPaymentClass(order.payment)}">
                        ${escapeOrderText(order.payment)}
                    </span>
                </td>

                <td>
                    <span class="order-status ${getOrderStatusClass(order.status)}">
                        ${escapeOrderText(order.status)}
                    </span>
                </td>

                <td>
                    <button class="order-view-btn"
                        onclick="viewOrder('${escapeOrderText(order.id)}')"
                        title="View Order">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </td>

            </tr>
        `;
    }).join("");

    document.getElementById("ordersEmpty").style.display =
        filteredOrders.length ? "none" : "block";

    document.getElementById("ordersShowing").textContent =
        `Showing ${filteredOrders.length} of ${orders.length} orders`;

    updateOrderStats();
}

// FILTER TABS
document.querySelectorAll(".order-tab").forEach(tab => {

    tab.addEventListener("click", function() {

        document.querySelectorAll(".order-tab").forEach(item => {
            item.classList.remove("active");
        });

        this.classList.add("active");

        activeOrderFilter = this.dataset.status;

        renderOrders();
    });
});

// SEARCH AND FILTER EVENTS
document.getElementById("orderSearch")
    .addEventListener("input", renderOrders);

document.getElementById("orderPaymentFilter")
    .addEventListener("change", renderOrders);

document.getElementById("orderSort")
    .addEventListener("change", renderOrders);

// VIEW ORDER DETAILS
function viewOrder(id) {

    const order = orders.find(item => item.id === id);
    if (!order) return;

    selectedOrderId = id;

    document.getElementById("detailOrderId").textContent =
        "#" + order.id;

    document.getElementById("detailCustomer").textContent =
        "Customer: " + order.customer;

    document.getElementById("detailPhone").textContent =
        "Phone: " + order.phone;

    document.getElementById("detailAddress").textContent =
        "Address: " + order.address;

    document.getElementById("detailDate").textContent =
        "Order Date: " + order.date;

    document.getElementById("detailItems").textContent =
        "Total Items: " + order.items;

    document.getElementById("detailAmount").textContent =
        "Total Amount: ₹" + order.amount.toLocaleString("en-IN");

    document.getElementById("detailPayment").textContent =
        "Payment: " + order.payment;

    document.getElementById("detailStatus").value = order.status;

    document.getElementById("orderModal").classList.add("show");
}

// CLOSE MODAL
function closeOrderModal() {
    document.getElementById("orderModal").classList.remove("show");
    selectedOrderId = null;
}


// ===================================
// GREENORA - CUSTOMER MANAGEMENT
// ===================================

let customers = [
    {
        id: "CU1001",
        name: "Arun Kumar",
        email: "arun@gmail.com",
        phone: "9876543210",
        address: "Anna Nagar, Madurai",
        orders: 8,
        spent: 12450,
        joined: "2026-10-25",
        status: "Active"
    },
    {
        id: "CU1002",
        name: "Priya Sharma",
        email: "priya@gmail.com",
        phone: "9876543211",
        address: "KK Nagar, Chennai",
        orders: 5,
        spent: 8500,
        joined: "2026-10-28",
        status: "Active"
    },
    {
        id: "CU1003",
        name: "Rahul Kumar",
        email: "rahul@gmail.com",
        phone: "9876543212",
        address: "Velachery, Chennai",
        orders: 3,
        spent: 6200,
        joined: "2026-10-30",
        status: "Active"
    },
    {
        id: "CU1004",
        name: "Divya R",
        email: "divya@gmail.com",
        phone: "9876543213",
        address: "Gandhi Nagar, Coimbatore",
        orders: 2,
        spent: 3200,
        joined: "2026-11-01",
        status: "Inactive"
    },
    {
        id: "CU1005",
        name: "Karthik S",
        email: "karthik@gmail.com",
        phone: "9876543214",
        address: "Town Hall, Madurai",
        orders: 6,
        spent: 9800,
        joined: "2026-11-02",
        status: "Active"
    },
    {
        id: "CU1006",
        name: "Meena Devi",
        email: "meena@gmail.com",
        phone: "9876543215",
        address: "RS Puram, Coimbatore",
        orders: 4,
        spent: 7500,
        joined: "2026-11-03",
        status: "Active"
    },
    {
        id: "CU1007",
        name: "Vijay Anand",
        email: "vijay@gmail.com",
        phone: "9876543216",
        address: "Adyar, Chennai",
        orders: 1,
        spent: 1750,
        joined: "2026-11-04",
        status: "Inactive"
    },
    {
        id: "CU1008",
        name: "Sneha M",
        email: "sneha@gmail.com",
        phone: "9876543217",
        address: "Simmakkal, Madurai",
        orders: 7,
        spent: 11500,
        joined: "2026-11-05",
        status: "Active"
    }
];

let selectedCustomerId = null;


// CUSTOMER STATISTICS
function updateCustomerStats() {

    document.getElementById("totalCustomers").textContent =
        customers.length;

    document.getElementById("activeCustomers").textContent =
        customers.filter(c => c.status === "Active").length;

    document.getElementById("newCustomers").textContent =
        customers.filter(c => c.joined === "2026-11-05").length;

    document.getElementById("customerTotalOrders").textContent =
        customers.reduce((total, c) => total + c.orders, 0);
}


// RENDER CUSTOMERS
function renderCustomers() {

    const tbody = document.getElementById("customersTableBody");
    if (!tbody) return;

    const search = document.getElementById("customerSearch")
        .value.trim().toLowerCase();

    const statusFilter =
        document.getElementById("customerStatusFilter").value;

    const sortValue =
        document.getElementById("customerSort").value;

    let filteredCustomers = customers.filter(customer => {

        const matchesSearch =
            customer.name.toLowerCase().includes(search) ||
            customer.email.toLowerCase().includes(search) ||
            customer.phone.includes(search);

        const matchesStatus =
            statusFilter === "All" ||
            customer.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    if (sortValue === "newest") {
        filteredCustomers.sort((a, b) =>
            b.joined.localeCompare(a.joined)
        );
    } else if (sortValue === "oldest") {
        filteredCustomers.sort((a, b) =>
            a.joined.localeCompare(b.joined)
        );
    } else if (sortValue === "highest") {
        filteredCustomers.sort((a, b) =>
            b.orders - a.orders
        );
    }

    tbody.innerHTML = filteredCustomers.map(customer => {

        const date = new Date(customer.joined + "T00:00:00")
            .toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });

        return `
            <tr>
                <td>
                    <div class="customer-name-cell">
                        <div class="customer-avatar">
                            ${customer.name.charAt(0)}
                        </div>
                        <div>
                            <strong>${customer.name}</strong>
                            <small>${customer.email}</small>
                        </div>
                    </div>
                </td>

                <td>${customer.phone}</td>
                <td>${customer.address}</td>
                <td>${customer.orders}</td>
                <td>₹${customer.spent.toLocaleString("en-IN")}</td>
                <td>${date}</td>

                <td>
                    <span class="customer-status ${customer.status.toLowerCase()}">
                        ${customer.status}
                    </span>
                </td>

                <td>
                    <button class="customer-view-btn"
                            onclick="viewCustomer('${customer.id}')"
                            title="View Customer">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join("");

    document.getElementById("customersEmpty").style.display =
        filteredCustomers.length ? "none" : "block";

    document.getElementById("customersShowing").textContent =
        `Showing ${filteredCustomers.length} of ${customers.length} customers`;

    updateCustomerStats();
}


// VIEW CUSTOMER
function viewCustomer(id) {

    const customer = customers.find(c => c.id === id);
    if (!customer) return;

    selectedCustomerId = id;

    document.getElementById("customerDetailName").textContent =
        customer.name;

    document.getElementById("customerDetailEmail").textContent =
        "Email: " + customer.email;

    document.getElementById("customerDetailPhone").textContent =
        "Phone: " + customer.phone;

    document.getElementById("customerDetailAddress").textContent =
        "Address: " + customer.address;

    document.getElementById("customerDetailOrders").textContent =
        "Total Orders: " + customer.orders;

    document.getElementById("customerDetailSpent").textContent =
        "Total Spent: ₹" + customer.spent.toLocaleString("en-IN");

    document.getElementById("customerDetailJoined").textContent =
        "Joined Date: " + customer.joined;

    document.getElementById("customerDetailStatus").value =
        customer.status;

    document.getElementById("customerModal").classList.add("show");
}


// CLOSE MODAL
function closeCustomerModal() {

    document.getElementById("customerModal").classList.remove("show");

    selectedCustomerId = null;
}


// UPDATE CUSTOMER STATUS
function saveCustomerStatus() {
    window.location.href = "404.html";
}

// SEARCH AND FILTER
document.getElementById("customerSearch")
    .addEventListener("input", renderCustomers);

document.getElementById("customerStatusFilter")
    .addEventListener("change", renderCustomers);

document.getElementById("customerSort")
    .addEventListener("change", renderCustomers);


// EXPORT CUSTOMERS
function exportCustomers() {
    window.location.href = "404.html";
}


// INITIAL LOAD
renderCustomers();

// ================= REPORTS =================

// 404 REDIRECT
function goTo404() {
    window.location.href = "404.html";
}


// REVENUE CHART
const revenueCanvas = document.getElementById("revenueChart");

if (revenueCanvas && typeof Chart !== "undefined") {

    new Chart(revenueCanvas, {
        type: "line",

        data: {
            labels: [
                "Jan", "Feb", "Mar", "Apr",
                "May", "Jun", "Jul", "Aug",
                "Sep", "Oct", "Nov", "Dec"
            ],

            datasets: [{
                label: "Revenue",
                data: [
                    42000, 55000, 48000, 68000,
                    72000, 65000, 85000, 79000,
                    96000, 88000, 105000, 120000
                ],

                borderColor: "#204B30",
                backgroundColor: "rgba(128, 169, 107, 0.15)",
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: "#204B30",
                pointHoverRadius: 7
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                }
            },

            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: "#edf1eb"
                    },
                    ticks: {
                        callback: value => "₹" + value / 1000 + "k"
                    }
                },

                x: {
                    grid: {
                        display: false
                    }
                }
            },

            animation: {
                duration: 1600,
                easing: "easeOutQuart"
            }
        }
    });
}


// REVENUE BREAKDOWN CHART
const breakdownCanvas = document.getElementById("revenueBreakdownChart");

if (breakdownCanvas && typeof Chart !== "undefined") {

    new Chart(breakdownCanvas, {
        type: "doughnut",

        data: {
            labels: [
                "Organic Fruits",
                "Vegetables",
                "Dairy Products",
                "Others"
            ],

            datasets: [{
                data: [35, 28, 22, 15],

                backgroundColor: [
                    "#204B30",
                    "#80A96B",
                    "#C7D99E",
                    "#D9E4D4"
                ],

                borderWidth: 3,
                borderColor: "#ffffff",
                hoverOffset: 10
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "70%",

            plugins: {
                legend: {
                    display: false
                }
            },

            animation: {
                animateRotate: true,
                duration: 1500
            }
        }
    });
}


// SALES PERFORMANCE CHART
const performanceCanvas = document.getElementById("salesPerformanceChart");

if (performanceCanvas && typeof Chart !== "undefined") {

    new Chart(performanceCanvas, {
        type: "bar",

        data: {
            labels: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
            ],

            datasets: [{
                label: "Sales",
                data: [120, 190, 150, 230, 180, 280, 240],

                backgroundColor: [
                    "#C7D99E",
                    "#80A96B",
                    "#C7D99E",
                    "#80A96B",
                    "#C7D99E",
                    "#204B30",
                    "#80A96B"
                ],

                borderRadius: 7,
                borderSkipped: false,
                barThickness: 23
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                }
            },

            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: "#edf1eb"
                    }
                },

                x: {
                    grid: {
                        display: false
                    }
                }
            },

            animation: {
                duration: 1600,
                easing: "easeOutQuart"
            }
        }
    });
}