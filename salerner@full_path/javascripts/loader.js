/**
 * Adds the loading indicator to the window.
 */
var addLoader = function() {
    d3.select('#content')
        .append('div')
            .attr('class', 'loading-container')
            .style('background-color', 'lightgray').style('opacity', '0.75')
            .style('position', 'absolute').style('z-index', '100')
            .style('left', '45vw').style('top', '40vh')
            .style('width', '10vw').style('height', '10vw')
            .style('border-radius', '7.5%')
                .append('div').attr('class', 'loader')
                    .style('position', 'absolute')
                    .style('left', '10px').style('top', '10px')
                    .style('width', '80%').style('height', '80%');
}

/**
 * Removes the loading indicator from the window.
 */
var removeLoader = function() {
    d3.select('#content')
        .select('.loading-container').remove();
}