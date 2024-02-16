function openCloseFilterMenu() {
    console.log('Funkcija openCloseFilterMenu se poziva.');

    const filterMenu = document.querySelector(".dropdown_content");
    const filterMenuButton = document.querySelector(".btn_drop");
    const filterButtons = document.querySelectorAll(".dropdown_content li button");
    const currentFilterSpan = document.getElementById("current_filter");

    // Postavljamo početni tekst za trenutni filter
    currentFilterSpan.textContent = "Date";

    // Funkcija za otvaranje/zatvaranje menija
    const toggleFilterMenu = () => {
        // Proveravamo da li je meni trenutno otvoren ili zatvoren
        const isExpanded = filterMenuButton.getAttribute("aria-expanded") === "true" || false;
        // Menjamo atribut za stanje menija
        filterMenuButton.setAttribute("aria-expanded", !isExpanded);
        // Dodajemo ili uklanjamo klasu za efekat otvaranja/zatvaranja
        filterMenu.classList.toggle("curtain_effect");
        // Rotiramo ikonu strelice na dugmetu za otvaranje/zatvaranje menija
        document.querySelector(".fa-chevron-up").classList.toggle("rotate");

        // Postavljamo novu vrednost atributa aria-hidden
        const newAriaHiddenValue = filterMenu.classList.contains("curtain_effect") ? "false" : "true";
        filterMenu.setAttribute("aria-hidden", newAriaHiddenValue);

        // Postavljamo novu vrednost atributa tabindex za svako dugme filtera
        const newTabIndexValue = filterMenu.classList.contains("curtain_effect") ? "0" : "-1";
        filterButtons.forEach(button => button.setAttribute("tabindex", newTabIndexValue));
    };

    filterMenuButton.addEventListener("click", () => {
        toggleFilterMenu(); // Poziva se funkcija za otvaranje/zatvaranje menija
    });
    
};


const displayMediaWithFilter = mediasTemplate => {
    const currentFilter = document.querySelector('#current_filter');
    const allFilters = Array.from(document.querySelectorAll('.dropdown_content li button'))

    let filterAlreadySelected = allFilters.find(filter => filter.textContent == currentFilter.textContent);
    filterAlreadySelected.style.display = 'none';

    allFilters.forEach(filter => {
        filter.addEventListener('click', () => {

            currentFilter.textContent = filter.textContent;
            if (filterAlreadySelected) filterAlreadySelected.style.display = 'block';

            filterAlreadySelected = filter;
            filterAlreadySelected.style.display = 'none';

            populatePhotographerPhotos(filter.textContent);
        });

        // Dodajemo event listener za pritisak tipke Enter na svakom filteru
        filter.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                currentFilter.textContent = filter.textContent;
                if (filterAlreadySelected) filterAlreadySelected.style.display = 'block';

                filterAlreadySelected = filter;
                filterAlreadySelected.style.display = 'none';

                populatePhotographerPhotos(filter.textContent);
            }
        });
    });


};
const filterMenuButtons = document.querySelectorAll('.dropdown_content li button');

// Deklaracija promenljive za praćenje trenutnog fokusa
let currentFocusedIndex = 0;

// Funkcija za ažuriranje fokusa na sledeći element u meniju
function focusNextButton() {
    currentFocusedIndex = (currentFocusedIndex + 1) % filterMenuButtons.length;
    filterMenuButtons[currentFocusedIndex].focus();
}

// Funkcija za ažuriranje fokusa na prethodni element u meniju
function focusPreviousButton() {
    currentFocusedIndex = (currentFocusedIndex - 1 + filterMenuButtons.length) % filterMenuButtons.length;
    filterMenuButtons[currentFocusedIndex].focus();
}

// Dodavanje event listenera za pritisak tastera strelice na gore ili dole
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        event.preventDefault(); // Da sprečimo prelazak na sledeći redak u dokumentu
        focusPreviousButton();
    } else if (event.key === 'ArrowDown') {
        event.preventDefault(); // Da sprečimo prelazak na sledeći redak u dokumentu
        focusNextButton();
    }
});

// Funkcija za dodavanje event listenera za pritisak tastera Enter na svakom vidljivom filteru
filterMenuButtons.forEach((filter, index) => {
    // Provera da li je dugme vidljivo pre dodavanja event listenera
    if (filter.offsetParent !== null) {
        filter.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                currentFilter.textContent = filter.textContent;
                if (filterAlreadySelected) filterAlreadySelected.style.display = 'block';

                filterAlreadySelected = filter;
                filterAlreadySelected.style.display = 'none';

                populatePhotographerPhotos(filter.textContent);
            } else if (event.key === 'ArrowUp') {
                event.preventDefault(); // Da sprečimo prelazak na sledeći redak u dokumentu
                currentFocusedIndex = (index - 1 + filterMenuButtons.length) % filterMenuButtons.length;
                filterMenuButtons[currentFocusedIndex].focus();
            } else if (event.key === 'ArrowDown') {
                event.preventDefault(); // Da sprečimo prelazak na sledeći redak u dokumentu
                currentFocusedIndex = (index + 1) % filterMenuButtons.length;
                filterMenuButtons[currentFocusedIndex].focus();
            }
        });
    }
});


const toggleFilterMenu = () => {
    // Proveravamo da li je meni trenutno otvoren ili zatvoren
    const isExpanded = filterMenuButton.getAttribute("aria-expanded") === "true" || false;
    // Menjamo atribut za stanje menija
    filterMenuButton.setAttribute("aria-expanded", !isExpanded);
    // Dodajemo ili uklanjamo klasu za efekat otvaranja/zatvaranja
    filterMenu.classList.toggle("curtain_effect");
    // Rotiramo ikonu strelice na dugmetu za otvaranje/zatvaranje menija
    document.querySelector(".fa-chevron-up").classList.toggle("rotate");

    // Postavljamo novu vrednost atributa aria-hidden
    const newAriaHiddenValue = filterMenu.classList.contains("curtain_effect") ? "false" : "true";
    filterMenu.setAttribute("aria-hidden", newAriaHiddenValue);

    // Postavljamo novu vrednost atributa tabindex za svako dugme filtera
    const newTabIndexValue = filterMenu.classList.contains("curtain_effect") ? "0" : "-1";
    filterButtons.forEach(button => button.setAttribute("tabindex", newTabIndexValue));

    // Ručno postavljanje fokusa na prvo dugme u meniju nakon otvaranja
    if (!isExpanded) {
        filterButtons[0].focus();
    }
};


openCloseFilterMenu();
displayMediaWithFilter();