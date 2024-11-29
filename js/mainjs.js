// Importar Luxon
const DateTime = luxon.DateTime;

// Array para almacenar los productos del carrito
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Ruta al archivo JSON
const urlJSON = "./data/productos.json";

// Función para guardar el carrito en local
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Función para calcular el total del carrito
function calcularTotal() {
  return carrito.reduce((sum, item) => sum + item.cantidad * item.precio, 0).toFixed(2);
}

// Función para actualizar la vista del carrito
function actualizarCarrito() {
  const total = calcularTotal();
  const totalCarrito = document.getElementById('totalCarrito');
  if (totalCarrito) {
    totalCarrito.innerText = `Total: €${total}`;
  }
}

// Función para agregar un producto al carrito
function agregarProducto(nombre, precio) {
  const productoEnCarrito = carrito.find(item => item.nombre === nombre);
  if (productoEnCarrito) {
    productoEnCarrito.cantidad++;
  } else {
    carrito.push({ nombre, cantidad: 1, precio });
  }
  guardarCarrito();
  actualizarCarrito();

  Swal.fire({
    icon: 'success',
    title: 'Producto agregado',
    text: `${nombre} se ha añadido al carrito.`,
    timer: 1500,
    showConfirmButton: true, 
    customClass: {
      popup: 'swal2-popup',        
      title: 'swal2-title',         
      htmlContainer: 'swal2-html-container', 
      confirmButton: 'swal2-confirm' 
    },
  });
}

// Función para quitar un producto del carrito
function quitarProducto(nombre) {
  const productoEnCarrito = carrito.find(item => item.nombre === nombre);
  if (productoEnCarrito && productoEnCarrito.cantidad > 1) {
    productoEnCarrito.cantidad--;
  } else {
    carrito = carrito.filter(item => item.nombre !== nombre);
  }
  guardarCarrito();
  actualizarCarrito();

  Swal.fire({
    icon: 'info',
    title: 'Producto eliminado',
    text: `${nombre} se ha quitado del carrito.`,
    timer: 1500,
    showConfirmButton: false
  });
}

// Función para finalizar la compra
function finalizarCompra() {
  if (carrito.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Carrito vacío',
      text: 'No hay productos en el carrito para finalizar la compra.',
    });
    return;
  }

  const resumenCompra = carrito
    .map(item => `${item.nombre} x${item.cantidad} - €${(item.cantidad * item.precio).toFixed(2)}`)
    .join("\n");
  const total = calcularTotal();

  Swal.fire({
    icon: 'success',
    title: 'Compra finalizada',
    text: `Resumen de tu compra:\n${resumenCompra}\nTotal: €${total}`,
  });

  carrito = [];
  guardarCarrito();
  actualizarCarrito();
}

// Función para crear elementos (reutilizable)
function crearElemento(tipo, clase, contenido, evento = null) {
  const elemento = document.createElement(tipo);
  if (clase) elemento.classList.add(...clase.split(' '));
  if (contenido) elemento.innerHTML = contenido;
  if (evento) elemento.addEventListener('click', evento);
  return elemento;
}

// Función para generar la interfaz de productos
function generarInterfazProductos(productos) {
  const contenedorProductos = document.getElementById('productossect');

  // Crear contenedor para la lista de productos seleccionados
  const listaCarrito = crearElemento('ul', 'list-group mb-4', '');
  listaCarrito.id = 'listaCarrito';

  productos.forEach(producto => {
    const divProducto = document.querySelector(`.col-md-4[data-producto-id="${producto.id}"]`);

    if (divProducto) {
      const btnSumar = crearElemento('button', 'btn btn-success mx-2 product-button', 'Agregar', () => {
        agregarProducto(producto.nombre, producto.precio);
        actualizarListaCarrito();
      });
      const btnRestar = crearElemento('button', 'btn btn-danger mx-2 product-button', 'Quitar', () => {
        quitarProducto(producto.nombre);
        actualizarListaCarrito();
      });

      // Añadir los botones dentro del div col-md-4
      divProducto.appendChild(btnSumar);
      divProducto.appendChild(btnRestar);
    }
  });

  // Agregar la lista de productos seleccionados al contenedor de productos
  contenedorProductos.appendChild(listaCarrito);

  // Agregar la sección del total del carrito
  const totalCarrito = crearElemento('div', 'my-4', 'Total: €0.00');
  totalCarrito.id = 'totalCarrito';

  const finalizarCompraBtn = crearElemento('button', 'btn btn-primary mt-4', 'Finalizar compra', finalizarCompra);

  contenedorProductos.appendChild(totalCarrito);
  contenedorProductos.appendChild(finalizarCompraBtn);

  actualizarCarrito();
}

// Nueva función para actualizar la lista de productos en el carrito
function actualizarListaCarrito() {
  const listaCarrito = document.getElementById('listaCarrito');
  listaCarrito.innerHTML = ''; 

  carrito.forEach(item => {
    const itemLista = crearElemento(
      'li',
      'list-group-item d-flex justify-content-between align-items-center',
      `${item.nombre} x${item.cantidad}`
    );
    
    const precioTotalItem = crearElemento('span', 'badge bg-primary rounded-pill subtotal', `€${(item.cantidad * item.precio).toFixed(2)}`);
    itemLista.appendChild(precioTotalItem);

    listaCarrito.appendChild(itemLista);
  });

  totalCarrito.innerHTML = `<span style="color: orange;">Total: €${calcularTotal()}</span>`

  // Si el carrito está vacío, mostrar un mensaje
  if (carrito.length === 0) {
    const mensajeVacio = crearElemento('li', 'list-group-item text-center', 'El carrito está vacío.');
    listaCarrito.appendChild(mensajeVacio);
  }
}

// Función para cargar productos desde JSON
async function cargarProductos(url) {
  try {
    const response = await fetch(url);
    const productos = await response.json();
    return productos;
  } catch (error) {
    console.error('Error al cargar los productos:', error);
    return []; // Retorna un array vacío si hay un error
  }
}

// Función para inicializar la interfaz
async function inicializarCarrito() {
  const productos = await cargarProductos(urlJSON);
  if (productos.length > 0) {
    generarInterfazProductos(productos);
  } else {
    console.error('No se pudieron cargar los productos');
  }
}
// Ejecutar la inicialización al cargar el DOM
document.addEventListener('DOMContentLoaded', inicializarCarrito);


// login - register

document.addEventListener('DOMContentLoaded', () => {
  // Seleccionar el navbar
  const navbar = document.querySelector('.navbar');

  // Crear contenedor para los botones
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('navbar-buttons-container');

  // Crear botón "Iniciar Sesión"
  const loginButton = document.createElement('button');
  loginButton.textContent = 'Iniciar Sesión';
  loginButton.id = 'loginButton'; // ID para futura funcionalidad
  buttonContainer.appendChild(loginButton);

  // Crear botón "Registrarse"
  const registerButton = document.createElement('button');
  registerButton.textContent = 'Registrarse';
  registerButton.id = 'registerButton'; // ID para futura funcionalidad
  buttonContainer.appendChild(registerButton);

  // Agregar el contenedor de botones al navbar
  navbar.appendChild(buttonContainer);
});


// Inicializar usuarios desde localStorage o un array vacío
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

// Función para guardar los usuarios en localStorage
function guardarUsuarios() {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// Validar la existencia de un usuario por nombre
function usuarioExiste(nombre) {
  return usuarios.some(usuario => usuario.nombre === nombre);
}

// Validar formato de contraseña
function validarContrasena(contrasena) {
  const tieneNumero = /\d/; // Verifica si tiene al menos un número
  return contrasena.length > 5 && tieneNumero.test(contrasena);
}

// Función para registrarse
function registrarUsuario() {
  Swal.fire({
    title: 'Registrarse',
    html: `
      <input id="registro-nombre" class="swal2-input" placeholder="Nombre de usuario">
      <input id="registro-contrasena" class="swal2-input" type="password" placeholder="Contraseña">`,
    confirmButtonText: 'Registrarse',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const nombre = document.getElementById('registro-nombre').value.trim();
      const contrasena = document.getElementById('registro-contrasena').value;

      if (nombre.length <= 4) {
        Swal.showValidationMessage('El nombre debe tener más de 4 caracteres');
        return false;
      }
      if (usuarioExiste(nombre)) {
        Swal.showValidationMessage('El nombre de usuario ya existe');
        return false;
      }
      if (!validarContrasena(contrasena)) {
        Swal.showValidationMessage('La contraseña debe tener más de 5 caracteres y al menos un número');
        return false;
      }

      return { nombre, contrasena };
    }
  }).then(result => {
    if (result.isConfirmed) {
      const nuevoUsuario = result.value;
      usuarios.push(nuevoUsuario);
      guardarUsuarios();
      Swal.fire({
        icon: 'success',
        title: 'Usuario registrado',
        text: `Bienvenido, ${nuevoUsuario.nombre}!`,
        timer: 2000,
        showConfirmButton: false
      });
    }
  });
}

// Función para iniciar sesión
function iniciarSesion() {
  Swal.fire({
    title: 'Iniciar Sesión',
    html: `
      <input id="login-nombre" class="swal2-input" placeholder="Nombre de usuario">
      <input id="login-contrasena" class="swal2-input" type="password" placeholder="Contraseña">`,
    confirmButtonText: 'Iniciar Sesión',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const nombre = document.getElementById('login-nombre').value.trim();
      const contrasena = document.getElementById('login-contrasena').value;

      const usuarioEncontrado = usuarios.find(
        usuario => usuario.nombre === nombre && usuario.contrasena === contrasena
      );

      if (!usuarioEncontrado) {
        Swal.showValidationMessage('Usuario o contraseña incorrectos');
        return false;
      }

      return usuarioEncontrado;
    }
  }).then(result => {
    if (result.isConfirmed) {
      const usuario = result.value;
      Swal.fire({
        icon: 'success',
        title: `¡Bienvenido a Cookie Monkey, ${usuario.nombre}!`,
        timer: 2000,
        showConfirmButton: false
      });
    }
  });
}

// Agregar funcionalidad a los botones creados dinámicamente
document.addEventListener('DOMContentLoaded', () => {
  // Seleccionar los botones creados
  const loginButton = document.getElementById('loginButton');
  const registerButton = document.getElementById('registerButton');

  if (loginButton && registerButton) {
    // Asignar las funciones correspondientes
    loginButton.addEventListener('click', iniciarSesion);
    registerButton.addEventListener('click', registrarUsuario);
  }
});




// ----------------------------------------------------- 

// Crear objetos  (reutilizable)

document.addEventListener('DOMContentLoaded', () => {
  // Clase Testimonial
  class Testimonial {
    constructor(nombre, texto, imagen) {
      this.nombre = nombre;
      this.texto = texto;
      this.imagen = imagen;
    }

    generarHTML() {
      return `
        <div class="grid-card">
          <div class="card">
            <img src="${this.imagen}" class="card-img-top" alt="icono ${this.nombre}">
            <div class="card-body">
              <p class="card-text"><strong>${this.nombre}</strong><br>"${this.texto}"</p>
            </div>
          </div>
        </div>
      `;
    }
  }

  // Array de testimonios
  const testimonios = [
    new Testimonial("María G.", "Desde que descubrí Cookie Monkey, no puedo dejar de venir. La atención es siempre amable y personalizada, y las cookies son simplemente las mejores que he probado. Mi favorita es la de limón, es fresca y deliciosa. Recomiendo a todos que pasen por aquí y prueben estas delicias. ¡Gracias por todo, equipo de Cookie Monkey!", "./imagenes/icono-mujer.png"),
    new Testimonial("Carlos R.", "Llevo a mis hijos a Cookie Monkey cada semana y siempre es una alegría. Les encantan las cookies rellenas de dulce de leche, y yo disfruto del ambiente acogedor y el servicio atento. La ubicación en el corazón de Barcelona es perfecta para nuestras salidas familiares. ¡Sin duda, las mejores galletas de la ciudad!", "./imagenes/icono-hombre.png"),
    new Testimonial("Lucía M.", "Soy fan de las galletas de avena y pasas, y las de Cookie Monkey son simplemente sublimes. Me encanta cómo cuidan cada detalle, desde la frescura de los ingredientes hasta la presentación. El personal es siempre tan amable y servicial. ¡No puedo esperar a mi próxima visita!", "./imagenes/icono-mujer.png"),
    new Testimonial("Javier L.", "Trabajo cerca de Cookie Monkey y es mi lugar favorito para una pausa dulce. La cookie de brownie es increíble, rica y perfecta para recargar energías. La atención siempre es rápida y cordial, y el local es muy cómodo. ¡Un sitio que siempre recomiendo!", "./imagenes/icono-hombre.png"),
    new Testimonial("Elena S.", "Descubrí Cookie Monkey por recomendación de un amigo, y fue amor al primer bocado. La cookie de mantequilla de maní es mi perdición. Además, el equipo es siempre tan amable y atento. La ubicación es ideal y el ambiente muy acogedor. ¡Gracias por las mejores galletas!", "./imagenes/icono-mujer.png"),
    new Testimonial("Miguel T.", "Cada vez que paso por Barcelona, una parada obligatoria es Cookie Monkey. La variedad y calidad de las galletas es impresionante. Mi preferida es la de coco y chocolate blanco, ¡es como un trocito de paraíso! Además, la atención siempre es de primera. ¡Sigan así!", "./imagenes/icono-hombre.png"),
    new Testimonial("Sofía P.", "Llevé a mis amigas a Cookie Monkey y todas quedamos encantadas. El local es muy acogedor y el personal muy atento. Las cookies de chispas de chocolate fueron un éxito total. Es el lugar perfecto para reunirse y disfrutar de un momento dulce. ¡Gracias por todo!", "./imagenes/icono-mujer.png"),
    new Testimonial("David H.", "La primera vez que entré a Cookie Monkey, me sentí como en casa. El aroma a galletas recién horneadas es irresistible. La cookie de avellanas es mi favorita, crujiente y deliciosa. El personal es siempre tan amable y servicial. ¡Un lugar que recomiendo sin dudar!", "./imagenes/icono-hombre.png"),
    new Testimonial("Ana B.", "Cookie Monkey ha superado todas mis expectativas. La cookie de limón es simplemente perfecta, con un sabor fresco y equilibrado. La atención es siempre excelente y el ambiente muy acogedor. Me encanta venir aquí y disfrutar de estas delicias. ¡Gracias por ser tan geniales!", "./imagenes/icono-mujer.png")
  ];

  // Función para renderizar los testimonios
  function renderizarTestimonios() {
    const contenedorReferencias = document.querySelector('#referencias');
    testimonios.forEach(testimonio => {
      contenedorReferencias.innerHTML += testimonio.generarHTML();
    });
  }

  // Llamar a la función para renderizar los testimonios
  renderizarTestimonios();
});