var removeExistingCharts = function() {
    d3.selectAll('#chrDisplay').remove();
    d3.selectAll('#offset-container').remove();
}

var displayChart = function() {
    removeExistingCharts();
    var oc = d3.select('.top-panel').append('div').attr('id', 'offset-container');
    var chart = oc.append('svg').attr('class', 'chart').style('fill', 'white');

    const buffer = 0.005;
    const chartRect = rectFor('.chart')
    const width = chartRect.width - margins.left - margins.right,
        height = chartRect.height - margins.top - margins.bottom;

    const upperBound = 0, lowerBound = 0;
    const data = snps;
    const chrNum = parseInt(data[0].chr);

    var x = d3.scaleLinear()
        .range([margins.left, width])
        .domain([d3.min(data, function(d) { return d.loc/1000000; }) - buffer, d3.max(data, function(d) { return d.loc/1000000; }) + buffer]);
    var y = d3.scaleLinear()
        .range([height, margins.top])
        .domain([0, 1]);
    //var freqScale = d3.scalePow()
        .range([3, 8])
        .domain([d3.min(data, function(d) { return d.freq; }),
                d3.max(data, function(d) { return d.freq; })]);

    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);

    chart.append('text')
        .style('fill', 'black')
        .style('text-anchor', 'middle')
        .attr('x', width/2).attr('y', 0).attr('dy', '1em')
        .style('font-weight', 'bold').style('font-size', '20px').style('font-family', 'Arial')
        .text(data[0].gene);

    chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis).append('text')
            .attr('class', 'axisLabel')
            .attr('x', width / 2)
            .attr('dy', '3em')
            .style('text-anchor', 'middle')
            .text('Position on Chr ' + chrNum + ' (bp * 10^6)');

    chart.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + margins.left + ',0)')
        .call(yAxis).append('text')
            .attr('class', 'axisLabel')
            .attr('transform', 'rotate(-90)')
            .attr('dy', '-3em')
            .attr('x', -height / 2)
            .style('text-anchor', 'middle')
            .text('-log10(p)');
`   `
    /*var genes = chromosomes[currChr].genes;
    var geneBuffer = 300;
    var geneX = d3.scaleLinear().range([width - geneBuffer, geneBuffer])
        .domain([d3.min(genes, function(g) { return g.start; }),
                d3.max(genes, function(g) { return g.start; })]);
    var geneWidth = d3.scaleLinear().range([4, 12])
        .domain([d3.min(genes, function(g) { return g.end - g.start; }),
                d3.max(genes, function(g) { return g.end - g.start; })]);

    chart.selectAll('#chrDisplay')
        .data(genes).enter().append('rect')
        .attr('id', 'chrDisplay')
        .attr('transform', function(g) { return 'translate(' + geneX(g.start) + ',' + (chartRect.bottom - margins.bottom/2) + ')'; })
            .attr('height', margins.bottom/3)
            .attr('width', function(g) { return geneWidth(g.end - g.start); })
            .attr('rx', 3).attr('ry', 3)
            .style('stroke', 'black').style('stroke-width', 2)
            .style('fill', function(g) {
                return (g.name === gene) ? "steelblue" : "indianred";
            });*/

    chart.selectAll('.point').data(data)
        .enter().append('circle')
        .attr('class', 'point')
        .attr('bp', function(d) { return d.loc; })
        .attr('snp', function(d) { return d.name; })
        .attr('p', function(d) { return d.p; })
        .attr('scaledFreq', function(d) { return freqScale(d.freq); })
        .attr('id', function(d, i) { return 'snp' + i; })
        .attr('cx', function(d) { return x(d.loc/1000000); })
        .attr('cy', function(d) { return y(Math.random()); })
        .attr('r', function(d) { return freqScale(d.freq); });
    
    addAnnotationHover();

    if (firstChart) {
        firstChart = false;
        prepareForBrainRender();
        addResizeObservers();
    }
}