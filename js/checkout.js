document.addEventListener("DOMContentLoaded", function () {
  const cart = JSON.parse(localStorage.getItem("cart")) || [
    { name: "Shirt", price: 300, qty: 2, selectedColor: "Blue", selectedSize: "M" },
    { name: "Jeans", price: 500, qty: 1, selectedColor: "Black", selectedSize: "L" }
  ];

  const billingToggle = document.getElementById("billing-toggle");
  const billingSection = document.getElementById("billing-section");

  billingToggle.addEventListener("change", () => {
    billingSection.style.display = billingToggle.checked ? "block" : "none";
  });

  function updateCheckoutDetails() {
    let totalPrice = 0;
    let itemCount = 0;
    const coupon = 10;
    const list = document.getElementById("product-summary-list");
    list.innerHTML = "";

    cart.forEach(item => {
      const quantity = item.qty || 1;
      const itemTotal = item.price * quantity;
      totalPrice += itemTotal;
      itemCount += quantity;

      // Handle object or string color
      let displayColor = "";
      if (typeof item.selectedColor === "object" && item.selectedColor !== null) {
        displayColor = item.selectedColor.name || item.selectedColor.code || item.selectedColor.color || "";
      } else if (typeof item.selectedColor === "string" && item.selectedColor.toLowerCase() !== "n/a") {
        displayColor = item.selectedColor;
      }

      const displaySize = item.selectedSize || "N/A";

      const li = document.createElement("li");

      // Build string conditionally
      let productText = `${item.name} × ${quantity}`;
      if (displayColor) {
        productText += ` | Color: ${displayColor}`;
      }
      productText += ` | Size: ${displaySize} | ₹${itemTotal}`;

      li.textContent = productText;
      list.appendChild(li);
    });

    const discount = Math.floor(totalPrice * 0.3);
    const deliveryCharge = totalPrice - discount - coupon < 30 ? 6 : 0;
    const finalAmount = totalPrice - discount - coupon + deliveryCharge;

    document.getElementById("item-count").innerText = itemCount;
    document.getElementById("total-price").innerText = totalPrice;
    document.getElementById("discount").innerText = discount;
    document.getElementById("coupon").innerText = coupon;
    document.getElementById("final-amount").innerText = finalAmount;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    return /^\d{10}$/.test(phone);
  }

  function showErrorList(messages) {
    const body = document.getElementById("errorModalBody");
    body.innerHTML = `<ul class="mb-0">${messages.map(msg => `<li>${msg}</li>`).join("")}</ul>`;
    new bootstrap.Modal(document.getElementById("errorModal")).show();
  }

  function showLoader() {
    const btn = document.querySelector(".place-order button");
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Placing Order...`;
  }

  function generateOrderId() {
    const prefix = "PB";
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
    return `${prefix}-${random}`;
  }

  function placeOrder() {
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const fname = document.getElementById("fname").value.trim();
    const lname = document.getElementById("lname").value.trim();
    const country = document.getElementById("country").value;
    const city = document.getElementById("city").value.trim();
    const street = document.getElementById("street").value.trim();
    const postal = document.getElementById("postal").value.trim();

    const errors = [];

    if (!email) errors.push("Email is required.");
    else if (!isValidEmail(email)) errors.push("Email is invalid.");

    if (!phone) errors.push("Phone number is required.");
    else if (!isValidPhone(phone)) errors.push("Phone must be 10 digits.");

    if (!fname) errors.push("First name is required.");
    if (!lname) errors.push("Last name is required.");
    if (!country || country === "Country") errors.push("Country is required.");
    if (!city) errors.push("City is required.");
    if (!street) errors.push("Street is required.");
    if (!postal) errors.push("Postal code is required.");

    if (errors.length > 0) {
      showErrorList(errors);
      return;
    }

    showLoader();

    const shippingInfo = { email, phone, fname, lname, country, city, street, postal };
    const orderId = generateOrderId();

    const summaryData = {
      orderId,
      shippingInfo,
      items: cart,
      totalPrice: parseFloat(document.getElementById("total-price").innerText),
      discount: parseFloat(document.getElementById("discount").innerText),
      coupon: parseFloat(document.getElementById("coupon").innerText),
      finalAmount: parseFloat(document.getElementById("final-amount").innerText)
    };

    setTimeout(() => {
      localStorage.setItem("orderSummary", JSON.stringify(summaryData));
      localStorage.removeItem("cart");
      window.location.href = "thank-you.html";
    }, 2000);
  }

  document.querySelector(".place-order button").addEventListener("click", placeOrder);
  updateCheckoutDetails();
});
