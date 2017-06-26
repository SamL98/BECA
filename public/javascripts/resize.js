/**
 * Add the resize observers and handlers for panel resizing.
 */
var addResizeObservers = function() {
    // Obtain the initial values for the dimensions of the total content.
    let contentWidth = rectFor('#content').width;
    let contentHeight = rectFor('#content').height;
    let bottomBottom = rectFor('.bottom-panel').bottom;

    // Handles drags on the horizontal, chart resizer to resize the top and bottom panels.
    var chartDrag = d3.drag()
        .on('drag', function() {
            d3.select('.top-panel')
                .style('height', d3.event.y + 'px');
            d3.select('.bottom-panel')
                .style('height', (bottomBottom - rectFor('#chart-resizer').bottom) + 'px');
        })
        .on('end', function() {
            addLoader();
            displayChart();
            displayGrid();
            removeLoader();
        });
    d3.select('#chart-resizer').call(chartDrag);

    // Handles drags on the vertical, grid resizer to resize the left and right bottom panels.
    var gridDrag = d3.drag()
        .on('drag', function() {
            d3.select('.left-panel')
                .style('width', d3.event.x + 'px');
            d3.select('.right-panel')
                .style('width', (contentWidth - rectFor('#render-resizer').right) + 'px');
        });
    d3.select('#render-resizer').call(gridDrag);

    // Handles drags on the vertical, main slice resizer to resize the main slice container and secondary slice container.
    var mainSliceDrag = d3.drag()
        .on('drag', function() {
            d3.select('.main-slice')
                .style('width', d3.event.x + 'px');
            d3.select('.slice-container')
                .style('width', (rectFor('#render-container').width - rectFor('#main-render-resizer').right) + 'px');
        });
    d3.select('#main-render-resizer').call(mainSliceDrag);

    // Handles drags on the horizontal, secondary slice resizer to resize the top and bottom secondary slice containers.
    var secondarySliceDrag = d3.drag()
        .on('drag', function() {
            console.log(d3.event.y);
            d3.select('.top-slice')
                .style('height', d3.event.y + 'px');
            d3.selectAll('.bottom-slice')
                .style('height', (rectFor('.slice-container').height - rectFor('#secondary-render-resizer').bottom) + 'px');
        });
    d3.select('#secondary-render-resizer').call(secondarySliceDrag);
}