var addAnnotationHover = function() {
    $('.point').mouseover(function(e) {
        addAnnotationForSNP(e.target.id);
        d3.select('#' + e.target.id)
            .transition().duration(100)
            .style('fill', 'indianred')
            .attr('r', 7);
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
    var annotationWidth = 150, annotationHeight = 75;
    var pointX = (+point.attr('cx')), pointY = (+point.attr('cy'));

    var fontSize = 14,
        radius = 10, triangleWidth = 20, offset = 20,
        textInset = { x: 15, y: 15 }, interlineSpacing = 5;
    var annotationX = pointX - annotationWidth/2, 
        annotationY = pointY - annotationHeight - offset;
    var result = pathFor(pointX, pointY, annotationX, annotationY, textInset.x, textInset.y,
        offset, radius, annotationWidth, annotationHeight, triangleWidth);
    annotationY = result[1];
    offset = result[2];
    const path = result[0];

    var annotation = annotationFor('s', '.chart', id, annotationX, annotationY, annotationWidth, annotationHeight);
    addPathTo(annotation, path);

    var dy = result[3] ? '2em' : '0';

    var rsText = appendLabelTo(annotation, annotationWidth/2,
        textInset.y, dy, point.attr('snp')).style('font-weight', '600');

    var pText = appendLabelTo(annotation, annotationWidth/2,
        (+rsText.attr('y')) + fontSize + interlineSpacing, dy, 'p: ' + point.attr('p'));

    var bpText = appendLabelTo(annotation, annotationWidth/2,
        (+pText.attr('y')) + fontSize + interlineSpacing, dy, 'Location: ' + point.attr('bp'));
}

var removeAnnotationForSNP = function(id) {
    d3.select('#annotation' + id).remove();
}

var addAnnotationForPValue = function(id) {
    var voxel = d3.select('#' + id);
    const x = parseInt(voxel.attr('x'));
    const y = parseInt(voxel.attr('y'));
    const annoWidth = 100, annoHeight = 75;

    var fontSize = 14, radius = 10,
        triangleWidth = 20, offset = 20,
        textInset = { x: 15, y: 15 }, interlineSpacing = 5;

    const annoX = x - annoWidth/2;
    var annoY = y - annoHeight - offset;
    var result = pathFor(x, y, annoX, annoY, textInset.x, textInset.y,
        offset, radius, annoWidth, annoHeight, triangleWidth);
    annoY = result[1];
    offset = result[2];
    const path = result[0];

    var annotation = annotationFor('p', '.grid', id, annoX, annoY, annoWidth, annoHeight);
    addPathTo(annotation, path);

    var rsText = appendLabelTo(annotation, annoWidth/2,
        textInset.y, 2, voxel.attr('snp')).style('font-weight', '600');
    var pText = appendLabelTo(annotation, annoWidth/2,
        (+rsText.attr('y')) + fontSize + interlineSpacing, 0, 'p: ' + voxel.attr('y'));
    var roiText = appendLabelTo(annotation, annoWidth/2,
        (+pText.attr('y')) + fontSize + interlineSpacing, 0, 'ROI: ' + voxel.attr('roi'));
}

var removeAnnotationForPValue = function(id) {
    d3.select('#p-annotation-' + id).remove();
}

var pathFor = function(x, y, annoX, annoY, textInsetX, textInsetY, offset, radius, annoWidth, annoHeight, trWidth) {
    var path = '';
    var upPath = false;
    if (annoY < 0) {
        textInsetY += offset;
        annoY = y;
        path = annotationPath2(radius, annoWidth, annoHeight,
            trWidth, offset);
        offset /= 2;
        upPath = true;
    } else {
        path = annotationPath1(radius, annoWidth, annoHeight,
            trWidth, offset);
    }
    return [path, annoY, offset, upPath];
}

var annotationFor = function(type, node, id, x, y, width, height) {
    if (type == 'p') {
        id = 'p-annotation-' + id;
    } else {
        id = 'annotation' + id;
    }

    return d3.select(node).append('g')
        .attr('class', 'annotation')
        .attr('id', id)
        .attr('transform', 'translate(' + x + ',' + y + ')')
        .attr('width', width).attr('height', height);
}

var addPathTo = function(anno, path) {
    anno.append('path')
        .style('stroke-linejoin', 'round')
        .style('stroke', 'steelblue')
        .style('stroke-width', '3')
        .style('fill', 'white')
        .attr('d', path);
}

var appendLabelTo = function(node, x, y, dy, text) {
    return node.append('text')
        .attr('class', 'label')
        .attr('x', x).attr('y', y).attr('dy', dy)
        .text(text);
}