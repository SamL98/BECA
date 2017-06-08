var zoomStart = null;
var dragging = false;

var dragStart = function(d) {
    dragging = true;
    zoomStart = d3.event.x;
    d3.select('.chart').append('rect')
        .attr('id', 'zoom-rect')
        .attr('x', zoomStart).attr('y', 0)
        .attr('width', 0).attr('height', rectFor('.chart').height)
        .style('stroke', 'black')
        .style('fill', 'purple').style('fill-opacity', 0.5);
};

var dragChange = function(d) {
    if (dragging && zoomStart) {
        var currDrag = d3.event.x;
        if (currDrag < zoomStart) {
            d3.select('#zoom-rect')
                .attr('x', currDrag).attr('width', (zoomStart - currDrag));
        } else {
            d3.select('#zoom-rect')
                .attr('width', (currDrag - zoomStart));
        }
    }
};

var dragEnd = function(d) {
    if (dragging && zoomStart && (zoomStart != d3.event.x)) {
        dragging = false;
        zoomStart = null;

        var chartRect = rectFor('.chart');
        var bpScale = d3.scaleLinear()
            .range([lowerBound, upperBound])
            .domain([chartRect.left, chartRect.right]);

        const lastDrag = d3.event.x;
        const fwdDrag = lastDrag >= zoomStart;
        lowerBound = fwdDrag ? parseInt(bpScale(zoomStart)) : parseInt(bpScale(lastDrag));
        upperBound = fwdDrag ? parseInt(bpScale(lastDrag)) : parseInt(bpScale(zoomStart));
        chrRange = upperBound - lowerBound;

        d3.select('#zoom-rect').remove();

        if (confirm("Would you like to zoom in to " + (lowerBound/1000000) + 'Mb - ' + (upperBound/1000000) + 'Mb')) {
            addLoader();
            displayChart();
        }
    }
};