// Ellenőrizzük, hogy a termékek már a LocalStorage-ban vannak-e
if (!localStorage.getItem('termekek')) {
    fetch('../termekek.json') // Javított elérési út!
        .then(response => {
            if (!response.ok) {
                throw new Error('Hiba a termekek.json betöltésekor');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('termekek', JSON.stringify(data));
            renderAllProducts(); // Újratöltés után is jelenjenek meg a kártyák
        })
        .catch(error => console.error('Fetch hiba:', error));
} else {
    renderAllProducts(); // Ha már van adat, azonnal jelenítse meg
}

// Termékek betöltése az oldalra adott kategóriához
function betoltTermekek(kategoria) {
    const termekek = JSON.parse(localStorage.getItem('termekek')) || {};
    const termekLista = document.querySelector('.product-list');
    termekLista.innerHTML = '';

    if (!termekek[kategoria]) {
        console.log(kategoria);
        console.warn(`Nincs ilyen kategória: ${kategoria}`);
        return;
    }

    termekek[kategoria].forEach(termek => {
        const kepUrl = termek.kepek && termek.kepek.length > 0 
            ? `${termek.kepek[0]}` // Javított elérési út
            : 'https://via.placeholder.com/200';
        termekLista.innerHTML += createProductCard(termek, kategoria);
        
    });
}

// Összes termék megjelenítése minden kategóriából (teszt oldalhoz)
function renderAllProducts() {
    const termekek = JSON.parse(localStorage.getItem('termekek')) || {};
    const termekLista = document.querySelector('.product-list');
    if (!termekLista) return;
    termekLista.innerHTML = '';
    Object.keys(termekek).forEach(kategoria => {
        termekek[kategoria].forEach(termek => {
            termekLista.innerHTML += createProductCard(termek, kategoria);
        });
    });
}

// Kategória nevek térképezése a JSON megfelelő kulcsaira
const kategoriaMap = {
    "Elektromos Gitárok": "elektromosGitarok",
    "Akusztikus Gitárok": "akusztikusGitarok",
    "Klasszikus Gitárok": "klasszikusGitarok",
    "Húrok": "hurok",
    "Akusztikus Dobszerelések": "akdobok",
    "Pergődobok": "pergodobok",
    "Cintányér szettek": "cintanyer",
    "Elektromos Dobszerelések": "elektromosDobok", // <-- javítva!
};

// Navigációs menü eseményfigyelő
if (document.querySelectorAll('nav ul li ul li a').length) {
    document.querySelectorAll('nav ul li ul li a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const kategoria = kategoriaMap[this.textContent] || "";
            if (kategoria) {
                betoltTermekek(kategoria);
            } else {
                console.warn(`Ismeretlen kategória: ${this.textContent}`);
            }
        });
    });
}

function filterByKeys(keysString) {
  const keys = keysString.split(",").map(k => k.trim());
  const allProducts = JSON.parse(localStorage.getItem("osszesTermek") || "[]");
  const filtered = allProducts.filter(p => keys.includes(p.categoryKey));
  renderProducts(filtered);
}


// Valós idejű keresés
document.getElementById("searchBar").addEventListener("input", e => {
  const query = e.target.value.toLowerCase();
  const allProducts = JSON.parse(localStorage.getItem("osszesTermek") || "[]");

  const filtered = allProducts.filter(p =>
    p.nev.toLowerCase().includes(query) ||
    p.leiras?.toLowerCase().includes(query)
  );

  renderProducts(filtered);
});

function addToCart(termek) {
    

    let kosar = JSON.parse(localStorage.getItem("kosar") || "[]");

    // Ha már van ilyen termék, csak a mennyiséget növeljük
    const idx = kosar.findIndex(t => t.id === termek.id);
    if (idx > -1) {
        kosar[idx].mennyiseg += 1;
    } else {
        kosar.push({ ...termek, mennyiseg: 1 });
    }
    localStorage.setItem("kosar", JSON.stringify(kosar));
    alert("A termék a kosárba került!");
}