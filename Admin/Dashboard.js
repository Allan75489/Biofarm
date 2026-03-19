const ctx = document.getElementById('grafico');

// DADOS
const dados = {
    dia: [5, 8, 12, 6, 10, 14, 9, 11],
    mes: [120, 90, 150, 200, 180, 220, 300]
};

const labelsDia = ['8h','9h','10h','11h','12h','13h','14h','15h'];
const labelsMes = ['Sem 1','Sem 2','Sem 3','Sem 4','Extra','Promo','Final'];

let tipoAtual = 'dia';

// CRIA GRÁFICO
const chart = new Chart(ctx, {
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
            pointRadius: 5,
            pointHoverRadius: 8
        }]
    },
    options: {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { labels: { color: '#e2e8f0' } } },
        scales: {
            x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
            y: { beginAtZero: true, ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } }
        }
    }
});

// TROCAR ENTRE DIA E MÊS
function trocarGrafico() {
    if(tipoAtual === 'dia'){
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

// GRÁFICO PIZZA
const ctxPizza = document.getElementById('graficoPizza');
new Chart(ctxPizza, {
    type: 'pie',
    data: {
        labels: ['Paracetamol','Ibuprofeno','Dipirona','Amoxicilina','Vitamina C'],
        datasets: [{
            data: [30,25,20,15,10],
            backgroundColor: ['#22c55e','#06b6d4','#3b82f6','#14b8a6','#4ade80']
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