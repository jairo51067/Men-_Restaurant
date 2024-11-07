function calcularTotal() {
  const basePrice = 0.50 + 0.25 + 0.25; // Precio de ingredientes básicos
  let additionalPrice = 0;

  // Obtenemos todos los checkboxes
  const checkboxes = document.querySelectorAll('#menu input[type="checkbox"]');
  
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      additionalPrice += parseFloat(checkbox.value);
    }
  });

  // Calculamos el total
  const total = basePrice + additionalPrice;
  document.getElementById('precioTotal').innerText = total.toFixed(2);
}

async function generarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Título
  doc.text("Resumen de Pedido", 10, 10);
  
  // Ingredientes básicos
  doc.text("Ingredientes básicos:", 10, 20);
  doc.text("Base Masa ($0.50)", 10, 30);
  doc.text("Queso Mozzarella ($0.25)", 10, 40);
  doc.text("Tomate ($0.25)", 10, 50);
  
  // Ingredientes adicionales seleccionados
  let yPosition = 70; // Posición vertical inicial para los ingredientes adicionales
  const checkboxes = document.querySelectorAll('#menu input[type="checkbox"]');
  
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      doc.text(`${checkbox.nextElementSibling.innerText}`, 10, yPosition);
      yPosition += 10; // Espaciado entre líneas
    }
  });

  // Precio total
  const total = document.getElementById('precioTotal').innerText;
  doc.text(`Total: $${total}`, 10, yPosition);
  yPosition += 10;

  // Notas del cliente
  const notas = document.getElementById('notas').value;
  doc.text("Notas del cliente:", 10, yPosition);
  yPosition += 10;
  doc.text(notas || "No hay notas", 10, yPosition);

  // Guardar el PDF si se desea guerdar una copia del pedido, por ahora desactivado
  // doc.save('pedido.pdf');

  // Envío a WhatsApp
  const whatsappNumber = '5804161709611'; // Número de WhatsApp del Restaurant en formato correcto
  const message = `Hola, aquí está mi pedido:\n\nIngredientes básicos:\n- Base Masa ($0.50)\n- Queso Mozzarella ($0.25)\n- Tomate ($0.25)\n\nIngredientes adicionales:\n${Array.from(checkboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.nextElementSibling.innerText).join('\n')}\n\nTotal: $${total}\n\nNotas: ${notas || "No hay notas"}`;
  
  const encodedMessage = encodeURIComponent(message);
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  
  // Abrir el enlace de WhatsApp
  window.open(whatsappLink, '_blank');
}