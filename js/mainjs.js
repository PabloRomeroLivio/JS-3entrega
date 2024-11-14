// productos al carrito con LS
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// carrito localstorage
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// agregar carrito
function agregarProducto(nombre, precio) {
  const productoEnCarrito = carrito.find(item => item.nombre === nombre);
  if (productoEnCarrito) {
    productoEnCarrito.cantidad++;
  } else {
    carrito.push({ nombre, cantidad: 1, precio });
  }
  guardarCarrito();
  actualizarCarrito();
  alert(`${nombre} agregado al carrito.`);
}

// quitar producto
function quitarProducto(nombre) {
  const productoEnCarrito = carrito.find(item => item.nombre === nombre);
  if (productoEnCarrito && productoEnCarrito.cantidad > 1) {
    productoEnCarrito.cantidad--;
  } else {
    carrito = carrito.filter(item => item.nombre !== nombre);
  }
  guardarCarrito();
  actualizarCarrito();
  alert(`${nombre} eliminado del carrito.`);
}

// actualizar el carrito
function actualizarCarrito() {
  const total = carrito.reduce((sum, item) => sum + item.cantidad * item.precio, 0);
  document.getElementById('totalCarrito').innerText = `Total: €${total.toFixed(2)}`;
}

// botones suma y resta
document.addEventListener("DOMContentLoaded", () => {
  const productos = [
    { nombre: "Cookie clásica", precio: 1.50 },
    { nombre: "Cookie brownie", precio: 1.50 },
    { nombre: "Cookie limon", precio: 1.50 },
    { nombre: "Cookie dulce de leche", precio: 2.00 },
    { nombre: "Cookie avellanas", precio: 1.50 },
    { nombre: "Cookie de Chocolate Blanco", precio: 2.00 }
  ];
  
  productos.forEach((producto, index) => {
    const container = document.querySelectorAll('.col-md-4')[index];

    // botón de suma
    const btnSumar = document.createElement("button");
    btnSumar.innerText = "+";
    btnSumar.classList.add("btn", "btn-success", "mx-2");
    btnSumar.onclick = () => agregarProducto(producto.nombre, producto.precio);

    // botón de resta
    const btnRestar = document.createElement("button");
    btnRestar.innerText = "-";
    btnRestar.classList.add("btn", "btn-danger", "mx-2");
    btnRestar.onclick = () => quitarProducto(producto.nombre);

    container.appendChild(btnSumar);
    container.appendChild(btnRestar);
  });

  // botón para finalizar el carrito
  const finalizarCompra = document.createElement("button");
  finalizarCompra.innerText = "Finalizar compra";
  finalizarCompra.classList.add("btn", "btn-primary", "mt-4");
  finalizarCompra.onclick = () => {
    if (carrito.length === 0) {
      alert("El carrito está vacío.");
    } else {
      const listaProductos = carrito.map(item => 
        `${item.nombre} x${item.cantidad} - €${(item.cantidad * item.precio).toFixed(2)}`).join("\n");
      const total = carrito.reduce((sum, item) => sum + item.cantidad * item.precio, 0);
      alert(`Resumen de tu compra:\n${listaProductos}\n\nTotal a pagar: €${total.toFixed(2)}`);
      alert("Compra finalizada. ¡Gracias por su compra!");
      carrito = [];
      guardarCarrito();
      actualizarCarrito();
    }
  };

  //total del carrito
  const totalCarrito = document.createElement("div");
  totalCarrito.id = "totalCarrito";
  totalCarrito.classList.add("my-4");
  totalCarrito.innerText = "Total: €0.00";

  // botón y total del carrito al final de los productos
  document.getElementById("productossect").appendChild(totalCarrito);
  document.getElementById("productossect").appendChild(finalizarCompra);

  // Actualizar carrito al cargar la página
  actualizarCarrito();
});