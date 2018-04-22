/**
 * Created by laveeshrohra on 20/04/18.
 */

function createPieChart(container, data) {
    //data = [0.62, 0.23, 0.2] [Pos, Neu, Neg]

    Highcharts.chart(container, {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Sentiment Analysis of Review'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                },
                showInLegend: true
            }
        },
        series: [{
            name: 'Sentiments',
            colorByPoint: true,
            data: [{
                name: 'Positive',
                y: data[0],
                sliced: true,
                selected: true
            }, {
                name: 'Neutral',
                y: data[1]
            }, {
                name: 'Negative',
                y: data[2]
            }]
        }],
        colors: [
            '#89A54E',
            '#FFFF66',
            '#FF4500'
        ]
    });
}