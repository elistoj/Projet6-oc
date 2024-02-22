// Declaration of the index of the media currently displayed in the lightbox
let currentMediaIndex = 0;

// Function to open the lightbox
function openLightbox(media, mediaList, photographerName) {
  // Retrieve the lightbox element by its ID
  const lightbox = document.getElementById('lightbox');
  // Retrieve the content of the lightbox
  const lightboxContent = lightbox.querySelector('.lightbox-content');
  // Retrieve the element to display the media title in the lightbox
  const mediaTitle = lightbox.querySelector('#mediaTitle');

// Afficher le titre du média actuel
  mediaTitle.textContent = media.title;

// Efface le contenu précédent de la lightbox
  lightboxContent.innerHTML = '';

  // Create the image or video in the lightbox
  const mediaInstance = MediaFactory.createMedia(media, photographerName);
  const mediaElement = mediaInstance.render();
  lightboxContent.appendChild(mediaElement);

     // Définit tabindex sur 0 pour rendre la media focusable
     mediaElement.tabIndex = 0;

// Afficher la lightbox
  lightbox.style.display = 'block';
// Vérifiez si le média est une vidéo et créez un élément vidéo
if (media.video) {
// Récupère l'élément vidéo existant
  const videoElement = lightboxContent.querySelector('video');
// Vérifiez si un élément vidéo est trouvé
  if (videoElement) {
// Définition des attributs de lecture automatique et de contrôle  
    videoElement.autoplay = true;
    videoElement.controls = true;
    // Définit tabindex sur 0 pour rendre la vidéo focusable
    videoElement.tabIndex = 0;
  }
}
  
// Ajouter un écouteur d'événement pour appuyer sur la touche Entrée pour fermer la lightbox
  document.addEventListener('keydown', handleKeyboardNavigation);

// Définit le tabindex pour le bouton de fermeture
  const closeButton = document.querySelector('.close-btn');
  closeButton.setAttribute('tabindex', '0');
  closeButton.focus();

// Ajout d'un écouteur d'événements pour fermer la lightbox avec la touche Entrée
  closeButton.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      closeLightbox();
    }
  });

// Ajout d'écouteurs d'événements pour les boutons précédent et suivant
  const prevMediaButton = document.getElementById('prevMediaButton');
  const nextMediaButton = document.getElementById('nextMediaButton');
  prevMediaButton.addEventListener('click', () => showPreviousMedia(mediaList, photographerName));
  nextMediaButton.addEventListener('click', () => showNextMedia(mediaList, photographerName));

// Ajout d'un tabindex pour les boutons multimédias précédents et suivants
  prevMediaButton.setAttribute('tabindex', '0');
  nextMediaButton.setAttribute('tabindex', '0');
}

// Fonction pour fermer la lightbox
function closeLightbox() {
// Récupère l'élément lightbox par son ID
  const lightbox = document.getElementById('lightbox');
// Masquer la lightbox en définissant son style d'affichage sur 'aucun'
  lightbox.style.display = 'none';

// Supprime l'écouteur d'événements pour la navigation au clavier
  document.removeEventListener('keydown', handleKeyboardNavigation);
}

// Fonction pour gérer la navigation au clavier
function handleKeyboardNavigation(event) {
  if (event.key === 'Escape') {
    closeLightbox();
  }
}

// Ajout d'un écouteur d'événement pour la touche Échap, appuyez pour fermer la lightbox
document.addEventListener('keydown', handleKeyboardNavigation);

// Ajout d'un écouteur d'événements pour fermer la lightbox avec le bouton de fermeture
document.querySelector('.close-btn').addEventListener('click', closeLightbox);

// Fonction pour afficher le média précédent dans la lightbox
function showPreviousMedia(mediaList, photographerName) {
// Calcule l'index du média précédent
  currentMediaIndex = (currentMediaIndex - 1 + mediaList.length) % mediaList.length;
// Afficher le média avec l'index calculé
  displayMedia(mediaList, currentMediaIndex, photographerName);
}

// Fonction pour afficher le média suivant dans la lightbox
function showNextMedia(mediaList, photographerName) {
// Calcule l'index du prochain média
  currentMediaIndex = (currentMediaIndex + 1) % mediaList.length;
// Afficher le média avec l'index calculé
  displayMedia(mediaList, currentMediaIndex, photographerName);
}

// Fonction pour afficher un média spécifique dans la lightbox
function displayMedia(mediaList, index, photographerName) {
// Récupère le contenu de la lightbox
  const lightboxContent = document.querySelector('.lightbox-content');
  // Retrieve the element to display the title of the media in the lightbox
  const mediaTitle = document.querySelector('#mediaTitle');
// Récupère l'élément pour afficher le titre du média dans la lightbox
  const media = mediaList[index];

// Afficher le titre du média
  mediaTitle.textContent = media.title;

// Efface le contenu précédent de la lightbox
  lightboxContent.innerHTML = '';

// Crée l'image ou la vidéo dans la lightbox
  const mediaInstance = MediaFactory.createMedia(media, photographerName);
  const mediaElement = mediaInstance.render();
  lightboxContent.appendChild(mediaElement);

  // Afficher la lightbox
  lightbox.style.display = 'block';

// Si le média est une vidéo, démarre la lecture automatiquement
  if (media.video) {
    mediaElement.autoplay = true;
    mediaElement.controls = true;
     // Définit tabindex sur 0 pour rendre la vidéo focusable
     mediaElement.tabIndex = 0;
  }
}
