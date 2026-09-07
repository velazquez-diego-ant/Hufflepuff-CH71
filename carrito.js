// Obtiene el carrito guardado en localStorage
const getCart = () => {
  const savedCart = localStorage.getItem("shoppingCart");
  return savedCart ? JSON.parse(savedCart) : [];
};

// Guarda el carrito actualizado en localStorage
const saveCart = (cart) => {
  localStorage.setItem("shoppingCart", JSON.stringify(cart));
};

// Crea el HTML de cada producto que aparece en el carrito
const createProductCardHTML = (product) => `
  <div class="cart-item" data-id="${product.id}">
    <div class="cart-item-img"></div>
    <div class="cart-item-info">
      <h3>${product.name}</h3>
      <p class="muted">Producto de la tienda</p>
      <div class="qty-control">
        <button type="button" class="decrease-quantity" aria-label="Restar">−</button>
        <span>${product.quantity}</span>
        <button type="button" class="increase-quantity" aria-label="Sumar">+</button>
      </div>
    </div>
    <div class="cart-item-price">
      $${(Number(product.price) * Number(product.quantity)).toFixed(2)}
    </div>
    <button type="button" class="cart-item-remove" aria-label="Eliminar">×</button>
  </div>
`;

// Espera a que el HTML este cargado antes de buscar sus elementos
window.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("productList");
  const cartList = document.getElementById("cartList");
  const cartEmpty = document.getElementById("cart-empty");
  const cartFull = document.getElementById("cart-full");
  const subtotalElement = document.getElementById("cart-subtotal");
  const totalElement = document.getElementById("cart-total");
  const checkoutButton = document.getElementById("checkoutButton");
  const purchaseMessage = document.getElementById("purchaseMessage");
  let cart = getCart();

  // Muestra el estado actual del carrito y calcula sus totales
  const renderCart = () => {
    if (!cartList) return;

    if (cart.length === 0) {
      cartEmpty?.classList.remove("d-none");
      cartFull?.classList.add("d-none");
      if (subtotalElement) subtotalElement.textContent = "$0.00";
      if (totalElement) totalElement.textContent = "$0.00";
      return;
    }

    cartEmpty?.classList.add("d-none");
    cartFull?.classList.remove("d-none");
    cartList.innerHTML = cart.map(createProductCardHTML).join("");

    const subtotal = cart.reduce(
      (total, product) =>
        total + Number(product.price) * Number(product.quantity),
      0,
    );

    if (subtotalElement)
      subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${subtotal.toFixed(2)}`;
  };

  // Pinta el carrito al abrir carrito.html
  renderCart();

  // Lee los datos de la card pulsada y agrega el producto
  productList?.addEventListener("click", (event) => {
    const addButton = event.target.closest(".add-to-cart");
    if (!addButton) return;

    const productCard = addButton.closest(".product-card");
    if (!productCard) return;

    const product = {
      id: productCard.dataset.id,
      name: productCard.dataset.name,
      price: Number(productCard.dataset.price) || 0,
      quantity: 1,
    };

    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push(product);
    }

    saveCart(cart);
    console.log("Producto agregado:", product);
  });

  // Controla cantidades y elimina productos del carrito
  cartList?.addEventListener("click", (event) => {
    const cartItem = event.target.closest(".cart-item");
    if (!cartItem) return;

    const product = cart.find((item) => item.id === cartItem.dataset.id);
    if (!product) return;

    if (event.target.closest(".increase-quantity")) {
      product.quantity += 1;
    }

    if (event.target.closest(".decrease-quantity")) {
      product.quantity -= 1;
      if (product.quantity <= 0) {
        cart = cart.filter((item) => item.id !== cartItem.dataset.id);
      }
    }

    if (event.target.closest(".cart-item-remove")) {
      cart = cart.filter((item) => item.id !== cartItem.dataset.id);
    }

    if (cart.length > 0) {
      saveCart(cart);
    } else {
      localStorage.removeItem("shoppingCart");
    }

    renderCart();
  });

  // Finaliza la compra y muestra una confirmacion breve
  checkoutButton?.addEventListener("click", (event) => {
    event.preventDefault();

    if (cart.length === 0) {
      console.log("no products in carrito");
      return;
    }

    console.log("Compra realizada:", cart);
    cart = [];
    localStorage.removeItem("shoppingCart");
    renderCart();

    cartEmpty?.classList.add("d-none");
    cartFull?.classList.remove("d-none");

    if (purchaseMessage) {
      purchaseMessage.innerHTML = `
        <span class="purchase-check" aria-hidden="true">&#10003;</span>
        <span>Compra realizada</span>
      `;
      purchaseMessage.classList.add("purchase-success");
    }

    // Da tiempo para ver la confirmacion antes de recargar la pagina
    setTimeout(() => window.location.reload(), 1500);
  });
});
