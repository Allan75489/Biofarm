document.addEventListener("DOMContentLoaded", () => {

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
        alert(`${produto.nome} adicionado ao carrinho! 🛒`);
    }

    // =========================
    // BOTÃO COMPRAR
    // =========================
    cards.forEach(card => {
        const nome = card.querySelector("h3").innerText;
        const preco = card.querySelector(".preco").innerText;
        const btn = card.querySelector("button");

        btn.addEventListener("click", () => {
            const produto = { nome, preco };
            adicionarAoCarrinho(produto);
        });

        // animação hover via JS (extra)
        card.addEventListener("mouseenter", () => {
            card.style.transform = "scale(1.05)";
            card.style.transition = "0.3s";
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "scale(1)";
        });
    });

});