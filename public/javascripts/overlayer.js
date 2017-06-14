var renderOverlay = function(name) {
    colortable = 'http://localhost:8000/' + currChr + '/' + name + '/colortable.txt';
    
    r1.destroy();
    r2.destroy();
    sliceX.destroy();
    sliceY.destroy();
    sliceZ.destroy();

    renderBrain(colortable);
}