
document.getElementById('ventaForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const total = data.cantidad * data.precio;
  const restante = total - data.abono;

  data.total = total;
  data.restante = restante;

  const response = await fetch("https://sheetdb.io/api/v1/7merahzf5ighx", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({data})
  });

  if (response.ok) {
    alert("Venta registrada correctamente");
    e.target.reset();
  } else {
    alert("Error al registrar venta");
  }
});
