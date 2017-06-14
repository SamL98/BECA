/**
 * Removes all previous grids in preparation fo a new one.
 */
var removePreviousGrids = function() {
    d3.selectAll('.grid').remove();
}

// Variables to keep track of the previously selected column and previously hovered cell, respectively.
var prevCol = null;
var prevCell = null;

/**
 * Displays a voxel grid where each column represents a SNP and each row represents an ROI. Each cell is colored based off that SNP's p-value on the ROI with red corresponding to 0 and blue corresponding to 1.
 * @see https://github.com/d3/d3/wiki for more information on the D3 framework.
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG for more information on SVG.
 */
var displayGrid = function() {
    // Remove the previous grids.
    removePreviousGrids();
    
    // Only display the data that is within the current bounds.
    var data = [];
    for (var i = 0; i < snps.length; i++) {
        var snp = snps[i];
        if (snp.loc >= lowerBound || snp.loc <= upperBound) {
            data.push(snp);
        }
    }

    // Define the width and height of each cell.
    const boxWidth = 7.5, boxHeight = 7.5;
    // Define the width and height of the whole grid based off the number of ROIs and the amount of SNPs in range.
    const gridWidth = data.length * boxWidth, gridHeight = 116 * boxHeight;

    // Change the width and height of the grid container.
    d3.select('#grid-container')
        .style('width', gridWidth).style('height', gridHeight);

    // Create the SVG grid.
    var grid = d3.select('#grid-container').append('svg')
        .attr('class', 'grid').attr('width', gridWidth).attr('height', gridHeight);
    var rect = rectFor('.grid');

    // Define the x and y scales to transform the given domains to the edges of the grid frame.
    var x = d3.scaleLinear().range([rect.left, rect.right]).domain([0, boxWidth * snps.length]);
    var y = d3.scaleLinear().range([rect.bottom, rect.top]).domain([0, boxHeight * 116]);

    // Append the label for the x axis to the grid.
    grid.append('g').attr('transform', 'translate(' + 300.0 + ',' + gridMargins.top + ')')
        .append('text')
            .attr('class', 'gridLabel')
            .style('text-anchor', 'middle').style('font-weight', 400)
            .text('SNPs on chr ' + currChr + ' from ' + lowerBound + '-' + upperBound);

    // Append the label for the y axis to the grid.
    grid.append('g').attr('transform', 'rotate(-90) translate(' + (-225.0) + ',0)') 
        .append('text')
            .attr('dy', '2em')
            .attr('class', 'gridLabel')
            .style('text-anchor', 'middle').style('font-weight', 400)
            .text('ROIs');

    // Add all of the cells to the grid
    d3.select('.grid').selectAll('g').data(data)
        .enter().append('g')
            .attr('class', 'column').attr('id', function(s, i) { return 'col' + i; })
            .attr('snp', function(s) { return s.name; })
            .attr('transform', function(s, i) { return 'translate(' + (boxWidth * i + gridMargins.left) + ',' + 1.5 * gridMargins.top + ')'})
            .on('click', function(s, i) {
                /** For each column, when selected, outline it in white and display the colortable corresponding to that SNP on the renderers. */

                // If a column was previously selected, unselected it.
                if (prevCol) {
                    d3.select('#col' + prevCol).selectAll('rect').style('stroke', 'black');
                }

                // Select the new column.
                d3.select('#col' + i).selectAll('rect').style('stroke', 'white');
                prevCol = i;

                // Indicate loading
                addLoader();
                // Add the overlay (custom colortable) on the renderers.
                renderOverlay(s.name);
                // Set to not loading
                removeLoader();
            })
            .selectAll('rect').data(function(s) { return s.pvalues; }).enter().append('rect')
                .attr('id', function(p, j) { return 'p-' + (parseInt(Math.random() * 10000)) + '-' + j; })
                .attr('snp', s.name).attr('p', function(p) { return p; })
                .attr('roi', function(p, j) { return j; })
                .attr('x', 0).attr('y', function(p, j) { return boxHeight * j; })
                .attr('width', boxWidth).attr('height', boxHeight)
                .style('stroke', 'black')
                .style('fill', function(p) { 
                    // Fill each cell according to its inteprolated p-value.
                    return pToRGB(p); 
                })
                .on('mouseover', function() {
                    /** Similar to chart points, add voxel annotations on hover. */

                    // Outline the voxel in white.
                    const id = d3.event.target.id;
                    d3.select('#' + id)
                        .style('stroke', 'white');
                    prevCell = id;

                    // Get the SNP name from the parent column.
                    const snp = this.parentNode.getAttribute('snp');
                    // Add the voxel annotation.
                    addAnnotationForPValue(id, snp);
                })
                .on('mouseout', function() {
                    /** Remove the voxel annotation when the mouse exists the cell's bounds. */

                    // If the voxel was previously hovered over, remove the annotation and set the outline to black.
                    const id = d3.event.target.id;
                    if (prevCell) {
                        d3.select('#' + id)
                            .style('stroke', 'black');
                        removeAnnotationForPValue(id);
                    }
                });
}