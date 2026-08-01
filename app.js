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
    document.getElementById("seloSection").style.display = "block";
    document.getElementById("qrAzulSection").style.display = "block";
    document.getElementById("adesivoSection").style.display = "block";

    setTimeout(() => { gerarQrAzul(); gerarSelo(); gerarAdesivo(); }, 1000);
  });

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

  function gerarCertificadoOficial(empresa, cnpj, data) {
    const canvas = document.getElementById("certificadoOficialCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const xEmpresa = canvas.width / 2;

      // 1) apaga a área (título termina ~398, linha original ~445)
      //    com folga segura dos dois lados
      ctx.fillStyle = "#fff";
      ctx.fillRect(xEmpresa - 520, 404, 1040, 42);

      // 2) desenha uma linha nova, própria, tipo "assinatura"
      const yLinha = 438;
      ctx.strokeStyle = "#0a2a4a";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(xEmpresa - 350, yLinha);
      ctx.lineTo(xEmpresa + 350, yLinha);
      ctx.stroke();

      // 3) escreve o nome da empresa em cima da linha nova
      const yEmpresa = 430;
      ctx.fillStyle = "#0a2a4a";
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";

      let tamanho = 30;
      ctx.font = `bold ${tamanho}px Arial`;
      while (ctx.measureText(empresa).width > 660 && tamanho > 16) {
          tamanho--;
          ctx.font = `bold ${tamanho}px Arial`;
      }
      ctx.fillText(empresa, xEmpresa, yEmpresa);

      // DATA E CNPJ
      const xData = 404;
      const yData = 738;
      const xCnpj = 817;
      const yCnpj = 738;

      ctx.fillStyle = "#000";
      ctx.font = "bold 16px Arial";
      ctx.fillText(data, xData, yData);
      ctx.fillText(cnpj, xCnpj, yCnpj);
    };
    img.src = "certificado-oficial.png?v=" + Date.now();
}
  }

  // --- CERTIFICADO OFICIAL - VERSÃO FINAL CORRIGIDA y=455 ---
  function gerarCertificadoOficial(empresa, cnpj, data) {
    const canvas = document.getElementById("certificadoOficialCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // NOME — entre o fim do título (~398) e a linha (~445)
      const xEmpresa = canvas.width / 2; // 768 para 1536px de largura
      const yEmpresa = 428;

      // fundo branco atrás do nome, pra nunca sobrepor título/linha
      ctx.fillStyle = "#fff";
      ctx.fillRect(xEmpresa - 520, yEmpresa - 20, 1040, 30);

      // DATA E CNPJ — logo abaixo da linha dos campos (y≈705)
      const xData = 404;
const yData = 738;
const xCnpj = 817;
const yCnpj = 738;

      ctx.fillStyle = "#0a2a4a";
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";

      let tamanho = 30;
      ctx.font = `bold ${tamanho}px Arial`;
      while (ctx.measureText(empresa).width > 1000 && tamanho > 18) {
          tamanho--;
          ctx.font = `bold ${tamanho}px Arial`;
      }
      ctx.fillText(empresa, xEmpresa, yEmpresa);

      ctx.fillStyle = "#000";
      ctx.font = "bold 16px Arial";
      ctx.fillText(data, xData, yData);
      ctx.fillText(cnpj, xCnpj, yCnpj);
    };
    img.src = "certificado-oficial.png?v=" + Date.now();
}

  function gerarSelo() {
    const canvas = document.getElementById("seloCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const base = new Image();
    base.onload = () => {
      canvas.width = base.width;
      canvas.height = base.height;
      ctx.drawImage(base, 0, 0);
      const qrData = getQrDataUrl();
      if (!qrData) return;
      const qr = new Image();
      qr.onload = () => {
        const tamanho = canvas.width * 0.45;
        const x = (canvas.width - tamanho) / 2;
        const y = (canvas.height - tamanho) / 2 - canvas.height * 0.022;
        ctx.fillStyle = "#fff";
        ctx.fillRect(x - 6, y - 6, tamanho + 12, tamanho + 12);
        ctx.drawImage(qr, x, y, tamanho, tamanho);
      };
      qr.src = qrData;
    };
    base.src = "selo-base-v2.png";
  }

  function gerarQrAzul() {
    const canvas = document.getElementById("qrAzulCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const base = new Image();
    base.onload = () => {
      canvas.width = base.width;
      canvas.height = base.height;
      ctx.drawImage(base, 0, 0);
      const qrSize = canvas.width * 0.38;
      const qrX = (canvas.width - qrSize) / 2;
      const qrY = (canvas.height - qrSize) / 2 - canvas.height * 0.01;
      ctx.fillStyle = "#fff";
      ctx.fillRect(qrX, qrY, qrSize, qrSize);
      const qrDataUrl = getQrDataUrl();
      if (!qrDataUrl) return;
      const qrImg = new Image();
      qrImg.onload = () => {
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      };
      qrImg.src = qrDataUrl;
    };
    base.src = "qr-azul-base.png";
  }

  function gerarAdesivo() {
    const canvas = document.getElementById("adesivoCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const base = new Image();
    base.onload = () => {
      canvas.width = base.width;
      canvas.height = base.height;
      ctx.drawImage(base, 0, 0);
      const qrData = getQrDataUrl();
      if (!qrData) return;
      const qr = new Image();
      qr.onload = () => {
        const quadroX = canvas.width * 0.632;
        const quadroY = canvas.height * 0.078;
        const quadroW = canvas.width * 0.324;
        const quadroH = canvas.height * 0.652;
        const tamanho = Math.min(quadroW, quadroH) * 0.92;
        const x = quadroX + (quadroW - tamanho) / 2;
        const y = quadroY + (quadroH - tamanho) / 2;
        ctx.fillStyle = "#fff";
        ctx.fillRect(x, y, tamanho, tamanho);
        ctx.drawImage(qr, x, y, tamanho, tamanho);
      };
      qr.src = qrData;
    };
    base.src = "adesivo-porta-base.png";
  }

  document.getElementById("baixarQR").onclick = () => {
    const d = getQrDataUrl();
    if (!d) return alert("Gere o QR primeiro.");
    baixar("QR-ZAP.png", d);
  };
  document.getElementById("baixarCertificado").onclick = () => {
    const c = document.getElementById("certificadoCanvas");
    baixar("CERTIFICADO.png", c.toDataURL("image/png"));
  };
  document.getElementById("baixarSelo").onclick = () => {
    const c = document.getElementById("seloCanvas");
    baixar("SELO-OFICIAL.png", c.toDataURL("image/png"));
  };
  document.getElementById("baixarQrAzul").onclick = () => {
    const c = document.getElementById("qrAzulCanvas");
    baixar("QR-AZUL-OFICIAL.png", c.toDataURL("image/png"));
  };
  document.getElementById("baixarAdesivo").onclick = () => {
    const c = document.getElementById("adesivoCanvas");
    baixar("ADESIVO-PORTA.png", c.toDataURL("image/png"));
  };
  document.getElementById("baixarCertificadoOficial").onclick = () => {
    const c = document.getElementById("certificadoOficialCanvas");
    baixar("CERTIFICADO-OFICIAL-QRZAP.png", c.toDataURL("image/png"));
  };
});
