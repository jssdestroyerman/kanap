const itemImg = document.querySelector(".item__img")
const title = document.getElementById("title")
const price = document.getElementById("price")
const description = document.getElementById("description")
const colors = document.getElementById("colors")
const addTocart = document.getElementById("addToCart")
const quantity = document.getElementById("quantity")

// Récupération de l'URL et de son id avec searchParams
const url = new URL(window.location.href)
const urlId = url.searchParams.get("id")
console.log(urlId); // 

let colorValue, quantityValue

// Via l'API fetch je récupère seulement le produit avec l'id correspondant à l'id présent dans l'url
async function productAPI() {
    await fetch(`http://localhost:3000/api/products/${urlId}`)
        .then((res) => res.json())
        .then((data) => productDisplay(data))
        .catch((err) => console.log(err))
}
productAPI()

function productDisplay(product) {
    console.log(product);
    
    // Afficher les éléments dans le DOM

    // Boucle for pour afficher seulement les couleurs disponibles sur cet article
    for (let i of product.colors) {
        colors.innerHTML += `<option value="${i}">${i}</option>`
    }

    itemImg.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`
    title.textContent = `${product.name}`
    price.textContent = `${product.price}`
    description.textContent = `${product.description}`
}

// Récupération de la valeur entrée sur les inputs
colors.addEventListener("input", (e) => {
    colorValue = e.target.value
})
quantity.addEventListener("input", (e) => {
    quantityValue = parseInt(e.target.value)
})

// Écoute du button ajouter au panier 
addTocart.addEventListener("click", () => {
    // Création d'un object pour stocker les valeurs entrée par l'utilisateur 
    let localCartObj = {
        id: urlId,
        color: colorValue,
        quantity: quantityValue,
    }


    let productInLocalStorage = JSON.parse(localStorage.getItem("products"))

    // Function > si l'object présent dans ProductInlocalStorage à le même id et la même couleur alors j'additionne la quantité, sinon je push un nouvel object.
    function storageProduct() {
        let foundProduct = productInLocalStorage.find(p => p.id == localCartObj.id && p.color == localCartObj.color)
        // Solution plus simple ?????????????????????
        // Vérification du nombre de produit ajouté au panier
        if (foundProduct && foundProduct.quantity + quantityValue > 100) {
            alert("Le nombre d'article maximum est de 100")
            foundProduct.quantity -= quantityValue
        }
        if (foundProduct) {
            foundProduct.quantity = localCartObj.quantity + foundProduct.quantity
        } else {
            productInLocalStorage.push(localCartObj)
        }
        alert("Produit(s) ajouté(s) au panier")
        localStorage.setItem("products", JSON.stringify(productInLocalStorage))
    }

    // Vérification si les champs sont vides, inférieur à 1 ou supérieur à 100
    if (colors.value === "" || quantity.value < 1 || quantity.value > 100) {
        alert("Veuillez choisir une couleur et un nombre d'article")
    }
    else if  (productInLocalStorage) {
        storageProduct()
    } else {
        productInLocalStorage = []
        storageProduct()
    }
    console.log(productInLocalStorage);
})

