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

// Accédez au tableau des photographes depuis l'objet de données
  const photographers = data.photographers;

  photographers.forEach((photographer) => {
      const photographerModel = photographerTemplate(photographer);
      const userCardDOM = photographerModel.getUserCardDOM();
      photographersSection.appendChild(userCardDOM);
  });
}

async function init() {
  try {
      // Récupère les datas des photographes
      const photographers = await getPhotographers();
      displayData({ photographers }); // Pass an object with photographers property
  } catch (error) {
// Message d'erreur à l'utilisateur
      console.error('Initialization error:', error);
  }
}

init();
