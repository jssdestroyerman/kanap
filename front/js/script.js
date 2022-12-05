const items = document.getElementById("items")

// Récuperer les produits via l'API fetch
async function productAPI() {
    await fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((data) => productDisplay(data))
}
productAPI()

// Afficher les produits sur le DOM
function productDisplay(products) {
    for (let product of products) {
        console.log(product);
        items.innerHTML += `
        <a href="./product.html?id=${product._id}">
        <article>
            <img src="${product.imageUrl}" alt="${product.altTxt}">
            <h3 class="productName">${product.name}</h3>
            <p class="productDescription">${product.description}</p>
        </article>
        </a>
        `
    }
}

