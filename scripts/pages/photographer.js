// Déclarer une variable pour stocker les médias du photographe
let photographerMedia;

// Classe de la Factory Method pour créer des médias
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
async function fetchPhotographerData(photographerId) {
  try {
    // Effectuer une requête pour récupérer le fichier JSON des photographes
    const response = await fetch('data/photographers.json');

    // Vérifier si la requête est réussie
    if (!response.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }

    // Convertir la réponse en format JSON
    const data = await response.json();

    // Rechercher le photographe en fonction de l'ID
    const photographer = data.photographers.find(p => p.id == photographerId);

    // Gérer le cas où le photographe n'est pas trouvé
    if (!photographer) {
      console.error('Photographe non trouvé pour l\'ID :', photographerId);
      throw new Error('Données du photographe non trouvées.');
    }

    // Filtrer les médias en fonction de l'ID du photographe
    photographerMedia = data.media.filter(m => m.photographerId == photographerId);

    // Retourner le photographe et ses médias
    return { photographer, photographerMedia };
  } catch (error) {
    console.error('Erreur lors de la récupération des données du photographe :', error);
    throw error;
  }
}

// Fonction pour créer une carte de média
function createMediaCard(media, photographerName, mediaIndex, photographer) {
  const card = document.createElement('div');
  card.classList.add('media-card');

  // Utiliser la Factory Method pour créer le média
  const mediaInstance = MediaFactory.createMedia(media, photographerName);
  const mediaElement = mediaInstance.render();
  card.appendChild(mediaElement);

  // Créer l'icône du cœur en tant que fa-regular
  const heartIcon = document.createElement('i');
  heartIcon.classList.add('fa-regular', 'fa-heart');
  heartIcon.addEventListener('click', () => handleLikeClick(mediaIndex, heartIcon, photographer));

  // Ajouter l'icône du cœur à la carte multimédia
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

// Fonction asynchrone pour peupler les informations du photographe
async function populatePhotographerInfo(photographerId) {
  try {
    // Récupérer le photographe et ses informations
    const { photographer } = await fetchPhotographerData(photographerId);

    // Vérifier si le photographe est défini
    if (!photographer) {
      throw new Error('Données du photographe non trouvées.');
    }

    // Afficher les informations du photographe
    document.getElementById('photographerName').textContent = photographer.name;

    // Ajouter la ville et le pays
    const cityCountry = document.createElement('p');
    cityCountry.textContent = `${photographer.city}, ${photographer.country}`;
    cityCountry.classList.add('city-country');
    document.getElementById('photographerInfoContainer').appendChild(cityCountry);

    // Ajouter le slogan
    const tagline = document.createElement('p');
    tagline.textContent = photographer.tagline;
    document.getElementById('photographerInfoContainer').appendChild(tagline);

    // Ajouter l'image du photographe
    const img = document.createElement('img');
    img.src = `assets/photographers/${photographer.portrait}`;
    img.alt = photographer.name;
    document.getElementById('photographerImageContainer').appendChild(img);

  } catch (error) {
    console.error('Erreur lors du peuplement des informations du photographe :', error);
  }
}

// Fonction asynchrone pour peupler les photos du photographe
async function populatePhotographerPhotos(photographerId) {
  try {
    // Récupérer les médias du photographe
    const { photographerMedia, photographer } = await fetchPhotographerData(photographerId);
    const mediaContainer = document.getElementById('photographerMedia');

    // Effacer le conteneur
    mediaContainer.innerHTML = '';

    // Récupérer et afficher les médias du photographe
    photographerMedia.forEach((media, index) => {
      const mediaCard = createMediaCard(media, photographer.name, index, photographer);
      mediaContainer.appendChild(mediaCard);
    });

    // Ajouter le total des likes
    const totalLikes = calculateTotalLikes(photographerMedia);

    // Afficher le total des likes avec l'icône cœur et le prix du photographe
    displayTotalLikesAndPrice(totalLikes, photographer.price);
  } catch (error) {
    console.error('Erreur lors du peuplement des photos du photographe :', error);
  }
}

// Fonction pour trier par date (ascendant)
function sortByDate(mediaList) {
  return mediaList.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Fonction pour trier par likes (descendant)
function sortByLikes(mediaList) {
  return mediaList.slice().sort((a, b) => b.likes - a.likes);
}

// Fonction pour trier par titre (ascendant)
function sortByTitle(mediaList) {
  return mediaList.slice().sort((a, b) => a.title.localeCompare(b.title));
}

// Fonction pour gérer le clic sur l'icône du cœur
function handleLikeClick(mediaIndex, heartIcon, photographer) {
  console.log('Icône de like cliquée !');
  const media = photographerMedia[mediaIndex];
  if (!media || typeof media !== 'object' || !media.likes) {
    console.error('Objet média non valide :', media);
    return;
  }

  // Basculer la classe "liked" pour le changement de couleur
  heartIcon.classList.toggle('liked');

  // Mettre à jour le nombre de likes pour le média spécifique
  if (heartIcon.classList.contains('liked')) {
    // Changer l'icône du cœur en fa-solid et définir la couleur sur rouge
    heartIcon.classList.remove('fa-regular');
    heartIcon.classList.add('fa-solid');
    heartIcon.style.color = '#901C1C'; // Remplacez par la couleur rouge souhaitée
    media.likes += 1;
  } else {
    // Remplacer l'icône du cœur par fa-regular
    heartIcon.classList.remove('fa-solid');
    heartIcon.classList.add('fa-regular');
    heartIcon.style.color = '';
    media.likes -= 1;
  }

  // Mettre à jour le nombre de likes pour le média spécifique dans l'interface utilisateur
  const likesContainer = heartIcon.parentElement;
  const likesCount = likesContainer.querySelector('p');
  likesCount.textContent = ` ${media.likes}`;

  // Mettre à jour le nombre total de likes dans photographerMedia
  const totalLikes = calculateTotalLikes(photographerMedia);

  // Afficher le nombre total de likes avec l'icône en forme de cœur et le prix du photographe
  displayTotalLikesAndPrice(totalLikes, photographer.price);
}

// Fonction pour calculer le nombre total de likes
function calculateTotalLikes(photographerMedia) {
  return photographerMedia.reduce((totalLikes, media) => totalLikes + media.likes, 0);
}

// Fonction pour afficher le nombre total de likes et le prix du photographe
function displayTotalLikesAndPrice(totalLikes, pricePerDay) {
  const likesTotalPriceContainer = document.getElementById('likesTotalPrice');
  // Afficher le nombre total de likes avec l'icône en forme de cœur noir et le prix du photographe
  likesTotalPriceContainer.innerHTML = `<p>${totalLikes} <i class="fa-solid fa-heart"></i> ${pricePerDay} € / jour</p>`;
}

// Récupérer l'ID du photographe depuis les paramètres d'URL
const urlParams = new URLSearchParams(window.location.search);
const photographerId = urlParams.get('id');

// Vérifier si l'ID du photographe est présent dans les paramètres d'URL
if (!photographerId) {
  console.error('ID du photographe non trouvé dans les paramètres d\'URL.');
  // Gérer le cas où PhotographerId n'est pas présent (par exemple, rediriger ou afficher un message d'erreur)
} else {
  // Appeler les fonctions une seule fois pour peupler les informations du photographe et ses photos
  populatePhotographerInfo(photographerId);
  populatePhotographerPhotos(photographerId);
}
