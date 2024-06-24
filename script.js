document.getElementById('n').addEventListener('input', generateInputs);
document.getElementById('calculate-button').addEventListener('click', calculate);
document.getElementById('reset-button').addEventListener('click', reset);

let chart;

function generateInputs() {
    const n = document.getElementById('n').value;
    const dynamicInputs = document.getElementById('dynamic-inputs');
    dynamicInputs.innerHTML = '';

    for (let i = 1; i <= n; i++) {
        const distanceInput = document.createElement('div');
        distanceInput.className = 'input-group';
        distanceInput.innerHTML = `
            <label for="a${i}">Distancia desde el apoyo ${i} hasta el siguiente apoyo (a${i}) en metros:</label>
            <input type="number" id="a${i}" step="0.01" min="0" required>
        `;
        dynamicInputs.appendChild(distanceInput);

        const loadInput = document.createElement('div');
        loadInput.className = 'input-group';
        loadInput.innerHTML = `
            <label for="q${i}">Carga en el tramo ${i} (q${i}) en N/m:</label>
            <input type="number" id="q${i}" step="0.01" min="0" required>
        `;
        dynamicInputs.appendChild(loadInput);
    }
}

function calculate() {
    const n = document.getElementById('n').value;
    const L = document.getElementById('L').value;
    let totalAi = 0;
    let results = '';

    for (let i = 1; i <= n; i++) {
        totalAi += parseFloat(document.getElementById(`a${i}`).value);
    }

    const data = [];
    for (let i = 1; i <= n; i++) {
        const ai = parseFloat(document.getElementById(`a${i}`).value);
        const qi = parseFloat(document.getElementById(`q${i}`).value);
        const Pi = (ai * qi * L) / totalAi;
        results += `<p>Carga en el apoyo ${i} (P${i}): ${Pi.toFixed(2)} N</p>`;
        data.push(Pi);
    }

    document.getElementById('results').innerHTML = results;

    // Generar el gráfico interactivo
    generateChart(n, data);
}

function generateChart(n, data) {
    const ctx = document.getElementById('results-chart').getContext('2d');
    const labels = Array.from({ length: n }, (_, index) => `Apoyo ${index + 1}`);

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Carga en cada apoyo (N)',
                data: data,
                backgroundColor: 'rgba(129, 162, 190, 0.6)',
                borderColor: 'rgba(129, 162, 190, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function reset() {
    document.getElementById('calculator-form').reset();
    document.getElementById('dynamic-inputs').innerHTML = '';
    document.getElementById('results').innerHTML = '';
    if (chart) {
        chart.destroy();
    }
}
