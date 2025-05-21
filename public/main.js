document.addEventListener("DOMContentLoaded", () => {
    const productId = localStorage.getItem("selectedProductId");
  
    if (!productId) {
      console.warn("Nincs kiválasztott termék azonosító a localStorage-ban.");
      return;
    }
  
    fetch("products.json")
      .then(response => response.json())
      .then(products => {
        const product = products.find(p => p.id === productId);
  
        if (!product) {
          console.error("Nem található a termék.");
          return;
        }
  
        // Terméknév és ár frissítése
        document.querySelector(".product-name").textContent = product.name;
        document.querySelector(".product-price").innerHTML = `<strong>Ár:</strong> ${product.price.toLocaleString("hu-HU")} Ft`;
  
        // Leírás frissítése
        const descriptionElement = document.querySelector(".col-lg-4 .mt-4 p");
        if (descriptionElement) {
          descriptionElement.textContent = product.description;
        }
  
        // Képek betöltése carouselba
        const carouselInner = document.querySelector(".carousel-inner");
        carouselInner.innerHTML = ""; // Töröljük a placeholder képeket
  
        product.images.forEach((img, index) => {
          const div = document.createElement("div");
          div.className = `carousel-item${index === 0 ? " active" : ""}`;
          div.innerHTML = `<img src="${img}" class="d-block w-100" alt="Termék kép ${index + 1}">`;
          carouselInner.appendChild(div);
        });
  
        // Videó iframe frissítése
        const iframe = document.querySelector("iframe");
        if (iframe && product.video) {
          iframe.src = product.video;
        }
      })
      .catch(err => {
        console.error("Hiba a termék betöltésekor:", err);
      });
  });
  