/**
 * Creates a new control panel to manipulate the user-controllable features of the chart, grid, and renderer.
 * 
 * @constructor
 * @this {ControlPanel}
 * @see http://workshop.chromeexperiments.com/examples/gui/ for more information on Dat.GUI.
 */
var ControlPanel = function() {
    //this.DisplayMode = 'All';

    /** Query controls */

    // Text input for the user-entered ROI and Query.
    this.ROI = '';
    this.Query = '';

    /** SNP Chart controls */

    // Submits the given query information.
    this.Submit = function() {
        if (query && query != "" && roi && roi > 0) {
            // If the query and roi are present, fetch the SNP data.
            d3.select('#intro-header').remove();
            performQuery()
        } else if (this.Query != '' && this.ROI != '') {
            query = this.Query;
            roi = this.ROI;
            d3.select('#intro-header').remove();
            this.Submit();
        }
    }

    // Functions to fetch SNPs determined by the given query information.
    var performQuery = function() {
        parseGenomicData(query, roi, function() {
            displayChart();
            displayGrid();
            removeLoader();
        });
    }

    // Function to fetch either the previous or next range on the current chromosome.
    var adjacent = function(type) {
        // Perform the database query.
        adjacentRange(type, currChr, roi, function() {
            // Display the chart and grid.
            displayChart();
            displayGrid();

            // Let the user know that the query and display are completed.
            removeLoader();
        });
    }

    // Buttons to display the previous or next range.
    this.Previous = function() {
        adjacent("prev");
    };
    this.Next = function() {
        adjacent("next");
    };

    // Button to reset the chart zoom
    this.ResetZoom = function() {
        // Reset the bounds.
        lowerBound = originalLower;
        upperBound = originalUpper;

        removeSNPLabel();

        // Show that the redisplay will take some time.
        addLoader();

        // Redisplay the chart and grid.
        displayChart();
        displayGrid();

        // Let the user know that the display is completed.
        removeLoader();
    }

    /** Renderer controls */

    // Controls the min and max colors and opacity of the renderer.
    this.color1 = [1, 0, 0];
    this.color2 = [0, 0, 1]; 
    this.opacity = 0.75;

    // Toggles whether or not to show the SNP label.
    this.ShowLabel = displaySNPLabel;

    // Controls which renderers to display.
    this.VolumeMode = 'Both'; // Potential values: Both - Display both the 3d and sliced volumes, Full - Display only the 3d volume, Slices - Diplay only the sliced volume.
    this.SliceMode = 'Normal'; // Potential values: Normal - Display the orthogonal slices at the bottom with ~30% height, Full - Show only the slicing, no volumes, None - Show no slicing, only volumes.

    // Resets the cameras of the volume renderers to default values.
    this.Reset = function() {
        r1.resetBoundingBox();
        r1.resetViewAndRender();

        r2.resetBoundingBox();
        r2.resetViewAndRender();

        let headerRect = d3.select('#snp-label');
        if (headerRect) {
            d3.select('.volume-panel').style('height', (rectFor('#render-container').height * 0.62 - headerRect.height) + 'px');
        } else {
            d3.select('.volume-panel').style('height', '62%');
        }
        d3.selectAll('.slice').style('height', '35%').style('width', '33%');
        d3.selectAll('.vcontainer').style('width', '48%');
    };
};

/**
 * Creates the control panel and listens to changes in its values.
 * @see http://workshop.chromeexperiments.com/examples/gui/ for more information on Dat.GUI.
 */
var setUpControls = function() {
    // Initialize the panel.
    var panel = new ControlPanel();
    var gui = new dat.GUI({ autoPlace: true });

    // Create the folders to separate chart and renderer control.
    var queryFolder = gui.addFolder('Query');
    var chartFolder = gui.addFolder('Chart');
    var renderFolder = gui.addFolder('Render');

    // Save the current panel settings in local storage (cleared when cache is emptied).
    gui.remember(panel);

    /*var displayControl = displayFolder.add(panel, 'DisplayMode', ['All', 'Chart and Grid', 'Grid and Brain', 'Chart', 'Grid', 'Brain']).listen();
    displayControl.onChange(function(value) {
        switch (value) {
            case 'All':
                displayAll();
                break;
            case 'Chart and Grid':
                displayChartAndGrid();
                break;
            case 'Grid and Brain':
                displayGridAndBrain();
                break;
            case 'Chart':
                displaySNPChart();
                break;
            case 'Grid':
                displaySNPGrid();
                break;
            case 'Brain':
                displayBrain();
                break;
            default: break;
        }
    });*/

    /** Query controls */

    // The textfield for the ROI to query.
    var rControl = queryFolder.add(panel, 'ROI');
    rControl.onFinishChange(function(value) {
        roi = parseInt(value);
    });

    // The textfield for the formatted chromosome and range query.
    var qControl = queryFolder.add(panel, 'Query');
    qControl.onFinishChange(function(value) {
        query = value;
    });

    queryFolder.add(panel, 'Submit');

    // Open the query folder.
    queryFolder.open();

    /** SNP Chart controls */

    // Add the reset and adjacent buttons to the chart folder.
    chartFolder.add(panel, 'Previous');
    chartFolder.add(panel, 'Next');
    chartFolder.add(panel, 'ResetZoom');

    // Close the chart folder.
    chartFolder.close();

    /** Renderer controls */

    // Minimum color control.
    var minCC = renderFolder.addColor(panel, 'color1');
    minCC.onChange(function(value) {
        volume.minColor = [value[0]/255.0, value[1]/255.0, value[2]/255.0];
    })

    // Maximum color control.
    var maxCC = renderFolder.addColor(panel, 'color2');
    maxCC.onChange(function(value) {
        volume.maxColor = [value[0]/255.0, value[1]/255.0, value[2]/255.0];
    })

    // Opacity control.
    var opacityControl = renderFolder.add(panel, 'opacity', 0.1, 1.0).step(0.05);
    opacityControl.onChange(function(value) {
        volume.opacity = value;
        slices.opacity = value;
    })

    // SNP label control.
    var labelControl = renderFolder.add(panel, 'ShowLabel');
    labelControl.onChange(function(value) {
        displaySNPLabel = value;
        if (displaySNPLabel) {
            addSNPLabel(previousSNPLabel);
        } else {
            removeSNPLabel();
        }
    })

    // Volume mode control (See ControlPanel doc) for more information.
    // var volumeControl = renderFolder.add(panel, 'VolumeMode', ['Full', 'Slices', 'Both']).listen();
    // volumeControl.onChange(function(value) {
    //     if (panel.SliceMode === 'Full' && value !== "None") {
    //         panel.SliceMode = 'Normal';
    //     }
    //     switch (value) {
    //         case "Full":
    //             setToFullVolume(true);
    //             break;
    //         case "Slices":
    //             setToSlicedVolume(true);
    //             break;
    //         case "Both":
    //             setToBothVolume();
    //             break;
    //         default: break;
    //     }
    // })

    // Volume mode control (See ControlPanel doc) for more information.
    // var sliceControl = renderFolder.add(panel, 'SliceMode', ['Full', 'Normal', 'None']).listen();
    // sliceControl.onChange(function(value) {
    //     switch (value) {
    //         case 'Full':
    //             showFullSlicing();
    //             break;
    //         case 'Normal':
    //             setToShowSlicing();
    //             break;
    //         case 'None':
    //             setToHideSlicing();
    //             break;
    //         default: break;
    //     }
    // })

    // Add the reset button.
    renderFolder.add(panel, 'Reset');
    // Close the render folder.
    renderFolder.close();
}