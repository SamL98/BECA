var ControlPanel = function() {
    this.phenotype = '';
    this.gene = '';

    this.previous = function() {
        currGene = Math.max(0, currGene - 1);
        displayChart(chromosomes[currChr].genes[currGene].name);
    };
    this.next = function() {
        currGene = Math.min(currGene + 1, chromosomes[currChr].genes.length);
        displayChart(chromosomes[currChr].genes[currGene].name);
    };

    this.MinColor = [1, 0, 0];
    this.MaxColor = [0, 0, 1]; 
    this.opacity = 0.75;

    this.reset = function() {
        renderer.renderer.resetBoundingBox();
        renderer.renderer.resetViewAndRender();
    };
};

var setUpControls = function() {
    var panel = new ControlPanel();
    var gui = new dat.GUI();

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
        renderer.brain.maxColor = [value[0]/255.0, value[1]/255.0, value[2]/255.0];
    })

    var opacityControl = renderFolder.add(panel, 'opacity', 0.1, 1.0);
    opacityControl.onChange(function(value) {
        renderer.brain.opacity = value;
    })
    renderFolder.add(panel, 'reset');
    renderFolder.close();
}