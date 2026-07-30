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
    document.getElementById("empresaPreview").textContent = empresa;
    document.getElementById("telefonePreview").textContent = "WhatsApp: +" + telefone;
    gerarCertificado(empresa);
    gerarCertificadoOficial(empresa);
    document.getElementById("certificadoSection").style.display = "block";
    document.getElementById("certificadoOficialSection").style.display = "block";
    setTimeout(() => {
        gerarQrAzul();
        gerarSelo();
        gerarAdesivo();
    }, 800);
  });

  function getQrDataUrl() {
    const c = document.querySelector("#qrCode canvas"); if (c) return c.toDataURL("image/png");
    const i = document.querySelector("#qrCode img"); if (i) return i.src; return null;
  }
  function baixar(nome, dataUrl) { const a = document.createElement("a"); a.download = nome; a.href = dataUrl; a.click(); }
  function imprimirDataUrl(dataUrl) {
    const w = window.open("", "_blank"); if (!w) return;
    w.document.write(`<html><body style="margin:0;display:flex;justify-content:center;align-items:center"><img src="${dataUrl}" onload="setTimeout(()=>print(),500)" style="max-width:95vw"></body></html>`);
    w.document.close();
  }

  function gerarCertificado(empresa) {
    const canvas = document.getElementById("certificadoCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
        canvas.width = img.width; canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        ctx.fillStyle = "#fff";
        ctx.fillRect(canvas.width * 0.18, canvas.height * 0.370, canvas.width * 0.64, canvas.height * 0.08);
        ctx.fillStyle = "#4b1f9c";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        let tamanhoFonte = 78; const larguraMaxima = canvas.width * 0.60;
        ctx.font = `bold ${tamanhoFonte}px "Brush Script MT", cursive`;
        while (ctx.measureText(empresa).width > larguraMaxima && tamanhoFonte > 30) {
            tamanhoFonte -= 2; ctx.font = `bold ${tamanhoFonte}px "Brush Script MT", cursive`;
        }
        ctx.fillText(empresa, canvas.width / 2, canvas.height * 0.43);
    };
    img.src = "certificado-base.png";
  }

  function gerarCertificadoOficial(empresa) {
    const canvas = document.getElementById("certificadoOficialCanvas"); if (!canvas) return;
    const ctx = canvas.getContext("2d"); const img = new Image();
    img.onload = () => {
        canvas.width = img.width; canvas.height = img.height; ctx.drawImage(img, 0, 0);
        ctx.fillStyle = "#3d247a"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        let tamanhoFonte = 78; const larguraMaxima = canvas.width * 0.78;
        ctx.font = `bold ${tamanhoFonte}px "Brush Script MT", cursive`;
        while (ctx.measureText(empresa).width > larguraMaxima && tamanhoFonte > 30) {
            tamanhoFonte -= 2; ctx.font = `bold ${tamanhoFonte}px "Brush Script MT", cursive`;
        }
        ctx.fillText(empresa, canvas.width / 2, canvas.height * 0.43);
    };
    img.src = "certificado-oficial.png";
  }

  function gerarSelo() {
    const canvas = document.getElementById("seloCanvas"); const section = document.getElementById("seloSection");
    if (!canvas) return; const ctx = canvas.getContext("2d"); const base = new Image();
    base.onload = () => {
      canvas.width = base.width; canvas.height = base.height; ctx.drawImage(base, 0, 0);
      const qrData = getQrDataUrl(); if (!qrData) return; const qr = new Image();
      qr.onload = () => {
        const tamanho = canvas.width * 0.22; const x = (canvas.width - tamanho)/2; const y = canvas.height * 0.19;
        ctx.fillStyle = "#fff"; ctx.fillRect(x-2, y-2, tamanho+4); ctx.drawImage(qr, x, y, tamanho, tamanho);
        if (section) section.style.display = "block";
      }; qr.src = qrData;
    }; base.src = "selo-base.png";
  }

  function gerarQrAzul() {
    const canvas = document.getElementById("qrAzulCanvas"); const section = document.getElementById("qrAzulSection");
    if (!canvas) return; const ctx = canvas.getContext("2d"); const base = new Image();
    base.onload = () => {
      canvas.width = base.width; canvas.height = base.height; ctx.drawImage(base, 0, 0, canvas.width, canvas.height);
      const qrSize = canvas.width * 0.38; const qrX = (canvas.width - qrSize)/2; const qrY = (canvas.height - qrSize)/2 - (canvas.height*0.01);
      ctx.fillStyle = "#fff"; ctx.fillRect(qrX, qrY, qrSize, qrSize);
      const qrDataUrl = getQrDataUrl(); if (!qrDataUrl) return; const qrImg = new Image();
      qrImg.onload = () => { ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize); if (section) section.style.display = "block"; };
      qrImg.src = qrDataUrl;
    }; base.src = "qr-azul-base.png";
  }

  function gerarAdesivo() {
    const canvas = document.getElementById("adesivoCanvas"); const section = document.getElementById("adesivoSection");
    if (!canvas) return; const ctx = canvas.getContext("2d"); const base = new Image();
    base.onload = () => {
      canvas.width = base.width; canvas.height = base.height; ctx.drawImage(base, 0, 0);
      const qrData = getQrDataUrl(); if (!qrData) { section.style.display="block"; return; }
      const qr = new Image();
      qr.onload = () => {

    // Área onde ficará o QR
const quadroX = canvas.width * 0.665;
const quadroY = canvas.height * 0.088;
const quadroW = canvas.width * 0.285;
const quadroH = canvas.height * 0.585;

// QR ocupando toda a área disponível
const tamanho = Math.min(quadroW, quadroH);

const x = quadroX + (quadroW - tamanho) / 2;
const y = quadroY + (quadroH - tamanho) / 2;

// Apenas fundo branco
ctx.fillStyle = "#fff";
ctx.fillRect(x, y, tamanho, tamanho);

// Desenha o QR sem moldura
ctx.drawImage(qr, x, y, tamanho, tamanho);

    if (section) section.style.display = "block";
};

qr.src = qrData;
};

base.src = "adesivo-porta-base.png";
}

  document.getElementById("baixarQR").onclick = () => { const d=getQrDataUrl(); if(!d) return alert("Gere o QR primeiro."); baixar("QR-ZAP.png", d); };
  document.getElementById("imprimirQR").onclick = () => { const d=getQrDataUrl(); if(!d) return alert("Gere o QR primeiro."); imprimirDataUrl(d); };
  document.getElementById("baixarCertificado").onclick = () => { const c=document.getElementById("certificadoCanvas"); baixar("CERTIFICADO.png", c.toDataURL("image/png")); };
  document.getElementById("baixarSelo").onclick = () => { const c=document.getElementById("seloCanvas"); if(!c||c.width===0) return alert("Gere o kit primeiro."); baixar("SELO-OFICIAL.png", c.toDataURL("image/png")); };
  document.getElementById("baixarQrAzul").onclick = () => { const c=document.getElementById("qrAzulCanvas"); baixar("QR-AZUL-OFICIAL.png", c.toDataURL("image/png")); };
  document.getElementById("baixarAdesivo").onclick = () => { const c=document.getElementById("adesivoCanvas"); baixar("ADESIVO-PORTA.png", c.toDataURL("image/png")); };
  document.getElementById("baixarCertificadoOficial").onclick = () => {
    const c = document.getElementById("certificadoOficialCanvas");
    if (!c || !c.width) return alert("Gere o Certificado Oficial primeiro.");
    baixar("CERTIFICADO-OFICIAL-QRZAP.png", c.toDataURL("image/png"));
  };
});
