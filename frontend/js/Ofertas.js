document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("search");
    const cards = document.querySelectorAll(".card");

    // =========================
    // CARRINHO
    // =========================
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    function salvarCarrinho() {
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
    }

    function adicionarAoCarrinho(produto) {
        carrinho.push(produto);
        salvarCarrinho();
        alert(`${produto.nome} adicionado! 🛒`);
    }

    // =========================
    // BUSCA
    // =========================
    searchInput.addEventListener("input", () => {
        const texto = searchInput.value.toLowerCase();

        cards.forEach(card => {
            const nome = card.querySelector("h3").innerText.toLowerCase();

            if (nome.includes(texto)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });

    // =========================
    // BOTÃO COMPRAR
    // =========================
    cards.forEach(card => {
        const nome = card.querySelector("h3").innerText;
        const preco = card.querySelector(".new").innerText;

        const btn = card.querySelector("button");

        btn.addEventListener("click", () => {
            const produto = {
                nome,
                preco
            };

            adicionarAoCarrinho(produto);
        });
    });

});