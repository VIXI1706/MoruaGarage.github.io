function calcularTotal(trabajos, refacciones) {
  const manoObra = trabajos.reduce((suma, t) => suma + (Number(t.precio) || 0), 0);
  return manoObra + (Number(refacciones) || 0);
}
function formatoMoneda(valor) {
  return Number(valor).toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}
