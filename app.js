document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("gerarKit");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const empresa = document.getElementById("empresa")?.value.trim() || "";
    const cnpj = document.getElementById("cnpj")?.value.trim() || "";
    const dataRaw = document.getElementById("dataAdesao")?.value || "";
    const whatsappRaw = document.getElementById("whatsapp")?.value.trim() || "";
    const telefone = whatsappRaw.replace(/\D/g, "");
    const mensagem = document.getElementById("mensagem")?.value.trim() || "";

    if (!empresa || !cnpj || !dataRaw || !telefone || !mensagem) {
      alert("Preencha todos os campos.");
      return;
    }

    const data = dataRaw.split("-").reverse().join("/");

    const link = "https://wa.me/" + telefone + "?text=" + encodeURIComponent(mensagem);
    const qrDiv = document.getElementById("qrCode");
    if (qrDiv) {
      qrDiv.innerHTML = "";
      new QRCode(qrDiv, { text: link, width: 300, height: 300, correctLevel: QRCode.CorrectLevel.H });
    }

    document.getElementById("empresaPreview").textContent = empresa;
    document.getElementById("telefonePreview").textContent = "WhatsApp: +" + telefone;

    gerarCertificado(empresa);
    gerarCertificadoOficial(empresa, cnpj, data);

    document.getElementById("certificadoSection").style.display = "block";
    document.getElementById("certificadoOficialSection").style.display = "block";
    setTimeout(() => { gerarQrAzul(); gerarSelo(); gerarAdesivo(); }, 800);
  });

  function getQrDataUrl() {
    const c = document.querySelector("#qrCode canvas"); if (c) return c.toDataURL("image/png");
    const i = document.querySelector("#qrCode img"); if (i) return i.src; return null;
  }
  function baixar(nome, dataUrl) { const a = document.createElement("a"); a.download = nome; a.href = dataUrl; a.click(); }

  function gerarCertificado(empresa) {
    const canvas = document.getElementById("certificadoCanvas"); if (!canvas) return;
    const ctx = canvas.getContext("2d"); const img = new Image();
    img.onload = () => {
        canvas.width = img.width; canvas.height = img.height; ctx.drawImage(img, 0, 0);
        ctx.fillStyle = "#fff"; ctx.fillRect(canvas.width * 0.18, canvas.height * 0.370, canvas.width * 0.64, canvas.height * 0.08);
        ctx.fillStyle = "#4b1f9c"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        let tamanhoFonte = 78; const larguraMaxima = canvas.width * 0.60;
        ctx.font = `bold ${tamanhoFonte}px "Brush Script MT", cursive`;
        while (ctx.measureText(empresa).width > larguraMaxima && tamanhoFonte > 30) { tamanhoFonte -= 2; ctx.font = `bold ${tamanhoFonte}px "Brush Script MT", cursive`; }
        ctx.fillText(empresa, canvas.width / 2, canvas.height * 0.43);
    }; img.src = "certificado-base.png";
  }

  // --- CERTIFICADO OFICIAL COM CNPJ E DATA NAS POSIÇÕES EXATAS ---
    function gerarCertificadoOficial(empresa, cnpj, data) {
    const canvas = document.getElementById("certificadoOficialCanvas"); if (!canvas) return;
    const ctx = canvas.getContext("2d"); const img = new Image();
    img.onload = () => {
        canvas.width = img.width; canvas.height = img.height; 
        ctx.drawImage(img, 0, 0);

        // --- COORDENADAS CORRIGIDAS PARA SEU LAYOUT ---
        // Nome da empresa
const xEmpresa = canvas.width * 0.60;
const yEmpresa = canvas.height * 0.24;

// Data
const xData = canvas.width * 0.215;
const yData = canvas.height * 0.705;

// CNPJ
const xCnpj = canvas.width * 0.49;
const yCnpj = canvas.height * 0.705;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // 1. NOME DA EMPRESA
        ctx.fillStyle = "#1a2a4a";
        let tamanhoFonte = 42;
        const larguraMaxima = canvas.width * 0.55;
        ctx.font = `bold ${tamanhoFonte}px Arial`;
        while (ctx.measureText(empresa).width > larguraMaxima && tamanhoFonte > 18) {
          tamanhoFonte -= 2;
          ctx.font = `bold ${tamanhoFonte}px Arial`;
        }
        ctx.fillText(empresa, xEmpresa, yEmpresa);

        // DATA
ctx.fillStyle = "#000";
ctx.font = "bold 20px Arial";
ctx.fillText(data, xData, yData);

// CNPJ
ctx.font = "bold 20px Arial";
ctx.fillText(cnpj, xCnpj, yCnpj);
    };
    img.src = "certificado-oficial.png";
  }

  function gerarSelo() {
    const canvas = document.getElementById("seloCanvas");
    const section = document.getElementById("seloSection");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const base = new Image();
    base.onload = () => {
        canvas.width = base.width; canvas.height = base.height;
        ctx.drawImage(base, 0, 0);
        const qrData = getQrDataUrl(); if (!qrData) return;
        const qr = new Image();
        qr.onload = () => {
            const tamanho = canvas.width * 0.45;
            const x = (canvas.width - tamanho) / 2;
            const y = (canvas.height - tamanho) / 2 - (canvas.height * 0.022);
            ctx.fillStyle = "#fff";
            ctx.fillRect(x - 6, y - 6, tamanho + 12, tamanho + 12);
            ctx.drawImage(qr, x, y, tamanho, tamanho);
            if (section) section.style.display = "block";
        };
        qr.src = qrData;
    };
    base.src = "selo-base-v2.png";
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
        const quadroX = canvas.width * 0.632;
        const quadroY = canvas.height * 0.078;
        const quadroW = canvas.width * 0.324;
        const quadroH = canvas.height * 0.652;
        const tamanho = Math.min(quadroW, quadroH) * 0.92;
        const x = quadroX + (quadroW - tamanho) / 2;
        const y = quadroY + (quadroH - tamanho) / 2;
        ctx.fillStyle = "#fff"; ctx.fillRect(x, y, tamanho, tamanho);
        ctx.drawImage(qr, x, y, tamanho, tamanho);
        if (section) section.style.display = "block";
      };
      qr.src = qrData;
    };
    base.src = "adesivo-porta-base.png";
  }

  document.getElementById("baixarQR").onclick = () => { const d=getQrDataUrl(); if(!d) return alert("Gere o QR primeiro."); baixar("QR-ZAP.png", d); };
  document.getElementById("baixarCertificado").onclick = () => { const c=document.getElementById("certificadoCanvas"); baixar("CERTIFICADO.png", c.toDataURL("image/png")); };
  document.getElementById("baixarSelo").onclick = () => { const c=document.getElementById("seloCanvas"); if(!c||c.width===0) return alert("Gere o kit primeiro."); baixar("SELO-OFICIAL.png", c.toDataURL("image/png")); };
  document.getElementById("baixarQrAzul").onclick = () => { const c=document.getElementById("qrAzulCanvas"); baixar("QR-AZUL-OFICIAL.png", c.toDataURL("image/png")); };
  document.getElementById("baixarAdesivo").onclick = () => { const c=document.getElementById("adesivoCanvas"); baixar("ADESIVO-PORTA.png", c.toDataURL("image/png")); };
  document.getElementById("baixarCertificadoOficial").onclick = () => { const c = document.getElementById("certificadoOficialCanvas"); baixar("CERTIFICADO-OFICIAL-QRZAP.png", c.toDataURL("image/png")); };
});
