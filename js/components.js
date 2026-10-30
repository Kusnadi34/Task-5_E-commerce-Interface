/** Components rendering functions */

const formatUSD = (angka) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(angka);
};

// 1. Render Product Card,
function ProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://placehold.co/400x500?text=No+Image'; this.classList.add('error-img')">
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${formatUSD(product.price)}</p>
                <button class="btn-add">+ Add to Cart</button>
            </div>
        </div>
    `;
}

// 2. Render Cart Item,
function CartItem(item) {
    return `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://placehold.co/150x150?text=Error'">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">${formatUSD(item.price)}</p>
                <div class="cart-item-actions" data-id="${item.id}">
                    <button class="qty-btn" data-action="decrease">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" data-action="increase">+</button>
                    <button class="remove-btn" data-action="remove">Remove</button>
                </div>
            </div>
        </div>
    `;
}

// 3. Render Skeleton,
function SkeletonCard() {
    return `
        <div class="product-card skeleton">
            <div class="product-image skeleton-box"></div>
            <div class="product-info">
                <div class="skeleton-text short"></div>
                <div class="skeleton-text long"></div>
                <div class="skeleton-text medium"></div>
                <div class="skeleton-btn"></div>
            </div>
        </div>
    `;
}

// 4. Product Detail Modal,
function ProductDetailContent(product) {
    return `
        <div class="modal-detail-grid">
            <div class="modal-detail-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://placehold.co/600x800?text=No+Image'">
            </div>
            <div class="modal-detail-info">
                <span class="product-category">${product.category}</span>
                <h2 class="modal-title">${product.name}</h2>
                <p class="modal-price">${formatUSD(product.price)}</p>
                <p class="modal-desc">${product.description || 'No description available.'}</p>
                <button class="btn-checkout" data-action="add-from-modal" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `;
}

// 5. Checkout Form,
function CheckoutFormContent(total, user) {
    // Pre-fill name if user exists.
    const defaultName = user ? user.name : '';
    return `
        <h2>Checkout</h2>
        <p style="color: #666; margin-bottom: 20px;">Total Amount: <strong>${formatUSD(total)}</strong></p>
        <form id="checkout-form">
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" id="checkout-name" required value="${defaultName}" placeholder="Enter your name">
            </div>
            <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" id="checkout-phone" required placeholder="+1 (555) 000-0000">
            </div>
            <div class="form-group">
                <label>Shipping Address</label>
                <textarea id="checkout-address" rows="3" required placeholder="Full address details..."></textarea>
            </div>
            <button type="submit" class="btn-checkout" id="submit-order-btn" style="width: 100%; margin-top: 10px;">Confirm Order</button>
        </form>
    `;
}

// 6. Auth Navigation for Login & Logout Buttons,
function AuthNavContent(user) {
    if (user) {
        return `
            <span class="user-greeting">Hi, ${user.name.split(' ')[0]}</span>
            <button class="btn-auth outline" id="btn-logout">Logout</button>
        `;
    } else {
        return `<button class="btn-auth" id="btn-login-nav">Login / Register</button>`;
    }
}

// 7. Login Form,
function LoginFormContent() {
    return `
        <h2 style="margin-bottom: 20px;">Welcome Back</h2>
        <form id="login-form">
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="login-email" required placeholder="you@example.com">
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="login-password" required placeholder="••••••••">
            </div>
            <button type="submit" class="btn-checkout" style="width: 100%; margin-top: 10px;">Login</button>
        </form>
        <div class="form-footer">
            Don't have an account? <a id="link-to-register">Register here</a>
        </div>
    `;
}

// 8. Register Form,
function RegisterFormContent() {
    return `
        <h2 style="margin-bottom: 20px;">Create Account</h2>
        <form id="register-form">
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" id="register-name" required placeholder="John Doe">
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="register-email" required placeholder="you@example.com">
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="register-password" required placeholder="Min. 6 characters" minlength="6">
            </div>
            <button type="submit" class="btn-checkout" style="width: 100%; margin-top: 10px;">Register</button>
        </form>
        <div class="form-footer">
            Already have an account? <a id="link-to-login">Login here</a>
        </div>
    `;
}