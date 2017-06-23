/**
 * Redisplays both the SNP Chart and the Voxel Grid when new window bounds are introduced.
 */
function resizePanels() {
    addLoader();
    displayChart();
    displayGrid();
    removeLoader();
}

// The function to handle window resize events.
var resizeFunction;

// On each resize, wait 50ms to redisplay the panels so that it is not done excessively.
window.onresize = function() {
    clearTimeout(resizeFunction);
    resizeFunction = setTimeout(resizePanels, 50);
}

/**
 * Reset all the panels to their default widths and heights.
 */
var resetPanels = function() {
    d3.select('.top-panel').style('height', '37.5vh');
    d3.select('.bottom-panel').style('height', '52.5vh');
    d3.select('.left-panel').style('width', rectFor('.bottom-panel').height + 'px');
    d3.select('.right-panel').style('width', (rectFor('.bottom-panel').width - rectFor('#render-resizer').right) + 'px');
}