var ControlPanel = function() {
    //this.DisplayMode = 'All';

    this.ROI = '';
    this.gene = '';

    var adjacent = function(type) {
        adjacentRange(type, currChr, roi, function() {
            displayChart();
        });
    }

    this.previous = function() {
        adjacent("prev");
    };
    this.next = function() {
        adjacent("next");
    };

    this.color1 = [1, 0, 0];
    this.color2 = [0, 0, 1]; 
    this.opacity = 0.75;

    this.VolumeMode = 'Both';
    this.SliceMode = 'Normal';

    this.reset = function() {
        r1.resetBoundingBox();
        r1.resetViewAndRender();

        r2.resetBoundingBox();
        r2.resetViewAndRender();
    };
};

var setUpControls = function() {
    var panel = new ControlPanel();
    var gui = new dat.GUI({ autoPlace: true });
    //document.getElementById('datGuiContainer').appendChild(gui.domElement);

    //var displayFolder = gui.addFolder('Display');
    var chartFolder = gui.addFolder('Chart');
    var renderFolder = gui.addFolder('Render');

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
                displayChart();
                break;
            case 'Grid':
                displayGrid();
                break;
            case 'Brain':
                displayBrain();
                break;
            default: break;
        }
    });*/

    var pControl = chartFolder.add(panel, 'ROI');
    pControl.onFinishChange(function(value) {
        roi = parseInt(value);
        if (query != null && query != "") {
            parseGenomicData(query, roi, function() {
                displayChart();
            });
        }
    });

    var gControl = chartFolder.add(panel, 'gene');
    gControl.onFinishChange(function(value) {
        query = value;
        if (roi != null && roi > 0) {
            parseGenomicData(query, roi, function() {
                displayChart();
            });
        }
    });

    chartFolder.add(panel, 'previous');
    chartFolder.add(panel, 'next');
    chartFolder.open();

    var minCC = renderFolder.addColor(panel, 'color1');
    minCC.onChange(function(value) {
        volume.minColor = [value[0]/255.0, value[1]/255.0, value[2]/255.0];
    })

    var maxCC = renderFolder.addColor(panel, 'color2');
    maxCC.onChange(function(value) {
        volume.maxColor = [value[0]/255.0, value[1]/255.0, value[2]/255.0];
    })

    var opacityControl = renderFolder.add(panel, 'opacity', 0.1, 1.0).step(0.05);
    opacityControl.onChange(function(value) {
        volume.opacity = value;
        slices.opacity = value;
    })

    var volumeControl = renderFolder.add(panel, 'VolumeMode', ['Full', 'Slices', 'Both']).listen();
    volumeControl.onChange(function(value) {
        if (panel.SliceMode === 'Full' && value !== "None") {
            panel.SliceMode = 'Normal';
        }
        switch (value) {
            case "Full":
                setToFullVolume(true);
                break;
            case "Slices":
                setToSlicedVolume(true);
                break;
            case "Both":
                setToBothVolume();
                break;
            default: break;
        }
    })

    var sliceControl = renderFolder.add(panel, 'SliceMode', ['Full', 'Normal', 'None']).listen();
    sliceControl.onChange(function(value) {
        switch (value) {
            case 'Full':
                showFullSlicing();
                break;
            case 'Normal':
                setToShowSlicing();
                break;
            case 'None':
                setToHideSlicing();
                break;
            default: break;
        }
    })

    renderFolder.add(panel, 'reset');
    renderFolder.close();
}