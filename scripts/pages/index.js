async function getPhotographers() {
  try {
    // Récupère les données du fichier JSON
    const response = await fetch('data/photographers.json');

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse JSON response
    const data = await response.json();

    console.log('Fetched data:', data); // Log the fetched data

    // Renvoie directement le tableau des photographes
    return data.photographers;
  } catch (error) {
    console.error('Error fetching photographers:', error);
    throw error; // Re-throw the error to be caught by the caller
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

    // Postavljamo tabindex na 0 za karticu fotografa
    userCardDOM.tabIndex = 0;

    // Postavljamo tabindex na 0 da bi slika bila fokusabilna
    image.tabIndex = 0;

    // Postavljamo tabindex na 0 za ime fotografa
    name.tabIndex = 0;

    // Postavljamo tabindex na 0 za opis fotografa
    description.tabIndex = 0;

    // Postavljamo tabindex na 0 za tagline
    tagline.tabIndex = 0;

    // Postavljamo tabindex na 0 za cenu
    price.tabIndex = 0;

    // Dodajemo event listenere za klik i taster Enter na karticu fotografa
    userCardDOM.addEventListener('click', () => {
      window.location.href = `photographer.html?id=${photographer.id}`;
    });

    userCardDOM.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        window.location.href = `photographer.html?id=${photographer.id}`;
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault(); // Prevent default scrolling behavior
        const currentIndex = Array.from(photographers).indexOf(photographer);
        if (currentIndex > 0) {
          photographers[currentIndex - 1].querySelector('img').focus();
        }
      } else if (event.key === 'ArrowRight') {
        event.preventDefault(); // Prevent default scrolling behavior
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
    // Preuzimanje podataka o fotografima iz JSON fajla
    const photographers = await getPhotographers();

    // Generisanje kartica fotografa
    displayData({ photographers });

    // Sačekajmo malo pre nego što pokušamo fokusirati prvu karticu
    setTimeout(() => {
      // Provera da li postoji prethodno fokusirana kartica
      const previousFocusedPhotographer = document.querySelector('.photographer_card:focus');
      if (!previousFocusedPhotographer) {
        // Postavljanje fokusa na prvu karticu ako nije pritisnut taster
        const firstPhotographer = document.querySelector('.photographer_card');
        if (firstPhotographer) {
          firstPhotographer.focus();
        }
      }
    }, 100); // Sačekajmo 100ms pre provere fokusa
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

init();
