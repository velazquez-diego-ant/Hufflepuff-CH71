//*ponemos todo en el locastorage
const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

//*obtiene los items y los mete en un array
const getItemStorage = (key) => {
  const data = localStorage.getItem(key);
  if (!data) return [];

  try {
    const parsedData = JSON.parse(data);
    return Array.isArray(parsedData) ? parsedData : [];
  } catch {
    return [];
  }
};

//*nombre que usaremos para guardar el carrito
const CART_STORAGE_KEY = "cart";

//*evita que los textos introducidos por el usuario rompan el html
function escapeHTML(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

//*crea la tarjeta html de cada producto del carrito
function createProductCardHTML(product) {
  return `
    <div class="card border-0 bg-light">
      <div class="card-body py-3">
        <h3 class="h6">${escapeHTML(product.name)}</h3>
        <p class="mb-1"><strong>Precio:</strong> $${Number(product.price).toFixed(2)}</p>
        <p class="mb-0"><strong>Cantidad:</strong> ${product.quantity}</p>
      </div>
    </div>
  `;
}

//*esperamos a que cargue todo el html antes de buscar sus elementos
window.addEventListener("DOMContentLoaded", () => {
  //*buscamos el contenedor que contiene las cards de productos
  const productList = document.getElementById("productList");

  //*buscamos el contenedor nuevo o el contenedor antiguo de albumes
  const cartListContainer =
    document.getElementById("cartList") || document.getElementById("albumList");

  //*buscamos el boton que finaliza la compra
  const submitButton = document.querySelector(".subtim");

  //*buscamos un elemento donde mostrar el mensaje de compra
  const purchaseMessage = document.getElementById("purchaseMessage");

  //*recuperamos el carrito guardado o creamos uno vacio
  let cart = getItemStorage(CART_STORAGE_KEY);

  //*pinta todos los productos guardados en el contenedor del carrito
  const renderCart = () => {
    //*si no existe el contenedor, no hacemos nada
    if (!cartListContainer) return;

    //*mostramos los productos o indicamos que el carrito esta vacio
    cartListContainer.innerHTML = cart.length
      ? cart.map(createProductCardHTML).join("")
      : '<p class="empty-cart">El carrito está vacío.</p>';
  };

  //*mostramos el contenido guardado al abrir o recargar la pagina
  renderCart();

  //*escuchamos los clicks de los botones dentro de las cards
  productList?.addEventListener("click", (event) => {
    //*buscamos el boton pulsado, aunque este dentro de otro elemento
    const addButton = event.target.closest(".add-to-cart");
    if (!addButton) return;

    //*obtenemos la card que contiene al boton pulsado
    const productCard = addButton.closest(".product-card");
    if (!productCard) return;

    //*leemos los datos del producto desde los atributos data-* de la card
    const product = {
      id: productCard.dataset.id,
      name: productCard.dataset.name,
      price: Number(productCard.dataset.price) || 0,
      quantity: 1,
    };

    //*si la card no tiene nombre, no añadimos el producto
    if (!product.name) return;

    //*añadimos el producto al array del carrito
    cart.push(product);

    //*mostramos en consola el producto que se acaba de añadir
    console.log("debug: product added to carrito", product);

    //*guardamos el carrito actualizado para mantener la persistencia
    setLocalStorage(CART_STORAGE_KEY, cart);

    //*actualizamos la vista del carrito
    renderCart();
  });

  //*escuchamos el click del boton de compra
  submitButton?.addEventListener("click", (event) => {
    //*evitamos el comportamiento por defecto del boton
    event.preventDefault();

    //*si no hay productos, no se puede realizar la compra
    if (!cart.length) {
      console.log("no products in carrito");
      return;
    }

    //*mostramos en consola los productos que se van a comprar
    console.log("debug: purchase completed", cart);

    //*vaciamos el array del carrito
    cart = [];

    //*eliminamos tambien el carrito guardado en localstorage
    localStorage.removeItem(CART_STORAGE_KEY);

    //*mostramos el carrito vacio en la pagina
    renderCart();

    //*si el mensaje ya existe, cambiamos su texto
    if (purchaseMessage) {
      purchaseMessage.textContent = "Compra realizada con éxito.";
    } else {
      //*si no existe, creamos el mensaje despues del boton
      submitButton.insertAdjacentHTML(
        "afterend",
        '<p id="purchaseMessage">Compra realizada con éxito.</p>',
      );
    }
  });
});
