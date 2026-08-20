document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("gerarKit");
  if (!btn) return;

  // ─── CONFIGURAÇÃO DO CONTADOR (JSONBin.io) ────────────────────────────────
  const JSONBIN_ID  = "6a78cab0f5f4af5e29ff6ad2";
  const JSONBIN_KEY = "$2a$10$vTm6uZ/N4TIQ0zf9twTwqOyCGm2slLg21OJnJVaVYB6p6xEEF1uSu";
  const ANO = new Date().getFullYear();

  // ─── CONTROLE DE DOWNLOADS (localStorage) ────────────────────────────────
  const ITENS = ["qr","certificado","certificadoOficial","selo","qrAzul","adesivo"];
  const CHAVE = "qrzap_kit_concluido";

  function marcarDownload(item) {
    const dados = JSON.parse(localStorage.getItem(CHAVE) || "{}");
    dados[item] = true;
    localStorage.setItem(CHAVE, JSON.stringify(dados));
    verificarConcluido();
  }

  function verificarConcluido() {
    const dados = JSON.parse(localStorage.getItem(CHAVE) || "{}");
    const todos = ITENS.every(i => dados[i]);
    if (todos) {
      bloquearPainel();
    }
  }

  function bloquearPainel() {
    btn.disabled = true;
    btn.textContent = "🔒 Kit já gerado";
    btn.style.backgroundColor = "#999";
    btn.style.cursor = "not-allowed";

    // Travar todos os botões de download
    ["baixarQR","baixarCertificado","baixarCertificadoOficial",
     "baixarSelo","baixarQrAzul","baixarAdesivo"].forEach(id => {
      const b = document.getElementById(id);
      if (b) {
        b.disabled = true;
        b.style.opacity = "0.4";
        b.style.cursor = "not-allowed";
      }
    });

    // Mostrar aviso
    const aviso = document.createElement("div");
    aviso.style.cssText = `
      background:#fff3cd;
      border:2px solid #ffc107;
      border-radius:12px;
      padding:20px;
      margin:20px 0;
      text-align:center;
      font-size:15px;
      color:#333;
    `;
    aviso.innerHTML = `
      <p>🔒 <strong>Seu Kit Digital já foi gerado e baixado.</strong></p>
      <p>Para gerar um novo kit, realize uma nova assinatura em:</p>
      <p><a href="https://qrzap-falecomigo.com.br" style="color:#1A2340;font-weight:bold;">qrzap-falecomigo.com.br</a></p>
      <p style="font-size:13px;color:#666;margin-top:10px;">Dúvidas? Entre em contato: <strong>contato@qrzap-falecomigo.com.br</strong></p>
    `;
    btn.parentNode.insertBefore(aviso, btn.nextSibling);
  }

  // Verificar ao carregar a página
  verificarConcluido();

  // ─────────────────────────────────────────────────────────────────────────

  async function lerContador() {
    const resp = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`, {
      headers: { "X-Master-Key": JSONBIN_KEY }
    });
    if (!resp.ok) throw new Error("Erro ao ler contador: " + resp.status);
    const json = await resp.json();
    return json.record.contador || 0;
  }

  async function salvarContador(novoValor) {
    const resp = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": JSONBIN_KEY
      },
      body: JSON.stringify({ contador: novoValor })
    });
    if (!resp.ok) throw new Error("Erro ao salvar contador: " + resp.status);
  }

  function formatarSerial(n) {
    return `QRZAP-${ANO}-${String(n).padStart(5, "0")}`;
  }

  btn.addEventListener("click", async () => {
    // Verificar se kit já foi concluído
    const dados = JSON.parse(localStorage.getItem(CHAVE) || "{}");
    const todos = ITENS.every(i => dados[i]);
    if (todos) {
      alert("🔒 Seu Kit Digital já foi gerado.\nPara novo kit acesse: qrzap-falecomigo.com.br");
      return;
    }

    const empresa     = document.getElementById("empresa")?.value.trim() || "";
    const cnpj        = document.getElementById("cnpj")?.value.trim() || "";
    const dataRaw     = document.getElementById("dataAdesao")?.value || "";
    const whatsappRaw = document.getElementById("whatsapp")?.value.trim() || "";
    const telefone    = whatsappRaw.replace(/\D/g, "");
    const mensagem    = document.getElementById("mensagem")?.value.trim() || "";

    if (!empresa || !cnpj || !dataRaw || !telefone || !mensagem) {
      alert("Preencha todos os campos.");
      return;
    }

    btn.disabled = true;
    btn.textContent = "Gerando número...";
    let serial = "QRZAP-" + ANO + "-?????";

    try {
      const atual = await lerContador();
      const novo  = atual + 1;
      await salvarContador(novo);
      serial = formatarSerial(novo);
    } catch (e) {
      console.warn("Contador não atualizado:", e.message);
      alert("⚠️ Não foi possível atualizar o contador.\nO certificado será gerado sem número serial.");
    } finally {
      btn.disabled = false;
      btn.textContent = "Gerar Kit";
    }

    const data  = dataRaw.split("-").reverse().join("/");
    const link  = "https://wa.me/" + telefone + "?text=" + encodeURIComponent(mensagem);

    const qrDiv = document.getElementById("qrCode");
    if (qrDiv) {
      qrDiv.innerHTML = "";
      new QRCode(qrDiv, { text: link, width: 300, height: 300, correctLevel: QRCode.CorrectLevel.H });
    }

    document.getElementById("empresaPreview").textContent = empresa;
    document.getElementById("telefonePreview").textContent = "WhatsApp: +" + telefone;

    gerarCertificado(empresa);
    gerarCertificadoOficial(empresa, cnpj, data, serial);

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

  function baixar(nome, dataUrl, itemChave) {
    const a = document.createElement("a");
    a.download = nome;
    a.href = dataUrl;
    a.click();
    if (itemChave) marcarDownload(itemChave);
  }

  function gerarCertificado(empresa) {
    const canvas = document.getElementById("certificadoCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      ctx.fillStyle = "#fff";
      ctx.fillRect(canvas.width * 0.10, canvas.height * 0.355, canvas.width * 0.80, canvas.height * 0.11);
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
      ctx.fillText(empresa, canvas.width / 2, canvas.height * 0.43);
    };
    img.src = "certificado-base.png";
  }

  function gerarCertificadoOficial(empresa, cnpj, data, serial) {
    const canvas = document.getElementById("certificadoOficialCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const xEmpresa = canvas.width / 2;
      ctx.fillStyle = "#fff";
      ctx.fillRect(xEmpresa - 600, 395, 1200, 70);

      const yEmpresa = 438;
      ctx.fillStyle = "#0a2a4a";
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      let tamanho = 28;
      ctx.font = `bold ${tamanho}px Arial`;
      while (ctx.measureText(empresa).width > 680 && tamanho > 16) {
        tamanho--;
        ctx.font = `bold ${tamanho}px Arial`;
      }
      ctx.fillText(empresa, xEmpresa, yEmpresa);

      const xData = 404;
      const yData = 715;
      const xCnpj = 817;
      const yCnpj = 715;
      ctx.fillStyle = "#000";
      ctx.font = "bold 16px Arial";
      ctx.fillText(data, xData, yData);
      ctx.fillText(cnpj, xCnpj, yCnpj);

      ctx.fillStyle = "#1A2340";
      ctx.textAlign = "left";
      ctx.font = "bold 20px Arial";
      ctx.fillText("001", 1210, 835);

      ctx.font = "bold 16px Arial";
      ctx.fillText(serial, 1153, 855);
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
        const y = (canvas.height - tamanho) / 2 - canvas.height * 0.055;
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
      const qrY = (canvas.height - qrSize) / 2 - canvas.height * 0.06;
      ctx.fillStyle = "#fff";
      ctx.fillRect(qrX, qrY, qrSize, qrSize);
      const qrDataUrl = getQrDataUrl();
      if (!qrDataUrl) return;
      const qrImg = new Image();
      qrImg.onload = () => { ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize); };
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
        const quadroX = canvas.width * 0.645;
        const quadroY = canvas.height * 0.060;
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

  // ── Botões de download ───────────────────────────────────────────────────
  document.getElementById("baixarQR").onclick = () => {
    const d = getQrDataUrl();
    if (!d) return alert("Gere o QR primeiro.");
    baixar("QR-ZAP.png", d, "qr");
  };
  document.getElementById("baixarCertificado").onclick = () => {
    baixar("CERTIFICADO.png", document.getElementById("certificadoCanvas").toDataURL("image/png"), "certificado");
  };
  document.getElementById("baixarSelo").onclick = () => {
    baixar("SELO-QRZAP.png", document.getElementById("seloCanvas").toDataURL("image/png"), "selo");
  };
  document.getElementById("baixarQrAzul").onclick = () => {
    baixar("QR-AZUL.png", document.getElementById("qrAzulCanvas").toDataURL("image/png"), "qrAzul");
  };
  document.getElementById("baixarAdesivo").onclick = () => {
    baixar("ADESIVO-PORTA.png", document.getElementById("adesivoCanvas").toDataURL("image/png"), "adesivo");
  };
  document.getElementById("baixarCertificadoOficial").onclick = () => {
    baixar("CERTIFICADO-ADESAO-QRZAP.png", document.getElementById("certificadoOficialCanvas").toDataURL("image/png"), "certificadoOficial");
  };
});
