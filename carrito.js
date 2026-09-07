// =====================================================
// LOCAL STORAGE
// =====================================================

// Guarda información en localStorage
const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Obtiene información de localStorage
const getItemStorage = (key) => {
  const data = localStorage.getItem(key);

  // Si no existe información, regresamos un array vacío
  if (!data) return [];

  try {
    const parsedData = JSON.parse(data);

    // Nos aseguramos de que sea un array
    return Array.isArray(parsedData) ? parsedData : [];
  } catch {
    return [];
  }
};

// Nombre de la variable utilizada en localStorage
const CART_STORAGE_KEY = "cart";

// =====================================================
// SEGURIDAD
// =====================================================

// Evita que los textos de los productos
// sean interpretados como HTML
function escapeHTML(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// =====================================================
// CREAR PRODUCTO DEL CARRITO
// =====================================================

function createProductCardHTML(product) {
  return `

    <div
      class="cart-item"
      data-id="${escapeHTML(product.id)}"
    >

      <div class="cart-item-img"></div>


      <div class="cart-item-info">

        <h3>
          ${escapeHTML(product.name)}
        </h3>

        <p class="muted">
          Producto de la tienda
        </p>


        <div class="qty-control">

          <button
            type="button"
            class="decrease-quantity"
            aria-label="Restar"
          >
            −
          </button>


          <span>
            ${product.quantity}
          </span>


          <button
            type="button"
            class="increase-quantity"
            aria-label="Sumar"
          >
            +
          </button>

        </div>

      </div>


      <div class="cart-item-price">

        $${(Number(product.price) * product.quantity).toFixed(2)}

      </div>


      <button
        type="button"
        class="cart-item-remove"
        aria-label="Eliminar"
      >
        ×
      </button>

    </div>

  `;
}

// =====================================================
// CUANDO CARGA LA PÁGINA
// =====================================================

window.addEventListener("DOMContentLoaded", () => {
  // ===================================================
  // ELEMENTOS DEL DOM
  // ===================================================

  const productList = document.getElementById("productList");

  const cartList = document.getElementById("cartList");

  const cartEmpty = document.getElementById("cart-empty");

  const cartFull = document.getElementById("cart-full");

  const subtotalElement = document.getElementById("cart-subtotal");

  const totalElement = document.getElementById("cart-total");

  const checkoutButton = document.getElementById("checkoutButton");

  const purchaseMessage = document.getElementById("purchaseMessage");

  // ===================================================
  // RECUPERAR CARRITO
  // ===================================================

  let cart = getItemStorage(CART_STORAGE_KEY);

  // ===================================================
  // MOSTRAR CARRITO
  // ===================================================

  const renderCart = () => {
    // Si estamos en test.html no hacemos nada
    // porque esa página no tiene cartList
    if (!cartList) return;

    // ===============================================
    // CARRITO VACÍO
    // ===============================================

    if (cart.length === 0) {
      cartEmpty?.classList.remove("d-none");

      cartFull?.classList.add("d-none");

      return;
    }

    // ===============================================
    // CARRITO CON PRODUCTOS
    // ===============================================

    cartEmpty?.classList.add("d-none");

    cartFull?.classList.remove("d-none");

    // Pintamos los productos
    cartList.innerHTML = cart.map(createProductCardHTML).join("");

    // ===============================================
    // CALCULAR SUBTOTAL
    // ===============================================

    const subtotal = cart.reduce((total, product) => {
      return total + Number(product.price) * Number(product.quantity);
    }, 0);

    // Mostramos subtotal
    if (subtotalElement) {
      subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    }

    // ===============================================
    // CALCULAR TOTAL
    // ===============================================

    if (totalElement) {
      totalElement.textContent = `$${subtotal.toFixed(2)}`;
    }
  };

  // ===================================================
  // MOSTRAR EL CARRITO AL ABRIR carrito.html
  // ===================================================

  renderCart();

  // ===================================================
  // AGREGAR PRODUCTOS DESDE test.html
  // ===================================================

  productList?.addEventListener("click", (event) => {
    // Buscamos el botón presionado
    const addButton = event.target.closest(".add-to-cart");

    if (!addButton) return;

    // Buscamos la tarjeta del producto
    const productCard = addButton.closest(".product-card");

    if (!productCard) return;

    // =============================================
    // OBTENER INFORMACIÓN DEL PRODUCTO
    // =============================================

    const product = {
      id: productCard.dataset.id,

      name: productCard.dataset.name,

      price: Number(productCard.dataset.price) || 0,

      quantity: 1,
    };

    // Si no tiene nombre no lo agregamos
    if (!product.name) return;

    // =============================================
    // BUSCAR SI EL PRODUCTO YA EXISTE
    // =============================================

    const existingProduct = cart.find((item) => item.id === product.id);

    // Si ya existe aumentamos su cantidad
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      // Si no existe lo agregamos
      cart.push(product);
    }

    // =============================================
    // GUARDAR CARRITO
    // =============================================

    setLocalStorage(CART_STORAGE_KEY, cart);

    console.log("Producto agregado:", product);
  });

  // ===================================================
  // CONTROLES DEL CARRITO
  // ===================================================

  cartList?.addEventListener("click", (event) => {
    // Buscamos el elemento .cart-item
    const cartItem = event.target.closest(".cart-item");

    if (!cartItem) return;

    // ID del producto
    const productId = cartItem.dataset.id;

    // Producto correspondiente
    const product = cart.find((item) => item.id === productId);

    if (!product) return;

    // =============================================
    // AUMENTAR CANTIDAD
    // =============================================

    if (event.target.closest(".increase-quantity")) {
      product.quantity += 1;
    }

    // =============================================
    // DISMINUIR CANTIDAD
    // =============================================

    if (event.target.closest(".decrease-quantity")) {
      product.quantity -= 1;

      // Si llega a cero,
      // eliminamos el producto
      if (product.quantity <= 0) {
        cart = cart.filter((item) => item.id !== productId);
      }
    }

    // =============================================
    // ELIMINAR PRODUCTO
    // =============================================

    if (event.target.closest(".cart-item-remove")) {
      cart = cart.filter((item) => item.id !== productId);
    }

    // =============================================
    // ACTUALIZAR LOCAL STORAGE
    // =============================================

    if (cart.length > 0) {
      setLocalStorage(CART_STORAGE_KEY, cart);
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }

    // =============================================
    // ACTUALIZAR PANTALLA
    // =============================================

    renderCart();
  });

  // ===================================================
  // FINALIZAR COMPRA
  // ===================================================

  checkoutButton?.addEventListener("click", (event) => {
    // Evitamos comportamiento por defecto
    event.preventDefault();

    // =============================================
    // VERIFICAR SI EL CARRITO ESTÁ VACÍO
    // =============================================

    if (cart.length === 0) {
      return;
    }

    // =============================================
    // MOSTRAR EN CONSOLA LA COMPRA
    // =============================================

    console.log("Compra realizada:", cart);

    // =============================================
    // VACIAR EL ARRAY
    // =============================================

    cart = [];

    // =============================================
    // BORRAR CARRITO DEL LOCAL STORAGE
    // =============================================

    localStorage.removeItem(CART_STORAGE_KEY);

    // =============================================
    // ACTUALIZAR LA VISTA
    // =============================================

    renderCart();

    // =============================================
    // MOSTRAR MENSAJE
    // =============================================

    if (purchaseMessage) {
      purchaseMessage.textContent = "Compra realizada con éxito.";
    }
  });
});
