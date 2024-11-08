function calcularTotal() {
  let menuTotal = 0;

  // Obtener las cantidades de los platos del menú
  const margaritaQty =
    parseInt(document.getElementById("margarita-qty").value) || 0;
  const pepperoniQty =
    parseInt(document.getElementById("pepperoni-qty").value) || 0;
  const cuatroQuesosQty =
    parseInt(document.getElementById("cuatro-quesos-qty").value) || 0;
  const vegetarianaQty =
    parseInt(document.getElementById("vegetariana-qty").value) || 0;

  // Calcular el total de los platos del menú
  menuTotal += margaritaQty * 10.0;
  menuTotal += pepperoniQty * 12.0;
  menuTotal += cuatroQuesosQty * 14.0;
  menuTotal += vegetarianaQty * 11.0;

  let additionalPrice = 0;

  // Obtener los checkboxes de ingredientes adicionales y sus cantidades
  const checkboxes = document.querySelectorAll(
    '#additional-ingredients input[type="checkbox"]'
  );

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const qtyInput = document.getElementById(checkbox.id + "-qty");
      const qty = parseInt(qtyInput.value) || 0;
      additionalPrice += qty * parseFloat(checkbox.value);
    }
  });

  let bebidasTotal = 0;

  // Obtener las cantidades de las bebidas
  const cocaColaQty =
    parseInt(document.getElementById("coca-cola-qty").value) || 0;
  const fantaQty = parseInt(document.getElementById("fanta-qty").value) || 0;

  // Calcular el total de las bebidas
  bebidasTotal += cocaColaQty * 3.0;
  bebidasTotal += fantaQty * 3.0;

  // Calcular el total final
  const total = menuTotal + additionalPrice + bebidasTotal;
  document.getElementById("precioTotal").innerText = total.toFixed(2);
}

async function generarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Obtener el total del elemento en el DOM
  const totalPedido = parseFloat(document.getElementById("precioTotal").innerText);

  // Verificar si el total es cero
  if (totalPedido === 0) {
    swal("Error", "No puedes enviar un pedido vacío. Por favor selecciona al menos un artículo.", "error");
    return; // Salir de la función si el total es cero
  }

  // Título
  doc.text("Resumen de Pedido", 10, 10);

  // Platos seleccionados
  const margaritaQty =
    parseInt(document.getElementById("margarita-qty").value) || 0;
  const pepperoniQty =
    parseInt(document.getElementById("pepperoni-qty").value) || 0;
  const cuatroQuesosQty =
    parseInt(document.getElementById("cuatro-quesos-qty").value) || 0;
  const vegetarianaQty =
    parseInt(document.getElementById("vegetariana-qty").value) || 0;

  let yPosition = 20;
  if (margaritaQty > 0)
    doc.text(
      `Pizza Margarita: ${margaritaQty} x $10.00`,
      10,
      (yPosition += 10)
    );
  if (pepperoniQty > 0)
    doc.text(
      `Pizza Pepperoni: ${pepperoniQty} x $12.00`,
      10,
      (yPosition += 10)
    );
  if (cuatroQuesosQty > 0)
    doc.text(
      `Pizza Cuatro Quesos: ${cuatroQuesosQty} x $14.00`,
      10,
      (yPosition += 10)
    );
  if (vegetarianaQty > 0)
    doc.text(
      `Pizza Vegetariana: ${vegetarianaQty} x $11.00`,
      10,
      (yPosition += 10)
    );

  // Bebidas seleccionadas
  const cocaColaQty =
    parseInt(document.getElementById("coca-cola-qty").value) || 0;
  const fantaQty = parseInt(document.getElementById("fanta-qty").value) || 0;

  if (cocaColaQty > 0)
    doc.text(`Coca-Cola: ${cocaColaQty} x $3.00`, 10, (yPosition += 10));
  if (fantaQty > 0)
    doc.text(`Fanta: ${fantaQty} x $3.00`, 10, (yPosition += 10));

  // Ingredientes adicionales seleccionados
  const checkboxes = document.querySelectorAll(
    '#additional-ingredients input[type="checkbox"]'
  );

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const qtyInput = document.getElementById(checkbox.id + "-qty");
      const qty = parseInt(qtyInput.value) || 0;
      if (qty > 0) {
        doc.text(
          `${checkbox.nextElementSibling.innerText}: ${qty} x $${checkbox.value}`,
          10,
          (yPosition += 10)
        );
      }
    }
  });

  // Precio total
  const total = document.getElementById("precioTotal").innerText;
  doc.text(`Total: $${total}`, 10, (yPosition += 10));

  // Notas del cliente
  const notas = document.getElementById("notas").value;
  doc.text("Notas del cliente:", 10, (yPosition += 10));
  doc.text(notas || "No hay notas", 10, (yPosition += 10));

  // Generar el PDF
  doc.save("pedido.pdf");

  // Enviar a WhatsApp
  const whatsappNumber = "5804161709611"; // Número de WhatsApp del negocio
  let mensaje =
    `Hola, aquí está mi pedido:\n\n` +
    `Pizza Margarita: ${margaritaQty} x $10.00\n` +
    `Pizza Pepperoni: ${pepperoniQty} x $12.00\n` +
    `Pizza Cuatro Quesos: ${cuatroQuesosQty} x $14.00\n` +
    `Pizza Vegetariana: ${vegetarianaQty} x $11.00\n\n` +
    `Ingredientes adicionales:\n`;

  // Agregar ingredientes adicionales al mensaje
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const qtyInput = document.getElementById(checkbox.id + "-qty");
      const qty = parseInt(qtyInput.value) || 0;
      if (qty > 0) {
        mensaje += `${checkbox.nextElementSibling.innerText}: ${qty} x $${checkbox.value}\n`;
      }
    }
  });

  // Precio total
  mensaje += `\nTotal: $${total}\n`;

  // Notas del cliente
  mensaje += `Notas: ${notas || "No hay notas"}`;

  // Codificar el mensaje para la URL
  const encodedMessage = encodeURIComponent(mensaje);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  // Abrir la URL de WhatsApp
  window.open(whatsappUrl, "_blank");

  // Al final de la función generarPDF
  swal("¡Pedido Enviado!", "Tu pedido ha sido enviado a WhatsApp.", "success");
}

function borrarPedido() {
  // Restablecer las cantidades de las pizzas a 0
  document.getElementById("margarita-qty").value = 0;
  document.getElementById("pepperoni-qty").value = 0;
  document.getElementById("cuatro-quesos-qty").value = 0;
  document.getElementById("vegetariana-qty").value = 0;

  // Restablecer las cantidades de los ingredientes adicionales a 0
  const checkboxes = document.querySelectorAll(
    '#additional-ingredients input[type="checkbox"]'
  );
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
    const qtyInput = document.getElementById(checkbox.id + "-qty");
    qtyInput.value = 0;
  });

  // Restablecer el total
  document.getElementById("precioTotal").innerText = "0.00";

  // Limpiar notas
  document.getElementById("notas").value = "";
  // Usar SweetAlert para mostrar un mensaje de confirmación
  swal(
    "¡Listo!",
    "El pedido ha sido borrado y el formulario ha sido restablecido.",
    "success"
  );
}
