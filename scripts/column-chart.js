/**
 * Created by laveeshrohra on 18/04/18.
 */

//Data format = [positive, neutral, negative]
function loadColumnChart(container, data = [10, 20, 10]) {

    let sum = data.reduce((a, b) => a + b, 0);
    data = data.map(d => d / sum * 100);

    Highcharts.chart(container, {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Reviews Analysis'
        },
        subtitle: {
            text: 'Percentage reviews per book'
        },
        xAxis: {
            categories: ['Reviews'],
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Reviews (percentage)',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: ' %'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true,
                    format: '{point.y:.1f}%'
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [
            {
                name: 'Positive',
                data: [data[0]]
            },
            {
                name: 'Neutral',
                data: [data[1]]
            },
            {
                name: 'Negative',
                data: [data[2]]
            }
        ]
        ,
        colors: [
            '#89A54E',
            '#FFFF66',
            '#FF4500'
        ]

    });
}