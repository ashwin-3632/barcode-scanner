let inventory = {};

function loadCSV() {
  fetch('products.csv')
    .then(response => response.text())
    .then(csv => {
      let lines = csv.trim().split('\n');
      let headers = lines[0].split(',');
      lines.slice(1).forEach(line => {
        let data = line.split(',');
        let item = {};
        headers.forEach((header, i) => {
          item[header.trim()] = data[i].trim();
        });
        inventory[item.barcode] = item;
      });
    });
}

function showProductInfo(barcode) {
  const resultDiv = document.getElementById('result');
  if (inventory[barcode]) {
    const product = inventory[barcode];
    resultDiv.innerHTML = `
      <h3>Product Found</h3>
      <p><b>Name:</b> ${product.product_name}</p>
      <p><b>Stock:</b> ${product.stock}</p>
    `;
  } else {
    resultDiv.innerHTML = `<p style="color:red;">Product not found for barcode: ${barcode}</p>`;
  }
}

function startScanner() {
  const html5QrCode = new Html5Qrcode("reader");
  html5QrCode.start(
    { facingMode: "environment" }, // rear camera
    {
      fps: 10,
      qrbox: 250
    },
    (decodedText, decodedResult) => {
      html5QrCode.stop(); // stop scanning after first result
      showProductInfo(decodedText);
    },
    (errorMessage) => {}
  );
}

loadCSV();
startScanner();
