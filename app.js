document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("gerarKit");
  if (!btn) return;

  // ─── CONFIGURAÇÃO DO CONTADOR (GitHub) ───────────────────────────────────
  // Repositório onde fica o counter.json
  const REPO_OWNER = "brochezapbrasil";
  const REPO_NAME  = "qrzap-painel";
  const COUNTER_FILE = "counter.json";   // arquivo na raiz do repositório
  const ANO = new Date().getFullYear();  // ano atual para o serial

  // Lê o token que a Fran cola no campo da página
  function getToken() {
    const campo = document.getElementById("githubToken");
    return campo ? campo.value.trim() : "";
  }

  // Busca o counter.json no GitHub e retorna { contador, sha }
  async function lerContador() {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${COUNTER_FILE}`;
    const token = getToken();
    const headers = { "Accept": "application/vnd.github+json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const resp = await fetch(url, { headers });
    if (!resp.ok) {
      if (resp.status === 404) {
        // arquivo ainda não existe — começa do zero
        return { contador: 0, sha: null };
      }
      throw new Error("Erro ao ler contador: " + resp.status);
    }
    const json = await resp.json();
    const conteudo = JSON.parse(atob(json.content.replace(/\n/g, "")));
    return { contador: conteudo.contador || 0, sha: json.sha };
  }

  // Salva o novo valor de volta no counter.json
  async function salvarContador(novoValor, sha) {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${COUNTER_FILE}`;
    const token = getToken();
    if (!token) throw new Error("Token GitHub não informado.");

    const conteudo = btoa(JSON.stringify({ contador: novoValor }));
    const body = {
      message: `cert #${novoValor} emitido`,
      content: conteudo,
    };
    if (sha) body.sha = sha; // obrigatório pra atualizar arquivo existente

    const resp = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      const err = await resp.json();
      throw new Error("Erro ao salvar contador: " + (err.message || resp.status));
    }
  }

  // Monta o número serial formatado: QRZAP-2026-00007
  function formatarSerial(n) {
    return `QRZAP-${ANO}-${String(n).padStart(5, "0")}`;
  }
  // ─────────────────────────────────────────────────────────────────────────

  btn.addEventListener("click", async () => {
    const empresa    = document.getElementById("empresa")?.value.trim() || "";
    const cnpj       = document.getElementById("cnpj")?.value.trim() || "";
    const dataRaw    = document.getElementById("dataAdesao")?.value || "";
    const whatsappRaw = document.getElementById("whatsapp")?.value.trim() || "";
    const telefone   = whatsappRaw.replace(/\D/g, "");
    const mensagem   = document.getElementById("mensagem")?.value.trim() || "";

    if (!empresa || !cnpj || !dataRaw || !telefone || !mensagem) {
      alert("Preencha todos os campos.");
      return;
    }

    // ── Incrementa o contador antes de gerar ──────────────────────────────
    btn.disabled = true;
    btn.textContent = "Gerando número...";
    let serial = "QRZAP-" + ANO + "-?????"; // fallback se der erro

    try {
      const { contador, sha } = await lerContador();
      const novo = contador + 1;
      await salvarContador(novo, sha);
      serial = formatarSerial(novo);
    } catch (e) {
      // Se não tiver token ou der erro, avisa mas não bloqueia a geração
      console.warn("Contador não atualizado:", e.message);
      const semToken = !getToken();
      if (semToken) {
        alert("⚠️ Token GitHub não informado — certificado gerado SEM número serial automático.\n\nCole seu token no campo acima para ativar o contador.");
      } else {
        alert("⚠️ Não foi possível atualizar o contador:\n" + e.message + "\n\nO certificado será gerado sem número serial.");
      }
    } finally {
      btn.disabled = false;
      btn.textContent = "Gerar Kit";
    }
    // ──────────────────────────────────────────────────────────────────────

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
    gerarCertificadoOficial(empresa, cnpj, data, serial);

    document.getElementById("certificadoSection").style.display = "block";
    document.getElementById("certificadoOficialSection").style.display = "block";
    document.getElementById("seloSection").style.display = "block";
    document.getElementById("qrAzulSection").style.display = "block";
    document.getElementById("adesivoSection").style.display = "block";

    setTimeout(() => { gerarQrAzul(); gerarSelo(); gerarAdesivo(); }, 1000);
  });

  // ── Funções de geração (sem alteração exceto gerarCertificadoOficial) ────

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

  // ── gerarCertificadoOficial — agora recebe e imprime o serial ────────────
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

      // apaga faixa do placeholder de nome e linha acima
      ctx.fillStyle = "#fff";
      ctx.fillRect(xEmpresa - 600, 395, 1200, 70);

      // linha separadora removida

      // nome da empresa
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

      // data e CNPJ
      const xData = 404;
      const yData = 688;
      const xCnpj = 817;
      const yCnpj = 688;
      ctx.fillStyle = "#000";
      ctx.font = "bold 16px Arial";
      ctx.fillText(data, xData, yData);
      ctx.fillText(cnpj, xCnpj, yCnpj);

      // ── NÚMERO SERIAL — imprime junto ao CT- do template ──────────────
      // A caixinha "CÓDIGO DO DOCUMENTO / CT-" já existe na arte
      // Só precisamos escrever o número após o CT-
      ctx.fillStyle = "#1A2340";
      ctx.textAlign = "left";
      ctx.font = "bold 16px Arial";
      ctx.fillText(serial, 1055, 848);
      // ──────────────────────────────────────────────────────────────────
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

  // ── Botões de download (sem alteração) ───────────────────────────────────
  document.getElementById("baixarQR").onclick = () => {
    const d = getQrDataUrl();
    if (!d) return alert("Gere o QR primeiro.");
    baixar("QR-ZAP.png", d);
  };
  document.getElementById("baixarCertificado").onclick = () => {
    baixar("CERTIFICADO.png", document.getElementById("certificadoCanvas").toDataURL("image/png"));
  };
  document.getElementById("baixarSelo").onclick = () => {
    baixar("SELO-QRZAP.png", document.getElementById("seloCanvas").toDataURL("image/png"));
  };
  document.getElementById("baixarQrAzul").onclick = () => {
    baixar("QR-AZUL.png", document.getElementById("qrAzulCanvas").toDataURL("image/png"));
  };
  document.getElementById("baixarAdesivo").onclick = () => {
    baixar("ADESIVO-PORTA.png", document.getElementById("adesivoCanvas").toDataURL("image/png"));
  };
  document.getElementById("baixarCertificadoOficial").onclick = () => {
    baixar("CERTIFICADO-ADESAO-QRZAP.png", document.getElementById("certificadoOficialCanvas").toDataURL("image/png"));
  };
});
