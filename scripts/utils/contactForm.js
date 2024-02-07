// Fonction pour ouvrir la fenêtre modale
function openModalWindow() {
    // Ouvrir une nouvelle fenêtre modale avec le contenu de "contact_modal.html"
    const modalWindow = window.open("contact_modal.html", "Contactez-moi", photographerName);
    // Mettre le focus sur la nouvelle fenêtre
    modalWindow.focus();
}

// Sélection des boutons de contact
const modalBtn = document.querySelectorAll('.contact_button');

// Sélection des champs du formulaire
const firstName = document.getElementById('first');
const lastName = document.getElementById('last');
const email = document.getElementById('email');
const message = document.getElementById('message');

// Fonction pour afficher la modal
function displayModal() {
    // Sélectionner l'élément modal par son ID
    const modal = document.getElementById("contact_modal");
    // Afficher la modal en changeant le style pour "block"
    modal.style.display = "block";
 
}

// Code supplémentaire pour récupérer le nom du photographe et le définir dans la fenêtre modale
function setPhotographerName(name) {
    const photographerNameElement = document.getElementById("photograpName");
    if (photographerNameElement) {
        photographerNameElement.textContent = name;
    }
}

// Fonction pour afficher la modal
function displayModal() {
    // Sélectionner l'élément modal par son ID
    const modal = document.getElementById("contact_modal");
    // Afficher la modal en changeant le style pour "block"
    modal.style.display = "block";

    // Récupérer le nom du photographe depuis la page et le définir dans la fenêtre modale
    const photographerName = document.getElementById("photographerName");
    if (photographerName) {
        setPhotographerName(photographerName.textContent);
    }
}

// Fonction pour fermer la modal
function closeModal() {
    // Sélectionner l'élément modal par son ID
    const modal = document.getElementById("contact_modal");
    // Cacher la modal en changeant le style pour "none"
    modal.style.display = "none";
}

// Ajout d'écouteurs d'événements aux boutons de contact
if (modalBtn) {
    modalBtn.forEach((btn) => btn.addEventListener('click', displayModal));
}

// Sélection du bouton de fermeture de la modal
const closeModalBtn = document.querySelector('.modal header img');

// Ajout d'un écouteur d'événement pour fermer la modal lorsque le bouton de fermeture est cliqué
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}

// Ajout d'un écouteur d'événement pour le formulaire pour empêcher son envoi par défaut
document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault();

    // Fermez la modal après avoir traité le formulaire
    closeModal();
});
// Ajout d'un écouteur d'événement pour empêcher son envoi par défaut
document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault();

    // Récupération des données du formulaire dans la modalité
    const prenom = document.getElementById('first').value;
    const nom = document.getElementById('last').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Affichage des données dans la console
    console.log('Prénom :', prenom);
    console.log('Nom :', nom);
    console.log('Email :', email);
    console.log('Message :', message);

    // Fermeture de la modalité après traitement du formulaire
    closeModal();

});
