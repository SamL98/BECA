/**
 * Creates the filename for the colortable for the given SNP and rerenders the brain.
 * @param {string} name The name of the snp to create the colortable for and render.
 */
var renderOverlay = function(name) {
    panel.DisplayOverlay = true;

    // Create the URL for the colortable from the fileserver.
    colortable = 'http://localhost:8000/' + currChr + '/' + name + '/colortable.txt';
    
    // Destroy the current renderers.
    destroyRenderers();

    // Add the label indicating which SNP is being presented to the right panel.
    addSNPLabel(name);

    // Rerender the brain passing the constructed colortable url.
    renderBrain(colortable, orientation);
}

/**
 * Displays the name of the SNP selected in the Voxel Grid on the render container.
 * @param {string} name The name of the selected SNP.
 */
var addSNPLabel = function(name) {
    // Remove the previous label (if exists).
    removeSNPLabel();

    // Set the global variable for selected SNP name.
    previousSNPLabel = name;

    // Assert that the SNP Label should be displayed
    if (!displaySNPLabel) {
        return;
    }

    // Insert the SNP Label at the beginning of the render container hierarchy.
    d3.select('#render-container').insert('h2', '.main-slice')
        .attr('class', 'header').attr('id', 'snp-label')
        .style('margin-top', '5px')
        .style('position', 'absolute').style('top', '0').style('left', '0').style('right', '0')
        .style('color', 'white')
        .style('background-color', 'black')
        .text(name);

    // Adjust the heights of the slice containers to fit the render container.
    let labelBottom = rectFor('#snp-label').bottom - rectFor('#render-container').top;
    let newHeight = (rectFor('#render-container').height - labelBottom) + 'px';
    d3.select('.main-slice')
        .style('height', newHeight);
    d3.select('.slice-container')
        .style('height', newHeight);
}

/**
 * Removes the SNP Label from the render container.
 */
var removeSNPLabel = function() {
    // Remove the label.
    d3.select('#snp-label').remove();

    // Adjust the heights of the slice containers to fit the render container.
    d3.select('.main-slice')
        .style('height', '100%');
    d3.select('.slice-container')
        .style('height', '96%');
}