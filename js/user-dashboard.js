/* ============================================
   GREENORA - ORGANIC FOOD STORE
   USER DASHBOARD JAVASCRIPT
============================================ */

/* PRODUCT DATA */

const products = [
    {
        id: 1,
        name: "Farm Fresh Apples",
        category: "Fruits",
        price: 180,
        unit: "1 kg",
        emoji: "🍎",
        tag: "Bestseller",
        saved: true
    },
    {
        id: 2,
        name: "Organic Bananas",
        category: "Fruits",
        price: 65,
        unit: "1 dozen",
        emoji: "🍌",
        tag: "Fresh Pick",
        saved: false
    },
    {
        id: 3,
        name: "Green Broccoli",
        category: "Vegetables",
        price: 90,
        unit: "500 g",
        emoji: "🥦",
        tag: "Organic",
        saved: true
    },
    {
        id: 4,
        name: "Farm Carrots",
        category: "Vegetables",
        price: 55,
        unit: "500 g",
        emoji: "🥕",
        tag: "Farm Fresh",
        saved: false
    },
    {
        id: 5,
        name: "Brown Rice",
        category: "Grains",
        price: 140,
        unit: "1 kg",
        emoji: "🌾",
        tag: "Whole Grain",
        saved: true
    },
    {
        id: 6,
        name: "Pure Cow Milk",
        category: "Dairy",
        price: 38,
        unit: "500 ml",
        emoji: "🥛",
        tag: "Natural",
        saved: false
    },
    {
        id: 7,
        name: "Raw Honey",
        category: "Pantry",
        price: 260,
        unit: "500 g",
        emoji: "🍯",
        tag: "No Additives",
        saved: true
    },
    {
        id: 8,
        name: "Fresh Strawberries",
        category: "Fruits",
        price: 120,
        unit: "250 g",
        emoji: "🍓",
        tag: "Seasonal",
        saved: false
    }
];


/* ORDER DATA */

const orders = [
    {
        id: "#GR1028",
        date: "08 Nov 2026",
        items: "Organic Apples, Brown Rice",
        amount: 420,
        status: "In transit"
    },
    {
        id: "#GR1027",
        date: "06 Nov 2026",
        items: "Broccoli, Carrots, Milk",
        amount: 265,
        status: "Processing"
    },
    {
        id: "#GR1026",
        date: "02 Nov 2026",
        items: "Raw Honey, Bananas",
        amount: 325,
        status: "Delivered"
    },
    {
        id: "#GR1025",
        date: "29 Oct 2026",
        items: "Fresh Fruit Basket",
        amount: 580,
        status: "Delivered"
    },
    {
        id: "#GR1024",
        date: "25 Oct 2026",
        items: "Organic Grains Pack",
        amount: 690,
        status: "Delivered"
    }
];


/* GLOBAL VARIABLES */

let selectedCategory = "all";

let wishlist = new Set(
    products
        .filter(product => product.saved)
        .map(product => product.id)
);

let cart = [];


/* SHORTCUT SELECTORS */

const $ = selector =>
    document.querySelector(selector);

const $$ = selector =>
    [...document.querySelectorAll(selector)];


/* ============================================
   TOAST MESSAGE
============================================ */

function toast(message) {

    const toastElement = $("#toast");

    if (!toastElement) return;

    toastElement.textContent = message;

    toastElement.classList.add("show");

    clearTimeout(toast.timer);

    toast.timer = setTimeout(() => {

        toastElement.classList.remove("show");

    }, 2300);
}


/* ============================================
   PAGE NAVIGATION
============================================ */

function go(page) {

    showPage(page);

}


function showPage(page) {

    const target = document.getElementById(page);

    if (!target) return;

    // Hide all sections

    $$(".page-section").forEach(section => {

        section.classList.toggle(
            "active",
            section === target
        );

    });


    // Active sidebar menu

    $$(".nav-links a").forEach(link => {

        link.classList.toggle(
            "active",
            link.dataset.page === page
        );

    });


    // Page titles

    const titles = {

        overview: "My Dashboard",

        shop: "Shop Organic",

        orders: "My Orders",

        wishlist: "My Wishlist",

        rewards: "Offers & Rewards",

        profile: "My Profile"

    };


    const pageTitle = $("#pageTitle");

    if (pageTitle) {

        pageTitle.textContent =
            titles[page] || "My Dashboard";

    }


    // Close mobile sidebar

    const sidebar = $("#sidebar");

    const overlay = $("#overlay");

    if (sidebar) {

        sidebar.classList.remove("open");

    }

    if (overlay) {

        overlay.classList.remove("show");

    }


    // Scroll to top

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* ============================================
   PRODUCT CARD DESIGN
============================================ */

function productCard(product) {

    const saved = wishlist.has(product.id);

    return `

        <article class="product-card">

            <div class="product-visual">

                <span class="emoji">
                    ${product.emoji}
                </span>

                <span class="product-tag">
                    ${product.tag}
                </span>

                <button
                    class="heart-btn ${saved ? "saved" : ""}"
                    data-heart="${product.id}"
                    aria-label="Toggle wishlist">

                    <i class="${saved ? "fa-solid" : "fa-regular"} fa-heart"></i>

                </button>

            </div>


            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>
                    ${product.name}
                </h3>

                <div class="product-meta">

                    <span class="product-price">

                        ₹${product.price}

                        <small>
                            / ${product.unit}
                        </small>

                    </span>


                    <button
                        class="add-cart"
                        data-cart="${product.id}"
                        aria-label="Add to cart">

                        <i class="fa-solid fa-plus"></i>

                    </button>

                </div>

            </div>

        </article>

    `;

}


/* ============================================
   RENDER PRODUCTS
============================================ */

function renderProducts() {

    const searchInput = $("#productSearch");

    const search = searchInput
        ? searchInput.value.toLowerCase()
        : "";


    // Filter products

    const filteredProducts = products.filter(product => {

        const categoryMatch =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        const searchMatch =
            product.name.toLowerCase().includes(search);

        return categoryMatch && searchMatch;

    });


    // Shop products

    const shopProducts = $("#shopProducts");

    if (shopProducts) {

        shopProducts.innerHTML = filteredProducts.length

            ? filteredProducts.map(productCard).join("")

            : `
                <div class="empty-state">

                    No products found.
                    Try another search.

                </div>
            `;

    }


    // Wishlist products

    const wishlistProducts = $("#wishlistProducts");

    const savedProducts = products.filter(product =>
        wishlist.has(product.id)
    );


    if (wishlistProducts) {

        wishlistProducts.innerHTML = savedProducts.length

            ? savedProducts.map(productCard).join("")

            : `
                <div class="empty-state">

                    Your wishlist is waiting for some goodness.

                    Save a product from Shop Organic.

                </div>
            `;

    }


    // Featured products

    const featuredProducts = $("#featuredProducts");

    if (featuredProducts) {

        featuredProducts.innerHTML = products
            .slice(0, 4)
            .map(productCard)
            .join("");

    }


    // Wishlist count

    const wishlistCount = $("#wishlistCount");

    if (wishlistCount) {

        wishlistCount.textContent =
            String(wishlist.size).padStart(2, "0");

    }

}


/* ============================================
   ORDER TABLE
============================================ */

function orderRows(list, showAction = true) {

    return list.map(order => `

        <tr>

            <td>
                <strong>${order.id}</strong>
            </td>

            <td>
                ${order.date}
            </td>

            <td>
                ${order.items}
            </td>

            <td>
                <strong>
                    ₹${order.amount.toLocaleString("en-IN")}
                </strong>
            </td>

            <td>

                <span class="status ${
                    order.status === "Delivered"
                        ? "delivered"
                        : order.status === "Processing"
                        ? "processing"
                        : "in-transit"
                }">

                    ${order.status}

                </span>

            </td>

            ${
                showAction

                ? `

                    <td>

                        <button
                            class="view-btn"
                            data-order="${order.id}">

                            Track

                        </button>

                    </td>

                `

                : ""

            }

        </tr>

    `).join("");

}


/* ============================================
   RENDER ORDERS
============================================ */

function renderOrders() {

    const ordersBody = $("#ordersBody");

    const recentOrdersBody = $("#recentOrdersBody");


    // All orders

    if (ordersBody) {

        ordersBody.innerHTML = orderRows(orders);

    }


    // Recent orders

    if (recentOrdersBody) {

        recentOrdersBody.innerHTML =
            orderRows(orders.slice(0, 3), false);

    }


    // Order count

    const totalOrders = orders.length + 3;

    const orderCount = $("#orderCount");

    const allOrdersMetric = $("#allOrdersMetric");


    if (orderCount) {

        orderCount.textContent =
            String(totalOrders).padStart(2, "0");

    }


    if (allOrdersMetric) {

        allOrdersMetric.textContent =
            String(totalOrders).padStart(2, "0");

    }

}


/* ============================================
   DOCUMENT CLICK EVENTS
============================================ */

document.addEventListener("click", function (event) {


    /* SIDEBAR NAVIGATION */

    const nav = event.target.closest("[data-page]");

    if (nav) {

        event.preventDefault();

        showPage(nav.dataset.page);

        return;

    }


    /* DASHBOARD BUTTON NAVIGATION */

    const goButton = event.target.closest("[data-go]");

    if (goButton) {

        showPage(goButton.dataset.go);

        return;

    }


    /* WISHLIST BUTTON */

    const heartButton = event.target.closest("[data-heart]");

    if (heartButton) {

        const id = Number(heartButton.dataset.heart);


        if (wishlist.has(id)) {

            wishlist.delete(id);

            toast("Removed from wishlist");

        } else {

            wishlist.add(id);

            toast("Added to your wishlist");

        }


        renderProducts();

        return;

    }


    /* ADD TO CART */

    const cartButton = event.target.closest("[data-cart]");

    if (cartButton) {

        const product = products.find(item =>
            item.id === Number(cartButton.dataset.cart)
        );


        if (product) {

            cart.push(product);

            toast(`${product.name} added to your cart`);

        }

        return;

    }


    /* COPY COUPON */

    const copyButton = event.target.closest("[data-code]");

    if (copyButton) {

        const code = copyButton.dataset.code;


        if (navigator.clipboard && navigator.clipboard.writeText) {

            navigator.clipboard.writeText(code)

                .then(() => {

                    toast(`${code} copied`);

                })

                .catch(() => {

                    toast(`Coupon code: ${code}`);

                });

        } else {

            toast(`Coupon code: ${code}`);

        }

        return;

    }


    /* ORDER TRACKING */

    const trackButton = event.target.closest("[data-order]");

    if (trackButton) {

        const order = orders.find(item =>
            item.id === trackButton.dataset.order
        );


        if (order) {

            toast(
                `${order.id} • ${order.status}`
            );

        }

        return;

    }

});


/* ============================================
   MOBILE SIDEBAR
============================================ */

const menuBtn = $("#menuBtn");

const sidebar = $("#sidebar");

const overlay = $("#overlay");


if (menuBtn && sidebar && overlay) {

    menuBtn.addEventListener("click", function () {

        sidebar.classList.add("open");

        overlay.classList.add("show");

    });


    overlay.addEventListener("click", function () {

        sidebar.classList.remove("open");

        overlay.classList.remove("show");

    });

}


/* ============================================
   PRODUCT SEARCH
============================================ */

const productSearch = $("#productSearch");

if (productSearch) {

    productSearch.addEventListener("input", function () {

        renderProducts();

    });

}


/* ============================================
   CATEGORY FILTER
============================================ */

const categoryFilter = $("#categoryFilter");

if (categoryFilter) {

    categoryFilter.addEventListener("change", function (event) {

        selectedCategory = event.target.value;


        $$(".chip").forEach(chip => {

            chip.classList.toggle(
                "active",
                chip.dataset.category === selectedCategory
            );

        });


        renderProducts();

    });

}


/* ============================================
   CATEGORY CHIPS
============================================ */

const categoryChips = $("#categoryChips");

if (categoryChips) {

    categoryChips.addEventListener("click", function (event) {

        const chip = event.target.closest("[data-category]");

        if (!chip) return;


        selectedCategory = chip.dataset.category;


        if (categoryFilter) {

            categoryFilter.value = selectedCategory;

        }


        $$(".chip").forEach(item => {

            item.classList.toggle(
                "active",
                item === chip
            );

        });


        renderProducts();

    });

}


/* ============================================
   ORDER FILTER
============================================ */

const orderFilter = $("#orderFilter");

if (orderFilter) {

    orderFilter.addEventListener("change", function (event) {

        const value = event.target.value;


        const filteredOrders = value === "all"

            ? orders

            : orders.filter(order =>
                order.status === value
            );


        const ordersBody = $("#ordersBody");

        if (!ordersBody) return;


        ordersBody.innerHTML = filteredOrders.length

            ? orderRows(filteredOrders)

            : `

                <tr>

                    <td colspan="6">

                        No orders in this category.

                    </td>

                </tr>

            `;

    });

}


/* ============================================
   USER PROFILE
============================================ */

function setProfile(name, email) {

    const cleanName = name || "Greenora Guest";


    // Header name

    const topName = $("#topName");

    if (topName) {

        topName.textContent = cleanName;

    }


    // Welcome name

    const welcomeName = $("#welcomeName");

    if (welcomeName) {

        welcomeName.textContent =
            cleanName.split(" ")[0];

    }


    // Profile card name

    const profileCardName = $("#profileCardName");

    if (profileCardName) {

        profileCardName.textContent = cleanName;

    }


    // Avatar

    const firstLetter =
        cleanName.charAt(0).toUpperCase();


    const topAvatar = $("#topAvatar");

    const profileAvatar = $("#profileAvatar");


    if (topAvatar) {

        topAvatar.textContent = firstLetter;

    }


    if (profileAvatar) {

        profileAvatar.textContent = firstLetter;

    }


    // Email

    const profileCardEmail = $("#profileCardEmail");

    const emailInput = $("#emailAddress");


    if (email) {

        if (profileCardEmail) {

            profileCardEmail.textContent = email;

        }

        if (emailInput) {

            emailInput.value = email;

        }

    }


    // Name input

    const nameInput = $("#fullName");

    if (nameInput) {

        nameInput.value = name || "";

    }

}


/* ============================================
   PROFILE FORM SUBMIT
============================================ */

const profileForm = $("#profileForm");

if (profileForm) {

    profileForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const nameInput = $("#fullName");

        const emailInput = $("#emailAddress");


        const name = nameInput.value.trim();

        const email = emailInput.value.trim();


        if (!name || !email) {

            toast("Please enter your name and email");

            return;

        }


        setProfile(name, email);


        toast("Your profile details have been saved");

    });


    profileForm.addEventListener("reset", function () {

        setTimeout(() => {

            toast("Profile form reset");

        }, 0);

    });

}


/* ============================================
   NOTIFICATION BUTTON
============================================ */

const notificationBtn = $("#notificationBtn");

if (notificationBtn) {

    notificationBtn.addEventListener("click", function () {

        toast("You're all caught up!");

    });

}


/* ============================================
   LOGGED IN USER INFORMATION
============================================ */

const params = new URLSearchParams(
    window.location.search
);

let savedUser = {};

try {

    savedUser = JSON.parse(
        localStorage.getItem("greenoraUser") || "{}"
    );

} catch (error) {

    savedUser = {};

}

const customerEmail =
    savedUser.email || params.get("email") || "";

const customerName =
    savedUser.name ||
    params.get("name") ||
    (customerEmail ? customerEmail.split("@")[0] : "Greenora Guest");

setProfile(customerName, customerEmail);



/* ============================================
   CURRENT DATE
============================================ */

const currentDate = $("#currentDate");

if (currentDate) {

    currentDate.textContent =
        new Intl.DateTimeFormat("en-IN", {

            day: "2-digit",

            month: "short",

            year: "numeric"

        }).format(new Date());

}


/* ============================================
   INITIAL RENDER
============================================ */

renderProducts();

renderOrders();


/* ============================================
   INITIAL PAGE FROM URL HASH
============================================ */

const initialPage =
    window.location.hash.replace("#", "");


const validPages = [

    "overview",

    "shop",

    "orders",

    "wishlist",

    "rewards",

    "profile"

];


if (validPages.includes(initialPage)) {

    showPage(initialPage);

}