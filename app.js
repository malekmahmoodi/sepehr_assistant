let excelData = [];
let codeReader;

function loadExcelFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      excelData = XLSX.utils.sheet_to_json(sheet);
      alert("✅ فایل با موفقیت بارگذاری شد.");
    } catch (err) {
      alert("❌ خطا در خواندن فایل:\n" + err.message);
    }
  };
  reader.readAsArrayBuffer(file);
}

function searchByTerminal() {
  const terminal = document.getElementById("terminal-input").value.trim();
  const result = excelData.find(row => row["terminal"] == terminal);
  if (!result){
    result = excelData.find(row => row["ترمینال"] == terminal);
  }
  else if (!result){
    result = excelData.find(row => row["پایانه"] == terminal);
  }
  showResult(result);
}

function searchBySerial() {
  const serial = document.getElementById("serial-input").value.trim();
  const result = excelData.find(row => row["serial"] == serial);
  if (!result){
    result = excelData.find(row => row["سریال"] == serial);
  }
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

function startScanner() {
  document.getElementById("scanner").style.display = "block";

  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector('#interactive'),
      constraints: {
        facingMode: "environment", // دوربین پشتی
        aspectRatio: { min: 1, max: 2 },
      }
    },
    decoder: {
      readers: ["code_128_reader"]
    },
    locate: true, // فعال‌سازی تشخیص خودکار موقعیت بارکد
    locator: {
      patchSize: "medium", // یا "large" برای بارکدهای بزرگ‌تر
      halfSample: false
    },
    numOfWorkers: 2,
    frequency: 10
  }, function(err) {
    if (err) {
      console.error(err);
      alert("خطا در راه‌اندازی اسکنر");
      return;
    }
    Quagga.start();
  });

  Quagga.onDetected(function(result) {
    const code = result.codeResult.code;
    document.getElementById("serial-input").value = code;
    stopScanner();
  });
}

function stopScanner() {
  Quagga.stop();
  document.getElementById("scanner").style.display = "none";
}

function startZXingScanner() {
  document.getElementById("scanner").style.display = "block";
  const video = document.getElementById("video");

  codeReader = new ZXing.BrowserMultiFormatReader();
  codeReader.decodeFromVideoDevice(null, video, (result, err) => {
    if (result) {
      document.getElementById("serial-input").value = result.text;
      stopZXingScanner();
    }
  });
}

function stopZXingScanner() {
  if (codeReader) {
    codeReader.reset();
    document.getElementById("scanner").style.display = "none";
  }
}



