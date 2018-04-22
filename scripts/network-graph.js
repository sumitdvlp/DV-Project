/**
 * Created by laveeshrohra on 19/04/18.
 */

function createNetworkGraph(container='#networkGraph', data, legend) {

    let parent = $(container);

    parent.empty();

    let svg = d3.select(container)
        .append('svg')
        .attr('width', parent.width())
        .attr('height', parent.height());

    let width = +svg.attr("width"),
        height = +svg.attr("height");

    let color = d3.scaleOrdinal(d3.schemeCategory10);

    let ordinal = d3.scaleOrdinal()
        .domain(legend)
        .range(legend.map((l,i) => color(i)));

    svg.append("g")
        .attr("class", "legendOrdinal")
        .attr("transform", "translate(20,20)");

    let legendOrdinal = d3.legendColor()
        .cellFilter(function(d){ return d.label !== "e" })
        .scale(ordinal);

    svg.select(".legendOrdinal")
        .call(legendOrdinal);

    let toolTip = d3.select(container).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    let simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) {
            return d.id;
        }).distance(150))
        .force("charge", d3.forceManyBody().strength(-1000))
        .force("center", d3.forceCenter(width / 2, height / 2));

    let link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(data.links)
        .enter().append("line")
        .attr("stroke-width", 15)
        .attr("stroke", d => color(d.group));

    let node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("image")
        .data(data.nodes)
        .enter().append("image")
        .attr("xlink:href", d => d.source.imUrl)//"http://ecx.images-amazon.com/images/I/61L5PoYGxOL._SL500_.jpg")
        .attr("x", -16)
        .attr("y", -24)
        .attr("width", 60)
        .attr("height", 84)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .on("mouseover", function(d) {
            d3.select(this).style("cursor", "pointer");
            toolTip.transition()
                .duration(200)
                .style("opacity", .9);
            toolTip.html("Title: " + d.id)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            d3.select(this).style("cursor", "default");
            toolTip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", d => getFullMetaDataByAsins(d.source, '#networkGraph'));


    // node.append("title")
    //     .text(function(d) {
    //         return d.id;
    //     });

    simulation
        .nodes(data.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(data.links);

    function ticked() {
        link
            .attr("x1", function(d) {
                return d.source.x;
            })
            .attr("y1", function(d) {
                return d.source.y;
            })
            .attr("x2", function(d) {
                return d.target.x;
            })
            .attr("y2", function(d) {
                return d.target.y;
            });

        node
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";

            });
    }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}