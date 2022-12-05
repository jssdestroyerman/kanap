// Récupération du numéro de commande dans l'url
const url = new URL(location.href)
const urlOrderId = url.searchParams.get("orderId")
console.log(urlOrderId);
// Injection sur le DOM du numéro de commande
const orderId = document.getElementById("orderId")
orderId.innerText = urlOrderId