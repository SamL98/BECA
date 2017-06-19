// Global variables to determine which renderers are being shown.
var displayingVolume = true, displayingFull = true,
    displayingCombined = true, displayingSlices = true,
    displayingFullSlices = false;
// Respectively, the full volume renderer, the sliced volume renderer, the full volume volume, the sliced volume volume, and the three slice renderers.
var r1, r2, volume, slices, sliceX, sliceY, sliceZ;

/**
 * Renders the full, sliced, and orthogonal slices of the brain with or without a colortable overlay.
 * @see https://github.com/xtk/X for more information on the XTK framework.
 * @see http://api.goxtk.com for more information on the XTK framework.
 * @param {string} colortable The optional colortable filename to overlay on the brain.
 */
var renderBrain = function(colortable) {
    // Initialize the full volume renderer.
    r1 = new X.renderer3D();
    r1.container = 'full-vcontainer';
    r1.init();

    // Initialize the sliced volume renderer.
    r2 = new X.renderer3D();
    r2.container = 'sliced-vcontainer';
    r2.init();

    // Create the sliced volume.
    slices = new X.volume();
    slices.file = 'http://localhost:8000/file/gray_matter.nii';
    slices.labelmap.file = 'http://localhost:8000/file/converted.nii';

    // Create the 3d volume.
    volume = new X.volume();
    volume.file = 'http://localhost:8000/file/gray_matter.nii';
    volume.labelmap.file = 'http://localhost:8000/file/converted.nii';

    // If a colortable is given, specify it as the colortable for both volumes.
    if (colortable) {
        slices.labelmap.colortable.file = colortable;
        volume.labelmap.colortable.file = colortable;
    }

    // Create the X-oriented slice.
    sliceX = new X.renderer2D();
    sliceX.container = 'xSliceContainer';
    sliceX.orientation = 'X';
    sliceX.init();

    // Create the Y-oriented slice.
    sliceY = new X.renderer2D();
    sliceY.container = 'ySliceContainer';
    sliceY.orientation = 'Y';
    sliceY.init();

    // Create the Z-oriented slice.
    sliceZ = new X.renderer2D();
    sliceZ.container = 'zSliceContainer';
    sliceZ.orientation = 'Z';
    sliceZ.init();

    // Add the 3d volume to its renderer, render, and set the camera position.
    r1.add(volume);
    r1.render();
    r1.camera.position = [0, 0, 300];
    
    // Edit the 3d volume properties for volume rendering.
    volume.volumeRendering = true;
    volume.opacity = 1.0;
    volume.lowerThreshold = 0.01;
    volume.windowLow = 0.01;
    volume.windowHigh = 1;
    volume.minColor = (colortable == null) ? [0, 0, 0] : [1, 0, 0];
    volume.maxColor = (colortable == null) ? [1, 1, 1] : [0, 0, 1];

    // Add the sliced volume to its renderer, render, and set the camera position.
    r2.add(slices);
    r2.render();
    r2.camera.position = [0, 0, 300];

    // Wait for the sliced brain to load then add the slices to their respective renderers and render.
    r2.onShowtime = function() {
        sliceX.add(slices);
        sliceX.add(linexy);
        sliceX.render();

        sliceY.add(slices);
        sliceY.render();

        sliceZ.add(slices);
        sliceZ.render();
    }

    var mouseDown = function(renderer, id, orientation) {
        return function(left, middle, right) {
            var pos = renderer.interactor.mousePosition;
            let rect = rectFor(id);
            pos = {x: pos[0]/rect.width, y: pos[1]/rect.height};
            let dims = slices.dimensions;
            if (orientation == 'x') {
                slices.indexY = dims[1] * pos.x;
                slices.indexZ = dims[2] * pos.y;
            } else if (orientation == 'y') {
                slices.indexX = dims[0] * pos.x;
                slices.indexZ = dims[2] * pos.y;
            } else {
                slices.indexX = dims[0] * pos.x;
                slices.indexY = dims[1] * pos.y;
            }
            slices.modified();
        }
    }

    sliceX.interactor.onMouseDown = mouseDown(sliceX, '#xSliceContainer', 'x');
    sliceY.interactor.onMouseDown = mouseDown(sliceY, '#ySliceContainer', 'y');
    sliceZ.interactor.onMouseDown = mouseDown(sliceZ, '#zSliceContainer', 'z');
};

/**
 * Display both the full and sliced volumes.
 */
var setToBothVolume = function() {
    setToFullVolume(false);
    setToSlicedVolume(false);
}

/**
 * Depending on given flag, either hides or unhides the volume panel.
 * @param {bool} none Determines whether or not to hide the volume panel.
 */
var toggleNoneVolume = function(none) {
    console.log('toggling volume ' + none);
    const destClass = (!none) ? 'vpanelboth' : 'vpanelhidden';
    d3.select('.volume-panel').transition().duration(100)
        .attr('class', destClass);
    displayingVolume = !none;
}

/**
 * Displays the full volume renderer and depending on the given flag, hides the sliced volume renderer.
 * @param {bool} only Determines whether or not the full volume renderers should be the only volume renderer displayed.
 */
var setToFullVolume = function(only) {
    if (!displayingVolume) {
        toggleNoneVolume(false);
        addSlicing();
    }
    if (!displayingFull) {
        addFullVolume();
    }
    if (only) {
        removeSlicedVolume();
    }
}

/**
 * Displays the full sliced volume renderer and depending on the given flag, hides the full volume renderer.
 * @param {bool} only Deteremines whether or not the sliced volume renderer should be the only volume renderer displayed.
 */
var setToSlicedVolume = function(only) {
    if (!displayingVolume) {
        toggleNoneVolume(false);
        addSlicing();
    }
    if (!displayingCombined) {
        addSlicedVolume();
    }
    if (only) {
        removeFullVolume();
    }
}

/**
 * Displays the sliced volume renderer.
 */
var addSlicedVolume = function() {
    console.log('adding sliced volume');
    d3.select('#sliced-vcontainer').transition().duration(100)
        .attr('class', 'vcontainer vboth');
    d3.select('#full-vcontainer').transition().duration(100)
        .attr('class', 'vcontainer vboth');
    displayingCombined = true;
}

/**
 * Displays the full volume renderer.
 */
var addFullVolume = function() {
    console.log('adding full volume');
    d3.select('#full-vcontainer').transition().duration(100)
        .attr('class', 'vcontainer vboth');
    d3.select('#sliced-vcontainer').transition().duration(100)
        .attr('class', 'vcontainer vboth');
    displayingFull = true;
}

/**
 * Hides the sliced volume renderer.
 */
var removeSlicedVolume = function() {
    console.log('removing sliced volume');
    d3.select('#full-vcontainer').transition().duration(100)
        .attr('class', 'vcontainer vsolo');
    d3.select('#sliced-vcontainer').transition().duration(100)
        .attr('class', 'vcontainer vhidden');
    displayingCombined = false;
}

/**
 * Hides the full volume renderer.
 */
var removeFullVolume = function() {
    console.log('removing full volume');
    d3.select('#full-vcontainer').transition().duration(100)
        .attr('class', 'vcontainer vhidden');
    d3.select('#sliced-vcontainer').transition().duration(100)
        .attr('class', 'vcontainer vsolo');
    displayingFull = false;
}

/**
 * Shows slicing only if it is not currently shown.
 */
var setToShowSlicing = function() {
    if (!displayingSlices) {
        addSlicing();
    }
}

/**
 * Hides slicing only if it is currently shown.
 */
var setToHideSlicing = function() {
    if (displayingSlices || displayingFullSlices) {
        removeSlicing();
    }
}

/**
 * Displays the slicing at its normal height.
 */
var addSlicing = function() {
    console.log('adding slicing');
    toggleNoneVolume(false);
    d3.selectAll('.slice').transition().duration(100)
        .attr('class', 'sboth');
    displayingSlices = true;
}

/**
 * Hides the slicing.
 */
var removeSlicing = function() {
    console.log('removing slicing');
    d3.selectAll('.slice').transition().duration(100)
        .attr('class', 'shidden');
    toggleNoneVolume(false);
    d3.select('.volume-panel').transition().duration(100)
        .attr('class', 'vpanelsolo');
    displayingSlices = false;
}

/**
 * Displays the slicing at its full height while hiding the volume panel.
 */
var showFullSlicing = function() {
    console.log('showing full slicing');
    toggleNoneVolume(true);
    d3.selectAll('.slice').transition().duration(100)
        .attr('class', 'ssolo');
    displayingSlices = true;
}