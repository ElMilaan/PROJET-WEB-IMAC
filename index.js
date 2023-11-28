const elements = document.querySelectorAll(".element");
let moons = document.getElementsByClassName("moon");
let carousel = document.getElementsByClassName("carousel");
// variable qui stock l'id de l'élément sélectionner (terre, soleil...)
let currentElement = "";

// On ajoute un événement sur chacun des boutons des éléments du système solaire qui se déclenche quand on clique dessus
elements.forEach((element) => {
    element.addEventListener("click", () => {
        // currentElement prend la valeur de l'id de l'élément sur lequel on a cliqué
        currentElement = element.id;
        // on retire tous les éléments de la page sauf la nav
        document.querySelector(".title").remove();
        elements.forEach((element) => {
            element.remove();
        });
        // on appelle la fonction qui sert à afficher la page d'info sur l'élément cliqué
        displayElementData(currentElement);
        // A voir car marche pas
        moons = document.getElementsByClassName("moon");
        addEventOnMoon();
        console.log(moons);
    });
});

function addEventOnMoon() {
    for (let i = 0; i < moons.length; i++) {
        moons.item(i).addEventListener("click", () => {
            currentElement = moons.item(i)[0];
            while (document.body.firstChild) {
                // on retire tous les éléments de la page
                document.body.removeChild(document.body.firstChild);
            }
            // on change le titre de la page -> nom de la planète
            document.title = currentElement;
            console.log(currentElement);
            displayMoonData(moons.item(i)[1]);
        });
    }
}

function displayElementData(id) {
    // on fait la requête API qui sert à récupérer les données sur l'élément cliqué
    fetch(`https://api.le-systeme-solaire.net/rest.php/bodies/${id}`)
        // on met le résultat sous le format json supporté par JavaScript pour pouvoir manipuler la data venant de l'API
        .then((res) => res.json())
        // on utilise les données récupérées pour les afficher de la manière qu'on veut
        .then((data) => {
            // on ajoute le bouton de retour à la navigation au DOM

            let btn = createNode("div", "link_go_back", "", "");
            let link = createNode(
                "a",
                "go_back",
                "Retour au menu Planètes",
                "#"
            );
            btn.appendChild(link);
            document.body.appendChild(btn);
            // créer une liste des propriétés (<ul> -> <li> / <ol> -> <li>)
            for (var key in data) {
                // on change le titre de la page -> nom de la planète
                document.title = data.name;
                // on vérifie que la propriété est bien celle de l'objet json et ne provient pas d'un héritage
                // et que la valeur de la propriété n'est ni null ni vide
                if (
                    data.hasOwnProperty(key) &&
                    data[key] != null &&
                    data[key] != ""
                ) {
                    // on récupère le nom de chaque lune pour en faire un lien cliquable
                    if (key == "moons") {
                        let moonKey = document.createElement("p");
                        moonKey.textContent = `${key} : `;
                        document.body.appendChild(moonKey);
                        let moonsList = document.createElement("ul");
                        let moonValue = data[key].map(function (obj) {
                            return [obj.moon, obj.rel];
                        });
                        for (var val in moonValue) {
                            let moon = document.createElement("li");
                            moon.textContent = moonValue[val][0];
                            moon.className = "moon";
                            moon.id = moonValue[val][1];
                            moonsList.appendChild(moon);
                        }
                        document.body.appendChild(moonsList);
                    } else {
                        let p = document.createElement("p");
                        p.textContent = `${key} : ${data[key]}`;
                        document.body.appendChild(p);
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

function displayMoonData(rel) {
    // on fait la requête API qui sert à récupérer les données sur la lune cliqué
    fetch(rel)
        // on met le résultat sous le format json supporté par JavaScript pour pouvoir manipuler la data venant de l'API
        .then((res) => res.json())
        // on utilise les données récupérées pour les afficher de la manière qu'on veut
        .then((data) => {
            // vérif (à supp)
            console.log(data);
        });
}

function createNode(type, nameClass, txt, link) {
    let element = document.createElement(type);
    element.className = nameClass;
    element.textContent = txt;
    if (type === "a") {
        element.href = link;
    }
    return element;
}

displayMoonData("https://api.le-systeme-solaire.net/rest.php/bodies/lune");


// carousel

function moveCarousel() {

    let count = 0;
    let position = 0;
    let carousel = document.querySelector(".carousel-elements");

    document.querySelector(".arrow-right").addEventListener("click", () => {
        if (position == -(6 * (67.4 * 0.33))) {
            position = -(6 * (67.4 * 0.33));
        } else {
            position -= (67.4 * 0.33);
        }
        carousel.style.transform = 'translateX(' + position + 'vw)';
        carousel.style.transition = '0.5s ease';
        count += 1;
    })

    document.querySelector(".arrow-left").addEventListener("click", () => {
        if (position == 0) {
            position = 0;
        } else {
            position += (67.4 * 0.33);
        }
        carousel.style.transform = 'translateX(' + position + 'vw)';
        carousel.style.transition = '0.5s ease';
        count -= 1;
    })


}

moveCarousel();