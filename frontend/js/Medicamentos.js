document.addEventListener("DOMContentLoaded", () => {

    const buscarInput = document.getElementById("buscar");
    const categoriaSelect = document.getElementById("categoria");
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
    // BUSCA + FILTRO
    // =========================
    function filtrarProdutos() {
        const texto = buscarInput.value.toLowerCase();
        const categoria = categoriaSelect.value;

        cards.forEach(card => {
            const nome = card.querySelector("h3").innerText.toLowerCase();
            const cat = card.getAttribute("data-categoria");

            const matchTexto = nome.includes(texto);
            const matchCategoria = categoria === "" || categoria === cat;

            if (matchTexto && matchCategoria) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    }

    buscarInput.addEventListener("input", filtrarProdutos);
    categoriaSelect.addEventListener("change", filtrarProdutos);

    // =========================
    // FAVORITAR ❤️
    // =========================
    document.querySelectorAll(".favorito").forEach(icon => {
        icon.addEventListener("click", () => {
            icon.classList.toggle("ativo");

            if (icon.classList.contains("ativo")) {
                icon.style.color = "red";
            } else {
                icon.style.color = "white";
            }
        });
    });

    // =========================
    // BOTÃO COMPRAR
    // =========================
    cards.forEach(card => {
        const nome = card.querySelector("h3").innerText;
        const preco = card.querySelector(".preco").innerText;

        const btn = card.querySelector(".btn");

        btn.addEventListener("click", () => {
            const produto = {
                nome,
                preco
            };

            adicionarAoCarrinho(produto);
        });
    });

});