var zoomStart;
var dragging = false;

var dragStart = function(d) {
    dragging = true;
    zoomStart = d3.event.x;
    d3.select('.chart').append('rect')
        .attr('id', 'zoom-rect')
        .attr('x', zoomStart).attr('y', 0)
        .attr('width', 0).attr('height', rectFor('.chart').height)
        .style('fill', 'purple').style('alpha', 0.5);
};

var dragChange = function(d) {
    if (dragging) {
        var currDrag = d3.event.x;
        if (currDrag < zoomStart) {
            var tmp = zoomStart;
            zoomStart = currDrag;
            currDrag = tmp;
            d3.select('#zoom-rect').transition().duration(100)
                .attr('transform', 'translate(' + zoomStart + ',0)')
                .attr('width', (currDrag - zoomStart));
        } else {
            d3.select('#zoom-rect').transition().duration(100)
                .attr('width', (currDrag - zoomStart));
        }
    }
};

var dragEnd = function(d) {
    if (dragging) {
        dragging = false;

        var chartRect = rectFor('.chart');
        var bpScale = d3.scaleLinear()
            .range([lowerBound, upperBound])
            .domain([chartRect.left, chartRect.right]);

        lowerBound = bpScale(zoomStart);
        upperBound = bpScale(d3.event.x);
        chrRange = upperBound - lowerBound;

        d3.select('#zoom-rect').remove();

        if (confirm("Would you like to zoom in to " + (lowerBound/1000000) + 'Mb - ' + (upperBound/1000000) + 'Mb')) {
            displayChart();
        }
    }
};