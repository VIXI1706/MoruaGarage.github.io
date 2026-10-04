const trabajosDiv = document.getElementById("trabajos");
const totalEl = document.getElementById("total");
const refaccionesEl = document.getElementById("refacciones");
const listaEl = document.getElementById("lista");
const form = document.getElementById("formulario");

function esc(t) { const d = document.createElement("div"); d.textContent = t; return d.innerHTML; }

function agregarTrabajo() {
  const fila = document.createElement("div");
  fila.className = "trabajo";
  fila.innerHTML = `
    <input class="desc" placeholder="Descripción del trabajo">
    <input class="precio" type="number" min="0" step="0.01" placeholder="Precio">
    <button type="button" class="btn quitar">✕</button>`;
  fila.querySelector(".quitar").onclick = () => { fila.remove(); actualizarTotal(); };
  fila.querySelector(".precio").oninput = actualizarTotal;
  trabajosDiv.appendChild(fila);
}

function leerTrabajos() {
  return [...trabajosDiv.querySelectorAll(".trabajo")]
    .map(f => ({ descripcion: f.querySelector(".desc").value.trim(), precio: Number(f.querySelector(".precio").value) || 0 }))
    .filter(t => t.descripcion || t.precio);
}

function actualizarTotal() {
  totalEl.textContent = formatoMoneda(calcularTotal(leerTrabajos(), refaccionesEl.value));
}

function mostrarRegistros() {
  const registros = obtenerRegistros();
  if (!registros.length) { listaEl.innerHTML = '<p class="vacio">Aún no hay vehículos registrados.</p>'; return; }
  listaEl.innerHTML = registros.map(r => `
    <article class="registro">
      <h3>${r.vehiculo} — ${r.placas}</h3>
      <p><strong>Cliente:</strong> ${r.cliente} · ${r.fecha}</p>
      <p><strong>Falla:</strong> ${r.falla}</p>
      <p><strong>Trabajos:</strong> ${r.trabajos.map(t => `${t.descripcion} (${formatoMoneda(t.precio)})`).join(", ") || "—"}</p>
      <p><strong>Refacciones:</strong> ${formatoMoneda(r.refacciones)}</p>
      <p class="precio">Total: ${formatoMoneda(r.total)}</p>
      <button class="btn" data-id="${r.id}">Eliminar</button>
    </article>`).join("");
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const trabajos = leerTrabajos().map(t => ({ ...t, descripcion: esc(t.descripcion) }));
  const refacciones = Number(refaccionesEl.value) || 0;
  const registros = obtenerRegistros();
  registros.unshift({
    id: Date.now(),
    cliente: esc(document.getElementById("cliente").value),
    vehiculo: esc(document.getElementById("vehiculo").value),
    placas: esc(document.getElementById("placas").value),
    falla: esc(document.getElementById("falla").value),
    trabajos, refacciones,
    total: calcularTotal(trabajos, refacciones),
    fecha: new Date().toLocaleDateString("es-MX")
  });
  guardarRegistros(registros);
  form.reset(); trabajosDiv.innerHTML = ""; agregarTrabajo(); actualizarTotal(); mostrarRegistros();
});

listaEl.addEventListener("click", e => {
  const id = e.target.dataset.id;
  if (!id) return;
  guardarRegistros(obtenerRegistros().filter(r => String(r.id) !== id));
  mostrarRegistros();
});

document.getElementById("agregarTrabajo").onclick = agregarTrabajo;
refaccionesEl.oninput = actualizarTotal;
agregarTrabajo(); mostrarRegistros();
