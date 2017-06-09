var removeExistingCharts = function() {
    d3.selectAll('#chrDisplay').remove();
    d3.selectAll('#offset-container').remove();
}

var displayChart = function() {
    displayGrid();
    removeExistingCharts();
    
    var oc = d3.select('.top-panel').append('div').attr('id', 'offset-container');
    var chart = oc.append('svg').attr('class', 'chart').style('fill', 'white')
        .call(d3.drag()
            .on('start', dragStart)
            .on('drag', dragChange)
            .on('end', dragEnd));

    const buffer = 0.005;
    const chartRect = rectFor('.chart')
    const width = chartRect.width - margins.left - margins.right,
        height = chartRect.height - margins.top - margins.bottom;

    var data = [];
    for (var i = 0; i < snps.length; i++) {
        var snp = snps[i];
        if (snp.loc >= lowerBound || snp.loc <= upperBound) {
            data.push(snp);
        }
    }

    var x = d3.scaleLinear()
        .range([margins.left, width])
        .domain([lowerBound/1000000, upperBound/1000000]);
    var y = d3.scaleLinear()
        .range([height, margins.top])
        .domain([0, d3.max(data, function(d) { return -Math.log10(d.pvalues[roi - 1]); }) + 0.2]);

    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);

    chart.append('text')
        .style('fill', 'black')
        .style('text-anchor', 'middle')
        .attr('x', width/2).attr('y', 0).attr('dy', '1em')
        .style('font-weight', 'bold').style('font-size', '20px').style('font-family', 'Arial')
        .text(query);

    chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis).append('text')
            .attr('class', 'axisLabel')
            .attr('x', width / 2)
            .attr('dy', '3em')
            .style('text-anchor', 'middle')
            .text('Position on Chr ' + currChr + ' (bp * 10^6)');

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

    chart.selectAll('.point').data(data)
        .enter().append('circle')
        .attr('class', 'point')
        .attr('bp', function(d) { return d.loc; })
        .attr('snp', function(d) { return d.name; })
        .attr('p', function(d) { return d.pvalues[roi - 1]; })
        .attr('scaledFreq', 3.5)
        .attr('id', function(d, i) { return 'snp' + i; })
        .attr('cx', function(d) { return x(d.loc/1000000); })
        .attr('cy', function(d) { return y(-Math.log10(d.pvalues[roi - 1])); })
        .attr('r', 3.5);
    
    addAnnotationHover();

    if (firstChart) {
        firstChart = false;
        renderBrain(null);
    }

    removeLoader();
}