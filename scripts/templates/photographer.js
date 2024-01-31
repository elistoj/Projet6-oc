
function photographerTemplate(data) {
    const { id, name, tagline, city, country, price, portrait } = data;
    const picture = `assets/photographers/${portrait}`;
    
    function getUserCardDOM() {
        const article = document.createElement('article');
        const img = document.createElement('img');
        const figure = document.createElement('figure');
        img.setAttribute("src", picture);
        img.setAttribute("alt", name); // Ajout d'un attribut alt pour l'accessibilité
        const h2 = document.createElement('h2');
        h2.textContent = name;

// Ajout d'informations supplémentaires à la carte utilisateur        
       
        const cityCountryParagraph = document.createElement('p');
        cityCountryParagraph.textContent = ` ${city},  ${country}`;
        cityCountryParagraph.classList.add('city-country'); // Ajout une class
        const taglineParagraph = document.createElement('p');
        taglineParagraph.textContent = ` ${tagline}`;   
        taglineParagraph.classList.add('tagline'); // Ajout une class
        const priceParagraph = document.createElement('p');
        priceParagraph.textContent = ` ${price}€/jour`;
        priceParagraph.classList.add('price'); // Ajout une class

        figure.appendChild(img);
        article.appendChild(figure);
        article.appendChild(h2);
        article.appendChild(cityCountryParagraph);
        article.appendChild(taglineParagraph);
        article.appendChild(priceParagraph);

        return article;
    }

    return { id, name, picture, getUserCardDOM };
}
