// Fonction pour créer un modèle de photographe
function photographerTemplate(data) {
    // Extraction des données du photographe
    const { id, name, tagline, city, country, price, portrait } = data;
    // Chemin de l'image du photographe
    const picture = `assets/photographers/${portrait}`;

    // Fonction pour obtenir le DOM de la carte utilisateur
    function getUserCardDOM() {
        // Création des éléments HTML
        const article = document.createElement('article');
        const img = document.createElement('img');
        const figure = document.createElement('figure');
        img.setAttribute("src", picture);
        img.setAttribute("alt", name); // Ajout d'un attribut alt pour l'accessibilité
        const h2 = document.createElement('h2');
        h2.textContent = name;

        // Ajout d'informations supplémentaires à la carte utilisateur
        const cityCountryParagraph = document.createElement('p');
        cityCountryParagraph.textContent = ` ${city}, ${country}`;
        cityCountryParagraph.classList.add('city-country'); // Ajout d'une classe
        const taglineParagraph = document.createElement('p');
        taglineParagraph.textContent = ` ${tagline}`;
        taglineParagraph.classList.add('tagline'); // Ajout d'une classe
        const priceParagraph = document.createElement('p');
        priceParagraph.textContent = ` ${price}€/jour`;
        priceParagraph.classList.add('price'); // Ajout d'une classe

        // Construction de la structure DOM de la carte utilisateur
        figure.appendChild(img);
        article.appendChild(figure);
        article.appendChild(h2);
        article.appendChild(cityCountryParagraph);
        article.appendChild(taglineParagraph);
        article.appendChild(priceParagraph);

        return article;
    }

    // Retourne un objet avec les données du photographe et la fonction pour obtenir le DOM de la carte utilisateur
    return { id, name, picture, getUserCardDOM };
}

//photographerTemplate est  défini dans ce document, mais non utilisé. Il est utilisé dans le index.js
