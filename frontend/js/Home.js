// Espera o site carregar
document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // SCROLL SUAVE NOS LINKS
    // =========================
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            const targetId = link.getAttribute("href");
            const section = document.querySelector(targetId);

            if (section) {
                section.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });

    // =========================
    // BOTÃO "VER PRODUTOS"
    // =========================
    const btnProdutos = document.querySelector(".hero .btn");

    btnProdutos.addEventListener("click", (e) => {
        e.preventDefault();

        const produtosSection = document.querySelector(".produtos");

        produtosSection.scrollIntoView({
            behavior: "smooth"
        });
    });

    // =========================
    // FORMULÁRIO DE CONTATO
    // =========================
    const form = document.querySelector("form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nome = form.querySelector('input[type="text"]').value;
        const email = form.querySelector('input[type="email"]').value;
        const mensagem = form.querySelector("textarea").value;

        if (nome && email && mensagem) {
            alert(`Obrigado, ${nome}! Sua mensagem foi enviada.`);
            form.reset();
        } else {
            alert("Preencha todos os campos!");
        }
    });

    // =========================
    // ANIMAÇÃO DOS CARDS
    // =========================
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        card.addEventListener("mouseenter", () => {
            card.style.transform = "scale(1.05)";
            card.style.transition = "0.3s";
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "scale(1)";
        });
    });

});