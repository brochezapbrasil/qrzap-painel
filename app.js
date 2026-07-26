document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("gerarKit");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const empresa = document.getElementById("empresa")?.value.trim() || "";
    const telefoneRaw = document.getElementById("telefone")?.value.trim() || "";
    const telefone = telefoneRaw.replace(/\D/g, "");
    const mensagem = document.getElementById("mensagem")?.value.trim() || "";
    if (!empresa || !telefone || !mensagem) { alert("Preencha todos os campos."); return; }
    const link = "https://wa.me/" + telefone + "?text=" + encodeURIComponent(mensagem);
    const qrDiv = document.getElementById("qrCode");
    if (qrDiv) {
      qrDiv.innerHTML = "";
      new QRCode(qrDiv, { text: link, width: 200, height: 200, correctLevel: QRCode.CorrectLevel.H });
    }
    const empPrev = document.getElementById("empresaPreview");
    if (empPrev) empPrev.textContent = empresa;
    const telPrev = document.getElementById("telefonePreview");
    if (telPrev) telPrev.textContent = "WhatsApp: +" + telefone;
    gerarCertificado(empresa);
    setTimeout(() => {
    console.log(getQrDataUrl());
    gerarQrAzul();
}, 1500);
    const sec = document.getElementById("certificadoSection");
    if (sec) sec.style.display = "block";
  });

  function gerarCertificado(empresa) {
    const canvas = document.getElementById("certificadoCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width; canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(canvas.width * 0.18, canvas.height * 0.385, canvas.width * 0.64, canvas.height * 0.06);
      ctx.save(); ctx.fillStyle = "#4b1f9c"; ctx.font = "bold 78px 'Brush Script MT', cursive"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(empresa, canvas.width / 2, canvas.height * 0.43); ctx.restore();
    }; img.src = "certificado-base.png";
  }

  function getQrDataUrl() {
    const c = document.querySelector("#qrCode canvas"); if (c) return c.toDataURL("image/png");
    const i = document.querySelector("#qrCode img"); if (i) return i.src; return null;
  }
  function baixar(nome, dataUrl) { const a = document.createElement("a"); a.download = nome; a.href = dataUrl; a.click(); }
  function imprimirDataUrl(dataUrl) {
    const w = window.open("", "_blank"); if (!w) { alert("Permita pop-up"); return; }
    w.document.write(`<html><head><title>Imprimir</title><style>@page{margin:0}body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh}img{max-width:95vw;max-height:95vh}</style></head><body><img src="${dataUrl}" onload="setTimeout(()=>{window.print();},500)"></body></html>`);
    w.document.close();
  }
  document.getElementById("baixarQR")?.addEventListener("click", () => { const d = getQrDataUrl(); if (!d) return alert("Gere o QR primeiro."); baixar("QR-ZAP.png", d); });
  document.getElementById("imprimirQR")?.addEventListener("click", () => { const d = getQrDataUrl(); if (!d) return alert("Gere o QR primeiro."); imprimirDataUrl(d); });
  document.getElementById("baixarCertificado")?.addEventListener("click", () => { const c = document.getElementById("certificadoCanvas"); if (!c || c.width === 0) return alert("Gere primeiro"); baixar("CERTIFICADO.png", c.toDataURL("image/png")); });
  document.getElementById("imprimirCertificado")?.addEventListener("click", () => { const c = document.getElementById("certificadoCanvas"); if (!c || c.width === 0) return alert("Gere primeiro"); imprimirDataUrl(c.toDataURL("image/png")); });

  function gerarQrAzul() {
    try {
      const canvas = document.getElementById("qrAzulCanvas");
      const section = document.getElementById("qrAzulSection");
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const base = new Image();
      base.onload = () => {
        canvas.width = base.width; canvas.height = base.height;
        ctx.drawImage(base, 0, 0, canvas.width, canvas.height);
        const qrSize = canvas.width * 0.36;
        const qrX = (canvas.width - qrSize) / 2;
        const qrY = (canvas.height - qrSize) / 2 - (canvas.height * 0.01);
        ctx.fillStyle = "#ffffff"; ctx.fillRect(qrX, qrY, qrSize, qrSize);
        const qrDataUrl = getQrDataUrl(); if (!qrDataUrl) return;
        const qrImg = new Image();
        qrImg.onload = () => { ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize); if (section) section.style.display = "block"; };
        qrImg.src = qrDataUrl;
      }; base.src = "qr-azul-base.png";
    } catch(e){ console.log(e); }
  }
  document.getElementById("baixarQrAzul")?.addEventListener("click", () => { const c = document.getElementById("qrAzulCanvas"); if (!c || c.width === 0) return alert("Gere primeiro"); baixar("QR-AZUL-OFICIAL.png", c.toDataURL("image/png")); });
});
