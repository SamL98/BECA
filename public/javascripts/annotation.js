/**
 * Add bindings to each point on the SNP chart to display annotation information on hover.
 * @see http://jquery.com for more information on jQuery and possible bindings.
 * Note - this could also be accomplished using D3 bindings.
 */
var addAnnotationHover = function() {
    $('.point')
        .mouseover(function(e) {
            // On mouseover, add the actual annotation.
            addAnnotationForSNP(e.target.id);

            // Modify the point to indicate that its annotation is being displayed.
            d3.select('#' + e.target.id)
                .transition().duration(100)
                .style('fill', 'indianred')
                .attr('r', 7);
        }).mouseout(function(e) {
            // On mouseout, remove the annotation.
            removeAnnotationForSNP(e.target.id);

            // Modify the point to indicate that it is no longer being inspected.
            var point = d3.select('#' + e.target.id);
            point.transition().duration(100)
                .style('fill', 'steelblue')
                .attr('r', point.attr('scaledFreq'));
        });
}

/**
 * Return SVG drawing instruction for the border of an annotation above a point with the arrow pointing down.
 * The default and preferred annotation path, used when possible.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d for more information on how to construct an SVG path.
 * 
 *  __________
 * /          \
 * |          | The rough outline of the annotation.
 * \____  ____/
 *      \/
 * 
 * @param {integer} radius The corner radius of the annotation.
 * @param {integer} width The width of the annotation.
 * @param {integer} height The height of the annotation.
 * @param {integer} sWidth The width of the triangle directed at the point.
 * @param {integer} offset The offset of the annotation to the point.
 * 
 * @returns The string representation of the path.
 */
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

/**
 * Return SVG drawing instruction for the border of an annotation above a point with the arrow pointing down.
 * Used when the point is located so that if annotationPath1 is used, the top would overflow.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d for more information on how to construct an SVG path.
 * 
 *  ____/\____
 * /          \
 * |          | The rough outline of the annotation.
 * \__________/
 * 
 * @param {integer} radius The corner radius of the annotation.
 * @param {integer} width The width of the annotation.
 * @param {integer} height The height of the annotation.
 * @param {integer} sWidth The width of the triangle directed at the point.
 * @param {integer} offset The offset of the annotation to the point.
 * 
 * @returns The string representation of the SVG path.
 */
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

/**
 * Adds a SNP annotation to the specified point.
 * @param {string} id The id of the point to annotate.
 */
var addAnnotationForSNP = function(id) {
    // Select the point.
    var point = d3.select('#' + id);
    // Specify the width and height of the annotation.
    var annotationWidth = 135, annotationHeight = 70;
    // Obtain the center coordinates of the point.
    var pointX = (+point.attr('cx')), pointY = (+point.attr('cy'));

    // Specify variables for use in displaying the annotation and text.
    // - fontSize: the point size of the font used in the annotation labels.
    // - radius: the corner radius of the annotation.
    // - triangleWidth: the width of the triangular indicator of the annotation.
    // - offset: the offset of the annotation with respect to the point.
    // - textInset: x and y insets for the annotation labels.
    // - interlineSpacing: spacing between annotation labels.
    var fontSize = 14,
        radius = 10, triangleWidth = 20, offset = 20,
        textInset = { x: 15, y: 10 }, interlineSpacing = 5;

    // Calculate the origin points of the annotation.
    var annotationX = pointX - annotationWidth/2, 
        annotationY = pointY - annotationHeight - offset;

    // Obtain the annotation path to use given the set parameters
    // Note - Array result is returned because if the annotationY is less than zero, the annotationY, offset, and textInsets must change.
    var result = pathFor(pointX, pointY, annotationX, annotationY, textInset.x, textInset.y,
        offset, radius, annotationWidth, annotationHeight, triangleWidth);
    
    // Parse the results from the path calculation.
    annotationY = result[1];
    offset = result[2];
    const path = result[0];

    // If annotationPath1 is used, modify the dy of the labels.
    const dy = result[3] ? '2em' : '0';

    // Create and return the annotation SVG element
    var annotation = annotationFor('s', '.chart', id, annotationX, annotationY, annotationWidth, annotationHeight);
    // Add the calculated path to the annotation.
    addPathTo(annotation, path);

    // Add the SNP name label.
    var rsText = appendLabelTo(annotation, annotationWidth/2,
        textInset.y, dy, point.attr('snp')).style('font-weight', '600');

    // Add p-value label.
    var pText = appendLabelTo(annotation, annotationWidth/2,
        (+rsText.attr('y')) + fontSize + interlineSpacing, dy, 'p: ' + point.attr('p'));

    // Add basepair location label.
    var bpText = appendLabelTo(annotation, annotationWidth/2,
        (+pText.attr('y')) + fontSize + interlineSpacing, dy, 'Location: ' + point.attr('bp'));
}

/**
 * Removes the specifies chart annotation.
 * @param {string} id The id of the annotation to remove.
 */
var removeAnnotationForSNP = function(id) {
    d3.select('#annotation' + id).remove();
}

/**
 * Adds an annotation for a cell in the voxel grid.
 * @param {string} id The id of the grid cell to add the annotation for.
 * @param {string} snp The name of the SNP (passed to the function since it is stored as an attribute in the container column of the cell).
 */
var addAnnotationForPValue = function(id, snp) {
    // Obtain the voxel DOM element.
    const voxel = d3.select('#' + id);

    // Obtain the rect for the voxel and grid, respectively.
    const rect = rectFor('#' + id);
    const gridRect= rectFor('.grid');

    // Calculate the x and y center of the voxel, adjusting for grid margins.
    const x = (rect.left + rect.right)/2 - gridRect.left;
    const y = (rect.top + rect.bottom)/2 - gridRect.top;

    // Specify the width and height of the annotation.
    const annoWidth = 100, annoHeight = 65;

    // Specify variables for use in displaying the annotation and text.
    // - fontSize: the point size of the font used in the annotation labels.
    // - radius: the corner radius of the annotation.
    // - triangleWidth: the width of the triangular indicator of the annotation.
    // - offset: the offset of the annotation with respect to the point.
    // - textInset: x and y insets for the annotation labels.
    // - interlineSpacing: spacing between annotation labels.
    var fontSize = 14, radius = 10,
        triangleWidth = 20, offset = 20,
        textInset = { x: 15, y: 15 }, interlineSpacing = 5;

    // Specify the x and y origins for the annotation.
    const annoX = x - annoWidth/2;
    var annoY = y - annoHeight - offset;

    // Determine the annotation path to use given the parameters.
    var result = pathFor(x, y, annoX, annoY, textInset.x, textInset.y,
        offset, radius, annoWidth, annoHeight, triangleWidth);

    // Get the results from the side effects of calculating the path.
    annoY = result[1];
    offset = result[2];
    textInset.y = result[4];
    const path = result[0];

    // Create the annotation.
    var annotation = annotationFor('p', '.grid', id, annoX, annoY, annoWidth, annoHeight);
    // Add the specified path to it.
    addPathTo(annotation, path);

    // Add the SNP name label.
    var rsText = appendLabelTo(annotation, annoWidth/2,
        textInset.y, 2, snp).style('font-weight', '600');
   
    // Add the p-value label.    
    var pText = appendLabelTo(annotation, annoWidth/2,
        (+rsText.attr('y')) + fontSize + interlineSpacing, 0, 'p: ' + voxel.attr('p'));
    
    // Add the ROI label.
    var roiText = appendLabelTo(annotation, annoWidth/2,
        (+pText.attr('y')) + fontSize + interlineSpacing, 0, 'ROI: ' + voxel.attr('roi'));
}

/**
 * Removes the specified voxel annotation.
 * @param {string} id The id of the annotation to remove.
 */
var removeAnnotationForPValue = function(id) {
    d3.select('#p-annotation-' + id).remove();
}

/**
 * Calculates the path to use given the parameters and returns the path along with changed values.
 * 
 * @param {integer} x 
 * @param {integer} y 
 * @param {integer} annoX 
 * @param {integer} annoY 
 * @param {integer} textInsetX 
 * @param {integer} textInsetY 
 * @param {integer} offset 
 * @param {integer} radius 
 * @param {integer} annoWidth 
 * @param {integer} annoHeight 
 * @param {integer} trWidth 
 * 
 * @returns The path (string) and the values that could be updated if annotationPath2 is used: annoY, offset, textInsetY, along with a boolean flag to communicate if annotationPath1 was used or not in array form.
 */
var pathFor = function(x, y, annoX, annoY, textInsetX, textInsetY, offset, radius, annoWidth, annoHeight, trWidth) {
    var path = '';
    var upPath = false;

    // If the annotation's y origin would be offscreen adjust the parameters as follows.
    if (annoY < 0) {
        textInsetY += offset;
        annoY = y;
        path = annotationPath2(radius, annoWidth, annoHeight,
            trWidth, offset);
        offset /= 2;
        upPath = true;
    // If the annotation's y origin doesn't overflow, use the preferred annotationPath1.
    } else {
        path = annotationPath1(radius, annoWidth, annoHeight,
            trWidth, offset);
    }
    return [path, annoY, offset, upPath, textInsetY];
}

/**
 * Creates and returns an annotation based on the given parameters.
 * 
 * @param {string} type The type of annotation to create, either 'p' for a voxel annotation, or otherwise of chart annotation.
 * @param {string} node The selector of the element to add the annotation to.
 * @param {string} id The id to give the annotation.
 * @param {string} x The x origin of the annotation.
 * @param {string} y The y origin of the annotation.
 * @param {string} width The width of the annotation.
 * @param {string} height The height of the annotation.
 * 
 * @returns The created SVG graphical element representing the annotation.
 */
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

/**
 * Adds the given path to the given annotation.
 * @param {d3.Selection} anno The d3 selection of the annotation.
 * @param {string} path The path of the outline of the annotation.
 */
var addPathTo = function(anno, path) {
    anno.append('path')
        .style('stroke-linejoin', 'round')
        .style('stroke', 'steelblue')
        .style('stroke-width', '3')
        .style('fill', 'white')
        .attr('d', path);
}

/**
 * Creates a label based off the given parameters, appends it to the given selection, and returns it.
 * 
 * @param {d3.Selection} node The selection of the annotation.
 * @param {string} x The x coordinate of the label.
 * @param {string} y The y coordinate of the label.
 * @param {string} dy The relative dy of the label in its coordinate space.
 * @param {string} text The text of the label.
 * 
 * @returns The created label.
 */
var appendLabelTo = function(node, x, y, dy, text) {
    return node.append('text')
        .attr('class', 'label')
        .attr('x', x).attr('y', y).attr('dy', dy)
        .text(text);
}