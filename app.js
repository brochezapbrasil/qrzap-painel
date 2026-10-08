document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("gerarKit");
  if (!btn) return;

  // ─── IDIOMAS (i18n-painel.js) ─────────────────────────────────────────────
  const I18N = window.QRZAP_I18N;
  const T = (k) => (I18N ? I18N.t(k) : k);
  const idioma = () => (I18N ? I18N.lang() : "pt");

  let estado = "normal";   // "normal" | "busy" | "locked"
  let avisoEl = null;
  let msgEditada = false;
  let ultimoKit = null;   // dados do último kit gerado (para regerar ao trocar idioma)

  function atualizarBtn() {
    if (estado === "locked") btn.textContent = T("btnBloq");
    else if (estado === "busy") btn.textContent = T("btnGerando");
    else btn.textContent = T("btnGerar");
  }

  function renderAviso() {
    if (!avisoEl) return;
    avisoEl.innerHTML = `
      <p>🔒 <strong>${T("avisoT1")}</strong></p>
      <p>${T("avisoT2")}</p>
      <p><a href="https://qrzap-falecomigo.com.br" style="color:#1A2340;font-weight:bold;">qrzap-falecomigo.com.br</a></p>
      <p style="font-size:13px;color:#666;margin-top:10px;">${T("avisoT3")} <strong>contato@qrzap-falecomigo.com.br</strong></p>
    `;
  }

  const msgBox = document.getElementById("mensagem");
  if (msgBox) msgBox.addEventListener("input", () => { msgEditada = true; });
  function aplicarMensagemPadrao() {
    if (msgBox && !msgEditada) msgBox.value = T("msgPadrao");
  }

  // ─── CONFIGURAÇÃO DO CONTADOR (JSONBin.io) ────────────────────────────────
  const JSONBIN_ID  = "6a78cab0f5f4af5e29ff6ad2";
  const JSONBIN_KEY = "$2a$10$vTm6uZ/N4TIQ0zf9twTwqOyCGm2slLg21OJnJVaVYB6p6xEEF1uSu";
  const ANO = new Date().getFullYear();

  // ─── CONTROLE DE DOWNLOADS (localStorage) ────────────────────────────────
  const ITENS = ["qr","certificado","certificadoOficial","selo","qrAzul","adesivo"];
  const CHAVE = "qrzap_kit_concluido";
  // Modo teste: abra a página com ?teste=1 no final do endereço para ignorar o bloqueio
  const MODO_TESTE = new URLSearchParams(location.search).has("teste");

  function marcarDownload(item) {
    const dados = JSON.parse(localStorage.getItem(CHAVE) || "{}");
    dados[item] = true;
    localStorage.setItem(CHAVE, JSON.stringify(dados));
    verificarConcluido();
  }

  function verificarConcluido() {
    if (MODO_TESTE) return;
    const dados = JSON.parse(localStorage.getItem(CHAVE) || "{}");
    const todos = ITENS.every(i => dados[i]);
    if (todos) {
      bloquearPainel();
    }
  }

  function bloquearPainel() {
    estado = "locked";
    btn.disabled = true;
    atualizarBtn();
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
    if (!avisoEl) {
      avisoEl = document.createElement("div");
      avisoEl.style.cssText = `
        background:#fff3cd;
        border:2px solid #ffc107;
        border-radius:12px;
        padding:20px;
        margin:20px 0;
        text-align:center;
        font-size:15px;
        color:#333;
      `;
      btn.parentNode.insertBefore(avisoEl, btn.nextSibling);
    }
    renderAviso();
  }

  // Quando a pessoa troca de idioma, atualiza os textos montados pelo código
  function atualizarIdioma() {
    atualizarBtn();
    renderAviso();
    aplicarMensagemPadrao();
    regerarImagens();   // recarrega as imagens-base no novo idioma
  }
  if (I18N) I18N.onChange(atualizarIdioma);
  atualizarIdioma();

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
    if (todos && !MODO_TESTE) {
      alert(T("alertBloq"));
      return;
    }

    const empresa     = document.getElementById("empresa")?.value.trim() || "";
    const cnpj        = document.getElementById("cnpj")?.value.trim() || "";
    const dataRaw     = document.getElementById("dataAdesao")?.value || "";
    const whatsappRaw = document.getElementById("whatsapp")?.value.trim() || "";
    const telefone    = whatsappRaw.replace(/\D/g, "");
    const mensagem    = document.getElementById("mensagem")?.value.trim() || "";

    if (!empresa || !cnpj || !dataRaw || !telefone || !mensagem) {
      alert(T("alertCampos"));
      return;
    }

    btn.disabled = true;
    estado = "busy";
    atualizarBtn();
    let serial = "QRZAP-" + ANO + "-?????";

    try {
      const atual = await lerContador();
      const novo  = atual + 1;
      await salvarContador(novo);
      serial = formatarSerial(novo);
    } catch (e) {
      console.warn("Contador não atualizado:", e.message);
      alert(T("alertContador"));
    } finally {
      btn.disabled = false;
      estado = "normal";
      atualizarBtn();
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

    ultimoKit = { empresa, cnpj, data, serial };

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

  // Nomes dos arquivos-base por idioma (quando diferem do padrão "nome-idioma.png").
  // Se o arquivo do idioma não existir, cai para o português.
  const BASES = {
    "certificado-base":    { en: "certificado.base-en.png",    es: "certificado.base-es.png" },
    "certificado-oficial": { en: "certificado.oficial-en.png", es: "certificado.oficial-es.png" },
    "selo-base-v2":        { en: "selo-base-en.png",           es: "selo-base-es.png" },
    "qr-azul-base":        { en: "qr-azul-base-en.png",        es: "qr-azul-base-es.png" },
    "adesivo-porta-base":  { en: "adesivo.porta-en.png",       es: "adesivo.porta-es.png" }
  };

  function setBase(img, nome, query) {
    query = query || "";
    const L = idioma();
    if (L === "pt") { img.src = nome + ".png" + query; return; }
    const arquivo = (BASES[nome] && BASES[nome][L]) || (nome + "-" + L + ".png");
    // ?v=... evita que o navegador/GitHub Pages sirva imagem em cache
    const q = query || ("?v=" + Date.now());
    img.onerror = () => {
      img.onerror = null;
      console.warn("[QR ZAP] imagem não encontrada:", arquivo, "→ usando português");
      img.src = nome + ".png" + query;
    };
    console.log("[QR ZAP] carregando", arquivo, "(" + L + ")");
    img.src = arquivo + q;
  }

  // Redesenha tudo que já foi gerado, usando as imagens do idioma atual
  function regerarImagens() {
    if (!ultimoKit) return;            // ainda não gerou o kit
    const k = ultimoKit;
    gerarCertificado(k.empresa);
    gerarCertificadoOficial(k.empresa, k.cnpj, k.data, k.serial);
    gerarQrAzul();
    gerarSelo();
    gerarAdesivo();
  }

  // Coloca o QR Code no quadradinho tracejado do logo (canto superior esquerdo do certificado)
  function colocarQrNoCertificado(canvas, tentativa) {
    tentativa = tentativa || 0;
    const qrData = getQrDataUrl();
    if (!qrData) {                       // o QR pode ainda estar sendo desenhado
      if (tentativa < 6) setTimeout(() => colocarQrNoCertificado(canvas, tentativa + 1), 500);
      return;
    }
    const qr = new Image();
    qr.onload = () => {
      const ctx = canvas.getContext("2d");
      const W = canvas.width, H = canvas.height;
      const cx = W * 0.1217, cy = H * 0.138;   // centro do quadradinho
      const fundo = W * 0.076;                 // fundo branco (cobre o tracejado)
      const lado  = W * 0.068;                 // tamanho do QR
      ctx.fillStyle = "#fff";
      ctx.fillRect(cx - fundo / 2, cy - fundo / 2, fundo, fundo);
      ctx.drawImage(qr, cx - lado / 2, cy - lado / 2, lado, lado);
    };
    qr.src = qrData;
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
      colocarQrNoCertificado(canvas);
    };
    setBase(img, "certificado-base");
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

      // ── EN / ES: posições medidas na imagem 1824x1200 (em frações, valem p/ qualquer tamanho)
      if (idioma() !== "pt") {
        const W = canvas.width, H = canvas.height;
        const k = W / 1824;                       // escala das fontes
        const azul = "#0a2a4a";

        // Nome da empresa: sobre a linha (linha em y≈477), sem encostar no título
        ctx.fillStyle = "#fff";
        ctx.fillRect(W * 0.15, H * 0.350, W * 0.70, H * 0.040);   // y 420–468
        ctx.fillStyle = azul;
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        let tam = 46 * k;
        ctx.font = `bold ${tam}px Arial`;
        while (ctx.measureText(empresa).width > W * 0.62 && tam > 22 * k) {
          tam -= 1;
          ctx.font = `bold ${tam}px Arial`;
        }
        ctx.fillText(empresa, W * 0.5, H * 0.388);                // baseline y≈466

        // Data e CNPJ: sobre as linhas "Fecha de adhesión" / "ID de empresa" (linhas em y≈853)
        ctx.fillStyle = "#000";
        ctx.font = `bold ${26 * k}px Arial`;
        ctx.fillText(data, W * 0.265, H * 0.7025);                // centro da linha da data
        ctx.font = `bold ${24 * k}px Arial`;
        ctx.fillText(cnpj, W * 0.55, H * 0.7025);                 // à direita do ícone do prédio

        // Código do documento: continua o "CT-" do quadro
        ctx.fillStyle = "#1A2340";
        ctx.textAlign = "left";
        ctx.font = `bold ${28 * k}px Arial`;
        const x001 = W * 0.7752;                                  // logo após "CT-"
        const yCod = H * 0.821;
        ctx.fillText("001", x001, yCod);
        const larg001 = ctx.measureText("001").width;
        let tamS = 15 * k;
        ctx.font = `bold ${tamS}px Arial`;
        const xS = x001 + larg001 + 12 * k;
        while (xS + ctx.measureText(serial).width > W * 0.895 && tamS > 9 * k) {
          tamS -= 0.5;
          ctx.font = `bold ${tamS}px Arial`;
        }
        ctx.fillText(serial, xS, yCod);
        colocarQrNoCertificado(canvas);
        return;
      }

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
      colocarQrNoCertificado(canvas);
    };
    setBase(img, "certificado-oficial", "?v=" + Date.now());
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
        // Tamanho do QR (fração da largura) e quanto sobe (fração da altura), por idioma
        const L = idioma();
        // t = tamanho | sobe = quanto sobe | dx = quanto vai p/ a direita (frações)
        const C = L === "pt" ? { t: 0.45,  sobe: 0.055, dx: 0 }
                : L === "es" ? { t: 0.425, sobe: 0.03,  dx: 0 }       // ES: um pouco menor
                :              { t: 0.40,  sobe: 0.045, dx: 0.02 };   // EN: menor, mais alto e p/ a direita
        const tamanho = canvas.width * C.t;
        const x = (canvas.width - tamanho) / 2 + canvas.width * C.dx;
        const y = (canvas.height - tamanho) / 2 - canvas.height * C.sobe;
        ctx.fillStyle = "#fff";
        ctx.fillRect(x - 6, y - 6, tamanho + 12, tamanho + 12);
        ctx.drawImage(qr, x, y, tamanho, tamanho);
      };
      qr.src = qrData;
    };
    setBase(base, "selo-base-v2");
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
    setBase(base, "qr-azul-base");
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
        // Posição da moldura tracejada do QR (fração da largura/altura da imagem)
        const M = idioma() === "pt"
          ? { x: 0.645, y: 0.060, w: 0.324, h: 0.652 }
          : { x: 0.692, y: 0.157, w: 0.278, h: 0.396 };   // EN/ES
        const quadroX = canvas.width * M.x;
        const quadroY = canvas.height * M.y;
        const quadroW = canvas.width * M.w;
        const quadroH = canvas.height * M.h;
        // Ajuste extra só para EN: QR maior (escala) e mais alto (sobe)
        const Li = idioma();
        const E = Li === "en" ? { escala: 1.3,  sobe: 0.02 }
                : Li === "es" ? { escala: 1.15, sobe: 0 }      // ES: QR maior
                :               { escala: 1,    sobe: 0 };
        const tamanho = Math.min(quadroW, quadroH) * 0.92 * E.escala;
        const x = quadroX + (quadroW - tamanho) / 2;
        const y = quadroY + (quadroH - tamanho) / 2 - canvas.height * E.sobe;
        ctx.fillStyle = "#fff";
        ctx.fillRect(x, y, tamanho, tamanho);
        ctx.drawImage(qr, x, y, tamanho, tamanho);
      };
      qr.src = qrData;
    };
    setBase(base, "adesivo-porta-base");
  }

  // ── Botões de download ───────────────────────────────────────────────────
  document.getElementById("baixarQR").onclick = () => {
    const d = getQrDataUrl();
    if (!d) return alert(T("alertGereQR"));
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
