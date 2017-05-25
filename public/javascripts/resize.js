var addChartResizer = function() {
    var boundingRect = rectFor('.chart');
    var borderY = boundingRect.height + boundingRect.top;
    var borderX = boundingRect.left;
    var borderMaxY = borderY, borderMaxX = borderX + boundingRect.width;
    d3.select('body').select('#chartResizer')
        .style('width', (borderMaxX - borderX - 50.0) + 'px').style('height', (borderMaxY - borderY + 5.0) + 'px');
}

var addRenderResizer = function() {
    var boundingRect = rectFor('#render-container');
    var borderY = boundingRect.top;
    var borderX = boundingRect.left + boundingRect.width;
    var borderMaxX = borderX, borderMaxY = borderY + boundingRect.height;
    d3.select('body').select('#rendererResizer')
        .style('width', (borderMaxX - borderX + 5.0) + 'px').style('height', (borderMaxY - borderY - 50.0) + 'px');
}

var addResizeObservers = function() {
    $('.chart').resizable({
        handleSelector: '#chartResizer',
        resizeWidth: false,
        onDrag: function (e, $el, newWidth, newHeight, opt) {
            if (newHeight < 200 || newHeight > 500) {
                return false;
            }
        }
    });

    $('#render-container').resizable({
        handleSelector: '#rendererResizer',
        resizeHeight: false,
        onDrag: function (e, $el, newWidth, newHeight, opt) {
            if (newWidth < 50 || newWidth > 1000) {
                return false;
            }
        }
    });
}