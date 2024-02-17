// Fonction pour ouvrir la fenêtre modale
function openModalWindow() {
    // Ouvrir une nouvelle fenêtre modale avec le contenu de "contact_modal.html"
    const modalWindow = window.open("contact_modal.html", "Contactez-moi", photographerName);
    // Mettre le focus sur la nouvelle fenêtre
    modalWindow.focus();
    const modal = document.getElementById('modal');
    
// Définit tabindex à 0 pour modalot
    modal.setAttribute('tabindex', '0');
}

// Sélection des boutons de contact
const modalBtn = document.querySelectorAll('.contact_button');

// Sélection des champs du formulaire
const firstName = document.getElementById('first');
const lastName = document.getElementById('last');
const email = document.getElementById('email');
const message = document.getElementById('message');

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

// Définit le tabindex pour tous les éléments du modal sur 0
    const modalElements = modal.querySelectorAll('*');
    modalElements.forEach(element => {
        element.setAttribute('tabindex', '0');
    });

// Focus sur le premier champ de saisie du modal
    const firstInput = modal.querySelector('input');
    if (firstInput) {
        firstInput.focus();
    }

// Focus sur le bouton de fermeture
    const closeModalBtn = modal.querySelector('.modal header img');
    if (closeModalBtn) {
        closeModalBtn.focus();
    }
}



// Fonction pour fermer la modal
function closeModal() {
    // Sélectionner l'élément modal par son ID
    const modal = document.getElementById("contact_modal");
    // Cacher la modal en changeant le style pour "none"
    modal.style.display = "none";
}

// Ajout d'un écouteur d'événements aux boutons de contact
if (modalBtn) {
    modalBtn.forEach((btn) => btn.addEventListener('click', displayModal));
}

// Sélection du bouton de fermeture de la modal
const closeModalBtn = document.querySelector('.modal header img');
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
    // Ajout de la gestion de l'événement clavier pour la fermeture de la modal
    closeModalBtn.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            closeModal();
        }
    });
}

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

// Ajout d'un gestionnaire d'événements pour la touche Escape pour fermer la modalité
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});
