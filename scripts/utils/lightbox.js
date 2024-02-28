// Déclaration de l'index du média actuellement affiché dans la lightbox
let currentMediaIndex = 0;

// Fonction pour ouvrir la lightbox
function openLightbox(media, mediaList, photographerName) {
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = lightbox.querySelector('.lightbox-content');
  const mediaTitle = lightbox.querySelector('#mediaTitle');

  // Afficher le titre du média
  mediaTitle.textContent = media.title;
  lightboxContent.innerHTML = '';

  // Créer l'élément média (image ou vidéo) dans la lightbox
  const mediaInstance = MediaFactory.createMedia(media, photographerName);
  const mediaElement = mediaInstance.render();
  lightboxContent.appendChild(mediaElement);
  mediaElement.tabIndex = 0;

  // Afficher la lightbox
  lightbox.style.display = 'block';

  // Vérifier si le média est une vidéo et créer un élément vidéo
  if (media.video) {
    const videoElement = lightboxContent.querySelector('video');
    if (videoElement) {
      videoElement.autoplay = true;
      videoElement.controls = true;
      videoElement.tabIndex = 0;
    }
  }

  // Ajouter un écouteur d'événement pour la touche Échap
  document.addEventListener('keydown', handleKeyboardNavigation);

  // Définir tabindex pour le bouton de fermeture et lui donner le focus
  const closeButton = document.querySelector('.close-btn');
  closeButton.setAttribute('tabindex', '0');
  closeButton.focus();

  // Ajouter un écouteur d'événements pour fermer la lightbox avec la touche Entrée
  closeButton.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      closeLightbox();
    }
  });

  // Ajouter des écouteurs d'événements pour les boutons précédent et suivant
  const prevMediaButton = document.getElementById('prevMediaButton');
  const nextMediaButton = document.getElementById('nextMediaButton');
  prevMediaButton.addEventListener('click', () => showPreviousMedia(mediaList, photographerName));
  nextMediaButton.addEventListener('click', () => showNextMedia(mediaList, photographerName));


}

// Fonction pour fermer la lightbox
function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.style.display = 'none';
  document.removeEventListener('keydown', handleKeyboardNavigation);
}

// Fonction pour gérer la navigation au clavier
function handleKeyboardNavigation(event) {
  if (event.key === 'Escape') {
    closeLightbox();
  }
}

// Ajouter un écouteur d'événement pour fermer la lightbox avec le bouton de fermeture
document.querySelector('.close-btn').addEventListener('click', closeLightbox);

// Fonction pour afficher le média précédent dans la lightbox
function showPreviousMedia(mediaList, photographerName) {
  currentMediaIndex = (currentMediaIndex - 1 + mediaList.length) % mediaList.length;
  displayMedia(mediaList, currentMediaIndex, photographerName);
}

// Fonction pour afficher le média suivant dans la lightbox
function showNextMedia(mediaList, photographerName) {
  currentMediaIndex = (currentMediaIndex + 1) % mediaList.length;
  displayMedia(mediaList, currentMediaIndex, photographerName);
}

// Fonction pour afficher un média spécifique dans la lightbox
function displayMedia(mediaList, index, photographerName) {
  const lightboxContent = document.querySelector('.lightbox-content');
  const mediaTitle = document.querySelector('#mediaTitle');
  const media = mediaList[index];

  // Afficher le titre du média
  mediaTitle.textContent = media.title;
  lightboxContent.innerHTML = '';

  // Créer l'image ou la vidéo dans la lightbox
  const mediaInstance = MediaFactory.createMedia(media, photographerName);
  const mediaElement = mediaInstance.render();
  lightboxContent.appendChild(mediaElement);

  // Afficher la lightbox
  lightbox.style.display = 'block';

  // Si le média est une vidéo, définir les attributs de lecture automatique et de contrôle
  if (media.video) {
    mediaElement.autoplay = true;
    mediaElement.controls = true;
    mediaElement.tabIndex = 0;
  }
}
