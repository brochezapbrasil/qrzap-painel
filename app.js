<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Kit QR Zap - Empresa Amiga</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
<style>
  body{font-family:Arial,sans-serif;background:#f5f3ff;padding:20px}
  #dadosEmpresa{background:#fff;padding:20px;border-radius:12px;max-width:500px;margin:0 auto 20px;box-shadow:0 4px 12px rgba(0,0,0,.1)}
  label{display:block;margin-top:15px;font-weight:bold;color:#4b1f9c}
  input, textarea{width:100%;padding:10px;margin-top:5px;border:1px solid #ddd;border-radius:8px;box-sizing:border-box}
  textarea{height:80px}
  #gerarKit{margin-top:20px;width:100%;padding:15px;background:#4b1f9c;color:#fff;border:none;border-radius:8px;font-size:16px;font-weight:bold;cursor:pointer}
  #gerarKit:hover{background:#3d247a}
  .preview{max-width:900px;margin:0 auto;background:#fff;padding:20px;border-radius:12px;display:flex;flex-wrap:wrap;gap:20px;justify-content:center}
  .kit-item{text-align:center;display:none;margin-top:20px}
  .kit-item canvas{max-width:100%;border:1px solid #eee;border-radius:8px}
  .kit-item button{margin-top:10px;padding:10px 15px;background:#00c950;color:#fff;border:none;border-radius:8px;cursor:pointer}
  #qrCode{display:flex;justify-content:center;margin-top:10px}
</style>
</head>
<body>

<div id="dadosEmpresa">
  <h2 style="color:#4b1f9c;margin:0 0 10px">Dados da Empresa</h2>
  
  <label>Nome da Empresa</label>
  <input type="text" id="empresa" placeholder="Ex: Mercado Central">

  <label>CNPJ da Empresa</label>
  <input type="text" id="cnpj" placeholder="00.000.000/0000-00" maxlength="18">

  <label>Data da Adesão</label>
  <input type="date" id="dataAdesao">

  <label>WhatsApp</label>
  <input type="text" id="whatsapp" placeholder="(18) 99999-9999">

  <label>Mensagem de acolhimento</label>
  <textarea id="mensagem" placeholder="Olá! Somos uma empresa parceira..."></textarea>

  <button id="gerarKit">Gerar Kit Completo</button>

  <div id="qrCode" style="margin-top:20px"></div>
  <p id="empresaPreview" style="text-align:center;font-weight:bold;margin-top:10px"></p>
  <p id="telefonePreview" style="text-align:center;color:#666"></p>
</div>

<div class="preview">
  <div id="certificadoSection" class="kit-item">
    <h3>Certificado Simples</h3>
    <canvas id="certificadoCanvas"></canvas><br>
    <button id="baixarCertificado">Baixar Certificado</button>
  </div>

  <div id="certificadoOficialSection" class="kit-item">
    <h3>Certificado Oficial</h3>
    <canvas id="certificadoOficialCanvas"></canvas><br>
    <button id="baixarCertificadoOficial">Baixar Oficial</button>
  </div>

  <div id="seloSection" class="kit-item">
    <h3>Selo Oficial</h3>
    <canvas id="seloCanvas"></canvas><br>
    <button id="baixarSelo">Baixar Selo</button>
  </div>

  <div id="qrAzulSection" class="kit-item">
    <h3>QR Azul</h3>
    <canvas id="qrAzulCanvas"></canvas><br>
    <button id="baixarQrAzul">Baixar QR Azul</button>
  </div>

  <div id="adesivoSection" class="kit-item">
    <h3>Adesivo Porta</h3>
    <canvas id="adesivoCanvas"></canvas><br>
    <button id="baixarAdesivo">Baixar Adesivo</button>
  </div>

  <div style="width:100%;text-align:center;margin-top:20px">
    <button id="baixarQR" style="background:#4b1f9c;padding:12px 20px;border-radius:8px;color:#fff;border:none;cursor:pointer">Baixar QR Puro</button>
  </div>
</div>

<script>
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

    gerarCertificado(empresa, cnpj, data);
    gerarCertificadoOficial(empresa, cnpj, data);

    document.getElementById("certificadoSection").style.display = "block";
    document.getElementById("certificadoOficialSection").style.display = "block";

    setTimeout(() => {
      gerarQrAzul();
      gerarSelo();
      gerarAdesivo();
    }, 800);
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

  function gerarCertificado(empresa, cnpj, data) {
    const canvas = document.getElementById("certificadoCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // === POSIÇÕES - ALTERE AQUI ===
      const xEmpresa = canvas.width / 2;
      const yEmpresa = canvas.height * 0.43;
      const xCnpj = canvas.width / 2;
      const yCnpj = canvas.height * 0.53;
      const xData = canvas.width / 2;
      const yData = canvas.height * 0.58;

      ctx.fillStyle = "#fff";
      ctx.fillRect(canvas.width * 0.18, canvas.height * 0.37, canvas.width * 0.64, canvas.height * 0.08);

      ctx.fillStyle = "#4b1f9c";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      let tamanhoFonte = 78;
      const larguraMaxima = canvas.width * 0.60;
      ctx.font = `bold ${tamanhoFonte}px "Brush Script MT", cursive`;
      while (ctx.measureText(empresa).width > larguraMaxima && tamanhoFonte > 30) {
        tamanhoFonte -= 2;
        ctx.font = `bold ${tamanhoFonte}px "Brush Script MT", cursive`;
      }
      ctx.fillText(empresa, xEmpresa, yEmpresa);

      ctx.fillStyle = "#333";
      ctx.font = `bold 26px Arial`;
      ctx.fillText(cnpj, xCnpj, yCnpj);

      ctx.font = `22px Arial`;
      ctx.fillText(data, xData, yData);
    };
    img.src = "certificado-base.png";
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

      // === POSIÇÕES - ALTERE AQUI ===
      const xEmpresa = canvas.width / 2;
      const yEmpresa = canvas.height * 0.43;
      const xCnpj = canvas.width / 2;
      const yCnpj = canvas.height * 0.58;
      const xData = canvas.width / 2;
      const yData = canvas.height * 0.63;

      ctx.fillStyle = "#3d247a";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      let tamanhoFonte = 78;
      const larguraMaxima = canvas.width * 0.78;
      ctx.font = `bold ${tamanhoFonte}px "Brush Script MT", cursive`;
      while (ctx.measureText(empresa).width > larguraMaxima && tamanhoFonte > 30) {
        tamanhoFonte -= 2;
        ctx.font = `bold ${tamanhoFonte}px "Brush Script MT", cursive`;
      }
      ctx.fillText(empresa, xEmpresa, yEmpresa);

      ctx.font = `bold 28px Arial`;
      ctx.fillText(cnpj, xCnpj, yCnpj);

      ctx.font = `24px Arial`;
      ctx.fillText(data, xData, yData);
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
        if (section) section.style.display = "block";
      };
      qr.src = qrData;
    };
    base.src = "selo-base-v2.png";
  }

  function gerarQrAzul() {
    const canvas = document.getElementById("qrAzulCanvas");
    const section = document.getElementById("qrAzulSection");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const base = new Image();
    base.onload = () => {
      canvas.width = base.width;
      canvas.height = base.height;
      ctx.drawImage(base, 0, 0, canvas.width, canvas.height);
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
        if (section) section.style.display = "block";
      };
      qrImg.src = qrDataUrl;
    };
    base.src = "qr-azul-base.png";
  }

  function gerarAdesivo() {
    const canvas = document.getElementById("adesivoCanvas");
    const section = document.getElementById("adesivoSection");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const base = new Image();
    base.onload = () => {
      canvas.width = base.width;
      canvas.height = base.height;
      ctx.drawImage(base, 0, 0);
      const qrData = getQrDataUrl();
      if (!qrData) {
        if (section) section.style.display = "block";
        return;
      }
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
        if (section) section.style.display = "block";
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
    if (!c || c.width === 0) return alert("Gere o kit primeiro.");
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
</script>
</body>
</html>
