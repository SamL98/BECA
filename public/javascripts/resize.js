// var addResizeObservers = function() {
//     $('.top-panel').resizable({
//         handleSelector: '#chart-resizer',
//         resizeWidth: false,
//         onDrag: function (e, $el, newWidth, newHeight, opt) {
//             if (newHeight < 200 || newHeight > 750) {
//                 return false;
//             }

//             $('.bottom-panel').css({'height': (+$('#content').height() - (+$('.top-panel').height())) });
//             $('.left-panel').css({'width': $('.bottom-panel').height() });
//             $('.right-panel').css({'width': (rectFor('.bottom-panel').width - rectFor('#render-resizer').right) });
//         }
//     });

//     $('.left-panel').resizable({
//         handleSelector: '#render-resizer',
//         resizeHeight: false,
//         onDrag: function (e, $el, newWidth, newHeight, opt) {
//             if (newWidth < 100 || newWidth > 750) {
//                 return false;
//             }

//             $('.right-panel').css({'width': (rectFor('.bottom-panel').width - rectFor('#render-resizer').right) });
//             d3.select('.chart').attr('viewBox', '0 0 ' + ($('.right-panel').width() - gridMargins.left + ' ' + ($('.right-panel').height() - gridMargins.top)))
//         }
//     });
// }

var addResizeObservers = function() {
    var containerWidth = rectFor('.volume-panel').width;
    var containerHeight = rectFor('#render-container').height;

    var vContainerDrag = d3.drag()
        .on('drag', function() {
            d3.select('#full-vcontainer')
                .style('width', d3.event.x + 'px');
            d3.select('#sliced-vcontainer')
                .style('width', (containerWidth - rectFor('#vcontainer-resizer').right) + 'px');
        });
    d3.select('#vcontainer-resizer').call(vContainerDrag);

    var vPanelDrag = d3.drag()
        .on('drag', function() {
            d3.select('.volume-panel')
                .style('height', d3.event.y + 'px');
            d3.selectAll('.slice')
                .style('height', (containerHeight - d3.event.y) + 'px');
        });
    d3.select('#vpanel-resizer').call(vPanelDrag);

    var xSliceDrag = d3.drag()
        .on('drag', function() {
            d3.select('#xSliceContainer')
                .style('width', d3.event.x + 'px');
            d3.select('#ySliceContainer')
                .style('width', (containerWidth - rectFor('#zSliceContainer').width - d3.event.x) + 'px');
        });
    d3.select('#x-slice-resizer').call(xSliceDrag);

    var ySliceDrag = d3.drag()
        .on('drag', function() {
            d3.select('#ySliceContainer')
                .style('width', (d3.event.x - rectFor('#xSliceContainer').width) + 'px');
            d3.select('#zSliceContainer')
                .style('width', (containerWidth - rectFor('#y-slice-resizer').right) + 'px');
        });
    d3.select('#y-slice-resizer').call(ySliceDrag);
}