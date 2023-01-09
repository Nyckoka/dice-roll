
// Create the chart
var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        datasets: [{
            label: 'Number of Hits',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        },
        {
            label: 'Distribution Line',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            type: 'line',
            yAxisID: 'distribution-line-y-axis',
            pointRadius: 0,
            pointHoverRadius: 0,
            pointHitRadius: 0
        }]
    },
    options: {
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    var label = data.labels[tooltipItem.index];
                    var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                    // Calculate the total number of rolls
                    var totalRolls = data.datasets[tooltipItem.datasetIndex].data.reduce((acc, cur) => acc + cur, 0);
                    // Calculate the proportion of each hit possibility
                    var proportion = (value / totalRolls * 100).toFixed(4);
                    // Display both values in the tooltip
                    return label + ': ' + value + ' (' + proportion + '%)';
                }
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            },
            {
                id: 'distribution-line-y-axis',
                position: 'right',
                ticks: {
                    beginAtZero: true,
                    display: false
                }
            }]
        }
    }
});

/**
* Resets the chart, clearing it and displaying the correct number of dice. 
*/
function reset() {
    var numDice = document.getElementById('numDice').value;
    var numSides = document.getElementById('numSides').value;

    rollFunctionsAbortControllers.forEach(abortController => abortController.abort());
    rollFunctionsAbortControllers = [];

    // Calculate the possible sums that can be obtained by rolling `numDice` dice with `numSides` sides
    var labels = [];
    for (var i = numDice; i <= numDice * numSides; i++) {
        labels.push(i.toString());
    }

    // Update the chart data
    chart.data.labels = labels;
    chart.data.datasets[0].data = new Array(labels.length).fill(0);
    chart.data.datasets[1].data = new Array(labels.length).fill(0);
    document.getElementById('totalRolls').innerHTML = 0;
    chart.update();

    resetExpectedProbabilitiesTable(numDice, numSides);
}


let rollFunctionsAbortControllers = [];

document.getElementById('rollButton').addEventListener('click', () => {
    let abortController = new AbortController();
    rollFunctionsAbortControllers.push(abortController);

    async function roll() {
        const numDice = document.getElementById('numDice').value;
        const numSides = document.getElementById('numSides').value;
        const numRolls = document.getElementById('numRolls').value;
        let rollsDone = 0;

        while (rollsDone < numRolls) {
            if (abortController.signal.aborted) return;
            for (let i = 0; i < 1000 && rollsDone < numRolls; i++) {
                let roll = 0;
                for (let j = 0; j < numDice; j++) {
                    roll += Math.floor(Math.random() * numSides) + 1;
                }
                chart.data.datasets[0].data[roll - numDice]++;
                chart.data.datasets[1].data[roll - numDice]++;
                rollsDone++;
            }

            const totalRolls = chart.data.datasets[0].data.reduce((acc, cur) => acc + cur, 0);
            document.getElementById('totalRolls').innerHTML = totalRolls;
            chart.update();
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
    }

    roll();
});

document.getElementById('clearButton').addEventListener('click', function () {
    reset()
});

document.getElementById('toggleDistributionLineButton').addEventListener('click', function () {
    var distributionLineDataset = chart.data.datasets.find(dataset => dataset.label === 'Distribution Line');
    distributionLineDataset.hidden = !distributionLineDataset.hidden;

    chart.update();
});

document.getElementById('toggleExpectedProbabilitiesTable').addEventListener('click', function () {
    var table = document.getElementById('expectedProbabilitiesTable');
    var tableDiv = document.getElementById('expectedProbabilitiesTableDiv');

    table.style.display = table.style.display === 'none' ? 'block' : 'none';
    tableDiv.style.display = tableDiv.style.display === 'none' ? 'block' : 'none';
});

// Update the chart when the number of dice to roll changes
document.getElementById('numDice').addEventListener('change', function () {
    reset();
});

// Update the chart when the number of sides of the dice changes
document.getElementById('numSides').addEventListener('change', function () {
    reset();
});




function resetExpectedProbabilitiesTable(numDice, numSides) {
    // Clear the table
    var table = document.getElementById('expectedProbabilitiesTable');

    // Delete all the cells in the first row except the first cell
    while (table.rows[0].cells.length > 1) {
        table.rows[0].deleteCell(-1);
    }

    // Delete all the cells in the second row except the first cell
    while (table.rows[1].cells.length > 1) {
        table.rows[1].deleteCell(-1);
    }

    // Calculate the probability of each possible sum
    var possibleOutcomes = Math.pow(numSides, numDice);

    for (var i = numDice; i <= numSides * numDice; i++) {
        let favorableOutcomes = 0;

        const kLimit = Math.floor((i - numDice) / numSides);

        for (let k = 0; k <= kLimit; k++) {
            favorableOutcomes += Math.pow(-1, k) * Number(combinations(numDice, k)) * Number(combinations(i - numSides * k - 1, numDice - 1));
        }

        var probability = favorableOutcomes / possibleOutcomes * 100;
        var cell1 = table.rows[0].insertCell(-1);
        var cell2 = table.rows[1].insertCell(-1);
        cell1.innerHTML = i;
        cell2.innerHTML = probability.toFixed(4) + '%';
    }
}

// Calculate the number of combinations of size `k` that can be chosen from a set of size `n`
function combinations(n, k) {
    var numerator = factorial(n);
    var denominator = factorial(k) * factorial(n - k);
    return numerator / denominator;
}

// Calculate the factorial of a number `n`
function factorial(n) {
    if (n == 0) {
        return 1;
    }
    return n * factorial(n - 1);
}




reset();