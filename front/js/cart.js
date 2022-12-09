const cartItems  = document.getElementById("cart__items")
const cartTotalQuantity = document.getElementById("totalQuantity")
const cartTotalprice = document.getElementById("totalPrice")

const products = JSON.parse(localStorage.getItem("products"))
console.log(products); // Log du localStorage

const arrProduct = []
const calcTotalQuantity = []
const calcTotalPrice = []
const productsId = []

// Boucle des produits du Local Storage, pour chaque produit je lance la function productAPI
for (let i of products){
    productsId.push(i.id)
    productAPI(i.id, i.color, i.quantity)
}

// Récuperer les produits via l'API fetch, récupération du bon produit avec le paramètre id

async function productAPI(id, color, quantity) {
    await fetch(`http://localhost:3000/api/products/${id}`)
        .then((res) => res.json())
        .then((data) => productDisplay(data, color, quantity)) 
        .catch((err) => console.log(err))
}

/**
 *  Afficher les produits sur le DOM
 * @param { object } product
 * @param { string } color
 * @param { number } quantity
 */
function productDisplay(product, color, quantity) {
    // console.log(product);
    // += Pour afficher le produit de chaque tour de boucle
    cartItems.innerHTML += 
    `<article class="cart__item" data-id="${product._id}" data-color="${color}">
        <div class="cart__item__img">
            <img src="${product.imageUrl}" alt="${product.altTxt}">
        </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${color}</p>
                    <p>${product.price}</p>
              </div>
              <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : ${quantity}</p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                </div>
            </div>
        </div>
    </article>`

    // Appel des function pour supprimer et modifier la quantité des produits
    deleteProduct()
    modifyQuantity(quantity)

    //-------------------------------------------------------------

    // Calcul du prix total et la Quantité totale
    // Prix total
    const totalPrice = product.price * quantity

    // Création d'un array calcTotalPrice pour stocker les prix
    calcTotalPrice.push(totalPrice)
    let finalPrice = calcTotalPrice.reduce((a,b) => a + b)

    // Création d'un array calcTotalQuantity pour stocker la quantité
    calcTotalQuantity.push(quantity)
    let finalQuantity = calcTotalQuantity.reduce((a,b) => a + b)

    // Injection sur le DOM
    cartTotalQuantity.innerText = finalQuantity
    cartTotalprice.innerText = finalPrice
}   


// Function pour supprimer un produit
function deleteProduct() {
    const deleteButton = document.querySelectorAll(".cart__item__content__settings__delete > .deleteItem")

    for (let i of deleteButton) {
        const closest = i.closest("article")
        // console.log(closest);
        i.addEventListener("click", () => {
            // Lors du click si l'id du produit cliqué et le même que celui présent dans la variable products
            let foundProduct = products.find(p => p.id == closest.dataset.id && p.color == closest.dataset.color)
            // Récupération de l'index de foundProduct
            let index = products.indexOf(foundProduct)
            console.log(index);
            console.log(foundProduct);

            // Dans products je retire foundProduct appelé par son index
            products.splice(index, 1)
            console.log(products);

            // Actualiser le localStorage
            localStorage.setItem("products", JSON.stringify(products))
            // Raffraichissement de la page pour actualiser le localProduct
            location.reload()
        })
    }
}

// Function pour modifier la quantité
function modifyQuantity(quantity) {
    const itemQuantity = document.querySelectorAll(".itemQuantity")
    // console.log(itemQuantity);

    for (let i of itemQuantity) {
        const closest = i.closest("article")

        i.addEventListener("change", (e) => {
            // Si la quantité est de 0 ou plus de 100 alors j'affiche un message d'erreur et je remets la valeur précedente
            if (e.target.value == 0 || e.target.value > 100) {
                alert("Veuillez choisir un nombre d'article entre 1 et 100")
                e.target.value = quantity
            }
            // Lors du click si l'id du produit cliqué et le même que celui présent dans la variable products
            let foundProduct = products.find(p => p.id == closest.dataset.id && p.color == closest.dataset.color)

            // Récupération de l'index de foundProduct
            let index = products.indexOf(foundProduct)
            console.log(index);

            // Modifier la quantité du produit correspondant à l'index de foundProduct
            products[index].quantity = parseInt(e.target.value)

            // Actualiser le localStorage
            localStorage.setItem("products", JSON.stringify(products))
            location.reload()
        })
    }
}


const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
const letterRegex = /^[a-zA-z- ]*$/;
const inputs = document.querySelectorAll(".cart__order__form__question input")

let firstname, lastname, address, city, email

// Function de vérification des inputs, dans chaque input, on récupère son id et je lance la function correspondante en mettant comme paramètre son id et sa value
function inputChecker() {
    inputs.forEach((input) => {
        switch(input.id) {
            case "firstName":
                firstnameChecker(input.id, input.value.trim())
                break
            case "lastName":
                lastnameChecker(input.id, input.value.trim())
                break
            case "address":
                addressChecker(input.id, input.value.trim())
                break
            case "city":
                cityChecker(input.id, input.value.trim())
                break
            case "email":
                emailChecker(input.id, input.value.trim())
                break
            default: 
                null
        }
    })
}

/** 
 * Form function
 * @param { string } id
 * @param { string } message
 * @param { boolean } valid
 */ 

// Function pour le message d'erreur
function errorDisplay(id, message, valid) {
    const errorMessage = document.getElementById(`${id}ErrorMsg`)
    if (valid) {
        errorMessage.textContent = ""
    } else {
        errorMessage.textContent = message
    }
}
// Checking input for the firstname
function firstnameChecker(id, value) {
    if(value.length < 3) {
        errorDisplay(id, "Le champs doit contenir au minimum 3 caractères")
    } else if (value.length > 20) {
        errorDisplay(id, `Le champs doit contenir au maximum 20 caractères`)
    } else if (!value.match(letterRegex)) {
        errorDisplay(id, `Le champs doit contenir que des lettres`)
    } else {
        errorDisplay(id, "", true)
        firstname = value
    }
}
// Checking input for the lastname
function lastnameChecker(id, value) {
    if(value.length < 3) {
        errorDisplay(id, "Le champs doit contenir au minimum 3 caractères")
    } else if (value.length > 20) {
        errorDisplay(id, `Le champs doit contenir au maximum 20 caractères`)
    } else if (!value.match(letterRegex)) {
        errorDisplay(id, `Le champs doit contenir que des lettres`)
    } else {
        errorDisplay(id, "", true)
        lastname = value
    }
}
// Checking input for the address
function addressChecker(id, value) {
    if(value.length < 3) {
        errorDisplay(id, "Le champs doit contenir au minimum 3 caractères")
    } else if (value.length > 50) {
        errorDisplay(id, `Le champs doit contenir au maximum 50 caractères`)
    } else {
        errorDisplay(id, "", true)
        address = value
    }
}
// Checking input for the city
function cityChecker(id, value) {
    if(value.length < 3) {
        errorDisplay(id, "Le champs doit contenir au minimum 3 caractères")
    } else if (value.length > 20) {
        errorDisplay(id, `Le champs doit contenir au maximum 20 caractères`)
    } else if (!value.match(letterRegex)) {
        errorDisplay(id, `Le champs doit contenir que des lettres`)
    } else {
        errorDisplay(id, "", true)
        city = value
    }
}
// Checking input for the email
function emailChecker(id, value) {
    if (!value.match(emailRegex)) {
        errorDisplay(id, "Veuillez entrez un email valide")
    } else {
        errorDisplay(id, "", true)
        email = value
    }
}


const order = document.querySelector(".cart__order__form")

order.addEventListener("submit", (e) => {
    e.preventDefault()
    // Fonction de vérification des inputs
    inputChecker()
    // Création de l'object de la requête 
    const body = {
        contact: {
            firstName: firstname,
            lastName: lastname,
            address: address,
            city: city,
            email: email,
        },
        products: productsId,
    }

    console.log(body)
    // Si les variables sont définies
    if (firstname && lastname && address && city && email) {
        // Vider tout les inputs
        inputs.forEach((input) => {
            input.value = ""
        })
        // Rêquete post avec fetch API : envoi des données format JSON, l'api nous réponds en envoyant un numéro de commande
        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
        }) 
        .then((res) => res.json())
        .then((data) => {
            const orderId = data.orderId
            location.href = `./confirmation.html?orderId=${orderId}`
        })
        .catch((err) => console.log(err))
        // Vider le localStorage si il n'y a pas d'erreur
        .then(localStorage.removeItem("products"))
    }
})
