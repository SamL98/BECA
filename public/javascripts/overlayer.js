/**
 * Creates the filename for the colortable for the given SNP and rerenders the brain.
 * @param {string} name The name of the snp to create the colortable for and render.
 */
var renderOverlay = function(name) {
    // Create the URL for the colortable from the fileserver.
    colortable = 'http://localhost:8000/' + currChr + '/' + name + '/colortable.txt';
    
    // Destroy the current renderers.
    r1.destroy();
    r2.destroy();
    sliceX.destroy();
    sliceY.destroy();
    sliceZ.destroy();

    // Add the label indicating which SNP is being presented to the right panel.
    addSNPLabel(name);

    // Rerender the brain passing the constructed colortable url.
    renderBrain(colortable);
}

var addSNPLabel = function(name) {
    previousSNPLabel = name;
    if (!displaySNPLabel) {
        return;
    }

    d3.select('#render-container').insert('h2', '.volume-panel')
        .attr('class', 'header').attr('id', 'snp-label')
        .style('margin-top', '5px')
        .style('display', 'inline-block')
        .style('color', 'white')
        .style('background-color', 'black')
        .text(name);
    d3.select('.volume-panel')
        .style('height', (rectFor('.volume-panel').height - rectFor('#snp-label').height) + 'px');
}

var previousSNPLabel = '';
var removeSNPLabel = function() {
    d3.select('#snp-label').remove();
    d3.select('.volume-panel')
        .style('height', '62%');
}