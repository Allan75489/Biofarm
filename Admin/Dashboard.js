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

        const labelsDia = ['8h','9h','10h','11h','12h','13h','14h','15h'];
        const labelsMes = ['Sem 1','Sem 2','Sem 3','Sem 4','Extra','Promo','Final'];

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
       FUNÇÃO GERAR DADOS
    ========================= */

    function gerarDados() {

        let produtosQtd = {};
        let total = 0;

        tabela.querySelectorAll("tr").forEach(tr => {

            if (tr.style.display !== "none") {

                const produto = tr.children[0].textContent;
                const quantidade = parseInt(tr.children[1].textContent);
                const valorTexto = tr.children[3].textContent
                    .replace("R$ ", "")
                    .replace(",", ".");

                const valor = parseFloat(valorTexto);

                total += valor;
                produtosQtd[produto] = (produtosQtd[produto] || 0) + quantidade;
            }
        });

        return { produtosQtd, total };
    }

    /* =========================
       GRÁFICO PIZZA (QUANTIDADE + %)
    ========================= */

    const ctxPizza = document.getElementById("graficoPizza");

    if (ctxPizza) {

        const dadosIniciais = gerarDados();

        pizzaChart = new Chart(ctxPizza, {
            type: 'doughnut',
            data: {
                labels: Object.keys(dadosIniciais.produtosQtd),
                datasets: [{
                    data: Object.values(dadosIniciais.produtosQtd),
                    backgroundColor: [
                        '#22c55e','#06b6d4','#3b82f6',
                        '#14b8a6','#4ade80','#f59e0b','#ef4444'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#e2e8f0' }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {

                                const total = context.dataset.data
                                    .reduce((a, b) => a + b, 0);

                                const value = context.raw;
                                const percent = ((value / total) * 100).toFixed(1);

                                return `${context.label}: ${value} vendas (${percent}%)`;
                            }
                        }
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

        const dadosIniciais = gerarDados();

        barraChart = new Chart(ctxBarra, {
            type: "bar",
            data: {
                labels: Object.keys(dadosIniciais.produtosQtd),
                datasets: [{
                    label: "Quantidade Vendida",
                    data: Object.values(dadosIniciais.produtosQtd),
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
        const dados = gerarDados();
        totalSpan.textContent = dados.total.toFixed(2).replace(".", ",");
    }

    atualizarTotal();

    finalizarBtn?.addEventListener("click", () => {
        alert("Venda finalizada com sucesso!");
    });

    /* =========================
       FILTRO POR MÊS
    ========================= */

    filtroMes?.addEventListener("change", function () {

        const mesSelecionado = this.value;

        tabela.querySelectorAll("tr").forEach(tr => {

            const mes = tr.getAttribute("data-mes");

            if (mesSelecionado === "" || mes === mesSelecionado) {
                tr.style.display = "";
            } else {
                tr.style.display = "none";
            }
        });

        const dadosAtualizados = gerarDados();

        atualizarTotal();

        if (pizzaChart) {
            pizzaChart.data.labels = Object.keys(dadosAtualizados.produtosQtd);
            pizzaChart.data.datasets[0].data = Object.values(dadosAtualizados.produtosQtd);
            pizzaChart.update();
        }

        if (barraChart) {
            barraChart.data.labels = Object.keys(dadosAtualizados.produtosQtd);
            barraChart.data.datasets[0].data = Object.values(dadosAtualizados.produtosQtd);
            barraChart.update();
        }
    });

});