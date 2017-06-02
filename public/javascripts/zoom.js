var zoomStart;
var dragging = false;

$('.chart').mousedown(function(e) {
    dragging = true;
    zoomStart = e.clientX;
    d3.select('.chart').append('rect')
        .attr('id', 'zoom-rect')
        .attr('transform', 'translate(' + zoomStart + ',0)')
        .attr('width', 0).attr('height', rectFor('.chart').height)
        .style('fill', 'purple');
});

$('.chart').mousemove(function(e) {
    if (dragging) {
        var currDrag = e.clientX;
        if (currDrag < zoomStart) {
            var tmp = zoomStart;
            zoomStart = currDrag;
            currDrag = tmp;
            d3.select('#zoom-rect').transition().duration(200)
                .attr('transform', 'translate(' + zoomStart + ',0)')
                .attr('width', (currDrag - zoomStart));
        } else {
            d3.select('zoom-rect').transition().duration(200)
                .attr('width', (currDrag - zoomStart));
        }
    }
});

$('.chart').mouseup(function(e) {
    if (dragging) {
        dragging = false;

        var chartRect = rectFor('.chart');
        var bpScale = d3.scaleLinear()
            .range([lowerBound, upperBound])
            .domain([chartRect.left, chartRect.right]);

        lowerBound = bpScale(zoomStart);
        upperBound = bpScale(e.clientX);
        chrRange = upperBound - lowerBound;

        d3.select('#zoom-rect').remove();

        if (confirm("Would you like to zoom in to " + (lowerBound/1000000) + 'Mb - ' + (upperBound/1000000) + 'Mb')) {
            displayChart();
        }
    }
})