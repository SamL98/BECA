var ControlPanel = function() {
    this.phenotype = '';
    this.gene = '';

    this.previous = function() {
        currGene = Math.max(0, currGene - 1);
        displayChart(chromosomes[currChr].genes[currGene].name);
    };
    this.next = function() {
        currGene = Math.min(currGene + 1, chromosomes[currChr].genes.length - 1);
        displayChart(chromosomes[currChr].genes[currGene].name);
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
    chartFolder.add(panel, 'phenotype');

    var gControl = chartFolder.add(panel, 'gene');
    gControl.onFinishChange(function(value) {
        displayChart(value);
    });

    chartFolder.add(panel, 'previous');
    chartFolder.add(panel, 'next');
    chartFolder.open();

    var minCC = renderFolder.addColor(panel, 'MinColor');
    minCC.onChange(function(value) {
        renderer.brain.minColor = [value[0]/255.0, value[1]/255.0, value[2]/255.0];
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