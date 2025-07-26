  // Toggle mobile navigation menu
  function toggleMobileNav() {
    document.getElementById("mobileNav").classList.toggle("active");
    document.getElementById("overlay").classList.toggle("active");
  }

  // Close mobile navigation
  function closeMobileNav() {
    document.getElementById("mobileNav").classList.remove("active");
    document.getElementById("overlay").classList.remove("active");
  }

  // Toggle search overlay
  function toggleSearchbar() {
    const overlay = document.getElementById("searchOverlay");
    const isVisible = overlay.style.display === "flex";

    overlay.style.display = isVisible ? "none" : "flex";

    if (!isVisible) {
      overlay.querySelector(".custom-input").focus();
    }
  }

  // Close search overlay when clicking outside of it
  document.addEventListener("click", function (e) {
    const overlay = document.getElementById("searchOverlay");
    const searchbar = overlay?.querySelector(".custom-searchbar");

    if (
      overlay?.style.display === "flex" &&
      !searchbar.contains(e.target) &&
      !e.target.closest(".search-icon")
    ) {
      overlay.style.display = "none";
    }
  });