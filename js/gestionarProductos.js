// Función para cargar los productos desde el archivo JSON
function cargarProductos(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error("Error al cargar los productos:", error);
      return []; // Devuelve un array vacío en caso de error
    });
}