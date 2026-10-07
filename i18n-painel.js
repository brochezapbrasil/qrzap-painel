/* QR ZAP Painel – idiomas (pt / en / es).
   Carregue ANTES do app.js:  <script defer src="i18n-painel.js"></script> */
(function(){
  var SUP=["pt","en","es"], IDX={pt:0,en:1,es:2};
  var HTML_LANG={pt:"pt-BR",en:"en",es:"es"};
  var D={
    title:["QR ZAP - Painel","QR ZAP - Panel","QR ZAP - Panel"],
    painelAdmin:["Painel Administrativo","Admin Panel","Panel Administrativo"],
    bemVindo:["🎉 Bem-vindo ao Kit Digital QR ZAP","🎉 Welcome to the QR ZAP Digital Kit","🎉 Bienvenido al Kit Digital QR ZAP"],
    bemVindoTxt:["Preencha os dados da empresa abaixo para personalizar seu Kit Digital QR ZAP. Após o preenchimento, os arquivos serão gerados automaticamente para download..","Fill in your company details below to personalize your QR ZAP Digital Kit. Once you finish, the files are generated automatically for download.","Complete los datos de su empresa a continuación para personalizar su Kit Digital QR ZAP. Una vez completados, los archivos se generan automáticamente para descargar."],
    item1:["✓ Certificado QR ZAP","✓ QR ZAP Certificate","✓ Certificado QR ZAP"],
    item2:["✓ Selo QR ZAP","✓ QR ZAP Seal","✓ Sello QR ZAP"],
    item3:["✓ Plaquinha QR Azul","✓ Blue QR Sign","✓ Placa QR Azul"],
    item4:["✓ Adesivo QR ZAP","✓ QR ZAP Sticker","✓ Adhesivo QR ZAP"],
    preencha:["⬇️ Preencha os dados abaixo para personalizar os arquivos.","⬇️ Fill in the details below to personalize the files.","⬇️ Complete los datos a continuación para personalizar los archivos."],
    notaIdioma:["","Note: the generated files (certificate, seal, sign and sticker) are currently issued in Portuguese.","Nota: los archivos generados (certificado, sello, placa y adhesivo) se emiten actualmente en portugués."],
    parabens:["🎉 Parabéns por adquirir o Kit Digital QR ZAP!","🎉 Congratulations on getting the QR ZAP Digital Kit!","🎉 ¡Felicitaciones por adquirir el Kit Digital QR ZAP!"],
    lema:["Comunicar é um direito. Incluir é uma escolha. Acolher é um compromisso.","Communicating is a right. Including is a choice. Welcoming is a commitment.","Comunicarse es un derecho. Incluir es una elección. Acoger es un compromiso."],
    dadosEmpresa:["Dados da Empresa","Company Details","Datos de la Empresa"],
    lblEmpresa:["Nome da Empresa","Company Name","Nombre de la Empresa"],
    phEmpresa:["Ex.: Farmácia Central","E.g.: Central Pharmacy","Ej.: Farmacia Central"],
    lblCnpj:["CNPJ da Empresa","Company tax ID (CNPJ in Brazil)","Identificación fiscal de la empresa (CNPJ en Brasil)"],
    phCnpj:["00.000.000/0000-00","Tax ID number","Número de identificación fiscal"],
    lblData:["Data da Adesão","Date of Joining","Fecha de Adhesión"],
    lblWhats:["WhatsApp","WhatsApp","WhatsApp"],
    hintWhats:["Com o código do país, só números. Ex.: 55 + DDD + número.","With the country code, digits only. E.g.: 1 + area code + number.","Con el código del país, solo números. Ej.: 34 + número."],
    lblMsg:["Mensagem de acolhimento","Welcome message","Mensaje de bienvenida"],
    msgPadrao:["Olá! Estou neste estabelecimento e prefiro me comunicar por mensagem. Por favor, responda por este chat para que possamos conversar. Obrigado(a)!","Hello! I'm at this establishment and I prefer to communicate by message. Please reply in this chat so we can talk. Thank you!","¡Hola! Estoy en este establecimiento y prefiero comunicarme por mensaje. Por favor, responda por este chat para que podamos conversar. ¡Gracias!"],
    btnGerar:["Gerar Kit","Generate Kit","Generar Kit"],
    btnGerando:["Gerando número...","Generating number...","Generando número..."],
    btnBloq:["🔒 Kit já gerado","🔒 Kit already generated","🔒 Kit ya generado"],
    preview:["Pré-visualização","Preview","Vista previa"],
    baixarQR:["📥 Baixar QR","📥 Download QR","📥 Descargar QR"],
    hCert:["📄 Certificado QR ZAP","📄 QR ZAP Certificate","📄 Certificado QR ZAP"],
    baixarCert:["📄 Baixar Certificado","📄 Download Certificate","📄 Descargar Certificado"],
    hCertOf:["📜 Certificado de Adesão QR ZAP","📜 QR ZAP Membership Certificate","📜 Certificado de Adhesión QR ZAP"],
    hSelo:["🏅 Selo QR ZAP","🏅 QR ZAP Seal","🏅 Sello QR ZAP"],
    baixarSelo:["📥 Baixar Selo","📥 Download Seal","📥 Descargar Sello"],
    hQrAzul:["🔵 Plaquinha QR Azul","🔵 Blue QR Sign","🔵 Placa QR Azul"],
    baixarQrAzul:["📥 Baixar QR Azul","📥 Download Blue QR","📥 Descargar QR Azul"],
    hAdesivo:["🚪 Adesivo QR ZAP","🚪 QR ZAP Sticker","🚪 Adhesivo QR ZAP"],
    baixarAdesivo:["📥 Baixar Adesivo","📥 Download Sticker","📥 Descargar Adhesivo"],
    rodape1:["O Programa QR ZAP é uma iniciativa privada de promoção da comunicação acessível, sem vínculo ou credenciamento por órgãos públicos.","The QR ZAP Program is a private initiative to promote accessible communication, with no link to or accreditation by public bodies.","El Programa QR ZAP es una iniciativa privada de promoción de la comunicación accesible, sin vínculo ni acreditación por parte de organismos públicos."],
    rodape2:["Ao gerar seus materiais, você concorda com nossos ","By generating your materials, you agree to our ","Al generar sus materiales, usted acepta nuestros "],
    termos:["Termos de Uso e Política de Privacidade","Terms of Use and Privacy Policy","Términos de Uso y Política de Privacidad"],
    alertBloq:["🔒 Seu Kit Digital já foi gerado.\nPara novo kit acesse: qrzap-falecomigo.com.br","🔒 Your Digital Kit has already been generated.\nFor a new kit, go to: qrzap-falecomigo.com.br","🔒 Su Kit Digital ya fue generado.\nPara un nuevo kit, acceda a: qrzap-falecomigo.com.br"],
    alertCampos:["Preencha todos os campos.","Please fill in all fields.","Complete todos los campos."],
    alertContador:["⚠️ Não foi possível atualizar o contador.\nO certificado será gerado sem número serial.","⚠️ The counter could not be updated.\nThe certificate will be generated without a serial number.","⚠️ No fue posible actualizar el contador.\nEl certificado se generará sin número de serie."],
    alertGereQR:["Gere o QR primeiro.","Generate the QR first.","Genere primero el QR."],
    avisoT1:["Seu Kit Digital já foi gerado e baixado.","Your Digital Kit has already been generated and downloaded.","Su Kit Digital ya fue generado y descargado."],
    avisoT2:["Para gerar um novo kit, realize uma nova assinatura em:","To generate a new kit, subscribe again at:","Para generar un nuevo kit, realice una nueva suscripción en:"],
    avisoT3:["Dúvidas? Entre em contato:","Questions? Contact us:","¿Dudas? Contáctenos:"]
  };
  var cur="pt", listeners=[];

  function t(k){ var e=D[k]; if(!e) return k; return e[IDX[cur]]; }
  function initial(){
    try{ var s=localStorage.getItem("qrzap_lang"); if(SUP.indexOf(s)>-1) return s; }catch(e){}
    var n=((navigator.languages&&navigator.languages[0])||navigator.language||"pt").toLowerCase().slice(0,2);
    if(n==="pt") return "pt";
    if(n==="es") return "es";
    return "en";
  }
  function applyStatic(){
    Array.prototype.forEach.call(document.querySelectorAll("[data-i18n]"),function(el){ el.textContent=t(el.getAttribute("data-i18n")); });
    Array.prototype.forEach.call(document.querySelectorAll("[data-i18n-ph]"),function(el){ el.setAttribute("placeholder",t(el.getAttribute("data-i18n-ph"))); });
    Array.prototype.forEach.call(document.querySelectorAll("[data-nonpt]"),function(el){ el.style.display=cur==="pt"?"none":""; });
    document.title=t("title");
    document.documentElement.lang=HTML_LANG[cur];
    Array.prototype.forEach.call(document.querySelectorAll("#qrzap-lang button"),function(b){
      var on=b.getAttribute("data-l")===cur;
      b.setAttribute("aria-pressed",on?"true":"false");
      b.style.background=on?"#2DC653":"transparent";
      b.style.color=on?"#1A2340":"#fff";
    });
  }
  function setLang(l){
    cur=l;
    try{ localStorage.setItem("qrzap_lang",l); }catch(e){}
    applyStatic();
    listeners.forEach(function(fn){ try{fn(cur);}catch(e){} });
  }
  function widget(){
    var d=document.createElement("div");
    d.id="qrzap-lang";
    d.setAttribute("role","group");
    d.setAttribute("aria-label","Idioma / Language / Idioma");
    d.style.cssText="position:fixed;right:12px;bottom:12px;z-index:9999;display:flex;gap:4px;background:#1A2340;border:2px solid #2DC653;border-radius:12px;padding:4px;font-family:system-ui,sans-serif";
    [["pt","PT"],["en","EN"],["es","ES"]].forEach(function(p){
      var b=document.createElement("button");
      b.type="button"; b.textContent=p[1]; b.setAttribute("data-l",p[0]);
      b.style.cssText="border:0;border-radius:8px;padding:8px 12px;font-weight:800;font-size:15px;cursor:pointer;min-width:44px;min-height:40px";
      b.addEventListener("click",function(){ setLang(p[0]); });
      d.appendChild(b);
    });
    document.body.appendChild(d);
  }

  window.QRZAP_I18N={
    t:t,
    lang:function(){ return cur; },
    onChange:function(fn){ listeners.push(fn); }
  };

  function start(){ cur=initial(); widget(); applyStatic(); }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",start); else start();
})();
