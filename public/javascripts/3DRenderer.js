// Global variables to determine which renderers are being shown.
var displayingVolume = true, displayingFull = true,
    displayingCombined = true, displayingSlices = true,
    displayingFullSlices = false;
// Respectively, the full volume renderer, the sliced volume renderer, the full volume volume, the sliced volume volume, and the three slice renderers.
var slices, sliceX, sliceY, sliceZ;

/**
 * Renders the full, sliced, and orthogonal slices of the brain with or without a colortable overlay.
 * @see https://github.com/xtk/X for more information on the XTK framework.
 * @see http://api.goxtk.com for more information on the XTK framework.
 * @param {string} colortable The optional colortable filename to overlay on the brain.
 */
var renderBrain = function(colortable, main) {
    // Create the sliced volume.
    slices = new X.volume();
    slices.file = 'http://localhost:8000/file/gray_matter.nii';
    slices.labelmap.file = 'http://localhost:8000/file/converted.nii';

    // If a colortable is given, specify it as the colortable for both volumes.
    if (colortable) {
        slices.labelmap.colortable.file = colortable;
    }

    orientations = {};
    containers = {
        'main': '.main-slice',
        'sec-top': '.top-slice',
        'sec-bottom': '.bottom-slice'
    };

    if (main == null) {
        main = 'x';
    }

    if (main === 'x') {
        orientations = {'X': 'main', 'Y': 'sec-top', 'Z': 'sec-bottom'};
    } else if (main === 'y') {
        orientations = {'Y': 'main', 'X': 'sec-top', 'Z': 'sec-bottom'};
    } else {
        orientations = {'Z': 'main', 'X': 'sec-top', 'Y': 'sec-bottom'};
    }

    console.log(orientation, orientations);

    // Create the X-oriented slice.
    sliceX = new X.renderer2D();
    sliceX.container = orientations['X'];
    sliceX.orientation = 'X';
    sliceX.init();

    // Create the Y-oriented slice.
    sliceY = new X.renderer2D();
    sliceY.container = orientations['Y'];
    sliceY.orientation = 'Y';
    sliceY.init();

    // Create the Z-oriented slice.
    sliceZ = new X.renderer2D();
    sliceZ.container = orientations['Z'];
    sliceZ.orientation = 'Z';
    sliceZ.init();

    sliceX.add(slices);
    sliceX.render();

    sliceX.onShowtime = function() {
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

    sliceX.interactor.onMouseDown = mouseDown(sliceX, containers[orientations['X']], 'x');
    sliceY.interactor.onMouseDown = mouseDown(sliceY, containers[orientations['Y']], 'y');
    sliceZ.interactor.onMouseDown = mouseDown(sliceZ, containers[orientations['Z']], 'z');
};

var switchToOrientation = function(o) {
    if (o === orientation) {
        return;
    }

    orientation = o;
    destroyRenderers();

    if (o === 'x') {
        renderBrain(colortable, 'x');
    } else if (o === 'y') {
        renderBrain(colortable, 'y');
    } else {
        renderBrain(colortable, 'z');
    }
}