// JS Filter Logic
const filterCategory = document.getElementById("filter-category");
const filterAvailability = document.getElementById("filter-availability");

filterCategory.addEventListener("change", applyFilters);
filterAvailability.addEventListener("change", applyFilters);

function applyFilters() {
  const category = filterCategory?.value || "all";
  const availability = filterAvailability?.value || "all";

  const filtered = products.filter(product => {
    const matchesCategory =
      category === "all" ||
      (Array.isArray(product.category)
        ? product.category.includes(category)
        : product.category === category);

    const matchesAvailability =
      availability === "all" || product.availability === availability;

    return matchesCategory && matchesAvailability;
  });

  renderProducts(filtered);
}

