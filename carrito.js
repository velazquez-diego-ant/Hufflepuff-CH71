
// Función para obtener el carrito del localStorage
const getCart = () => {
    const cart = localStorage.getItem('shoppingCart');
    return cart ? JSON.parse(cart) : [];
};

// Función para guardar el carrito en localStorage
const saveCart = (cart) => {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
};

// ==================== FUNCIONES PARA AGREGAR PRODUCTOS ====================

// Función para agregar productos al carrito (desde la página de productos)
const addToCart = (productData) => {
    let cart = getCart();
    
    const existingProduct = cart.find(item => item.id === productData.id);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        productData.quantity = 1;
        cart.push(productData);
    }
    
    saveCart(cart);
    alert(`¡${productData.name} agregado al carrito!`);
};

// Manejar el clic en el botón "Añadir al carrito"
const handleAddToCart = (event) => {
    const button = event.target;
    const productCard = button.closest('.product-card');
    
    if (productCard) {
        const product = {
            id: productCard.dataset.id,
            name: productCard.dataset.name,
            price: parseFloat(productCard.dataset.price)
        };
        
        addToCart(product);
    }
};

// ==================== FUNCIONES PARA RENDERIZAR EL CARRITO ====================

// Renderizar los productos del carrito
const renderCart = () => {
    const cart = getCart();
    const cartList = document.getElementById('cartList');
    const cartEmpty = document.getElementById('cart-empty');
    const cartFull = document.getElementById('cart-full');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    const purchaseMessage = document.getElementById('purchaseMessage');
    
    // Limpiar mensaje anterior
    if (purchaseMessage) {
        purchaseMessage.textContent = '';
        purchaseMessage.className = 'text-success fw-semibold mt-3 mb-0';
    }
    
    // Condicional: Verificar si el carrito está vacío
    if (cart.length === 0) {
        // Mostrar carrito vacío
        if (cartEmpty) cartEmpty.classList.remove('d-none');
        if (cartFull) cartFull.classList.add('d-none');
        return;
    }
    
    // Mostrar carrito con productos
    if (cartEmpty) cartEmpty.classList.add('d-none');
    if (cartFull) cartFull.classList.remove('d-none');
    
    // Bucle: Calcular el total usando reduce
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal; // En este caso no hay envío adicional
    
    // Actualizar resumen
    if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
    
    // Generar HTML para los productos usando la estructura de tus estilos
    let html = '';
    
    // Bucle: Recorrer todos los productos del carrito
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        html += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-info" style="flex: 1;">
                    <h3>${item.name}</h3>
                    <p class="muted">Precio unitario: $${item.price.toFixed(2)}</p>
                </div>
                <div class="qty-control">
                    <button class="quantity-btn" data-action="decrease" data-id="${item.id}">−</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" data-action="increase" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <button class="cart-item-remove remove-btn" data-id="${item.id}">✕</button>
            </div>
        `;
    }
    
    if (cartList) cartList.innerHTML = html;
    
    // Agregar event listeners a los botones de cantidad y eliminar
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', handleQuantityChange);
    });
    
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', handleRemoveItem);
    });
};

// ==================== FUNCIONES PARA MANIPULAR EL CARRITO ====================

// Manejar cambios de cantidad
const handleQuantityChange = (event) => {
    const button = event.target;
    const action = button.dataset.action;
    const productId = button.dataset.id;
    
    let cart = getCart();
    const product = cart.find(item => item.id === productId);
    
    if (product) {
        if (action === 'increase') {
            product.quantity += 1;
        } else if (action === 'decrease') {
            product.quantity -= 1;
            if (product.quantity === 0) {
                cart = cart.filter(item => item.id !== productId);
            }
        }
        
        saveCart(cart);
        renderCart();
    }
};

// Manejar eliminación de productos
const handleRemoveItem = (event) => {
    const button = event.target;
    const productId = button.dataset.id;
    
    if (confirm('¿Deseas eliminar este producto del carrito?')) {
        let cart = getCart();
        cart = cart.filter(item => item.id !== productId);
        saveCart(cart);
        renderCart();
    }
};

// ==================== FUNCIÓN PARA FINALIZAR COMPRA ====================

// Finalizar compra
const handleCheckout = () => {
    const cart = getCart();
    const purchaseMessage = document.getElementById('purchaseMessage');
    
    if (cart.length === 0) {
        if (purchaseMessage) {
            purchaseMessage.textContent = 'El carrito está vacío. Agrega productos primero.';
            purchaseMessage.className = 'text-danger fw-semibold mt-3 mb-0';
        }
        return;
    }
    
    if (confirm('¿Deseas finalizar la compra?')) {
        localStorage.removeItem('shoppingCart');
        renderCart();
        
        if (purchaseMessage) {
            purchaseMessage.textContent = '¡Compra finalizada con éxito! Gracias por tu pedido.';
            purchaseMessage.className = 'text-success fw-semibold mt-3 mb-0';
        }
    }
};

// ==================== INICIALIZACIÓN ====================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Si existe productList, estamos en la página de productos
    const productList = document.getElementById('productList');
    if (productList) {
        const addButtons = document.querySelectorAll('.add-to-cart');
        addButtons.forEach(button => {
            button.addEventListener('click', handleAddToCart);
        });
    }
    
    // Si existe cartList, estamos en la página del carrito
    const cartList = document.getElementById('cartList');
    if (cartList) {
        renderCart();
        
        // Agregar evento al botón de finalizar compra
        const checkoutButton = document.getElementById('checkoutButton');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', handleCheckout);
        }
    }
});