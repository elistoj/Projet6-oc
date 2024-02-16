// Déclaration de la variable pour stocker les médias du photographe
let photographerMedia;

// Déclaration de la variable pour le photographer
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

// Classe de base pour les images
// Klasa osnovne slike
class Photo extends Media {
  render() {
    const img = document.createElement('img');
    const imagePath = `assets/images/${this.photographerName}/${this.mediaData.image}`;
    img.src = imagePath;
    img.alt = this.mediaData.title; // Postavljanje alt atributa sa naslovom slike
    img.tabIndex = 0; // Dodavanje tabindex atributa
    return img;
  }
}

// Klasa osnovnog videa
class Video extends Media {
  render() {
    const video = document.createElement('video');
    const videoPath = `assets/images/${this.photographerName}/${this.mediaData.video}`;
    video.src = videoPath;
    video.controls = true;
    video.autoplay = true; // Dodavanje atributa za automatsko reprodukovanje
    video.alt = this.mediaData.title; // Postavljanje alt atributa sa naslovom videa
    video.tabIndex = 0; // Dodavanje tabindex atributa
    return video;
  }
}

// Funkcija za rukovanje klikom na ikonu srca
function handleLikeInteraction(event, mediaIndex, heartIcon, photographer, mediaList) {
  // Funkcija se izvršava samo ako je pritisnuta tipka Enter (keyCode === 13) ili Space (keyCode === 32)
  if (event.keyCode === 13 || event.keyCode === 32) {
    // Izvrši istu logiku kao u funkciji handleLikeClick
    handleLikeClick(mediaIndex, heartIcon, photographer, mediaList);
  }
}

// Fonction pour créer une carte de média
function createMediaCard(media, photographerName, mediaIndex, photographer, mediaList) {
  const card = document.createElement('div');
  card.classList.add('media-card');

  // Utilisation de la Factory Method pour créer le média
  const mediaInstance = MediaFactory.createMedia(media, photographerName);
  const mediaElement = mediaInstance.render();
  mediaElement.addEventListener('click', () => openLightbox(media, mediaList, photographerName));
  card.appendChild(mediaElement);

  // Création de l'icône de cœur en tant qu'icône fa-regular
  const heartIcon = document.createElement('i');
  heartIcon.classList.add('fa-regular', 'fa-heart');
  heartIcon.addEventListener('click', () => handleLikeClick(mediaIndex, heartIcon, photographer, mediaList));
  heartIcon.setAttribute('tabindex', 0); // Dodavanje tabindex atributa

  // Dodavanje event listenera za otvaranje lightboxa na pritisak Enter
  addEnterKeyListenerToMedia(mediaElement, media, mediaList, photographerName);
 
  // Dodavanje event listenera za tastaturu (Enter i Space)
  heartIcon.addEventListener('keydown', (event) => handleLikeInteraction(event, mediaIndex, heartIcon, photographer, mediaList));

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



/// Funkcija asinhronog dohvatanja podataka o fotografu
async function fetchPhotographerData(id) {
  try {
    const response = await fetch('data/photographers.json');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const photographer = data.photographers.find(p => p.id == id);
    if (!photographer) {
      console.error('Photographer not found for ID:', id);
      throw new Error('Photographer data not found.');
    }
    const photographerMedia = data.media.filter(m => m.photographerId == id);
    return { photographer, photographerMedia };
  } catch (error) {
    console.error('Error fetching photographer data:', error);
    throw error;
  }
}

// Funkcija za popunjavanje informacija o fotografu
async function populatePhotographerInfo(id) {
  try {
    const { photographer } = await fetchPhotographerData(id);
    document.getElementById('photographerName').textContent = photographer.name;
    const cityCountry = document.createElement('p');
    cityCountry.textContent = `${photographer.city}, ${photographer.country}`;
    cityCountry.classList.add('city-country');
    document.getElementById('photographerInfoContainer').appendChild(cityCountry);
    const tagline = document.createElement('p');
    tagline.textContent = photographer.tagline;
    document.getElementById('photographerInfoContainer').appendChild(tagline);
    const img = document.createElement('img');
    img.src = `assets/photographers/${photographer.portrait}`;
    img.alt = photographer.name;
    document.getElementById('photographerImageContainer').appendChild(img);
  } catch (error) {
    console.error('Error populating photographer info:', error);
  }
}

// Funkcija za popunjavanje fotografija fotografa
async function populatePhotographerPhotos(id, sortBy) {
  try {
    const { photographerMedia, photographer } = await fetchPhotographerData(id);
    let sortedMedia = [...photographerMedia]; // Kopiranje medija za sortiranje

    // Sortiranje medija na osnovu odabrane opcije
    switch (sortBy) {
      case 'date':
        sortedMedia.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'likes':
        sortedMedia.sort((a, b) => b.likes - a.likes);
        break;
      case 'title':
        sortedMedia.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Ako nije odabrana opcija, koristi podrazumevanu vrednost (po datumu)
        sortedMedia.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // Osvežavanje prikaza medija
    const mediaContainer = document.getElementById('photographerMedia');
    mediaContainer.innerHTML = '';
    sortedMedia.forEach((media, index) => {
      const mediaCard = createMediaCard(media, photographer.name, index, photographer, photographerMedia);
      mediaContainer.appendChild(mediaCard);
    });

    // Računanje ukupnog broja lajkova
    const totalLikes = sortedMedia.reduce((total, media) => total + media.likes, 0);

    // Prikazivanje ukupnog broja lajkova i cene fotografa
    displayTotalLikesAndPrice(totalLikes, photographer.price);
  } catch (error) {
    console.error('Error populating photographer photos:', error);
  }
}






// Funkcija za popunjavanje informacija o fotografu
async function populatePhotographerInfo(id) {
  try {
    const { photographer } = await fetchPhotographerData(id);
    document.getElementById('photographerName').textContent = photographer.name;
    const cityCountry = document.createElement('p');
    cityCountry.textContent = `${photographer.city}, ${photographer.country}`;
    cityCountry.classList.add('city-country');
    document.getElementById('photographerInfoContainer').appendChild(cityCountry);
    const tagline = document.createElement('p');
    tagline.textContent = photographer.tagline;
    document.getElementById('photographerInfoContainer').appendChild(tagline);
    const img = document.createElement('img');
    img.src = `assets/photographers/${photographer.portrait}`;
    img.alt = photographer.name;
    document.getElementById('photographerImageContainer').appendChild(img);
  } catch (error) {
    console.error('Error populating photographer info:', error);
  }
}

// Funkcija za popunjavanje fotografija fotografa
async function populatePhotographerPhotos(id, sortBy) {
  try {
    const { photographerMedia, photographer } = await fetchPhotographerData(id);
    let sortedMedia = [...photographerMedia]; // Kopiranje medija za sortiranje

    // Sortiranje medija na osnovu odabrane opcije
    switch (sortBy) {
      case 'date':
        sortedMedia.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'likes':
        sortedMedia.sort((a, b) => b.likes - a.likes);
        break;
      case 'title':
        sortedMedia.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Ako nije odabrana opcija, koristi podrazumevanu vrednost (po datumu)
        sortedMedia.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // Osvežavanje prikaza medija
    const mediaContainer = document.getElementById('photographerMedia');
    mediaContainer.innerHTML = '';
    sortedMedia.forEach((media, index) => {
      const mediaCard = createMediaCard(media, photographer.name, index, photographer, photographerMedia);
      mediaContainer.appendChild(mediaCard);
    });

    // Računanje ukupnog broja lajkova
    const totalLikes = sortedMedia.reduce((total, media) => total + media.likes, 0);

    // Prikazivanje ukupnog broja lajkova i cene fotografa
    displayTotalLikesAndPrice(totalLikes, photographer.price);
  } catch (error) {
    console.error('Error populating photographer photos:', error);
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

// Funkcija za dodavanje event listenera za otvaranje lightboxa na pritisak Enter
function addEnterKeyListenerToMedia(mediaElement, media, mediaList, photographerName) {
  mediaElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      openLightbox(media, mediaList, photographerName);
    }
  });
}