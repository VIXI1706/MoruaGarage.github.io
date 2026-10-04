const CLAVE = "taller-registros";
function obtenerRegistros() {
  try { return JSON.parse(localStorage.getItem(CLAVE)) || []; } catch { return []; }
}
function guardarRegistros(registros) {
  localStorage.setItem(CLAVE, JSON.stringify(registros));
}
