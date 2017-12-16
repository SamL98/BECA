/**
 * Removes all existing charts in preparation for displaying new chart.
 */
var removeExistingCharts = function() {
    d3.selectAll('#offset-container').remove();
}

/**
 * Displays the SNP chart given the current query and bounds.
 * @see https://github.com/d3/d3/wiki for more information on the D3 framework.
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG for more information on SVG.
 */
var displayChart = function() {
    // Remove all existing charts.
    removeExistingCharts();
    
    // Append both the offset container and svg chart to the top panel.
    var oc = d3.select('.top-panel').append('div')
        .attr('id', 'offset-container');
    // Append the SVG chart and add drag zoom bindings for zooming.
    var chart = oc.append('svg').attr('class', 'chart')
        .style('fill', 'white')
        .call(d3.drag()
            .on('start', dragStart)
            .on('drag', dragChange)
            .on('end', dragEnd));

    // Determine the width and height of the chart to display.
    const chartRect = rectFor('.chart')
    const width = chartRect.width - chartMargins.left - chartMargins.right,
        height = chartRect.height - chartMargins.top - chartMargins.bottom;

    // Create local variable to hold the SNPs within the current bounds.
    var data = [];
    for (var i = 0; i < snps.length; i++) {
        var snp = snps[i];
        if (snp.loc >= lowerBound && snp.loc <= upperBound) {
            data.push(snp);
        }
    }

    // Create linear scales to determine the placement of both the axes as well as the scatter points.

    // The x scale transforms the scaled down bounds to the left and right edges of the chart's frame.
    var x = d3.scaleLinear()
        .range([chartMargins.left, width])
        .domain([lowerBound/1000000, upperBound/1000000]);

    // The y scale transforms the range from 0 to the max of the log-scaled p-values for the current ROI to the top and bottom edges of the chart's frame.
    // Note - Due to the SVG coordinate system, the bounds of the range are opposite of what they would intuitively be.
    var y = d3.scaleLinear()
        .range([height, chartMargins.top])
        .domain([0, d3.max(data, function(d) { return -Math.log10(d.pvalues[roi - 1]); }) + 0.2]);

    // Initialize the x and y axes based on the created scales.
    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);

    // Create the title label for the chart based on the current query.
    chart.append('text')
        .style('fill', 'black')
        .style('text-anchor', 'middle')
        .attr('x', width/2).attr('y', 0).attr('dy', '1em')
        .style('font-weight', 'bold').style('font-size', '20px').style('font-family', 'Arial')
        .text(query);

    // Append the x axis to the chart.
    chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis).append('text')
            .attr('class', 'axisLabel')
            .attr('x', width / 2)
            .attr('dy', '3em')
            .style('text-anchor', 'middle')
            .text('Position on Chr ' + currChr + ' (bp * 10^6)');

    // Append the y axis to the chart.
    chart.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + chartMargins.left + ',0)')
        .call(yAxis).append('text')
            .attr('class', 'axisLabel')
            .attr('transform', 'rotate(-90)')
            .attr('dy', '-3em')
            .attr('x', -height / 2)
            .style('text-anchor', 'middle')
            .text('-log10(p)');

    // Append all of the SNPs within the current bounds to the chart, with the x-coordinate the scaled location on the chromosome and the y-coordinate the scaled log probability on the ROI.
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
    
    // Add the mouseover and mouseout bindings to each data point to show the annotation information.
    addAnnotationHover();
}