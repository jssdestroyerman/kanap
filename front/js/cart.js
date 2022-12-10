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


const emailRegex = /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/
const letterRegex = /([A-Z]+[A-Z ])\w+/gi
const inputs = document.querySelectorAll(".cart__order__form__question input")
const inputsError = document.querySelectorAll(".cart__order__form__question p")
const order = document.querySelector(".cart__order__form")
const firstName = document.getElementById("firstName")
const lastName = document.getElementById("lastName")
const address = document.getElementById("address")
const city = document.getElementById("city")
const email = document.getElementById("email")

function checkInput() {
    inputs.forEach((input) => {
        switch (input.id) {
            case "firstName":
            case "lastName":
            case "city":
                if (input.value.length < 3 || input.value.length > 20) {
                    errorDisplay(input.id, "Le champs doit contenir entre 3 et 20 caractères")
                } else if (!input.value.match(letterRegex)){
                    errorDisplay(input.id, "Le champs doit contenir que des lettres")
                } else {
                    errorDisplay(input.id, "", true)
                }
                break
            case "address":
                if (input.value.length < 3 || input.value.length > 50) {
                    errorDisplay(input.id, "Le champs doit contenir entre 3 et 50 caractères")
                } else {
                    errorDisplay(input.id, "", true)
                }
                break
            case "email":
                if (!input.value.match(emailRegex)) {
                    errorDisplay(input.id, "Veuillez entrer un email valide")
                } else {
                    errorDisplay(input.id, "", true)
                }
                break
            default:
                null
        }
    })
}

function errorDisplay (id, message, valid) {
    const error = document.getElementById(`${id}ErrorMsg`)

    if (valid) {
        error.textContent = ""
    } else {
        error.textContent = message
    }
}

order.addEventListener("submit", (e) => {
    e.preventDefault()
    checkInput()
    let error = 0

    inputsError.forEach((errorDisplayed) => {
        if (!errorDisplayed.innerText == "") {
            error++
            console.log(error);
        }
    })

    if (error === 0) {
        const sendForm = {
            contact: {
                firstName: firstName.value.trim(),
                lastName: lastName.value.trim(),
                address: address.value.trim(),
                city: city.value.trim(),
                email: email.value.trim(),
            },
            products: productsId,
        }
        console.log(sendForm);

        // Rêquete post avec fetch API : envoi des données format JSON, l'api nous réponds en envoyant un numéro de commande
        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sendForm),
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
