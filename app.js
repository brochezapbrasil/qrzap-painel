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

        window.kitQRZAP = {
            empresa,
            telefone,
            mensagem
        };

        preview.innerHTML = `
            <h3>Dados registrados</h3>
            <p><strong>Empresa:</strong> ${empresa}</p>
            <p><strong>WhatsApp:</strong> ${telefone}</p>
            <p>Pronto para gerar o QR Code.</p>
        `;
    });

});
