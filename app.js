document.addEventListener("DOMContentLoaded", () => {

    const botao = document.getElementById("gerarKit");

    botao.addEventListener("click", () => {

        const empresa = document.getElementById("empresa").value.trim();
        const telefone = document.getElementById("telefone").value.trim();
        const mensagem = document.getElementById("mensagem").value.trim();

        if (!empresa || !telefone || !mensagem) {
            alert("Preencha todos os campos.");
            return;
        }

        const link =
            "https://wa.me/" +
            telefone +
            "?text=" +
            encodeURIComponent(mensagem);

        const qr = document.getElementById("qrCode");

        qr.innerHTML = "";

        new QRCode(qr, {
            text: link,
            width: 220,
            height: 220
        });

        document.getElementById("empresaPreview").textContent = empresa;
        document.getElementById("telefonePreview").textContent =
            "WhatsApp: +" + telefone;
        const canvas = document.getElementById("certificadoCanvas");
const ctx = canvas.getContext("2d");

const certificado = new Image();

certificado.onload = () => {

    canvas.width = certificado.width;
    console.log("Largura:", canvas.width);
    canvas.height = certificado.height;
console.log("Altura:", canvas.height);

    ctx.drawImage(certificado, 0, 0);
console.log(canvas.width);
console.log(canvas.height);
console.log(certificado.width);
console.log(certificado.height);
    ctx.save();

ctx.fillStyle = "#ff0000";
ctx.font = "bold 48px Arial";
ctx.textAlign = "center";
ctx.textBaseline = "middle";

ctx.fillText(empresa, canvas.width / 2, 395);

ctx.restore();

ctx.fillStyle = "#2f195f";
ctx.textAlign = "center";

ctx.font = "24px Arial";
ctx.fillText("WhatsApp: +" + telefone, canvas.width / 2, 435);

const hoje = new Date().toLocaleDateString("pt-BR");

ctx.fillText("Emitido em: " + hoje, canvas.width / 2, 470);
    

    document.getElementById("certificadoSection").style.display = "block";
};

certificado.src = "certificado-base.png";
    });
document.getElementById("baixarQR").addEventListener("click", () => {
        const canvas = document.querySelector("#qrCode canvas");
        const img = document.querySelector("#qrCode img");

        if (canvas) {

            const link = document.createElement("a");
            link.download = "QR-ZAP.png";
            link.href = canvas.toDataURL("image/png");
            link.click();

        } else if (img) {

            const link = document.createElement("a");
            link.download = "QR-ZAP.png";
            link.href = img.src;
            link.click();

        } else {

            alert("Gere o QR primeiro.");

        }

    });

    document.getElementById("imprimirQR").addEventListener("click", () => {

        const conteudo = document.getElementById("qrCode").innerHTML;

        if (!conteudo) {
            alert("Gere o QR primeiro.");
            return;
        }

        const janela = window.open("", "_blank");

        janela.document.write(`
            <html>
            <head>
                <title>Imprimir QR</title>
                <style>
                    body{
                        display:flex;
                        justify-content:center;
                        align-items:center;
                        height:100vh;
                        margin:0;
                    }
                </style>
            </head>
            <body>
                ${conteudo}
            </body>
            </html>
        `);

        janela.document.close();
        janela.focus();
        janela.print();

    });

});
