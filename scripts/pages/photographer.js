// Déclaration de la variable pour stocker les médias du photographe
let photographerMedia;

let photographer;





// Déclaration de la variable pour stocker l'ID du photographe
let photographerId;

// Classe Factory Method pour créer des médias
class MediaFactory {
  static createMedia(mediaData, photographerName) {
    if (mediaData.image) {
      return new Photo(mediaData, photographerName);
    } else if (mediaData.video) {
      return new Video(mediaData, photographerName);
    } else {
      throw new Error('Type de média non pris en charge.');
    }
  }
}

// Classe de base pour les médias
class Media {
  constructor(mediaData, photographerName) {
    this.mediaData = mediaData;
    this.photographerName = photographerName;
  }

  // Méthode render() pour afficher le média
  render() {
    throw new Error('La méthode render() doit être implémentée par les sous-classes.');
  }
}

// Classe pour les photos
class Photo extends Media {
  render() {
    const img = document.createElement('img');
    const imagePath = `assets/images/${this.photographerName}/${this.mediaData.image}`;
    img.src = imagePath;
    img.alt = this.mediaData.title;
    return img;
  }
}

// Classe pour les vidéos
class Video extends Media {
  render() {
    const video = document.createElement('video');
    const videoPath = `assets/images/${this.photographerName}/${this.mediaData.video}`;
    video.src = videoPath;
    video.controls = true;
    return video;
  }
}

// Fonction asynchrone pour récupérer les données du photographe
async function fetchPhotographerData(id) {
  try {
    // Effectuer une requête pour récupérer le fichier JSON contenant les données des photographes
    const response = await fetch('data/photographers.json');

    // Vérifier si la requête a réussi
    if (!response.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }

    // Conversion de la réponse en format JSON
    const data = await response.json();

    // Rechercher le photographe en fonction de son ID
    const photographer = data.photographers.find(p => p.id == id);

    // Gérer le cas où le photographe n'est pas trouvé
    if (!photographer) {
      console.error('Photographe non trouvé pour ID :', id);
      throw new Error('Données du photographe non trouvées.');
    }

    // Filtrer les médias en fonction de l'ID du photographe
    photographerMedia = data.media.filter(m => m.photographerId == id);

    // Retourner le photographe et ses médias
    return { photographer, photographerMedia };
  } catch (error) {
    console.error('Erreur lors de la récupération des données du photographe :', error);
    throw error;
  }
}

// Fonction pour créer une carte de média
function createMediaCard(media, photographerName, mediaIndex, photographer, mediaList) {
  const card = document.createElement('div');
  card.classList.add('media-card');

  // Utilisation de la Factory Method pour créer le média
  const mediaInstance = MediaFactory.createMedia(media, photographerName);
  const mediaElement = mediaInstance.render();
  card.appendChild(mediaElement);

  // Création de l'icône de cœur en tant qu'icône fa-regular
  const heartIcon = document.createElement('i');
  heartIcon.classList.add('fa-regular', 'fa-heart');
  heartIcon.addEventListener('click', () => handleLikeClick(mediaIndex, heartIcon, photographer, mediaList));

  // Ajout de l'icône de cœur à la carte de média
  const likesContainer = document.createElement('div');
  likesContainer.classList.add('likes-container');
  const likes = document.createElement('p');
  likes.textContent = ` ${media.likes}`;
  likesContainer.appendChild(likes);
  likesContainer.appendChild(heartIcon);

  const mediaInfo = document.createElement('div');
  mediaInfo.classList.add('media-info');
  const title = document.createElement('p');
  title.textContent = media.title;

  mediaInfo.appendChild(title);
  mediaInfo.appendChild(likesContainer);

  card.appendChild(mediaInfo);

  return card;
}

// Fonction asynchrone pour remplir les informations sur le photographe
async function populatePhotographerInfo(id) {
  try {
    // Récupération du photographe et de ses informations
    const { photographer } = await fetchPhotographerData(id);

    // Vérifier si le photographe est défini
    if (!photographer) {
      throw new Error('Données du photographe non trouvées.');
    }

    // Affichage des informations sur le photographe
    document.getElementById('photographerName').textContent = photographer.name;

    // Ajout de la ville et du pays
    const cityCountry = document.createElement('p');
    cityCountry.textContent = `${photographer.city}, ${photographer.country}`;
    cityCountry.classList.add('city-country');
    document.getElementById('photographerInfoContainer').appendChild(cityCountry);

    // Ajout du slogan
    const tagline = document.createElement('p');
    tagline.textContent = photographer.tagline;
    document.getElementById('photographerInfoContainer').appendChild(tagline);

    // Ajout de la photo du photographe
    const img = document.createElement('img');
    img.src = `assets/photographers/${photographer.portrait}`;
    img.alt = photographer.name;
    document.getElementById('photographerImageContainer').appendChild(img);

  } catch (error) {
    console.error('Erreur lors du remplissage des informations sur le photographe :', error);
  }
}

// Fonction asynchrone pour remplir les photos du photographe
async function populatePhotographerPhotos(id, sortBy) {
  try {
    // Récupération des médias du photographe
    const { photographerMedia, photographer } = await fetchPhotographerData(id);
    let sortedMedia = [];

    // Tri des médias en fonction de l'option sélectionnée
    switch (sortBy) {
      case 'date':
        sortedMedia = sortByDate(photographerMedia);
        break;
      case 'likes':
        sortedMedia = sortByLikes(photographerMedia);
        break;
      case 'title':
        sortedMedia = sortByTitle(photographerMedia);
        break;
      default:
        // Si aucune option de tri n'est sélectionnée, utilisez la valeur par défaut
        sortedMedia = sortByDate(photographerMedia);
    }

    // Mise à jour du tableau photographerMedia
    photographerMedia.length = 0;
    sortedMedia.forEach(media => photographerMedia.push(media));

    // Effacement du conteneur
    const mediaContainer = document.getElementById('photographerMedia');
    mediaContainer.innerHTML = '';

    // Récupération et affichage des médias du photographe
    sortedMedia.forEach((media, index) => {
      const mediaCard = createMediaCard(media, photographer.name, index, photographer, photographerMedia);
      mediaContainer.appendChild(mediaCard);
    });

    // Ajout du nombre total de likes
    const totalLikes = calculateTotalLikes(sortedMedia);

    // Affichage du nombre total de likes avec l'icône de cœur et le prix du photographe
    displayTotalLikesAndPrice(totalLikes, photographer.price);
  } catch (error) {
    console.error('Erreur lors du remplissage des photos du photographe :', error);
  }
}

// Fonction asynchrone qui s'exécute après avoir cliqué sur le bouton de tri
async function initializeSortButtons(id) {
  try {
    // Récupération des médias du photographe
    const { photographerMedia } = await fetchPhotographerData(id);

    // Mise à jour des boutons de tri et ajout au conteneur
    const sortByDateButton = document.getElementById('sortByDateButton');
    const sortByTitleButton = document.getElementById('sortByTitleButton');
    const sortByLikesButton = document.getElementById('sortByLikesButton');

    sortByDateButton.addEventListener('click', () => populatePhotographerPhotos(id, 'date'));
    sortByTitleButton.addEventListener('click', () => populatePhotographerPhotos(id, 'title'));
    sortByLikesButton.addEventListener('click', () => populatePhotographerPhotos(id, 'likes'));

  } catch (error) {
    console.error('Erreur lors du remplissage des photos du photographe :', error);
  }
}

// Fonction pour gérer le clic sur l'icône de cœur
function handleLikeClick(mediaIndex, heartIcon, photographer, mediaList) {
  console.log('Cœur cliqué !');
  const media = mediaList[mediaIndex];
  if (!media || typeof media !== 'object' || !media.likes) {
    console.error('Objet média non valide :', media);
    return;
  }

  // Changement de la classe "liked" pour changer la couleur
  heartIcon.classList.toggle('liked');

  // Mise à jour du nombre de likes pour le média spécifique
  if (heartIcon.classList.contains('liked')) {
    // Changement de l'icône de cœur en fa-solid et réglage de la couleur sur rouge
    heartIcon.classList.remove('fa-regular');
    heartIcon.classList.add('fa-solid');
    heartIcon.style.color = '#901C1C'; // Changez-le pour la couleur de rouge souhaitée
    media.likes += 1;
  } else {
    // Retour à l'icône de cœur fa-regular
    heartIcon.classList.remove('fa-solid');
    heartIcon.classList.add('fa-regular');
    heartIcon.style.color = '';
    media.likes -= 1;
  }

  // Mise à jour du nombre de likes pour le média spécifique dans l'interface utilisateur
  const likesContainer = heartIcon.parentElement;
  const likesCount = likesContainer.querySelector('p');
  likesCount.textContent = ` ${media.likes}`;

  // Mise à jour du nombre total de likes
  const totalLikes = calculateTotalLikes(mediaList);

  // Affichage du nombre total de likes avec l'icône de cœur et le prix du photographe
  displayTotalLikesAndPrice(totalLikes, photographer.price);
}

// Fonction pour trier par date (croissante)
function sortByDate(mediaList) {
  return mediaList.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Fonction pour trier par likes (décroissante)
function sortByLikes(mediaList) {
  return mediaList.slice().sort((a, b) => b.likes - a.likes);
}

// Fonction pour trier par titre (croissante)
function sortByTitle(mediaList) {
  return mediaList.slice().sort((a, b) => a.title.localeCompare(b.title));
}

// Fonction pour calculer le nombre total de likes
function calculateTotalLikes(photographerMedia) {
  return photographerMedia.reduce((totalLikes, media) => totalLikes + media.likes, 0);
}

// Fonction pour afficher le nombre total de likes et le prix du photographe
function displayTotalLikesAndPrice(totalLikes, pricePerDay) {
  const likesTotalPriceContainer = document.getElementById('likesTotalPrice');
  // Affichage du nombre total de likes avec l'icône de cœur et le prix du photographe
  likesTotalPriceContainer.innerHTML = `<p>${totalLikes} <i class="fa-solid fa-heart"></i> ${pricePerDay} € / jour</p>`;
}

/// Récupération de l'ID du photographe à partir des paramètres d'URL
const urlParams = new URLSearchParams(window.location.search);
photographerId = urlParams.get('id');

// Vérification de la présence de l'ID du photographe dans les paramètres d'URL
if (!photographerId) {
  console.error('ID du photographe non trouvé dans les paramètres d\'URL.');
  // Traitement lorsque PhotographerId n'est pas présent (par exemple, redirection ou affichage d'un message d'erreur)
} else {
  // Appel initial des fonctions pour remplir les informations sur le photographe et ses photos
  populatePhotographerInfo(photographerId);
  populatePhotographerPhotos(photographerId, 'date');

  // Ensuite, appelons une nouvelle fonction qui définit les boutons de tri
  initializeSortButtons(photographerId);
}

// Écouteur d'événements pour le bouton "Trier par" qui affiche la fenêtre des options de tri
document.getElementById('sortButton').addEventListener('click', function() {
  const sortButtonsContainer = document.getElementById('sortButtons');
  const currentDisplayStyle = sortButtonsContainer.style.display;
  // Masquer toutes les fenêtres
  document.getElementById('sortButtons').querySelectorAll('.sort-options').forEach(option => {
    option.style.display = 'none';
  });
  // Si actuellement affiché, masquez-le, sinon affichez-le
  sortButtonsContainer.style.display = currentDisplayStyle === 'none' ? 'flex' : 'none';
});

/// Écouteurs d'événements pour les boutons de tri
// Lorsque l'option de tri par date est sélectionnée
document.getElementById('sortByDateButton').addEventListener('click', function() {
  populatePhotographerPhotos(photographerId, 'date');
});

// Lorsque l'option de tri par titre est sélectionnée
document.getElementById('sortByTitleButton').addEventListener('click', function() {
  populatePhotographerPhotos(photographerId, 'title');
});

// Lorsque l'option de tri par popularité est sélectionnée
document.getElementById('sortByLikesButton').addEventListener('click', function() {
  populatePhotographerPhotos(photographerId, 'likes');
});

// Fonction pour changer la couleur de fond de la fenêtre des options de tri
function changeSortOptionsBackground(color) {
  const sortButtonsContainer = document.getElementById('sortButtons');
  sortButtonsContainer.style.backgroundColor = color;
}

// Fonction pour changer la couleur du bouton de tri sélectionné
function toggleSortOptionsDisplay(buttonId) {
  const sortOptionsContainer = document.getElementById(buttonId).nextElementSibling;
  // Masquer toutes les fenêtres
  document.getElementById('sortButtons').querySelectorAll('.sort-options').forEach(option => {
    if (option !== sortOptionsContainer) {
      option.style.display = 'none';
    }
  });
  // Réinitialiser tous les boutons à la couleur par défaut
  document.querySelectorAll('.sort-button').forEach(btn => {
    btn.classList.remove('active');
  });
  // Afficher ou masquer la fenêtre en fonction de l'état actuel d'affichage
  if (sortOptionsContainer.style.display === 'none') {
    sortOptionsContainer.style.display = 'flex';
    document.getElementById(buttonId).classList.add('active'); // Ajouter la classe active
  } else {
    sortOptionsContainer.style.display = 'none';
    document.getElementById(buttonId).classList.remove('active'); // Supprimer la classe active
  }
}

// Écouteurs d'événements pour les boutons de tri
document.getElementById('sortByDateButton').addEventListener('click', function() {
  populatePhotographerPhotos(photographerId, 'date');
  toggleSortOptionsBackground(this.id); // Appeler la fonction avec l'ID du bouton cliqué
});

document.getElementById('sortByTitleButton').addEventListener('click', function() {
  populatePhotographerPhotos(photographerId, 'title');
  toggleSortOptionsBackground(this.id); // Appeler la fonction avec l'ID du bouton cliqué
});

document.getElementById('sortByLikesButton').addEventListener('click', function() {
  populatePhotographerPhotos(photographerId, 'likes');
  toggleSortOptionsBackground(this.id); // Appeler la fonction avec l'ID du bouton cliqué
});

// Fonction pour ajouter/supprimer la classe active au bouton de tri sélectionné
function toggleSortOptionsBackground(buttonId) {
  const buttons = document.querySelectorAll('#sortButtons button');
  buttons.forEach(button => {
    if (button.id === buttonId) {
      button.classList.add('active'); // Ajouter la classe active au bouton cliqué
    } else {
      button.classList.remove('active'); // Supprimer la classe active des autres boutons
    }
  });
}

function openLightbox(mediaUrl, mediaTitle) {
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.querySelector('.lightbox-content');
  
  // Effacer le contenu de la lightbox
  lightboxContent.innerHTML = '';

  // Ajouter l'image ou la vidéo à la lightbox
  if (mediaUrl.endsWith('.jpg') || mediaUrl.endsWith('.png') || mediaUrl.endsWith('.jpeg')) {
    const img = document.createElement('img');
    img.src = mediaUrl;
    lightboxContent.appendChild(img);
  } else if (mediaUrl.endsWith('.mp4')) {
    const video = document.createElement('video');
    video.src = mediaUrl;
    video.controls = true;
    lightboxContent.appendChild(video);
  }

  // Afficher le titre du média dans la lightbox
  const titleParagraph = document.createElement('p');
  titleParagraph.textContent = mediaTitle;
  lightboxContent.appendChild(titleParagraph);

  // Afficher la lightbox
  lightbox.style.display = 'block';
}









// Fonction pour fermer la lightbox
function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.style.display = 'none';
}

// Écouteur d'événements pour ouvrir la lightbox lorsqu'on clique sur une image ou une vidéo
document.getElementById('photographerMedia').addEventListener('click', function(event) {
  const target = event.target;
  if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
    const mediaUrl = target.tagName === 'IMG' ? target.src : target.src;
    openLightbox(mediaUrl);
  }
});

function showNextMedia(photographer) {
  const lightboxContent = document.querySelector('.lightbox-content img, .lightbox-content video');
  if (!lightboxContent) return;

  const currentIndex = photographerMedia.findIndex(media => {
    const mediaUrl = media.image || media.video;
    return mediaUrl === lightboxContent.src;
  });

  if (currentIndex < photographerMedia.length - 1) {
    const nextMedia = photographerMedia[currentIndex + 1];
    displayMediaInLightbox(nextMedia, photographer); 
  }

}

function showPreviousMedia() {
  const lightboxContent = document.querySelector('.lightbox-content img, .lightbox-content video');
  if (!lightboxContent) return;

  const currentIndex = photographerMedia.findIndex(media => {
    const mediaUrl = media.image || media.video;
    return mediaUrl === lightboxContent.src;
  });

  if (currentIndex > 0) {
    const previousMedia = photographerMedia[currentIndex - 1];
    displayMediaInLightbox(previousMedia, photographer); 
  }
  
}

function displayMediaInLightbox(media, photographer) {
  console.log(photographer); 
  const lightboxContent = document.querySelector('.lightbox-content');

  lightboxContent.innerHTML = '';

  if (media.image) {
    const img = document.createElement('img');
    img.src = `assets/images/${photographer.name}/${media.image}`;
    lightboxContent.appendChild(img);
  } else if (media.video) {
    const video = document.createElement('video');
    video.src = `assets/images/${photographer.name}/${media.video}`;
    video.controls = true;
    lightboxContent.appendChild(video);
  }

  const mediaTitle = document.createElement('p');
  mediaTitle.textContent = media.title;
  lightboxContent.appendChild(mediaTitle);
}

