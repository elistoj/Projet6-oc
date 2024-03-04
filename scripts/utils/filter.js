// Fonction pour ouvrir/fermer le menu de filtre
function openCloseFilterMenu() {
  
    const filterMenu = document.querySelector(".dropdown_content");
    const filterMenuButton = document.querySelector(".btn_drop");
    const filterButtons = document.querySelectorAll(".dropdown_content li button");
    const currentFilterSpan = document.getElementById("current_filter");
  
    // Définir le texte initial pour le filtre actuel
    currentFilterSpan.textContent = "Date";
  
    // Ajouter un écouteur d'événements pour le clic sur le bouton d'ouverture/fermeture du menu
    filterMenuButton.addEventListener("click", () => {
        // Vérifier si le menu est actuellement ouvert ou fermé
        const isExpanded = filterMenuButton.getAttribute("aria-expanded") === "true" || false;
        // Modifier l'attribut pour l'état du menu
        filterMenuButton.setAttribute("aria-expanded", !isExpanded);
        // Ajouter ou supprimer la classe pour l'effet d'ouverture/fermeture
        filterMenu.classList.toggle("curtain_effect");
        // Faire tourner l'icône de flèche sur le bouton d'ouverture/fermeture du menu
        document.querySelector(".fa-chevron-up").classList.toggle("rotate");
  
        // Définir la nouvelle valeur de l'attribut aria-hidden
        const newAriaHiddenValue = filterMenu.classList.contains("curtain_effect") ? "false" : "true";
        filterMenu.setAttribute("aria-hidden", newAriaHiddenValue);
  
        // Définir la nouvelle valeur de l'attribut tabindex pour chaque bouton de filtre
        const newTabIndexValue = filterMenu.classList.contains("curtain_effect") ? "0" : "-1";
        filterButtons.forEach(button => button.setAttribute("tabindex", newTabIndexValue));
    });

    // Ajouter un écouteur d'événements pour la touche "Échap" afin de fermer le menu
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            // Vérifier si le menu est actuellement ouvert
            const isExpanded = filterMenuButton.getAttribute("aria-expanded") === "true" || false;
            if (isExpanded) {
                filterMenuButton.click(); // Simuler un clic sur le bouton d'ouverture/fermeture du menu
            }
        }
    });
}

// Fonction pour afficher les médias avec un filtre
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
        })
    });
};

// Appel des fonctions
openCloseFilterMenu();
displayMediaWithFilter();

//mediasTemplate est defini est utilise dans ce document
// 'populatePhotographerPhotos' est defini dans photographer.js