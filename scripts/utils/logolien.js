
// Recherche de l'élément du logo
const logo = document.getElementById('logo');

// Ajouter un écouteur pour le clic sur le logo
logo.addEventListener('click', () => {
// Rediriger l'utilisateur vers index.html
    window.location.href = './index.html';
});

// Ajouter un écouteur pour le bouton Entrée sur le logo
logo.addEventListener('keydown', (event) => {
// Vérifiez si la touche Entrée a été enfoncée
    if (event.key === 'Enter') {
// Rediriger l'utilisateur vers index.html
        window.location.href = './index.html';
    }
});
function redirectToHomepage() {
    window.location.href = '/';
  }
  
  // Ajout des écouteurs d'événements pour le clic et la touche Entrée sur le logo
  document.addEventListener('DOMContentLoaded', function() {
    const logo = document.querySelector('.logo');
    logo.addEventListener('click', redirectToHomepage);
    logo.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            redirectToHomepage();
        }
    });
  
    // Ajout des écouteurs d'événements pour le clic et la touche Entrée sur le titre
    const title = document.querySelector('h1');
    title.addEventListener('click', redirectToHomepage);
    title.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            redirectToHomepage();
        }
    });
  });
  

  