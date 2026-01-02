// ===============================
// 1. Product Data (Original data retained)
// ===============================
// Note: আমি এখানে উদাহরণস্বরূপ দুটি প্রোডাক্টের জন্য ডিসকাউন্ট ও আসল মূল্য যোগ করেছি, 
// যা আপনার ইমেজ-ম্যাচিং ডিজাইনের জন্য দরকার। বাকিগুলোতে ফিক্সড ডিসকাউন্ট ধরে নেওয়া হয়েছে।
const products = [
    // Updated Product 1 with discount info
    { id: 'p001', name: 'DXW RC Jersey (Black/Red)', type: 'Printed Tees', price: 450, originalPrice: 550, discount: 18, image: '12 jercey DXW RC pic.jpg' },
    { id: 'p002', name: 'DXW Jersey Style 2 (Green)', type: 'Classic Fit', price: 450, originalPrice: 450, discount: 0, image: '9 Jercey Dxw 2.jpg' },
    { id: 'p003', name: 'DXW Jersey Style 3 (Abstract Black)', type: 'Acid Wash', price: 450, originalPrice: 500, discount: 10, image: '11 jercey DXW 2.jpg' },
    { id: 'p004', name: 'DXW Jersey Style 4 (Tiger Stripe)', type: 'Printed Tees', price: 450, originalPrice: 450, discount: 0, image: '2 jercey dxw 2.jpg' },
    { id: 'p005', name: 'DXW Jersey Style 5 (Blue Geometric)', type: 'Printed Tees', price: 450, originalPrice: 450, discount: 0, image: '7 jercey dxw 2.jpg' },
    { id: 'p006', name: 'DXW Jersey Style 6 (Red Grid)', type: 'Classic Fit', price: 450, originalPrice: 450, discount: 0, image: '10 jercey Dxw 2.jpg' },
    { id: 'p007', name: 'DXW Jersey Style 7 (Infinix Black)', type: 'Acid Wash', price: 450, originalPrice: 450, discount: 0, image: 'IMG-20250924-WA0087.jpg' }
];

// ... (2. Shipping, 3. Cart State, 4. DOM Elements - These remain unchanged) ...
const SHIPPING_DHAKA = 55;
const SHIPPING_OUTSIDE = 115;
let shippingFee = SHIPPING_OUTSIDE;
let cart = [];
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
// 5. Render Products (UPDATED)
// ===============================
function renderProducts() {
    productGrid.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';

        // Format prices for display
        const price = product.price.toFixed(2);
        const originalPrice = product.originalPrice ? product.originalPrice.toFixed(2) : null;
        const discountBadge = product.discount > 0 
            ? `<span class="discount-badge">-${product.discount}%</span>` 
            : '';
        
        const originalPriceDisplay = product.discount > 0
            ? `<span class="original-price">${originalPrice}৳</span>`
            : '';

        card.innerHTML = `
            <div class="product-image-wrapper">
                ${discountBadge}
                <img src="${product.image}" alt="${product.name}">
                
                <div class="product-actions">
                    <button class="action-icon add-to-cart" data-id="${product.id}" aria-label="Add to Cart">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="action-icon add-to-wishlist" aria-label="Add to Wishlist">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>

            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-type">${product.type}</p> 

                <div class="price-container">
                    ${originalPriceDisplay}
                    <span class="sale-price">${price}৳</span>
                </div>
                
                </div>
        `;
        productGrid.appendChild(card);
    });
}

// ===============================
// 6. Cart Logic (Unchanged)
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
                <div>
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
// 7. Events (UPDATED: Click Listener)
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartDisplay();
});

// *** UPDATED: Click listener now targets the new 'add-to-cart' class ***
productGrid.addEventListener('click', e => {
    // Target the closest element that has the class 'add-to-cart'
    const btn = e.target.closest('.add-to-cart'); 
    if (btn?.dataset.id) addToCart(btn.dataset.id);

    // Optional: Handle Wishlist click if needed
    // if (e.target.closest('.add-to-wishlist')) {
    //     console.log('Wishlist button clicked');
    // }
});
// *********************************************************************

cartButton.onclick = () => (cartModal.style.display = 'block');

document.querySelectorAll('.close-button').forEach(btn => {
    btn.onclick = () => (btn.closest('.modal').style.display = 'none');
});

cartItemsList.addEventListener('click', e => {
    if (!e.target.classList.contains('qty-btn')) return;
    updateQuantity(
        e.target.dataset.id,
        e.target.dataset.action === 'increase' ? 1 : -1
    );
});

checkoutButton.onclick = () => {
    cartModal.style.display = 'none';
    checkoutModal.style.display = 'block';
};

paymentMethod.onchange = () => {
    bkashInfo.style.display = paymentMethod.value === 'bkash' ? 'block' : 'none';
};

// ===============================
// 8. SAVE ORDER FOR ADMIN (Unchanged)
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

    // 🔐 Save to localStorage for Admin Panel
    const orders = JSON.parse(localStorage.getItem('dadawear_orders')) || [];
    orders.push(order);
    localStorage.setItem('dadawear_orders', JSON.stringify(orders));

    console.log('✅ Order saved:', order);

    // Reset
    cart = [];
    updateCartDisplay();
    checkoutForm.reset();

    checkoutModal.style.display = 'none';
    successModal.style.display = 'block';
});
