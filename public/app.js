// Ellenőrizzük, hogy a termékek már a LocalStorage-ban vannak-e
if (!localStorage.getItem('termekek')) {
    fetch('./termekek.json') // Javított elérési út!
        .then(response => {
            if (!response.ok) {
                throw new Error('Hiba a termekek.json betöltésekor');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('termekek', JSON.stringify(data));
        })
        .catch(error => console.error('Fetch hiba:', error));
}

// Termékek betöltése az oldalra
function betoltTermekek(kategoria) {
    const termekek = JSON.parse(localStorage.getItem('termekek')) || {};
    const termekLista = document.querySelector('.product-list');
    termekLista.innerHTML = ''; // Előző termékek törlése

    if (!termekek[kategoria]) {
        console.warn(`Nincs ilyen kategória: ${kategoria}`);
        return;
    }

    termekek[kategoria].forEach(termek => {
        const kepUrl = termek.kepek && termek.kepek.length > 0 
            ? `${termek.kepek[0]}` // Javított elérési út
            : 'https://via.placeholder.com/200';

        const termekElem = `
            <div class="product hover-product">
                <img src="${kepUrl}" alt="${termek.nev}" class="product-image">
                <div class="product-info">
                    <div class="product-details">
                        <div>
                            <strong class="product-category">${termek.nev}</strong><br>
                            ${kategoria.replace(/([A-Z])/g, ' $1')}
                        </div>
                    </div>
                    <p>${termek.leiras.substring(0, 100)}...</p>
                    <div class="product-purchase">
                        <strong>${termek.ar} Ft</strong>
                        <a href="#" class="btn btn-primary">Kosárba</a>
                    </div>
                </div>
            </div>`;
        termekLista.innerHTML += termekElem;
    });
}

// Kategória nevek térképezése a JSON megfelelő kulcsaira
const kategoriaMap = {
    "Elektromos Gitárok": "elektromosGitarok",
    "Akusztikus Gitárok": "akusztikusGitarok",
    "Klasszikus Gitárok": "klasszikusGitarok", // Javított elírás!
    "Húrok": "hurok"
};

// Navigációs menü eseményfigyelő
document.querySelectorAll('nav ul li ul li a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault(); // Ne navigáljon el az oldalról
        const kategoria = kategoriaMap[this.textContent] || "";
        if (kategoria) {
            betoltTermekek(kategoria);
        } else {
            console.warn(`Ismeretlen kategória: ${this.textContent}`);
        }
    });
});