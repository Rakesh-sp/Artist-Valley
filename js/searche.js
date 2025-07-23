document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("search-input");
  const suggestions = document.getElementById("search-suggestions");
  const products = JSON.parse(localStorage.getItem("products")) || [];

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

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".custom-searchbar")) {
      suggestions.innerHTML = "";
    }
  });
});
