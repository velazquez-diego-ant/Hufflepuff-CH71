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
    <div class="card-product">
      <h3>${escapeHTML(product.name)}</h3>
      <p><strong>Precio:</strong> $${product.price.toFixed(2)}</p>
      <p><strong>Cantidad:</strong> ${product.quantity}</p>
    </div>
  `;
}

//*esperamos a que cargue todo el html antes de buscar sus elementos
window.addEventListener("DOMContentLoaded", () => {
  //*buscamos el formulario nuevo o el formulario antiguo de albumes
  const productForm =
    document.getElementById("productForm") ||
    document.getElementById("albumForm");

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

  //*escuchamos el envio del formulario para añadir productos
  productForm?.addEventListener("submit", (event) => {
    //*evitamos que la pagina se recargue al enviar el formulario
    event.preventDefault();

    //*obtenemos los valores escritos en el formulario
    const formData = new FormData(productForm);

    //*creamos el objeto basico que representa un producto
    const product = {
      id: Date.now(),
      name: formData.get("name") || formData.get("productName"),
      price: Number(formData.get("price")) || 0,
      quantity: Number(formData.get("quantity")) || 1,
    };

    //*si el producto no tiene nombre, no lo añadimos
    if (!product.name) return;

    //*añadimos el producto al array del carrito
    cart.push(product);

    //*guardamos el carrito actualizado para mantener la persistencia
    setLocalStorage(CART_STORAGE_KEY, cart);

    //*actualizamos la vista y limpiamos el formulario
    renderCart();
    productForm.reset();
  });

  //*escuchamos el click del boton de compra
  submitButton?.addEventListener("click", (event) => {
    //*evitamos el comportamiento por defecto del boton
    event.preventDefault();

    //*si no hay productos, no se puede realizar la compra
    if (!cart.length) return;

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
