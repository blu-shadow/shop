// --- 1. Product Data ---
const products = [
    // --- Existing Products ---
    { id: 'p001', name: 'DXW RC Jersey (Black/Red)', price: 450, image: '12 jercey DXW RC pic.jpg' },
    { id: 'p002', name: 'DXW Jersey Style 2 (Green)', price: 450, image: '9 Jercey Dxw 2.jpg' },
    { id: 'p003', name: 'DXW Jersey Style 3 (Abstract Black)', price: 450, image: '11 jercey DXW 2.jpg' },
    { id: 'p004', name: 'DXW Jersey Style 4 (Tiger Stripe)', price: 450, image: '2 jercey dxw 2.jpg' },
    { id: 'p005', name: 'DXW Jersey Style 5 (Blue Geometric)', price: 450, image: '7 jercey dxw 2.jpg' },
    { id: 'p006', name: 'DXW Jersey Style 6 (Red Grid)', price: 450, image: '10 jercey Dxw 2.jpg' },
    { id: 'p007', name: 'DXW Jersey Style 7 (Infinix Black)', price: 450, image: 'IMG-20250924-WA0087.jpg' },
    // You can add more products here
];

const SHIPPING_DHAKA = 55;
const SHIPPING_OUTSIDE = 115;
// We'll assume Outside Chittagong shipping for the initial total calculation
let shippingFee = SHIPPING_OUTSIDE;

// --- 2. Global State (Shopping Cart) ---
let cart = []; // Stores objects like: { id: 'p001', quantity: 1, price: 450 }

// --- 3. DOM Elements ---
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
const finalTotalCodDisplay = document.getElementById('final-total-cod-display');


// --- 4. Core Functions ---

/**
 * Renders all products onto the main page.
 */
function renderProducts() {
    productGrid.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        // Check if the image path needs adjustment. Assuming images are in the root for simplicity if no subfolder is used, 
        // but keeping 'images/' prefix from original code for consistency.
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.price} TK</p>
                <button class="btn primary-btn" data-id="${product.id}">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

/**
 * Adds an item to the cart or increases its quantity.
 * @param {string} productId - The ID of the product to add.
 */
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const cartItemIndex = cart.findIndex(item => item.id === productId);

    if (cartItemIndex > -1) {
        cart[cartItemIndex].quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    updateCartDisplay();
    // Show a quick success message (optional)
    console.log(`${product.name} added to cart!`);
}

/**
 * Updates the quantity of an item in the cart.
 * @param {string} productId - The ID of the product.
 * @param {number} delta - The change in quantity (1 or -1).
 */
function updateQuantity(productId, delta) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += delta;

        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1); // Remove item if quantity is zero or less
        }
        updateCartDisplay();
    }
}

/**
 * Calculates the subtotal, shipping, and final total.
 * @returns {object} - An object containing subtotal and total.
 */
function calculateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + shippingFee;
    return { subtotal, total };
}

/**
 * Updates the cart icon count, list of items, and totals in the modal.
 */
function updateCartDisplay() {
    const totals = calculateCartTotals();
    
    // Update main cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;

    // Update cart modal
    cartItemsList.innerHTML = '';

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p>Your cart is empty.</p>';
        checkoutButton.disabled = true;
    } else {
        checkoutButton.disabled = false;
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <span class="cart-item-name">${item.name} (${item.price} TK)</span>
                <div class="item-quantity-controls">
                    <button class="qty-btn" data-id="${item.id}" data-action="decrease">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="qty-btn" data-id="${item.id}" data-action="increase">+</button>
                </div>
                <span class="cart-item-total">${item.price * item.quantity} TK</span>
            `;
            cartItemsList.appendChild(itemElement);
        });
    }

    cartSubtotalElement.textContent = totals.subtotal.toLocaleString('en-IN');
    cartTotalElement.textContent = totals.total.toLocaleString('en-IN');
    finalTotalDisplay.textContent = totals.total.toLocaleString('en-IN');
    finalTotalCodDisplay.textContent = totals.total.toLocaleString('en-IN');
}


// --- 5. Event Listeners ---

// Initial product render
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartDisplay(); // Initialize cart display
});

// Listener for Add to Cart buttons
productGrid.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' && e.target.dataset.id) {
        addToCart(e.target.dataset.id);
    }
});

// Open Cart Modal
cartButton.addEventListener('click', () => {
    cartModal.style.display = 'block';
});

// Close Modals
document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('click', (e) => {
        e.target.closest('.modal').style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    } else if (e.target === checkoutModal) {
        checkoutModal.style.display = 'none';
    } else if (e.target === successModal) {
        successModal.style.display = 'none';
    }
});

// Cart Quantity Controls
cartItemsList.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('qty-btn')) {
        const productId = target.dataset.id;
        const action = target.dataset.action;
        if (action === 'increase') {
            updateQuantity(productId, 1);
        } else if (action === 'decrease') {
            updateQuantity(productId, -1);
        }
    }
});

// Open Checkout Modal
checkoutButton.addEventListener('click', () => {
    cartModal.style.display = 'none'; // Close cart modal
    checkoutModal.style.display = 'block'; // Open checkout modal
});

// Handle Payment Method selection
paymentMethod.addEventListener('change', (e) => {
    const selected = e.target.value;
    bkashInfo.style.display = selected === 'bkash' ? 'block' : 'none';
});

// Checkout Form Submission
checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(checkoutForm);
    const customerData = Object.fromEntries(formData.entries());

    // Add cart and totals to the data object
    const { subtotal, total } = calculateCartTotals();
    const orderData = {
        timestamp: new Date().toISOString(),
        customer: customerData,
        items: cart,
        subtotal: subtotal,
        shippingFee: shippingFee,
        total: total,
        status: 'Pending'
    };

    console.log("Order Data Ready for Admin:", orderData);

    // --- CRITICAL: Data Submission Placeholder (As discussed previously) ---
    // This part SIMULATES sending data to your admin page.
    // Replace the code below with a real API call when you set up your backend.
    
    // Example of a real fetch call (currently commented out):
    /*
    try {
        const response = await fetch('https://your-real-api-endpoint.com/submit-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log("Server response:", result);
    } catch (error) {
        console.error("Error submitting order:", error);
        // You might want to show a failure modal here instead
    }
    */
    
    // --- Simulation Success ---
    // Clear the cart and show success modal
    cart = [];
    updateCartDisplay();
    checkoutForm.reset();
    checkoutModal.style.display = 'none';
    successModal.style.display = 'block';

    // Optional: Log data to console for testing
    console.log("Simulated Order Submission Successful. Order Details:", orderData);
    
});
