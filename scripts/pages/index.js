async function getPhotographers() {
  try {
    // Récupère les données du fichier JSON
    const response = await fetch('data/photographers.json');

    if (!response.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }

    // Analyse de la réponse JSON
    const data = await response.json();


    // Renvoie directement le tableau des photographes
    return data.photographers;
  } catch (error) {
    console.error('Erreur lors de la récupération des photographes :', error);
    throw error; // Rejette l'erreur pour qu'elle soit attrapée par l'appelant
  }
}

async function displayData(data) {
  const photographersSection = document.querySelector(".photographer_section");
  const photographers = data.photographers;

  photographers.forEach((photographer, index) => {
    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    const image = userCardDOM.querySelector('img');
    const name = userCardDOM.querySelector('h2');
    const description = userCardDOM.querySelector('p');
    const tagline = userCardDOM.querySelector('.tagline');
    const price = userCardDOM.querySelector('.price');

    // Définit tabIndex à 0 pour rendre l'image focusable
    image.tabIndex = 0;

    // Définit tabIndex à 0 pour rendre le nom du photographe focusable
    name.tabIndex = 0;

    // Définit tabIndex à 0 pour rendre la description focusable
    description.tabIndex = 0;

    // Définit tabIndex à 0 pour rendre le tagline focusable
    tagline.tabIndex = 0;

    // Définit tabIndex à 0 pour rendre le prix focusable
    price.tabIndex = 0;

    // Ajout des écouteurs d'événements pour le clic et la touche Entrée sur la carte du photographe
    userCardDOM.addEventListener('click', () => {
      window.location.href = `photographer.html?id=${photographer.id}`;
    });

    userCardDOM.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        window.location.href = `photographer.html?id=${photographer.id}`;
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault(); // Empêche le comportement de défilement par défaut
        const currentIndex = Array.from(photographers).indexOf(photographer);
        if (currentIndex > 0) {
          photographers[currentIndex - 1].querySelector('img').focus();
        }
      } else if (event.key === 'ArrowRight') {
        event.preventDefault(); // Empêche le comportement de défilement par défaut
        const currentIndex = Array.from(photographers).indexOf(photographer);
        if (currentIndex < photographers.length - 1) {
          photographers[currentIndex + 1].querySelector('img').focus();
        }
      }
    });

    photographersSection.appendChild(userCardDOM);
  });
}

async function init() {
  try {
    // Récupération des données sur les photographes à partir du fichier JSON
    const photographers = await getPhotographers();

    // Affichage des cartes des photographes
    displayData({ photographers });

    // Attendre un peu avant de tenter de mettre le focus sur la première carte
    setTimeout(() => {
      // Vérification s'il y a déjà une carte qui a le focus
      const previousFocusedPhotographer = document.querySelector('.photographer_card:focus');
      if (!previousFocusedPhotographer) {
        // Mettre le focus sur la première carte si aucune touche n'a été pressée
        const firstPhotographer = document.querySelector('.photographer_card');
        if (firstPhotographer) {
          firstPhotographer.focus();
        }
      }
    }, 100); // Attendre 100ms avant de vérifier le focus
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

init();



// photographerTemplate  est utilisé dans le document ,mais est  defini dans templates/photographerTemplate
// index  est utilisé dans le document  

