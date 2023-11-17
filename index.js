const elements = document.querySelectorAll(".element");
// variable qui stock l'id de l'élément sélectionner (terre, soleil...)
let currentElement = "";

// On ajoute un événement sur chacun des boutons des éléments du système solaire qui se déclenche quand on clique dessus
elements.forEach((element) => {
    element.addEventListener("click", () => {
        // currentElement prend la valeur de l'id de l'élément sur lequel on a cliqué
        currentElement = element.id;
        while (document.body.firstChild) {
            // on retire tous les éléments de la page
            document.body.removeChild(document.body.firstChild);
        }
        // on change le titre de la page -> nom de la planète
        document.title = currentElement;
        // on appelle la fonction qui sert à afficher la page d'info sur l'élément cliqué
        displayElementData(currentElement);
    });
});

function displayElementData(id) {
    // on fait la requête API qui sert à récupérer les données sur l'élément cliqué
    fetch(`https://api.le-systeme-solaire.net/rest.php/bodies/${id}`)
        // on met le résultat sous le format json supporté par JavaScript pour pouvoir manipuler la data venant de l'API
        .then((res) => res.json())
        // on utilise les données récupérées pour les afficher de la manière qu'on veut
        .then((data) => {
            // vérif (à supp)
            console.log(data);
            // créer une liste des propriétés (<ul> -> <li> / <ol> -> <li>)
            for (var key in data) {
                // on vérifie que la propriété est bien celle de l'objet json et ne provient pas d'un héritage
                // et que la valeur de la propriété n'est ni null ni vide
                if (
                    data.hasOwnProperty(key) &&
                    data[key] != null &&
                    data[key] != ""
                ) {
                    let p = document.createElement("p");
                    p.textContent = `${key} : ${data[key]}`;
                    document.body.appendChild(p);
                }
            }
        })
        // si une erreur survient lors de la création de la nouvelle page d'affichage (après le dernier "then"),
        // l'erreur s'affiche dans la console.
        .catch((err) => {
            console.log(err);
        });
}
