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

    var mainSliceDrag = d3.drag()
        .on('drag', function() {
            d3.select('.main-slice')
                .style('width', d3.event.x + 'px');
            d3.select('.slice-container')
                .style('width', (rectFor('#render-container').width - rectFor('#main-render-resizer').right) + 'px');
        });
    d3.select('#main-render-resizer').call(mainSliceDrag);

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

var resetPanels = function() {
    d3.select('.top-panel').style('height', '37.5vh');
    d3.select('.bottom-panel').style('height', '52.5vh');
    d3.select('.left-panel').style('width', rectFor('.bottom-panel').height + 'px');
    d3.select('.right-panel').style('width', (rectFor('.bottom-panel').width - rectFor('#render-resizer').right) + 'px');
}