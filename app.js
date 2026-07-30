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
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        ctx.fillStyle = "#fff";
        ctx.fillRect(
            canvas.width * 0.18,
            canvas.height * 0.370,
            canvas.width * 0.64,
            canvas.height * 0.08
        );

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

ctx.fillText(
    empresa,
    canvas.width / 2,
    canvas.height * 0.43
);
    };

    img.src = "certificado-base.png";
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
    if (!qrData) { if(section) section.style.display="block"; return; }
    
    const qr = new Image();
    qr.onload = () => {
      // MEDIDA EXATA DA SUA BASE FINAL "ACESSIBILIDADE PARA TODOS"
      const quadroX = canvas.width * 0.632;
      const quadroY = canvas.height * 0.078;
      const quadroW = canvas.width * 0.324;
      const quadroH = canvas.height * 0.652;

      // 1. Limpa tudo que tava por baixo do branco
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(quadroX, quadroY, quadroW, quadroH);

      // 2. QR com respiro de 7% centralizado vertical e horizontal
      const padding = quadroW * 0.07;
      const tamanho = quadroW - (padding * 2);
      const x = quadroX + padding;
      const y = quadroY + (quadroH - tamanho) / 2; // ISSO QUE CORRIGE SEU ERRO DO PRINT

      ctx.drawImage(qr, x, y, tamanho, tamanho);
      
      // 3. Redesenha borda verde por cima pra ficar perfeita
      ctx.strokeStyle = "#1a9d5f";
      ctx.lineWidth = canvas.width * 0.008;
      ctx.lineJoin = "round";
      ctx.strokeRect(quadroX, quadroY, quadroW, quadroH);
      
      if (section) section.style.display = "block";
    }; 
    qr.src = qrData;
  }; 
  base.src = "adesivo-porta-base.png"; // usa a base limpa que te mandei
}
}

  function gerarSelo() {
    const canvas = document.getElementById("seloCanvas"); const section = document.getElementById("seloSection");
    if (!canvas) return; const ctx = canvas.getContext("2d"); const base = new Image();
    base.onload = () => {
      canvas.width = base.width; canvas.height = base.height; ctx.drawImage(base, 0, 0);
      const qrData = getQrDataUrl(); if (!qrData) return; const qr = new Image();
      qr.onload = () => {
        const tamanho = canvas.width * 0.22; const x = (canvas.width - tamanho)/2; const y = canvas.height * 0.19;
        ctx.fillStyle = "#fff"; ctx.fillRect(x-2, y-2, tamanho+4);
        ctx.drawImage(qr, x, y, tamanho, tamanho);
        if (section) section.style.display = "block";
      }; qr.src = qrData;
    }; base.src = "selo-base.png";
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
    if (!qrData) { if(section) section.style.display="block"; return; }
    
    const qr = new Image();
    qr.onload = () => {
      // ===== MEDIDAS CERTAS DO QUADRO VERDE - BASE FINAL =====
      const quadroX = canvas.width * 0.632;  // início na horizontal
      const quadroY = canvas.height * 0.082; // início na vertical
      const quadroW = canvas.width * 0.324;  // largura do quadro
      const quadroH = canvas.height * 0.648; // altura do quadro
      const raio = canvas.width * 0.015;     // arredondado
      const borda = canvas.width * 0.007;    // espessura da borda verde

      // 1. Limpa a área (remove qualquer sujeira que tinha por baixo)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(quadroX, quadroY, quadroW, quadroH);

      // 2. Desenha o quadro verde por cima, na medida certa
      ctx.strokeStyle = "#1a9d5f"; // verde do BrocheZap
      ctx.lineWidth = borda;
      ctx.beginPath();
      ctx.roundRect(quadroX, quadroY, quadroW, quadroH, raio);
      ctx.stroke();

      // 3. QR centralizado dentro do quadro com respiro de 8%
      const respiro = 0.08;
      const qrTamanho = Math.min(quadroW, quadroH) * (1 - respiro*2);
      const qrX = quadroX + (quadroW - qrTamanho) / 2;
      const qrY = quadroY + (quadroH - qrTamanho) / 2;

      ctx.drawImage(qr, qrX, qrY, qrTamanho, qrTamanho);
      
      if (section) section.style.display = "block";
    }; 
    qr.src = qrData;
  }; 
  base.src = "adesivo-porta-base.png";
}
  }

  function gerarAdesivo() {
    const canvas = document.getElementById("adesivoCanvas"); const section = document.getElementById("adesivoSection");
    if (!canvas) return; const ctx = canvas.getContext("2d"); const base = new Image();
    base.onload = () => {
      canvas.width = base.width; canvas.height = base.height; ctx.drawImage(base, 0, 0);
      const qrData = getQrDataUrl(); if (!qrData) { section.style.display="block"; return; }
      const qr = new Image();
      qr.onload = () => {
const tamanho = canvas.width * 0.2344;
const x = canvas.width * 0.7031;
const y = canvas.height * 0.1328;
        ctx.fillStyle = "#fff"; ctx.fillRect(x-2, y-2, tamanho+4, tamanho+4);
        ctx.drawImage(qr, x, y, tamanho, tamanho);
        if (section) section.style.display = "block";
      }; qr.src = qrData;
    }; base.src = "adesivo-porta-base.png";
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
