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

    // Rerender the brain passing the constructed colortable url.
    renderBrain(colortable);
}