var addResizeObservers = function() {
    $('#offset-container').resizable({
        handleSelector: '#chart-resizer',
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

    $('.volumeContainer').resizable({
        handleSelector: '.volume-resizer',
        resizeHeight: false
    });

    $('.volume-panel').resizable({
        handleSelector: '.top-slice-resizer',
        resizeWidth: false
    });
}