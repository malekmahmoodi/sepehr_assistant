let excelData = [];
let html5QrCode;

function loadExcelFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    excelData = XLSX.utils.sheet_to_json(sheet);
    alert("فایل با موفقیت بارگذاری شد.");
  };
  reader.readAsArrayBuffer(file);
}

function searchByTerminal() {
  const terminal = document.getElementById("terminal-input").value.trim();
  const result = excelData.find(row => row["terminal"] == terminal);
  showResult(result);
}

function searchBySerial() {
  const serial = document.getElementById("serial-input").value.trim();
  const result = excelData.find(row => row["serial"] == serial);
  showResult(result);
}

function showResult(result) {
  if (!result) {
    alert("موردی یافت نشد.");
    return;
  }
  localStorage.setItem("searchResult", JSON.stringify(result));
  window.location.href = "result.html";
}

function startBarcodeScanner() {
  document.getElementById("scanner").style.display = "block";
  html5QrCode = new Html5Qrcode("reader");
  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    (decodedText) => {
      document.getElementById("serial-input").value = decodedText;
      stopScanner();
    }
  );
}

function stopScanner() {
  if (html5QrCode) {
    html5QrCode.stop().then(() => {
      html5QrCode.clear();
      document.getElementById("scanner").style.display = "none";
    });
  }
}