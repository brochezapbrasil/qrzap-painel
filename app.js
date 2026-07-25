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
