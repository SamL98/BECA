/**
 * Adds the loading indicator to the window.
 */
var addLoader = function() {
    d3.select('#content')
        .append('div')
            .attr('class', 'loading-container')
            .style('background-color', 'gray').style('opacity', '0.5')
            .style('position', 'fixed').style('z-index', 100)
            .style('top', 0).style('bottom', 0)
            .style('width', '100%').style('height', '100%')
                .append('div').attr('class', 'loader')
                    .style('position', 'absolute')
                    .style('left', '45vw').style('top', '40vh')
                    .style('width', '10vw').style('height', '10vw');
}

/**
 * Removes the loading indicator from the window.
 */
var removeLoader = function() {
    d3.select('#content')
        .select('.loading-container').remove();
}