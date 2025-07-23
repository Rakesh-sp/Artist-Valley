  document.getElementById("download-invoice").addEventListener("click", async () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const summary = JSON.parse(localStorage.getItem("orderSummary"));
    if (!summary) return;

    let y = 10;

    doc.setFontSize(18);
    doc.text("Invoice", 105, y, { align: "center" });
    y += 10;

    doc.setFontSize(12);
    doc.text("Shipping Information:", 10, y);
    y += 6;
    doc.text(`Name: ${summary.shippingInfo.fname} ${summary.shippingInfo.lname}`, 10, y);
    y += 6;
    doc.text(`Address: ${summary.shippingInfo.street}, ${summary.shippingInfo.city}, ${summary.shippingInfo.postal}`, 10, y);
    y += 6;
    doc.text(`Phone: ${summary.shippingInfo.phone}`, 10, y);
    y += 6;
    doc.text(`Email: ${summary.shippingInfo.email}`, 10, y);
    y += 10;

    doc.text("Products Ordered:", 10, y);
    y += 6;
    summary.items.forEach((item, index) => {
      const productName = item.name || item.product?.name || "Unnamed Product";
      const quantity = item.qty || 1;
      const size = item.selectedSize || "N/A";
      const color = typeof item.selectedColor === "object"
        ? (item.selectedColor.name || item.selectedColor.code || "N/A")
        : (item.selectedColor || "N/A");

      doc.text(`${index + 1}. ${productName}`, 10, y);
      y += 6;
      doc.text(`   Qty: ${quantity}, Size: ${size}, Color: ${color}`, 10, y);
      y += 6;
    });

    y += 8;
    doc.text("Order Summary:", 10, y);
    y += 6;
    doc.text(`Total Price: $${(summary.totalPrice || 0).toFixed(2)}`, 10, y);
    y += 6;
    doc.text(`Discount: -$${(summary.discount || 0).toFixed(2)}`, 10, y);
    y += 6;
    doc.text(`Coupon: -$${(summary.coupon || 0).toFixed(2)}`, 10, y);
    y += 6;
    doc.text(`Final Amount Paid: $${(summary.finalAmount || 0).toFixed(2)}`, 10, y);

    doc.save("invoice.pdf");
  });
