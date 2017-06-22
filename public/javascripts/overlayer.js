var destroyRenderers = function() {
    sliceX.destroy();
    sliceY.destroy();
    sliceZ.destroy();
}

/**
 * Creates the filename for the colortable for the given SNP and rerenders the brain.
 * @param {string} name The name of the snp to create the colortable for and render.
 */
var renderOverlay = function(name) {
    // Create the URL for the colortable from the fileserver.
    colortable = 'http://localhost:8000/' + currChr + '/' + name + '/colortable.txt';
    
    // Destroy the current renderers.
    destroyRenderers();

    // Add the label indicating which SNP is being presented to the right panel.
    addSNPLabel(name);

    // Rerender the brain passing the constructed colortable url.
    renderBrain(colortable, orientation);
}

var addSNPLabel = function(name) {
    removeSNPLabel();
    previousSNPLabel = name;
    if (!displaySNPLabel) {
        return;
    }

    d3.select('#render-container').insert('h2', '.main-slice')
        .attr('class', 'header').attr('id', 'snp-label')
        .style('margin-top', '5px')
        .style('display', 'inline-block')
        .style('color', 'white')
        .style('background-color', 'black')
        .text(name);
    let newHeight = (rectFor('.main-slice').height - rectFor('#snp-label').height) + 'px';
    d3.select('.main-slice')
        .style('height', newHeight);
    d3.select('.slice-container')
        .style('height', newHeight);
}

var previousSNPLabel = '';
var removeSNPLabel = function() {
    d3.select('#snp-label').remove();
    d3.select('.main-slice')
        .style('height', '100%');
    d3.select('.slice-container')
        .style('height', '100%');
}