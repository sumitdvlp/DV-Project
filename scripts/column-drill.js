/**
 * Created by laveeshrohra on 17/04/18.
 */
function createColumnChart(data) {

    let total = data.hits.total;
    let aggs = data.aggregations.prices.buckets;
    let series = [];
    let drills = [];
    const mainInterval = 20;
    const drillInterval = 5;

    aggs.forEach(row => {
        if(row['doc_count'] === 0){
            return;
        }
        series.push(
            {
                "name": row['key'].toString() + " to " + (row['key'] + mainInterval - 1),
                "y": row['doc_count']/total*100,
                "drilldown": row['key'].toString() + " to " + (row['key'] + mainInterval - 1)
            }
        );

        let drillData = [];

        row['drill_prices'].buckets.forEach(drill => {
            drillData.push(
                [drill['key'].toString() + " to " + (drill['key'] + drillInterval - 1), drill['doc_count']/row['doc_count']*100]
            );
        });

        drills.push(
            {
                "name": row['key'].toString() + " to " + (row['key'] + mainInterval - 1),
                "id": row['key'].toString() + " to " + (row['key'] + mainInterval - 1),
                "data": drillData
            }
        );

    });


    // Create the chart
    Highcharts.chart('columnChart', {
        chart: {
            type: 'column'
        },

        title: {
            text: 'Book Price Distribution'
        },
        subtitle: {
            text: 'Click the columns to view sub distribution'
        },
        xAxis: {
            type: 'category',
            title: {
                text: 'Price Distribution (in Dollars $)'
            }
        },
        yAxis: {
            title: {
                text: 'Total percent book range'
            }

        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                cursor: 'pointer',
                events:{
                    click: onClick
                },
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.y:.1f}%'
                }
            }
        },

        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">({point.name})$</span>: <b>{point.y:.2f}%</b> of total/parent<br/>'
        },

        "series": [
            {
                "name": "Price Range",
                "colorByPoint": true,
                "data": series
            }
        ],
        "drilldown": {
            "series": drills,
        }
    });
}


function onClick(event) {
    let price = event.point.name.split(" to ");
    setPriceState(price);
    searchMetaData(updateAndPopulateList, getQuery(), price);
}

function setPriceState(price) {
    $('#priceState').val(price);
}