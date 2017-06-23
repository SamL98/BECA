// The sliced volume volume and the three slice renderers.
var slices, sliceX, sliceY, sliceZ;

/**
 * Destroys the renderers in preparation for new rendering.
 */
var destroyRenderers = function() {
    sliceX.destroy();
    sliceY.destroy();
    sliceZ.destroy();
}

/**
 * Renders the orthogonal slices of the brain with or without a colortable overlay.
 * @see https://github.com/xtk/X for more information on the XTK framework.
 * @see http://api.goxtk.com for more information on the XTK framework.
 * 
 * @param {string} colortable The optional colortable filename to overlay on the brain.
 * @param {string} main Specifies which orientation (x, y, or z) is to be placed in the main slice container.
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

    // Map the id's of the slice containers to their respective classes.
    containers = {
        'main': '.main-slice',
        'sec-top': '.top-slice',
        'sec-bottom': '.bottom-slice'
    };

    // If no main is given, default to the x orientation.
    if (main == null) {
        main = 'x';
    }

    // Initialize an empty dict that will hold the orientations.
    orientations = {};
    if (main === 'x') {
        // If x is the main, default to y on top and z on bottom.
        orientations = {'X': 'main', 'Y': 'sec-top', 'Z': 'sec-bottom'};
    } else if (main === 'y') {
        // If y is the main, default to x on top and z on bottom.
        orientations = {'Y': 'main', 'X': 'sec-top', 'Z': 'sec-bottom'};
    } else {
        // If z is the main, default to x on top and y on bottom.
        orientations = {'Z': 'main', 'X': 'sec-top', 'Y': 'sec-bottom'};
    }

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

    // Add the sliced brain to one of the renderers to load it and render.
    sliceX.add(slices);
    sliceX.render();

    // Once the sliced brain has loaded, add it to the other slices so that no extraneous loading occurs.
    sliceX.onShowtime = function() {
        sliceY.add(slices);
        sliceY.render();

        sliceZ.add(slices);
        sliceZ.render();
    }

    /**
     * 2nd-order function to return a handler for mousedown events in each of the slice containers.
     * On mousedown, change the index of the slices not triggering the event to reflect the position of the event.
     * 
     * @param {X.renderer2D.prototype} renderer The renderer2D that the event occurs within.
     * @param {string} id The id of the slice containaer.
     * @param {string} orientation The orientation currently being displayed in that container.
     */
    var mouseDown = function(renderer, id, orientation) {
        // Default X.onMouseDown handler needs left, middle, and right params to determine what type of click triggered the event.
        return function(left, middle, right) {
            // Only change the slice indices if it is a left mousedown.
            if (!left) {
                return;
            }

            // Obtain the position of the mousedown in the given renderer.
            var pos = renderer.interactor.mousePosition;

            // Determine the percent across and down the given slice container.
            let rect = rectFor(id);
            pos = {x: pos[0]/rect.width, y: pos[1]/rect.height};

            // Obtain the dimensions of the sliced brain as a length-3 array.
            let dims = slices.dimensions;

            // Depending on which orientation is displayed in the event container, change the other indices accordingly.
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

            // Signify that children (2d slices) of the sliced brain have changed.
            slices.modified();
        }
    }

    // Create the renderer onMouseDown handlers with their respective renderers, id's from the containers map, and orientation.
    sliceX.interactor.onMouseDown = mouseDown(sliceX, containers[orientations['X']], 'x');
    sliceY.interactor.onMouseDown = mouseDown(sliceY, containers[orientations['Y']], 'y');
    sliceZ.interactor.onMouseDown = mouseDown(sliceZ, containers[orientations['Z']], 'z');
};

/**
 * Displays the specified orientation in the main slice container.
 * @param {string} o The desired orientation.
 */
var switchToOrientation = function(o) {
    // Do nothing if the specified orientation is the same as the current, global orientation.
    if (o === orientation) {
        return;
    }

    // Set the global orientation.
    orientation = o;

    // Destroy the current renderers.
    destroyRenderers();

    // Renderer the slices according to their new orientation.
    renderBrain(colortable, orientation);
}