document.addEventListener("DOMContentLoaded", () => {
  const botao = document.getElementById("gerarKit");
  if (!botao) return;

  botao.addEventListener("click", () => {
    const empresa = document.getElementById("empresa").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();
    if (!empresa || !telefone || !mensagem) {
      alert("Preencha todos os campos.");
      return;
    }
    const link = "https://wa.me/" + telefone + "?text=" + encodeURIComponent(mensagem);
    const qr = document.getElementById("qrCode");
    qr.innerHTML = "";
    new QRCode(qr, { text: link, width: 280, height: 280, correctLevel: QRCode.CorrectLevel.H });

    const ep = document.getElementById("empresaPreview");
    if (ep) ep.textContent = empresa;
    const tp = document.getElementById("telefonePreview");
    if (tp) tp.textContent = "WhatsApp: +" + telefone;

    gerarCertificado(empresa, telefone);
    // gera os outros após 0.5s
    setTimeout(() => { gerarAdesivo(); gerarQrAzul(); }, 600);
    document.getElementById("certificadoSection").style.display = "block";
  });

  function gerarCertificado(empresa, telefone) {
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
    ctx.font = "bold 32px 'Brush Script MT', cursive";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(empresa, canvas.width / 2, canvas.height * 0.385);
    ctx.restore();
    document.getElementById("certificadoSection").style.display = "block";
  };
  img.src = "certificado-base.png";
}
  // IMPRESSÃO CORRIGIDA - 1 página só, sem erro 1/2
  function imprimirDataUrl(dataUrl) {
    const w = window.open("", "_blank");
    if (!w) { alert("Permita pop-up"); return; }
    w.document.write(`
      <html><head><title>Imprimir</title>
      <style>@page{margin:0}body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#fff}img{max-width:95vw;max-height:95vh;object-fit:contain}</style>
      </head><body><img src="${dataUrl}" onload="setTimeout(()=>{window.print();},500)"></body></html>`);
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
    baixar("CERTIFICADO.png", c.toDataURL());
  });
  document.getElementById("imprimirCertificado")?.addEventListener("click", () => {
    const c = document.getElementById("certificadoCanvas");
    if (!c || c.width === 0) return alert("Gere primeiro");
    imprimirDataUrl(c.toDataURL());
  });

  // ADESIVO CORRIGIDO - QR DENTRO DA CAIXA
  window.gerarAdesivo = async function() {
    const baseEl = document.getElementById("adesivoBase");
    const qrData = getQrDataUrl();
    if (!baseEl || !qrData) return;
    const canvas = document.getElementById("adesivoCanvas") || document.createElement("canvas");
    canvas.width = 1500; canvas.height = 350;
    const x = canvas.getContext("2d");
    x.fillStyle = "#fff"; x.fillRect(0,0,canvas.width,canvas.height);
    const b = new Image(); b.src = baseEl.src;
    await new Promise(r => { b.onload = r; b.onerror = r; });
    x.drawImage(b,0,0,canvas.width,canvas.height);
    const q = new Image(); q.src = qrData;
    await new Promise(r => { q.onload = r; q.onerror = r; });
    const qrSize = 210;
    const qx = canvas.width - qrSize - 45;
    const qy = 70;
    x.fillStyle = "#fff"; x.fillRect(qx-6,qy-6,qrSize+12,qrSize+12);
    x.drawImage(q,qx,qy,qrSize,qrSize);
    if (!document.getElementById("adesivoCanvas")) {
      canvas.id="adesivoCanvas"; canvas.style.display="none"; document.body.appendChild(canvas);
    }
    const prev = document.getElementById("adesivoPreview");
    if (prev) prev.src = canvas.toDataURL();
  };

  window.gerarQrAzul = async function() {
    const baseEl = document.getElementById("qrAzulBase");
    const qrData = getQrDataUrl();
    if (!baseEl || !qrData) return;
    const canvas = document.getElementById("qrAzulCanvas") || document.createElement("canvas");
    canvas.width = 800; canvas.height = 800;
    const x = canvas.getContext("2d");
    const b = new Image(); b.src = baseEl.src;
    await new Promise(r=>{b.onload=r; b.onerror=r;});
    x.drawImage(b,0,0,800,800);
    const q = new Image(); q.src = qrData;
    await new Promise(r=>{q.onload=r; q.onerror=r;});
    x.drawImage(q,250,250,300,300);
    if (!document.getElementById("qrAzulCanvas")) {
      canvas.id="qrAzulCanvas"; canvas.style.display="none"; document.body.appendChild(canvas);
    }
  };
});
