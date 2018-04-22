/**
 * Created by laveeshrohra on 22/04/18.
 */

function createWordCloud(container, data) {
    const parent = $(container);

    let  margin = {top: 10, right: 10, bottom: 10, left: 10};
    let  width = parent.width() - margin.left - margin.right;
    let  height = parent.height() - margin.top - margin.bottom;

    let  g = d3.select(container)
        .append("svg")
        .attr('class', 'wordCloud')
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // d3.csv("Team_Info.csv",function(data){
        let  color = d3.scaleOrdinal(d3.schemeCategory20);
        let  categories = d3.keys(d3.nest().key(function(d) { return d.State; }).map(data));
        let  fontSize = d3.scalePow().exponent(5).domain([0,1]).range([40,80]);
        let  fontStyle = d3.scaleLinear().domain([categories]).range(['楷体','仿宋']);

        let  layout = d3.layout.cloud()
            .size([width, height])
            .timeInterval(20)
            .words(data)
            .rotate(function(d) { return 0; })
            .fontSize(function(d,i) { return fontSize(Math.random()); })
            //.fontStyle(function(d,i) { return fontSyle(Math.random()); })
            .fontWeight(["bold"])
            .text(function(d) { return d.word; })
            .spiral("rectangular") // "archimedean" or "rectangular"
            .on("end", draw)
            .start();

        let  wordcloud = g.append("g")
            .attr('class','wordcloud')
            .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

        g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .selectAll('text')
            .style('font-size','20px')
            .style('fill',function(d) { return color(d); })
            .style('font','sans-serif');

        function draw(words) {
            wordcloud.selectAll("text")
                .data(words)
                .enter().append("text")
                .attr('class','word')
                .style("fill", function(d, i) { return color(i); })
                .style("font-size", function(d) { return d.size + "px"; })
                .style("font-family", function(d) { return d.font; })
                //.style("fill", function(d) {
                //let  paringObject = data.filter(function(obj) { return obj.Team_CN === d.text});
                // return color(paringObject[0].category);
                //})
                .attr("text-anchor", "middle")
                .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
                .text(function(d) { return d.text; });
        }

    // });
}