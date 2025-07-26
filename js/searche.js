document.addEventListener("DOMContentLoaded", () => {
  const products = JSON.parse(localStorage.getItem("products")) || [];

  document.querySelectorAll(".custom-searchbar").forEach(searchbar => {
    const input = searchbar.querySelector(".custom-input");
    const suggestions = searchbar.querySelector(".suggestions-list");

    input.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();
      suggestions.innerHTML = "";

      if (!query) return;

      const matches = products.filter(p => p.name.toLowerCase().includes(query));

      matches.forEach(product => {
        const li = document.createElement("li");
        li.textContent = product.name;
        li.addEventListener("click", () => {
          window.location.href = `details.html?id=${encodeURIComponent(product.id)}`;
        });
        suggestions.appendChild(li);
      });
    });

    // Clear suggestions on outside click
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".custom-searchbar")) {
        suggestions.innerHTML = "";
      }
    });
  });
});
