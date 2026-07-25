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

        document.getElementById("empresaPreview").textContent = empresa;

document.getElementById("telefonePreview").textContent =
"WhatsApp: +" + telefone;
document.getElementById("empresaPreview").style.display = "block";
document.getElementById("telefonePreview").style.display = "block";
document.querySelector(".acoesQR").style.display = "block";
document.getElementById("qrCode").style.display = "block";
const qr = document.getElementById("qrCode");

qr.innerHTML = "";

new QRCode(qr, {
            text: linkWhatsApp,
            width: 220,
            height: 220
        });

    document.getElementById("baixarQR").onclick = () => {
    const img = document.querySelector("#qrCode img") || document.querySelector("#qrCode canvas");

if (!img) return;

const link = document.createElement("a");
link.download = "QR-ZAP.png";
if (img.tagName === "CANVAS") {
    link.href = img.toDataURL("image/png");
} else {
    link.href = img.src;
}
link.click();
    };

    document.getElementById("imprimirQR").onclick = () => {
        window.print();
    };

});
