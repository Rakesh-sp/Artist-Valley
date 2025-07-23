// js/filter.js

document.addEventListener("DOMContentLoaded", () => {
  const filters = document.getElementById("filters");
  const priceSlider = document.getElementById("price-slider");

  const getCheckedValues = (name) =>
    Array.from(filters.querySelectorAll(`input[name='${name}']:checked`)).map(el => el.value);

  filters.addEventListener("change", applyFilters);
  priceSlider.addEventListener("input", applyFilters);

  function applyFilters() {
    const selectedCollections = getCheckedValues("collection"); // e.g. ['men', 'women']
    const selectedAvailability = getCheckedValues("availability"); // ['stock', 'out']
    const selectedRatings = getCheckedValues("rating").map(Number); // [4, 3]
    const selectedSizes = getCheckedValues("size"); // ['S', 'M']
    const selectedBrands = getCheckedValues("brand"); // ['Levis', 'Allen Solly']
    const maxPrice = parseFloat(priceSlider.value); // slider value

    const filtered = products.filter(p => {
      const discountPrice = p.price - (p.price * p.discount / 100);

      // Match collection (category) - updated to support array
      const matchCategory =
        selectedCollections.length === 0 ||
        (Array.isArray(p.category) && selectedCollections.some(cat => p.category.includes(cat)));

      // Match availability
      const matchAvailability =
        selectedAvailability.length === 0 || selectedAvailability.includes(p.availability);

      // Match rating
      const matchRating =
        selectedRatings.length === 0 || selectedRatings.some(r => p.rating >= r);

      // Match price
      const matchPrice = discountPrice <= maxPrice;

      // Match size (handle if sizes not available)
      const matchSize =
        selectedSizes.length === 0 ||
        (Array.isArray(p.sizes) && p.sizes.some(size => selectedSizes.includes(size)));

      // Match brand
      const matchBrand =
        selectedBrands.length === 0 || selectedBrands.includes(p.brand);

      return (
        matchCategory &&
        matchAvailability &&
        matchRating &&
        matchPrice &&
        matchSize &&
        matchBrand
      );
    });

    renderProducts(filtered);
  }
});
