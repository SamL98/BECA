var addChartResizer = function() {
    var boundingRect = d3.select('.chart').node().getBoundingClientRect();
    var borderY = boundingRect.height + boundingRect.top;
    var borderX = boundingRect.left;
    var borderMaxY = borderY + 5.0, borderMaxX = borderX + boundingRect.width;
    console.log(borderX, borderY, borderMaxX, borderMaxY);
    d3.select('body').append('div')
        .attr('class', 'resizer').attr('id', 'chartResizer')
        .style('width', (borderMaxX - borderX) + 'px').style('height', (borderMaxY - borderY) + 'px');
}

var addRenderResizer = function() {
    var boundingRect = d3.select('#renderContainer').node().getBoundingClientRect();
    var borderY = boundingRect.top;
    var borderX = boundingRect.left + boundingRect.width;
    var borderMaxX = borderX + 5.0, borderMaxY = borderY + boundingRect.height;
    console.log(borderX, borderY, borderMaxX, borderMaxY);
    d3.select('body').append('div')
        .attr('class', 'resizer').attr('id', 'rendererResizer')
        .style('display', 'inline-block')
        .style('width', (borderMaxX - borderX) + 'px').style('height', (borderMaxY - borderY) + 'px');
}

var addResizeObservers = function() {
    var dragging = false;

    $('.resizer').mouseover(function(e) {
        var cursorType = (e.target.id === 'chartResizer') ? 'ns-resize' : 'ew-resize';
        d3.select('html').style('cursor', cursorType);

        var id = '#' + e.target.id;
        $(id).mousedown(function(e) {
            dragging = true;
        });

        $(id).mousemove(function(e) {
            if (dragging) {
                d3.select('.chart').transition().duration(250)
                    .style('height', (+d3.select('.chart').attr('height') + e.pageY));
                d3.select('#renderContainer').transition().duration(250)
                    .style('height', (+d3.select('#renderContainer').attr('height') - e.pageY));
            }
        })

        $(id).mouseup(function(e) {
            dragging = false;
            $(id).unbind('mousedown');
            $(id).unbind('mousemove');
        });
    });
    $('.resizer').mouseout(function(e) {
        d3.select('html').style('cursor', 'default');
    });
}