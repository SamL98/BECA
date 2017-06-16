var addResizeObservers = function() {
    let contentWidth = rectFor('#content').width;
    let contentHeight = rectFor('#content').height;

    var chartDrag = d3.drag()
        .on('drag', function() {
            d3.select('.top-panel')
                .style('height', d3.event.y + 'px');
            d3.select('bottom-panel')
                .style('height', (contentHeight - d3.event.y) + 'px');
        })
        .on('end', function() {
            addLoader();
            displayChart();
            displayGrid();
            removeLoader();
        });
    d3.select('#chart-resizer').call(chartDrag);

    var gridDrag = d3.drag()
        .on('drag', function() {
            d3.select('.left-panel')
                .style('width', d3.event.x + 'px');
            d3.select('.right-panel')
                .style('width', (contentWidth - rectFor('#render-resizer').right) + 'px');
        });
    d3.select('#render-resizer').call(gridDrag);

    var vContainerDrag = d3.drag()
        .on('drag', function() {
            d3.select('#full-vcontainer')
                .style('width', d3.event.x + 'px');
            d3.select('#sliced-vcontainer')
                .style('width', (rectFor('.volume-panel').width - rectFor('#vcontainer-resizer').right) + 'px');
        });
    d3.select('#vcontainer-resizer').call(vContainerDrag);

    var vPanelDrag = d3.drag()
        .on('drag', function() {
            d3.select('.volume-panel')
                .style('height', d3.event.y + 'px');
            d3.selectAll('.slice')
                .style('height', (rectFor('#render-container').height - d3.event.y) + 'px');
        });
    d3.select('#vpanel-resizer').call(vPanelDrag);

    var xSliceDrag = d3.drag()
        .on('drag', function() {
            d3.select('#xSliceContainer')
                .style('width', d3.event.x + 'px');
            d3.select('#ySliceContainer')
                .style('width', (rectFor('.volume-panel').width - rectFor('#zSliceContainer').width - d3.event.x) + 'px');
        });
    d3.select('#x-slice-resizer').call(xSliceDrag);

    var ySliceDrag = d3.drag()
        .on('drag', function() {
            d3.select('#ySliceContainer')
                .style('width', (d3.event.x - rectFor('#xSliceContainer').width) + 'px');
            d3.select('#zSliceContainer')
                .style('width', (rectFor('.volume-panel').width - rectFor('#y-slice-resizer').right) + 'px');
        });
    d3.select('#y-slice-resizer').call(ySliceDrag);
}