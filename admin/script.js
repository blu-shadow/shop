// ===============================
// DadaXWear Admin Script
// ===============================

// 🔐 Admin Pass Key
const ADMIN_PASSKEY = "mystery12#!";

// ===============================
// LOGIN HANDLER
// ===============================
function login() {
    const inputKey = document.getElementById("passkey").value.trim();
    const errorBox = document.getElementById("error-msg");

    if (inputKey !== ADMIN_PASSKEY) {
        errorBox.innerText = "❌ Wrong pass key!";
        return;
    }

    // Success
    errorBox.innerText = "";
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("admin-panel").style.display = "block";

    loadOrders();
}

// ===============================
// LOAD ORDERS FROM localStorage
// ===============================
function loadOrders() {
    const ordersContainer = document.getElementById("orders");

    // Get orders
    const orders =
        JSON.parse(localStorage.getItem("dadawear_orders")) || [];

    ordersContainer.innerHTML = "";

    if (orders.length === 0) {
        ordersContainer.innerHTML =
            "<p style='text-align:center;color:#777'>No orders yet 📭</p>";
        return;
    }

    orders.forEach((order, index) => {
        const div = document.createElement("div");
        div.className = "order-card";

        div.innerHTML = `
            <h3>📦 Order #${index + 1}</h3>
            <p><b>Order ID:</b> ${order.orderId}</p>
            <p><b>Name:</b> ${order.customer.name}</p>
            <p><b>Phone:</b> ${order.customer.phone}</p>
            <p><b>Address:</b> ${order.customer.address}</p>
            <p><b>Payment:</b> ${order.customer.payment}</p>
            <p><b>Total:</b> ${order.total} TK</p>
            <p><b>Status:</b> ${order.status}</p>
            <hr>
        `;

        ordersContainer.appendChild(div);
    });
}

// ===============================
// LOGOUT
// ===============================
function logout() {
    location.reload();
}

// ===============================
// OPTIONAL: AUTO-REFRESH ORDERS
// ===============================
// Uncomment if you want auto reload every 5 seconds
/*
setInterval(() => {
    if (document.getElementById("admin-panel").style.display === "block") {
        loadOrders();
    }
}, 5000);
*/
