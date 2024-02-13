// Déclaration de l'index du média actuellement affiché dans le lightbox
let currentMediaIndex = 0;

//Function pour ouvrir le lightbox
function openLightbox(media, mediaList, photographerName) {
  // Récupérer l'élément lightbox par son ID
  const lightbox = document.getElementById('lightbox');
  // Récupérer le contenu du lightbox
  const lightboxContent = lightbox.querySelector('.lightbox-content');
  // Récupérer l'élément pour afficher le titre du média dans le lightbox
  const mediaTitle = lightbox.querySelector('#mediaTitle');

  // Affichage du titre du média actuel
  mediaTitle.textContent = media.title;

  // Effacement du contenu précédent du lightbox
  lightboxContent.innerHTML = '';

  // Création de l'image ou de la vidéo dans le lightbox
  const mediaInstance = MediaFactory.createMedia(media, photographerName);
  const mediaElement = mediaInstance.render();
  lightboxContent.appendChild(mediaElement);

  // Ajout d'écouteurs d'événements pour les boutons précédent et suivant
  document.getElementById('prevMediaButton').addEventListener('click', () => showPreviousMedia(mediaList, photographerName));
  document.getElementById('nextMediaButton').addEventListener('click', () => showNextMedia(mediaList, photographerName));

  // Affichage du lightbox
  lightbox.style.display = 'block';
}

//Function pour fermer le lightbox

function closeLightbox() {
  // Récupérer l'élément lightbox par son ID
  const lightbox = document.getElementById('lightbox');
  // Cacher le lightbox en réglant son style display à 'none'
  lightbox.style.display = 'none';
}

// Fonction pour afficher le média suivant dans le lightbox
function showNextMedia(mediaList, photographerName) {
  // Calcul de l'index du média suivant
  currentMediaIndex = (currentMediaIndex + 1) % mediaList.length;
  // Affichage du média à l'index calculé
  displayMedia(mediaList, currentMediaIndex, photographerName);
}

// Fonction pour afficher le média précédent dans le lightbox
function showPreviousMedia(mediaList, photographerName) {
  // Calcul de l'index du média précédent
  currentMediaIndex = (currentMediaIndex - 1 + mediaList.length) % mediaList.length;
  // Affichage du média à l'index calculé
  displayMedia(mediaList, currentMediaIndex, photographerName);
}

// Fonction pour afficher un média spécifique dans le lightbox
function displayMedia(mediaList, index, photographerName) {
  // Récupérer le contenu du lightbox
  const lightboxContent = document.querySelector('.lightbox-content');
  // Récupérer l'élément pour afficher le titre du média dans le lightbox
  const mediaTitle = document.querySelector('#mediaTitle');
  // Récupérer le média à l'index spécifié
  const media = mediaList[index];

  // Afficher le titre du média
  mediaTitle.textContent = media.title;

  // Effacement du contenu précédent du lightbox
  lightboxContent.innerHTML = '';

  // Création de l'image ou de la vidéo dans le lightbox
  const mediaInstance = MediaFactory.createMedia(media, photographerName);
  const mediaElement = mediaInstance.render();
  lightboxContent.appendChild(mediaElement);

  // Affichage du lightbox
  lightbox.style.display = 'block';
}
// Селектор за сите медиуми во лајтбоксот
var mediaElements = document.querySelectorAll('.lightbox-content .media-wrapper img, .lightbox-content .media-wrapper video');

// Проход на секој медиум и поставување на иста максимална ширина
mediaElements.forEach(function(mediaElement) {
    mediaElement.style.maxWidth = '100%';
});
