var removeExistingCharts = function() {
    d3.selectAll('#chrDisplay').remove();
    d3.selectAll('#offsetContainer').remove();
}

var displayChart = function(gene) {
    removeExistingCharts();

    var buffer = 0.005;
    var width = (+d3.select('body').node().getBoundingClientRect().width) - margins.left - margins.right,
        height = 400 - margins.top - margins.bottom;

    var upperBound = 0, lowerBound = 0;
    var chrNum = 0;
    var data = [];

    var foundGene = false;
    for (var i = 0; (i < chromosomes.length && !foundGene); i++) {
        var chr = chromosomes[i];
        for (var j = 0; (j < chr.genes.length && !foundGene); j++) {
            var tmp = chr.genes[j];
            if (tmp.name === gene) {
                foundGene = true;

                chrNum = i + 1;
                currChr = i;
                currGene = j;

                upperBound = tmp.end;
                lowerBound = tmp.start;
                for (var k = 0; k < tmp.snps.length; k++) {
                    var snp = tmp.snps[k];
                    if (snp.loc < lowerBound) { 
                        lowerBound = snp.loc; 
                    }
                    else if (snp.loc > upperBound) { 
                        upperBound = snp.loc; 
                    }
                    data.push(snp);
                }
            }
        }
    }

    var x = d3.scaleLinear()
        .range([0, width])
        .domain([d3.min(data, function(d) { return d.loc/1000000; }) - buffer, d3.max(data, function(d) { return d.loc/1000000; }) + buffer]);
    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 1]);
    var freqScale = d3.scalePow()
        .range([3, 8])
        .domain([d3.min(data, function(d) { return d.freq; }),
                d3.max(data, function(d) { return d.freq; })]);

    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);

    var chart = d3.select('.chart')
        .attr('x', 0).attr('y', 0)
        .attr('width', width + margins.left + margins.right)
        .attr('height', height + margins.top + margins.bottom)
        .append('g')
            .attr('id', 'offsetContainer')
            .style('fill', 'white')
            .attr('width', width).attr('height', height)
            .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

    chart.append('text')
        .style('fill', 'black')
        .style('text-anchor', 'middle')
        .attr('x', width/2).attr('y', -margins.top/2)
        .style('font-weight', 'bold').style('font-size', '20px').style('font-family', 'Arial')
        .text(gene);

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
        .call(yAxis).append('text')
            .attr('class', 'axisLabel')
            .attr('transform', 'rotate(-90)')
            .attr('dy', '-3em')
            .attr('x', -height / 2)
            .style('text-anchor', 'middle')
            .text('-log10(p)');

    var genes = chromosomes[currChr].genes;
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
        .attr('transform', function(g) { return 'translate(' + geneX(g.start) + ',' + (+chart.attr('height') + margins.bottom/2) + ')'; })
            .attr('height', margins.bottom/3)
            .attr('width', function(g) { return geneWidth(g.end - g.start); })
            .attr('rx', 3).attr('ry', 3)
            .style('stroke', 'black').style('stroke-width', 2)
            .style('fill', function(g) {
                if (g.name === gene) {
                    return "steelblue";
                } else {
                    return "indianred";
                }
            });

    chart.selectAll('.point').data(data)
        .enter().append('circle')
        .attr('class', 'point')
        .attr('bp', function(d) { return d.loc; })
        .attr('snp', function(d) { return d.name; })
        .attr('freq', function(d) { return d.freq; })
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
        addChartResizer();
        addRenderResizer();
        addResizeObservers();
    }
}