var addChartResizer = function() {
    var boundingRect = d3.select('.chart').node().getBoundingClientRect();
    var borderY = boundingRect.height + boundingRect.top;
    var borderX = boundingRect.left;
    var borderMaxY = borderY, borderMaxX = borderX + boundingRect.width;
    d3.select('body').select('#chartResizer')
        .style('width', (borderMaxX - borderX - 50.0) + 'px').style('height', (borderMaxY - borderY + 5.0) + 'px');
}

var addRenderResizer = function() {
    var boundingRect = d3.select('#renderContainer').node().getBoundingClientRect();
    var borderY = boundingRect.top;
    var borderX = boundingRect.left + boundingRect.width;
    var borderMaxX = borderX, borderMaxY = borderY + boundingRect.height;
    d3.select('body').select('#rendererResizer')
        .style('width', (borderMaxX - borderX + 5.0) + 'px').style('height', (borderMaxY - borderY - 50.0) + 'px');
}

var addResizeObservers = function() {
    var oHeight = d3.select('#offsetContainer').node().getBoundingClientRect().height;
    var oWidth = d3.select('#renderContainer').node().getBoundingClientRect().width;
    $('.chart').resizable({
        handleSelector: '#chartResizer',
        resizeWidth: false,
        onDrag: function (e, $el, newWidth, newHeight, opt) {
            if (newHeight < 200 || newHeight > 500) {
                return false;
            } else {
                var scale = newHeight/oHeight;
                oHeight = newHeight;
                d3.select('#offsetContainer')
                    .attr('transform', d3.select('#offsetContainer').attr('transform') + 
                        ' scale(1,' + scale + ')');
            }
        }
    });

    $('#renderContainer').resizable({
        handleSelector: '#rendererResizer',
        resizeHeight: false,
        onDrag: function (e, $el, newWidth, newHeight, opt) {
            if (newWidth < 50 || newWidth > 1000) {
                return false;
            }
        }
    });
}