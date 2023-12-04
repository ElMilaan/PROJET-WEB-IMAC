let carousel = document.getElementsByClassName("carousel");
let title = document.title;
let hamburger = document.getElementById("hamburger");
let navlinks = document.querySelector(".navlinks");

console.log("navlinks");

hamburger.addEventListener("click", () => {
    navlinks.classList.add("open");
})


// on appelle la fonction qui fait fonctionner le carrousel seulement sur la bonne page
if (title === "Les Planètes") {
    moveCarousel();
}

// on affiche les données des planètes lorsque l'on clique sur l'une d'elles
else if (!title.includes("Système Solaire", "Les Planètes", "Calendrier Astronomique")) {
    if (title.includes(" ")) {
        title = lastWord(title);
    }
    displayElementData(title);
}

function displayElementData(id) {
    // on fait la requête API qui sert à récupérer les données sur l'élément cliqué
    fetch(`https://api.le-systeme-solaire.net/rest.php/bodies/${id}`)
        // on met le résultat sous le format json supporté par JavaScript pour pouvoir manipuler la data venant de l'API
        .then((res) => res.json())

        // on utilise les données récupérées pour les afficher de la manière qu'on veut
        .then((data) => {
            // on liste les propriété (key -- value) en les mettant directement en forme dans le DOM
            for (var key in data) {
                // on vérifie que la propriété est bien celle de l'objet json et ne provient pas d'un héritage
                // et que la valeur de la propriété n'est ni null ni vide
                if (
                    data.hasOwnProperty(key) &&
                    data[key] != null &&
                    data[key] != ""
                ) {
                    // premier cas spécifique : si la propriété est le nom de la planète, on met la value dans un h1
                    if (key == "name") {
                        let title = document.createElement("h1");
                        title.textContent = data[key];
                        document.body.appendChild(title);
                    }

                    // second cas spécifique : si la propriété est le nom anglais, on met la valeur dans un h3
                    else if (key == "englishName") {
                        let enName = document.createElement("h3");
                        enName.textContent = data[key];
                        document.body.appendChild(enName);
                    }

                    // troisème cas spécifique : si la propriété correspond aux lunes de la planète en question,
                    // on affiche son nombre de lunes.
                    else if (key == "moons") {
                        let container = createNode("div", "property", "", "");
                        document.body.appendChild(container);

                        let moonPropertyName = createNode("p", "", "Moons", "");
                        container.appendChild(moonPropertyName);

                        let lines = createNode("div", "lines", "", "");
                        container.appendChild(lines);

                        let moonsList = data[key].map(function (obj) {
                            return [obj.moon, obj.rel];
                        });
                        let nbMoons = 0;
                        for (var moon in moonsList) {
                            nbMoons++;
                        }
                        let value = createNode("p", "value", nbMoons, "");
                        container.appendChild(value);
                    }

                    // dans tous les autres cas on intègrera toujours les propriétés de la même manière dans le DOM
                    else {
                        let container = createNode("div", "property", "", "");
                        let cle = createNode("p", "key", key, "");
                        let lines = createNode("div", "lines", "", "");
                        let value = createNode("p", "value", data[key], "");

                        document.body.appendChild(container);
                        container.appendChild(cle);
                        container.appendChild(lines);
                        container.appendChild(value);
                    }
                }
            }
        })

        // si une erreur survient lors de la création de la nouvelle page d'affichage (après le dernier "then"),
        // l'erreur s'affiche dans la console.
        .catch((err) => {
            console.log(err);
        });
}

// beaucoup de balises HTML sont créées donc on a écrit une fonction qui simplifie leur création
function createNode(type, nameClass, txt, link) {
    let element = document.createElement(type);
    element.className = nameClass;
    element.textContent = txt;
    if (type === "a") {
        element.href = link;
    }
    return element;
}

// permet de récupérer le dernier mot d'un string (utile pour les noms d'astres qui ont un déterminant -> LA Terre, LE Soleil...)
function lastWord(str) {
    const word = str.split(" ");
    return word[word.length - 1];
}

/******************* CAROUSEL *******************/

function moveCarousel() {

    let count = 0;
    let position = 0;
    let carousel = document.querySelector(".carousel-elements");
    let decalage = (65 - 4) / 3 + 2;

    document.querySelector(".arrow-right").addEventListener("click", () => {
        if (count === 6) {
            position = -(6 * decalage);
            count += 0;
        } else {
            position -= decalage;
            count += 1;
        }
        carousel.style.transform = 'translateX(calc(' + position + 'vw ))';
        carousel.style.transition = '0.5s ease';
    });

    document.querySelector(".arrow-left").addEventListener("click", () => {
        if (count === 0) {
            position = 0;
            count += 0;
        } else {
            position += decalage;
            count -= 1;
        }
        carousel.style.transform = 'translateX(calc(' + position + 'vw))';
        carousel.style.transition = '0.5s ease';
    });
}