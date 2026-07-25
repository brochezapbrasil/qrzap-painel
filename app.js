document.addEventListener("DOMContentLoaded", () => {

    const botao = document.getElementById("gerarKit");
    const preview = document.getElementById("previewQR");

    botao.addEventListener("click", () => {

        const empresa = document.getElementById("empresa").value.trim();
        const telefone = document.getElementById("telefone").value.trim();
        const mensagem = document.getElementById("mensagem").value.trim();

        if (!empresa || !telefone || !mensagem) {
            alert("Preencha todos os campos.");
            return;
        }

        const linkWhatsApp =
            "https://wa.me/" +
            telefone +
            "?text=" +
            encodeURIComponent(mensagem);

        preview.innerHTML = "";

        new QRCode(preview, {
            text: linkWhatsApp,
            width: 220,
            height: 220
        });

    });

});
