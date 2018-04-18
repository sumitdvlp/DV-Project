/**
 * Created by laveeshrohra on 14/04/18.
 */

function loadTreeMap(data) {

    let finalData = [];

    data.aggregations.categories.buckets.forEach((row, i) => {
        finalData.push({
            name: row.key,
            value: row.doc_count,
            colorValue: i + 1
        });
    });

    Highcharts.chart('treeChart', {
        plotOptions: {
            treemap: {
                cursor: 'pointer',
                events: {
                    click: onClick
                }
            }
        },
        colorAxis: {
            minColor: '#FF0000',
            maxColor: Highcharts.getOptions().colors[0]
        },
        series: [{
            type: 'treemap',
            layoutAlgorithm: 'squarified',
            data: finalData
        }],
        title: {
            text: 'Categories'
        }
    });
}


function onClick(event) {
    let category = event.point.name;
    searchMetaData(updateAndPopulateList, getQuery(), category);
}