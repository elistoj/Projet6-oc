// Déclaration de la variable pour stocker les médias du photographe
let photographerMedia;

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

// Classe de base pour les images
class Photo extends Media {
  render() {
    const img = document.createElement('img');
    const imagePath = `assets/images/${this.photographerName}/${this.mediaData.image}`;
    img.src = imagePath;
    img.alt = this.mediaData.title; // Définition de l'attribut alt avec le titre de l'image
    return img;
  }
}

// Classe de base pour les médias
class Video extends Media {
  render() {
    const video = document.createElement('video');
    const videoPath = `assets/images/${this.photographerName}/${this.mediaData.video}`;
    video.src = videoPath;
    video.controls = false;
    video.autoplay = false; // Dodavanje atributa za automatsko reprodukovanje
    video.alt = this.mediaData.title; // Définition de l'attribut alt avec le titre de le video
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

 

    // Filtrer les médias en fonction de l'ID du photographe
    photographerMedia = data.media.filter(m => m.photographerId == id);

    // Retourner le photographe et ses médias
    return { photographer, photographerMedia };
  } catch (error) {
    console.error('Erreur lors de la récupération des données du photographe :', error);
    throw error;
  }
}

function createMediaCard(media, photographerName, mediaIndex, photographer, mediaList) {
  const card = document.createElement('div');
  card.classList.add('media-card');

// Créer l'élément média (image ou vidéo)
  const mediaInstance = MediaFactory.createMedia(media, photographerName);
  const mediaElement = mediaInstance.render();


// Ajoute l'élément multimédia à l'onglet
  card.appendChild(mediaElement);

// Création de l'icône du cœur comme fa-regular et ajout de tabIndex
  const heartIcon = document.createElement('em');
  heartIcon.classList.add('fa-regular', 'fa-heart');
  heartIcon.tabIndex = 0;

// Ajout d'un écouteur d'événement Heart Click pour gérer les likes
  heartIcon.addEventListener('click', () => handleLikeClick(mediaIndex, heartIcon, photographer, mediaList));

// Ajout d'un écouteur d'événement pour Enter sur le coeur pour gérer les likes
heartIcon.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // Спречи стандардното однесување на Enter копчето
    console.log('Enter pressed');
    handleLikeClick(mediaIndex, heartIcon, photographer, mediaList);
  }
});




// Ajoute l'icône du cœur à la carte
  const likesContainer = document.createElement('div');
  likesContainer.classList.add('likes-container');
  const likes = document.createElement('p');
  likes.textContent = ` ${media.likes}`;
  likesContainer.appendChild(likes);
  likesContainer.appendChild(heartIcon);
  likes.tabIndex = 0; 

  const mediaInfo = document.createElement('div');
  mediaInfo.classList.add('media-info');
  const title = document.createElement('p');
  title.textContent = media.title;
  title.tabIndex = 0; 


  mediaInfo.appendChild(title);
  mediaInfo.appendChild(likesContainer);

  card.appendChild(mediaInfo);

// Ajoutez tabIndex uniquement si l'élément multimédia est une vidéo ou une image
if (mediaElement.tagName.toLowerCase() === 'video' || mediaElement.tagName.toLowerCase() === 'img') {
  mediaElement.tabIndex = 0;
}

// Ajoutez un écouteur d'événement pour ouvrir la lightbox en cliquant ou sur Entrée
mediaElement.addEventListener('click', () => openLightbox(media, mediaList, photographerName));
mediaElement.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    openLightbox(media, mediaList, photographerName);
  }
  if (event.key === 'Enter') {
    handleLikeClick(mediaIndex, heartIcon, photographer, mediaList);
  }
});

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
     photographer.tabIndex = 0; 


     // Ajout de la ville et du pays
     const cityCountry = document.createElement('p');
     cityCountry.textContent = `${photographer.city}, ${photographer.country}`;
     cityCountry.classList.add('city-country');
     document.getElementById('photographerInfoContainer').appendChild(cityCountry);
     cityCountry.tabIndex = 0;

     // Ajout du slogan
     const tagline = document.createElement('p');
     tagline.textContent = photographer.tagline;
     document.getElementById('photographerInfoContainer').appendChild(tagline);
     tagline.tabIndex = 0;

     // Ajout de la photo du photographe
     const img = document.createElement('img');
     img.src = `assets/photographers/${photographer.portrait}`;
     img.alt = photographer.name;
     document.getElementById('photographerImageContainer').appendChild(img);

    //Total likes
    const totalLikes = calculateTotalLikes(photographerMedia);
    displayTotalLikesAndPrice(totalLikes, photographer.price);

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
  likesTotalPriceContainer.innerHTML = `<p>${totalLikes} <em class="fa-solid fa-heart"></em> ${pricePerDay} € / jour</p>`;
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




