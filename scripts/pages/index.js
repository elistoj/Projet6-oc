async function getPhotographers() {
  try {
      // Fetch data from the JSON file
      const response = await fetch('data/photographers.json');

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse JSON response
      const data = await response.json();

      console.log('Fetched data:', data); // Log the fetched data

      // Return the photographers array directly
      return data.photographers;
  } catch (error) {
      console.error('Error fetching photographers:', error);
      throw error; // Re-throw the error to be caught by the caller
  }
}

async function displayData(data) {
  const photographersSection = document.querySelector(".photographer_section");

  // Access the photographers array from the data object
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
      // Handle the error here, e.g., display an error message to the user
      console.error('Initialization error:', error);
  }
}

init();
