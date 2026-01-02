// ===============================
// 1. Product Data
// ===============================
const products = [
    { id: 'p001', name: 'DXW RC Jersey (Black/Red)', price: 450, image: '12 jercey DXW RC pic.jpg' },
    { id: 'p002', name: 'DXW Jersey Style 2 (Green)', price: 450, image: '9 Jercey Dxw 2.jpg' },
    { id: 'p003', name: 'DXW Jersey Style 3 (Abstract Black)', price: 450, image: '11 jercey DXW 2.jpg' },
    { id: 'p004', name: 'DXW Jersey Style 4 (Tiger Stripe)', price: 450, image: '2 jercey dxw 2.jpg' },
    { id: 'p005', name: 'DXW Jersey Style 5 (Blue Geometric)', price: 450, image: '7 jercey dxw 2.jpg' },
    { id: 'p006', name: 'DXW Jersey Style 6 (Red Grid)', price: 450, image: '10 jercey Dxw 2.jpg' },
    { id: 'p007', name: 'DXW Jersey Style 7 (Infinix Black)', price: 450, image: 'IMG-20250924-WA0087.jpg' }
];

// ===============================
// 2. Shipping
// ===============================
const SHIPPING_DHAKA = 55;
const SHIPPING_OUTSIDE = 115;
let shippingFee = SHIPPING_OUTSIDE;

// ===============================
// 3. Cart State
// ===============================
let cart = [];

// ===============================
// 4. DOM Elements
// ===============================
const productGrid = document.getElementById('product-grid');
const cartButton = document.getElementById('cart-button');
const cartCountElement = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const checkoutModal = document.getElementById('checkout-modal');
const successModal = document.getElementById('success-modal');

const cartItemsList = document.getElementById('cart-items-list');
const cartSubtotalElement = document.getElementById('cart-subtotal');
const cartTotalElement = document.getElementById('cart-total');
const checkoutButton = document.getElementById('checkout-button');

const checkoutForm = document.getElementById('checkout-form');
const paymentMethod = document.getElementById('payment');
const bkashInfo = document.getElementById('bkash-info');
const finalTotalDisplay = document.getElementById('final-total-display');

// ===============================
// 5. Render Products
// ===============================
function renderProducts() {
    productGrid.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-actions">
                    <button class="action-icon" data-id="${product.id}" title="Add to Cart">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="price-container">
                    <span class="sale-price">${product.price} TK</span>
                </div>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

// ===============================
// 6. Cart Logic
// ===============================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const item = cart.find(i => i.id === productId);
    if (item) item.quantity++;
    else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    updateCartDisplay();
}

function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }

    updateCartDisplay();
}

function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal + (cart.length ? shippingFee : 0);
    return { subtotal, total };
}

function updateCartDisplay() {
    const { subtotal, total } = calculateTotals();

    cartCountElement.textContent = cart.reduce((s, i) => s + i.quantity, 0);
    cartItemsList.innerHTML = '';

    if (!cart.length) {
        cartItemsList.innerHTML = '<p>Your cart is empty.</p>';
        checkoutButton.disabled = true;
    } else {
        checkoutButton.disabled = false;

        cart.forEach(item => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <span>${item.name}</span>
                <div class="cart-quantity">
                    <button class="qty-btn" data-id="${item.id}" data-action="decrease">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" data-id="${item.id}" data-action="increase">+</button>
                </div>
                <strong>${item.price * item.quantity} TK</strong>
            `;
            cartItemsList.appendChild(div);
        });
    }

    cartSubtotalElement.textContent = subtotal;
    cartTotalElement.textContent = total;
    finalTotalDisplay.textContent = total;
}

// ===============================
// 7. Events
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartDisplay();
});

// Add to Cart from product card
productGrid.addEventListener('click', e => {
    const btn = e.target.closest('.action-icon');
    if (btn?.dataset.id) addToCart(btn.dataset.id);
});

// Open cart modal
cartButton.addEventListener('click', () => {
    cartModal.style.display = 'block';
});

// Close modals
document.querySelectorAll('.close-button').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.modal').style.display = 'none';
    });
});

// Quantity buttons in cart
cartItemsList.addEventListener('click', e => {
    if (!e.target.classList.contains('qty-btn')) return;
    updateQuantity(
        e.target.dataset.id,
        e.target.dataset.action === 'increase' ? 1 : -1
    );
});

// Checkout button
checkoutButton.addEventListener('click', () => {
    cartModal.style.display = 'none';
    checkoutModal.style.display = 'block';
});

// Payment method toggle
paymentMethod.addEventListener('change', () => {
    bkashInfo.style.display = paymentMethod.value === 'bkash' ? 'block' : 'none';
});

// ===============================
// 8. Checkout / Save Order
// ===============================
checkoutForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!cart.length) return alert('Cart is empty!');

    const formData = Object.fromEntries(new FormData(checkoutForm));

    if (formData.payment === 'bkash' && !formData.trxid) {
        alert('Please enter bKash Transaction ID');
        return;
    }

    const { subtotal, total } = calculateTotals();

    const order = {
        orderId: 'DXW-' + Date.now(),
        createdAt: new Date().toISOString(),
        customer: {
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            payment: formData.payment,
            trxid: formData.trxid || null
        },
        items: cart,
        subtotal,
        shippingFee,
        total,
        status: 'Pending'
    };

    // Save to localStorage for admin
    const orders = JSON.parse(localStorage.getItem('dadawear_orders')) || [];
    orders.push(order);
    localStorage.setItem('dadawear_orders', JSON.stringify(orders));

    console.log('✅ Order saved:', order);

    // Reset cart & form
    cart = [];
    updateCartDisplay();
    checkoutForm.reset();

    checkoutModal.style.display = 'none';
    successModal.style.display = 'block';
});
