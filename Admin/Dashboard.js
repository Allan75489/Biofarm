document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       ELEMENTOS GLOBAIS
    ========================= */

    const tabela = document.querySelector(".lista-vendas tbody");
    const totalSpan = document.getElementById("total");
    const finalizarBtn = document.getElementById("finalizar-vendas");
    const filtroMes = document.getElementById("filtroMes");

    let pizzaChart;
    let barraChart;

    /* =========================
       GRÁFICO DIA / MÊS
    ========================= */

    const ctxLinha = document.getElementById("grafico");

    if (ctxLinha) {

        const dados = {
            dia: [5, 8, 12, 6, 10, 14, 9, 11],
            mes: [120, 90, 150, 200, 180, 220, 300]
        };

        const labelsDia = ['8h', '9h', '10h', '11h', '12h', '13h', '14h', '15h'];
        const labelsMes = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Extra', 'Promo', 'Final'];

        let tipoAtual = 'dia';

        const chart = new Chart(ctxLinha, {
            type: 'line',
            data: {
                labels: labelsDia,
                datasets: [{
                    label: 'Vendas do Dia',
                    data: dados.dia,
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34,197,94,0.15)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: '#e2e8f0' } }
                },
                scales: {
                    x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
                    y: { beginAtZero: true, ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } }
                }
            }
        });

        window.trocarGrafico = function () {
            if (tipoAtual === 'dia') {
                chart.data.labels = labelsMes;
                chart.data.datasets[0].data = dados.mes;
                chart.data.datasets[0].label = 'Vendas do Mês';
                tipoAtual = 'mes';
            } else {
                chart.data.labels = labelsDia;
                chart.data.datasets[0].data = dados.dia;
                chart.data.datasets[0].label = 'Vendas do Dia';
                tipoAtual = 'dia';
            }
            chart.update();
        }
    }

    /* =========================
       GRÁFICO PIZZA
    ========================= */

    const ctxPizza = document.getElementById("graficoPizza");

    if (ctxPizza) {
        pizzaChart = new Chart(ctxPizza, {
            type: 'pie',
            data: {
                labels: ['Paracetamol', 'Ibuprofeno', 'Dipirona', 'Amoxicilina', 'Vitamina C'],
                datasets: [{
                    data: [30, 25, 20, 15, 10],
                    backgroundColor: ['#22c55e', '#06b6d4', '#3b82f6', '#14b8a6', '#4ade80']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#e2e8f0' }
                    }
                }
            }
        });
    }

    /* =========================
       GRÁFICO BARRAS
    ========================= */

    const ctxBarra = document.getElementById("graficoProdutos");

    if (ctxBarra) {
        barraChart = new Chart(ctxBarra, {
            type: "bar",
            data: {
                labels: [
                    "Paracetamol 500mg",
                    "Dipirona 1g",
                    "Amoxicilina 500mg",
                    "Ibuprofeno 400mg",
                    "Losartana 50mg"
                ],
                datasets: [{
                    label: "Quantidade Vendida",
                    data: [10, 5, 3, 2, 1],
                    backgroundColor: "#22c55e"
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
                    y: { beginAtZero: true, ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } }
                }
            }
        });
    }

    /* =========================
       ATUALIZAR TOTAL
    ========================= */

    function atualizarTotal() {
        let total = 0;

        tabela.querySelectorAll("tr").forEach(tr => {
            const totalTexto = tr.children[3].textContent
                .replace("R$ ", "")
                .replace(",", ".");

            total += parseFloat(totalTexto);
        });

        totalSpan.textContent = total.toFixed(2).replace(".", ",");
    }

    atualizarTotal();

    finalizarBtn?.addEventListener("click", () => {
        alert("Venda finalizada com sucesso!");
    });

    /* =========================
       FILTRO POR MÊS (TABELA + GRÁFICOS)
    ========================= */

    filtroMes?.addEventListener("change", function () {

        const mesSelecionado = this.value;
        let total = 0;
        let produtos = {};
        let produtosQtd = {};

        tabela.querySelectorAll("tr").forEach(tr => {

            const mes = tr.getAttribute("data-mes");
            const produto = tr.children[0].textContent;
            const quantidade = parseInt(tr.children[1].textContent);
            const valorTexto = tr.children[3].textContent
                .replace("R$ ", "")
                .replace(",", ".");

            const valor = parseFloat(valorTexto);

            if (mesSelecionado === "" || mes === mesSelecionado) {

                tr.style.display = "";
                total += valor;

                produtos[produto] = (produtos[produto] || 0) + valor;
                produtosQtd[produto] = (produtosQtd[produto] || 0) + quantidade;

            } else {
                tr.style.display = "none";
            }
        });

        totalSpan.textContent = total.toFixed(2).replace(".", ",");

        if (pizzaChart) {
            pizzaChart.data.labels = Object.keys(produtos);
            pizzaChart.data.datasets[0].data = Object.values(produtos);
            pizzaChart.update();
        }

        if (barraChart) {
            barraChart.data.labels = Object.keys(produtosQtd);
            barraChart.data.datasets[0].data = Object.values(produtosQtd);
            barraChart.update();
        }

    });

});

// vendas.js - Lógica de vendas, tabela e filtros

// ==========================
// PAGINAÇÃO DE VENDAS
// ==========================

const linhas = document.querySelectorAll(".lista-vendas tbody tr");

const itensPorPagina = 4;
let paginaAtual = 1;
const totalPaginas = Math.ceil(linhas.length / itensPorPagina);

const btnAnterior = document.getElementById("anterior");
const btnProximo = document.getElementById("proximo");
const paginaInfo = document.getElementById("pagina-info");

// Função para mostrar página
function mostrarPagina(pagina) {
    const inicio = (pagina - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;

    linhas.forEach((linha, index) => {
        linha.style.display =
            index >= inicio && index < fim ? "table-row" : "none";
    });

    paginaInfo.textContent = `Página ${pagina} de ${totalPaginas}`;

    // Desabilitar botões
    btnAnterior.disabled = pagina === 1;
    btnProximo.disabled = pagina === totalPaginas;
}

// Eventos
btnAnterior.addEventListener("click", () => {
    if (paginaAtual > 1) {
        paginaAtual--;
        mostrarPagina(paginaAtual);
    }
});

btnProximo.addEventListener("click", () => {
    if (paginaAtual < totalPaginas) {
        paginaAtual++;
        mostrarPagina(paginaAtual);
    }
});

// Inicializar
mostrarPagina(paginaAtual);

// ==========================
// PRODUTO MAIS VENDIDO POR MÊS
// ==========================

const filtroMes = document.getElementById("filtro-mes");
const topProduto = document.getElementById("top-produto");

// Função para calcular produto mais vendido
function calcularTopProduto() {
    const mesSelecionado = filtroMes.value;

    let maiorQtd = 0;
    let produtoTop = "-";

    linhas.forEach(linha => {
        const mes = linha.dataset.mes;
        const nome = linha.dataset.nome;
        const qtd = parseInt(linha.children[1].textContent);

        // Se não tiver filtro, pega geral
        if (mesSelecionado === "" || mes === mesSelecionado) {
            if (qtd > maiorQtd) {
                maiorQtd = qtd;
                produtoTop = nome;
            }
        }
    });

    if (produtoTop === "-") {
        topProduto.textContent = "Produto mais vendido: -";
    } else {
        topProduto.textContent = `Produto mais vendido: ${produtoTop} (${maiorQtd})`;
    }
}

// Evento ao mudar mês
filtroMes.addEventListener("change", () => {
    calcularTopProduto();
});

// Inicializar ao carregar
calcularTopProduto();


// Estoque.js - Lógica de estoque, tabela e filtros


