var renderOverlay = function(name) {
    colortable = 'http://localhost:8000/' + currChr + '/' + name + '/colortable.txt';
    
    r1.destroy();
    r2.destroy();
    sliceX.destroy();
    sliceY.destroy();
    sliceZ.destroy();

    renderBrain(colortable);
    // r1.onShowtime();
    // r2.onShowtime();
    // sliceX.onShowtime();
    // sliceY.onShowtime();

    // r2.destroy();
    // r2 = new X.renderer3D();
    // r2.container = 'sliced-vcontainer';
    // r2.init();
    // slices.labelmap.colortable.file = colortable;
    // slices.modified();
    // r2.add(slices);
    // r2.render();
}