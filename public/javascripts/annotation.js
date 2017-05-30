var addAnnotationHover = function() {
    $('.point').mouseover(function(e) {
        addAnnotationForSNP(e.target.id);
        d3.select('#' + e.target.id)
            .transition().duration(100)
            .style('fill', 'indianred')
            .attr('r', 10);
    });

    $('.point').mouseout(function(e) {
        removeAnnotationForSNP(e.target.id);
        var point = d3.select('#' + e.target.id);
        point.transition().duration(100)
            .style('fill', 'steelblue')
            .attr('r', point.attr('scaledFreq'));
    });
}

var annotationPath1 = function(radius, width, height, sWidth, offset) {
    return 'M ' + radius + ' 0 L ' + (width - radius) + ' 0 '
    + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + width + ' ' + radius
    + ' L ' + width + ' ' + (height - radius)
    + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + (width - radius) + ' ' + height
    + ' L ' + (width/2 + sWidth/2)+ ' ' + height
    + ' L ' + width/2 + ' ' + (height + offset/2)
    + ' L ' + (width/2 - sWidth/2) + ' ' + height
    + ' L ' + radius + ' ' + height
    + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + 0 + ' ' + (height - radius)
    + ' L ' + 0 + ' ' + radius
    + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + radius + ' ' + 0;
}

var annotationPath2 = function(radius, width, height, sWidth, offset) {
    return 'M ' + radius + ' ' + offset + ' L ' + (width/2 - sWidth/2) + ' ' + offset
    + ' L ' + (width/2) + ' ' + (offset/2)
    + ' L ' + (width/2 + sWidth/2) + ' ' + offset
    + ' L ' + (width - radius) + ' ' + offset
    + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + width + ' ' + (radius+offset)
    + ' L ' + width + ' ' + (height - radius + offset)
    + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + (width - radius) + ' ' + (height + offset)
    + ' L ' + radius + ' ' + (height + offset)
    + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + 0 + ' ' + (height - radius + offset)
    + ' L ' + 0 + ' ' + (radius + offset)
    + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + radius + ' ' + offset;
}

var addAnnotationForSNP = function(id) {
    var point = d3.select('#' + id);
    var annotationWidth = 150, annotationHeight = 100;
    var pointX = (+point.attr('cx')), pointY = (+point.attr('cy'));

    var fontSize = 14,
        radius = 10, triangleWidth = 20, offset = 20,
        textInset = { x: 15, y: 15 }, interlineSpacing = 5;
    var annotationX = pointX - annotationWidth/2, 
        annotationY = pointY - annotationHeight - offset;

    var path = '';
    if (annotationY < 0) {
        textInset.y += offset;
        annotationY = pointY;
        path = annotationPath2(radius, annotationWidth, annotationHeight,
            triangleWidth, offset);
        offset /= 2;
    } else {
        path = annotationPath1(radius, annotationWidth, annotationHeight,
            triangleWidth, offset);
    }

    var annotation = d3.select('.chart').append('g')
        .attr('class', 'annotation')
        .attr('id', 'annotation' + id)
        .attr('transform', 'translate(' + annotationX + ',' + annotationY + ')')
        .attr('width', annotationWidth).attr('height', annotationHeight);

    annotation.append('path')
        .style('stroke-linejoin', 'round')
        .style('stroke', 'steelblue')
        .style('stroke-width', '3')
        .style('fill', 'white')
        .attr('d', path);

    var rsText = annotation.append('text')
        .attr('class', 'label')
        .attr('x', annotationWidth/2).attr('y', textInset.y)
        .attr('dy', 2)
        .style('font-weight', '600')
        .text(point.attr('snp'));   

    var freqText = annotation.append('text')
        .attr('class', 'label')
        .attr('x', annotationWidth/2).attr('y', (+rsText.attr('dy')) + (+rsText.attr('y')) + fontSize + interlineSpacing)
        .text('Frequency: ' + point.attr('freq'));

    var pText = annotation.append('text')
        .attr('class', 'label')
        .attr('x', annotationWidth/2).attr('y', (+freqText.attr('y')) + fontSize + interlineSpacing)
        .text('p: ' + point.attr('p'));

    var bpText = annotation.append('text')
        .attr('class', 'label')
        .attr('x', annotationWidth/2).attr('y', (+pText.attr('y')) + fontSize + interlineSpacing)
        .text('Location: ' + point.attr('bp'));
}

var removeAnnotationForSNP = function(id) {
    var point = d3.select('#' + id);
    d3.select('.chart').select('#annotation' + id).remove();
}