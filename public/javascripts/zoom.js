// Tracks where the zoom began.
var zoomStart = null;
// Tracks whether or not zoom is occurring.
var zooming = false;

/**
 * Handles the start of a drag event on the SNP chart.
 */
var dragStart = function() {
    // Mark that dragging has began and the location of the event.
    zooming = true;
    zoomStart = d3.event.x;
    // Append the zoom rect to the chart.
    d3.select('.chart').append('rect')
        .attr('id', 'zoom-rect')
        .attr('x', zoomStart).attr('y', 0)
        .attr('width', 0).attr('height', rectFor('.chart').height)
        .style('stroke', 'black')
        .style('fill', 'purple').style('fill-opacity', 0.5);
};

/**
 * Handles changes in the drag event.
 */
var dragChange = function() {
    if (zooming && zoomStart) {
        // If the user is currently dragging, mark the current drag position.
        var currDrag = d3.event.x;
        if (currDrag < zoomStart) {
            // If the current drag position is to the left of the zoom start, set the zoom rect's origin to the current position.
            d3.select('#zoom-rect')
                .attr('x', currDrag).attr('width', (zoomStart - currDrag));
        } else {
            // Set the zoom rect's width to the difference of the current and start positions.
            d3.select('#zoom-rect')
                .attr('width', (currDrag - zoomStart));
        }
    }
};

/**
 * Handles the end of a drag event.
 */
var dragEnd = function() {
    // Make sure that the user is dragging and that a location for the start of a zoom exists.
    // This event is triggered by a click, so make sure that there is some difference in location between the zoom start and current position.
    if (zooming && zoomStart && (zoomStart != d3.event.x)) {
        // Obtain the rect for the SNP chart and create a scale to transform the zoom start and current position into accurate basepairs.
        var chartRect = rectFor('.chart');
        var bpScale = d3.scaleLinear()
            .range([lowerBound, upperBound])
            .domain([chartMargins.left, chartRect.width - chartMargins.left - chartMargins.right]);

        // The position of the end of the drag event.
        const lastDrag = d3.event.x;
        // Flag for whether or not the drag ended to the right of where it started.
        const fwdDrag = lastDrag >= zoomStart;

        // Calculate the new bounds based on whether or not it was a left or right drag and based off the scale previously created.
        var newLower = fwdDrag ? parseInt(bpScale(zoomStart)) : parseInt(bpScale(lastDrag));
        var newUpper = fwdDrag ? parseInt(bpScale(lastDrag)) : parseInt(bpScale(zoomStart));
        var newRange = newUpper - newLower;

        // Set the variables to indicate dragging is no longer occurring.
        zooming = false;
        zoomStart = null;

        // Remove the zoom rect from the DOM.
        d3.select('#zoom-rect').remove();

        // Ask if the user would like to zoom in on the specified range.
        if (confirm("Would you like to zoom in to " + (newLower/1000000) + 'Mb - ' + (newUpper/1000000) + 'Mb')) {
            // Set the new global bounds and range.
            lowerBound = newLower;
            upperBound = newUpper;
            chrRange = newRange;

            // Set to loading, display the chart, and set to not loading.
            addLoader();
            displayChart();
            displayGrid();
            removeLoader();
        }
    }
};