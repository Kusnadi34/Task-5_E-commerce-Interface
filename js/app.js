/** Main Application Logic center */


// 1. APP STATE,
let products = [];
let cart = [];
let users = []; // Simulated user database
let currentUser = null; // Logged in user session
let currentCategory = 'all';
let searchQuery = '';
let currentSort = 'default';

// Load State from LocalStorage.
function loadState() {
    try {
        const savedCart = localStorage.getItem('veloshop_cart');
        if (savedCart) cart = JSON.parse(savedCart);

        const savedUsers = localStorage.getItem('veloshop_users');
        if (savedUsers) users = JSON.parse(savedUsers);

        const savedSession = localStorage.getItem('veloshop_currentUser');
        if (savedSession) currentUser = JSON.parse(savedSession);
    } catch (e) {
        console.error("Error loading data from localStorage", e);
    }
}

// URL Params.
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('category')) currentCategory = urlParams.get('category');
if (urlParams.has('sort')) currentSort = urlParams.get('sort');

// 2. DOM ELEMENTS,
const productGrid = document.getElementById('product-grid');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');
const categoryFilters = document.getElementById('category-filters');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const toastContainer = document.getElementById('toast-container');
const authNavContainer = document.getElementById('auth-nav-container');

// Modals.
const productModal = document.getElementById('product-modal');
const productModalBody = document.getElementById('product-modal-body');
const checkoutModal = document.getElementById('checkout-modal');
const checkoutModalBody = document.getElementById('checkout-modal-body');
const authModal = document.getElementById('auth-modal');
const authModalBody = document.getElementById('auth-modal-body');

// 3. UTILITY FUNCTIONS,
function showToast(message, type = 'default') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function updateURL() {
    const params = new URLSearchParams();
    if (currentCategory !== 'all') params.set('category', currentCategory);
    if (currentSort !== 'default') params.set('sort', currentSort);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
}

// 4. AUTHENTICATION LOGIC,
function renderAuthNav() {
    authNavContainer.innerHTML = AuthNavContent(currentUser);
    
    // Re attach event listener since innerHTML wipes it out.
    const btnLoginNav = document.getElementById('btn-login-nav');
    const btnLogout = document.getElementById('btn-logout');

    if (btnLoginNav) {
        btnLoginNav.addEventListener('click', () => openAuthModal('login'));
    }
    if (btnLogout) {
        btnLogout.addEventListener('click', handleLogout);
    }
}

function openAuthModal(type = 'login') {
    if (type === 'login') {
        authModalBody.innerHTML = LoginFormContent();
        document.getElementById('link-to-register').addEventListener('click', (e) => {
            e.preventDefault();
            openAuthModal('register');
        });
    } else {
        authModalBody.innerHTML = RegisterFormContent();
        document.getElementById('link-to-login').addEventListener('click', (e) => {
            e.preventDefault();
            openAuthModal('login');
        });
    }
    authModal.classList.add('active');
}

function closeAuthModal() {
    authModal.classList.remove('active');
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim().toLowerCase();
    const password = document.getElementById('register-password').value;

    // Check if email exists..
    if (users.some(u => u.email === email)) {
        return showToast('Email already registered!', 'danger');
    }

    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);
    localStorage.setItem('veloshop_users', JSON.stringify(users));

    // Auto login..
    currentUser = newUser;
    localStorage.setItem('veloshop_currentUser', JSON.stringify(currentUser));

    closeAuthModal();
    renderAuthNav();
    showToast(`Welcome, ${name}!`, 'success');
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('veloshop_currentUser', JSON.stringify(currentUser));
        closeAuthModal();
        renderAuthNav();
        showToast(`Welcome back, ${user.name.split(' ')[0]}!`, 'success');
    } else {
        showToast('Invalid email or password', 'danger');
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('veloshop_currentUser');
    renderAuthNav();
    showToast('Logged out successfully');
}

// 5. RENDER FUNCTIONS for Products, Cart, etc. - Existing
function renderSkeletons() {
    productGrid.innerHTML = Array(8).fill(SkeletonCard()).join('');
}

function renderProducts() {
    let filtered = [...products];
    if (currentCategory !== 'all') filtered = filtered.filter(p => p.category === currentCategory);
    if (searchQuery) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery));

    if (currentSort === 'price-low') filtered.sort((a, b) => a.price - b.price);
    else if (currentSort === 'price-high') filtered.sort((a, b) => b.price - a.price);
    else if (currentSort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));

    if (filtered.length === 0) {
        productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:#888; padding: 40px 0;">No products found.</p>`;
        return;
    }
    productGrid.innerHTML = filtered.map(p => ProductCard(p)).join('');
}

function renderCart() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<div class="empty-cart"><p>Your cart is empty.</p></div>`;
        cartTotalPrice.textContent = '$0';
        return;
    }
    cartItemsContainer.innerHTML = cart.map(item => CartItem(item)).join('');
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    cartTotalPrice.textContent = formatUSD(total);
}

function updateCartBadge() {
    cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}

function saveCart() {
    localStorage.setItem('veloshop_cart', JSON.stringify(cart));
    renderCart();
    updateCartBadge();
}

// 6. CART and card ACTIONS.
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) existingItem.qty += 1;
    else cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 });
    saveCart();
    showToast(`${product.name} added to cart!`, 'success');
}

function updateQty(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) removeFromCart(productId);
        else saveCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    showToast('Item removed from cart', 'danger');
}

function openCart() {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
    renderCart();
}

function closeCart() {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
}

function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    productModalBody.innerHTML = ProductDetailContent(product);
    productModal.classList.add('active');
}

function openCheckoutModal() {
    if (cart.length === 0) return showToast('Cart is empty!', 'danger');
    
    // Check Auth for Checkout
    if (!currentUser) {
        showToast('Please login to proceed to checkout', 'danger');
        openAuthModal('login');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    checkoutModalBody.innerHTML = CheckoutFormContent(total, currentUser);
    checkoutModal.classList.add('active');
}

// 7. EVENT LISTENERS
document.getElementById('cart-btn').addEventListener('click', openCart);
document.getElementById('close-cart').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

document.getElementById('btn-checkout').addEventListener('click', () => {
    closeCart();
    openCheckoutModal();
});

document.getElementById('close-product-modal').addEventListener('click', () => productModal.classList.remove('active'));
document.getElementById('close-checkout-modal').addEventListener('click', () => checkoutModal.classList.remove('active'));
document.getElementById('close-auth-modal').addEventListener('click', closeAuthModal);

// Event Delegation for Products
productGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (!card) return;
    const productId = parseInt(card.dataset.id);
    if (e.target.classList.contains('btn-add')) {
        e.stopPropagation();
        addToCart(productId);
    } else if (e.target.closest('.product-image') || e.target.classList.contains('product-name')) {
        openProductModal(productId);
    }
});

// Event Delegation for Cart
cartItemsContainer.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('button[data-action]');
    if (!actionBtn) return;
    const container = e.target.closest('.cart-item-actions');
    const productId = parseInt(container.dataset.id);
    const action = actionBtn.dataset.action;
    if (action === 'increase') updateQty(productId, 1);
    if (action === 'decrease') updateQty(productId, -1);
    if (action === 'remove') removeFromCart(productId);
});

// Delegation for Dynamic Forms (Auth & Checkout)
authModalBody.addEventListener('submit', (e) => {
    if (e.target.id === 'login-form') handleLogin(e);
    if (e.target.id === 'register-form') handleRegister(e);
});

checkoutModalBody.addEventListener('submit', (e) => {
    if (e.target.id === 'checkout-form') {
        e.preventDefault();
        const submitBtn = document.getElementById('submit-order-btn');
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;
        setTimeout(() => {
            const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
            showToast(`Order placed! Total: ${formatUSD(total)}`, 'success');
            cart = [];
            saveCart();
            checkoutModal.classList.remove('active');
        }, 1500);
    }
});

// Add to cart from Modal
productModalBody.addEventListener('click', (e) => {
    if (e.target.dataset.action === 'add-from-modal') {
        addToCart(parseInt(e.target.dataset.id));
        productModal.classList.remove('active');
    }
});

// Filters & Search
categoryFilters.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        currentCategory = e.target.dataset.category;
        updateURL();
        renderProducts();
    }
});

sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    updateURL();
    renderProducts();
});

let typingTimer;
searchInput.addEventListener('input', (e) => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        searchQuery = e.target.value.toLowerCase();
        renderProducts();
    }, 300);
});

// 8. INITIALIZATION
document.addEventListener('DOMContentLoaded', async () => {
    loadState();
    renderAuthNav(); // Render Login/Logout state

    if (currentCategory !== 'all') {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === currentCategory);
        });
    }
    sortSelect.value = currentSort;

    updateCartBadge();
    renderCart();
    
    renderSkeletons();
    try {
        products = await fetchProductsAPI(); // From data.js
        renderProducts();
    } catch (error) {
        console.error(error);
        productGrid.innerHTML = `<p style="text-align:center; color:red;">Failed to load products.</p>`;
    }
});