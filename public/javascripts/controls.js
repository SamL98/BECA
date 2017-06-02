var ControlPanel = function() {
    this.ROI = '';
    this.gene = '';

    var adjacent = function(type) {
        const roi = parseInt(this.ROI);
        const chr = currChr;
        adjacentRange(type, chr, roi, function() {
            displayChart();
        });
    }

    this.previous = function() {
        adjacent("prev");
    };
    this.next = function() {
        adjacent("next");
    };

    this.MinColor = [1, 0, 0];
    this.MaxColor = [0, 0, 1]; 
    this.opacity = 0.75;

    this.VolumeMode = 'Both';
    this.SliceMode = 'Normal';

    this.reset = function() {
        renderer.fullRenderer.resetBoundingBox();
        renderer.fullRenderer.resetViewAndRender();

        renderer.slicedRenderer.resetBoundingBox();
        renderer.slicedRenderer.resetViewAndRender();
    };
};

var setUpControls = function() {
    var panel = new ControlPanel();
    var gui = new dat.GUI({ autoPlace: false });
    document.getElementById('datGuiContainer').appendChild(gui.domElement);

    var chartFolder = gui.addFolder('Chart');
    var renderFolder = gui.addFolder('Render');

    gui.remember(panel);
    var pControl = chartFolder.add(panel, 'ROI');
    pControl.onFinishChange(function(value) {
        roi = parseInt(vlaue);
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

    var minCC = renderFolder.addColor(panel, 'MinColor');
    minCC.onChange(function(value) {
        renderer.fullBrain.minColor = [value[0]/255.0, value[1]/255.0, value[2]/255.0];
    })

    var maxCC = renderFolder.addColor(panel, 'MaxColor');
    maxCC.onChange(function(value) {
        renderer.fullBrain.maxColor = [value[0]/255.0, value[1]/255.0, value[2]/255.0];
    })

    var opacityControl = renderFolder.add(panel, 'opacity', 0.1, 1.0).step(0.05);
    opacityControl.onChange(function(value) {
        renderer.fullBrain.opacity = value;
        renderer.slicedBrain.opacity = value;
    })

    var volumeControl = renderFolder.add(panel, 'VolumeMode', ['Full', 'Slices', 'Both', 'None']).listen();
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
                setToCombinedVolume();
                break;
            case "None":
                panel.SliceMode = 'Full';
                setToNoneVolume();
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
                panel.VolumeMode = 'Both';
                break;
            default: break;
        }
    })

    renderFolder.add(panel, 'reset');
    renderFolder.close();
}