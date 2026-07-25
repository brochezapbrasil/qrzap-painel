document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("gerarKit");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const empresa = document.getElementById("empresa")?.value.trim() || "";
    const telefone = document.getElementById("telefone")?.value.trim() || "";
    const mensagem = document.getElementById("mensagem")?.value.trim() || "";

    if (!empresa || !telefone || !mensagem) {
      alert("Preencha todos os campos.");
      return;
    }

    const link = "https://wa.me/" + telefone + "?text=" + encodeURIComponent(mensagem);
    
    // QR - limpa e gera
    const qrDiv = document.getElementById("qrCode");
    if (qrDiv) {
      qrDiv.innerHTML = "";
      new QRCode(qrDiv, {
        text: link,
        width: 280,
        height: 280,
        correctLevel: QRCode.CorrectLevel.H
      });
    }

    // Previews opcionais - não quebra se não existir
    const empPrev = document.getElementById("empresaPreview");
    if (empPrev) empPrev.textContent = empresa;
    const telPrev = document.getElementById("telefonePreview");
    if (telPrev) telPrev.textContent = "WhatsApp: +" + telefone;

    // Certificado
    gerarCertificado(empresa);

    // Mostra seção
    const sec = document.getElementById("certificadoSection");
    if (sec) sec.style.display = "block";
    const pre = document.getElementById("previewSection");
    if (pre) pre.style.display = "block";
  });

  function gerarCertificado(empresa) {
    const canvas = document.getElementById("certificadoCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      ctx.save();
      ctx.fillStyle = "#4b1f9c";
      ctx.font = "bold 34px 'Brush Script MT', cursive";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      // posição 0.385 = bem no meio da linha, sem sobrepor
      ctx.fillText(empresa, canvas.width / 2, canvas.height * 0.385);
      ctx.restore();
    };
    img.src = "certificado-base.png";
  }

  function getQrDataUrl() {
    const c = document.querySelector("#qrCode canvas");
    if (c) return c.toDataURL("image/png");
    const i = document.querySelector("#qrCode img");
    if (i) return i.src;
    return null;
  }

  function baixar(nome, dataUrl) {
    const a = document.createElement("a");
    a.download = nome;
    a.href = dataUrl;
    a.click();
  }

  function imprimirDataUrl(dataUrl) {
    const w = window.open("", "_blank");
    if (!w) { alert("Permita pop-up"); return; }
    w.document.write(`<html><head><title>Imprimir</title><style>@page{margin:0}body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh}img{max-width:95vw;max-height:95vh}</style></head><body><img src="${dataUrl}" onload="setTimeout(()=>{window.print();},500)"></body></html>`);
    w.document.close();
  }

  document.getElementById("baixarQR")?.addEventListener("click", () => {
    const d = getQrDataUrl();
    if (!d) return alert("Gere o QR primeiro.");
    baixar("QR-ZAP.png", d);
  });

  document.getElementById("imprimirQR")?.addEventListener("click", () => {
    const d = getQrDataUrl();
    if (!d) return alert("Gere o QR primeiro.");
    imprimirDataUrl(d);
  });

  document.getElementById("baixarCertificado")?.addEventListener("click", () => {
    const c = document.getElementById("certificadoCanvas");
    if (!c || c.width === 0) return alert("Gere primeiro");
    baixar("CERTIFICADO.png", c.toDataURL("image/png"));
  });

  document.getElementById("imprimirCertificado")?.addEventListener("click", () => {
    const c = document.getElementById("certificadoCanvas");
    if (!c || c.width === 0) return alert("Gere primeiro");
    imprimirDataUrl(c.toDataURL("image/png"));
  });
});
