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
    var containerRight = rectFor('.volume-panel').width;
    var drag = d3.drag()
        .on('drag', function() {
            d3.select('#full-vcontainer')
                .style('width', d3.event.x + 'px');
            d3.select('#sliced-vcontainer')
                .style('width', (containerRight - rectFor('#vcontainer-resizer').right) + 'px');
        });

    d3.select('#vcontainer-resizer').call(drag);
}