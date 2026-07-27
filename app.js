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
    if (qrDiv) { qrDiv.innerHTML = ""; new QRCode(qrDiv, { text: link, width: 200, height: 200, correctLevel: QRCode.CorrectLevel.H }); }
    document.getElementById("empresaPreview").textContent = empresa;
    document.getElementById("telefonePreview").textContent = "WhatsApp: +" + telefone;
    gerarCertificado(empresa);
    setTimeout(() => { gerarQrAzul(); gerarSelo(); gerarAdesivo(); }, 900);
    document.getElementById("certificadoSection").style.display = "block";
  });

  function getQrDataUrl() {
    const c = document.querySelector("#qrCode canvas"); if (c) return c.toDataURL("image/png");
    const i = document.querySelector("#qrCode img"); if (i) return i.src; return null;
  }
  function baixar(n,d){ const a=document.createElement("a"); a.download=n; a.href=d; a.click(); }

  function gerarCertificado(empresa){
    const c=document.getElementById("certificadoCanvas"); if(!c) return; 
    const ctx=c.getContext("2d"); const img=new Image();
    img.onload=()=>{ c.width=img.width; c.height=img.height; ctx.drawImage(img,0,0); ctx.fillStyle="#fff"; ctx.fillRect(c.width*0.18,c.height*0.385,c.width*0.64,c.height*0.06); ctx.fillStyle="#4b1f9c"; ctx.font="bold 78px 'Brush Script MT', cursive"; ctx.textAlign="center"; ctx.fillText(empresa,c.width/2,c.height*0.43); };
    img.src="certificado-base.png";
  }

  function gerarCertificado(empresa){
  const c=document.getElementById("certificadoCanvas"); if(!c) return; 
  const ctx=c.getContext("2d"); const img=new Image();
  img.onload=()=>{
    c.width=img.width; c.height=img.height; ctx.drawImage(img,0,0);
    
    // nome da empresa
    ctx.fillStyle="#fff"; 
    ctx.fillRect(c.width*0.18,c.height*0.385,c.width*0.64,c.height*0.06); 
    ctx.fillStyle="#4b1f9c"; 
    ctx.font="bold 78px 'Brush Script MT', cursive"; 
    ctx.textAlign="center"; 
    ctx.fillText(empresa,c.width/2,c.height*0.43);

    function gerarCertificado(empresa){
    const c=document.getElementById("certificadoCanvas"); if(!c) return; 
    const ctx=c.getContext("2d"); const img=new Image();
    img.onload=()=>{ c.width=img.width; c.height=img.height; ctx.drawImage(img,0,0); ctx.fillStyle="#fff"; ctx.fillRect(c.width*0.18,c.height*0.385,c.width*0.64,c.height*0.06); ctx.fillStyle="#4b1f9c"; ctx.font="bold 78px 'Brush Script MT', cursive"; ctx.textAlign="center"; ctx.fillText(empresa,c.width/2,c.height*0.43); };
    img.src="certificado-base.png";
  img.src="certificado-base.png";
  }

  function gerarQrAzul(){
    const c=document.getElementById("qrAzulCanvas"); const s=document.getElementById("qrAzulSection"); if(!c) return;
    const ctx=c.getContext("2d"); const base=new Image();
    base.onload=()=>{
      c.width=base.width; c.height=base.height; ctx.drawImage(base,0,0,c.width,c.height);
      const qrSize=c.width*0.36; const qrX=(c.width-qrSize)/2; const qrY=(c.height-qrSize)/2 - (c.height*0.01);
      ctx.fillStyle="#fff"; ctx.fillRect(qrX,qrY,qrSize,qrSize);
      const d=getQrDataUrl(); if(!d) return; const qr=new Image();
      qr.onload=()=>{ ctx.drawImage(qr,qrX,qrY,qrSize,qrSize); if(s) s.style.display="block"; }; qr.src=d;
    }; base.src="qr-azul-base.png";
  }

  function gerarAdesivo(){
    const c=document.getElementById("adesivoCanvas"); const s=document.getElementById("adesivoSection"); if(!c) return;
    const ctx=c.getContext("2d"); const base=new Image();
    base.onload=()=>{
      c.width=base.width; c.height=base.height; ctx.drawImage(base,0,0);
      if(s) s.style.display="block";
      const d=getQrDataUrl(); if(!d) return;
      const qr=new Image();
      qr.onload=()=>{
        const tamanho = c.width * 0.281;
const x = c.width * 0.652;
const y = c.height * 0.156;
        ctx.fillStyle="#fff"; ctx.fillRect(x,y,tamanho,tamanho);
        ctx.drawImage(qr,x,y,tamanho,tamanho);
      };
      qr.src=d;
    };
    base.src="adesivo-porta-base.png";
  }

  document.getElementById("baixarQR").onclick = () => baixar("QR-ZAP.png", getQrDataUrl());
  document.getElementById("baixarCertificado").onclick = () => { const c=document.getElementById("certificadoCanvas"); baixar("CERTIFICADO.png", c.toDataURL("image/png")); };
  document.getElementById("baixarSelo").onclick = () => { const c=document.getElementById("seloCanvas"); baixar("SELO-OFICIAL.png", c.toDataURL("image/png")); };
  document.getElementById("baixarQrAzul").onclick = () => { const c=document.getElementById("qrAzulCanvas"); baixar("QR-AZUL-OFICIAL.png", c.toDataURL("image/png")); };
  document.getElementById("baixarAdesivo").onclick = () => { const c=document.getElementById("adesivoCanvas"); baixar("ADESIVO-PORTA.png", c.toDataURL("image/png")); };
});
