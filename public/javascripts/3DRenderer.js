function Renderer() {
    this.renderBrain = function() {
        var r = new X.renderer3D();
        r.container = 'volumeContainer';
        r.init();

        var slices = new X.volume();
        slices.file = 'http://localhost:8080/gray_matter.nii';
        slices.labelmap.file = 'http://localhost:8080/converted.nii';
        slices.labelmap.colortable.file = 'http://localhost:8080/colortable.txt';

        var volume = new X.volume();
        volume.file = 'http://localhost:8080/gray_matter.nii';

        var sliceX = new X.renderer2D();
        sliceX.container = 'xSliceContainer';
        sliceX.orientation = 'X';
        sliceX.init();

        var sliceY = new X.renderer2D();
        sliceY.container = 'ySliceContainer';
        sliceY.orientation = 'Y';
        sliceY.init();

        var sliceZ = new X.renderer2D();
        sliceZ.container = 'zSliceContainer';
        sliceZ.orientation = 'Z';
        sliceZ.init();

        r.add(volume);
        r.render();

        this.renderer = r;
        this.brain = volume;

        r.onShowtime = function() {
            volume.volumeRendering = true;
            volume.opacity = 0.75;
            volume.lowerThreshold = 0.001;
            volume.windowLower = 0.001;
            volume.windowHigh = 1;
            volume.minColor = [0, 0, 1];
            volume.maxColor = [0, 0, 0];

            sliceX.add(slices);
            sliceY.add(slices);
            sliceZ.add(slices);
            
            sliceX.render();
            sliceY.render();
            sliceZ.render();
        };
    }
};

var prepareForBrainRender = function() {
    var renderContainer = d3.select('body').append('div')
        .attr('id', 'renderContainer')
        .attr('width', '50vw').attr('height', '50vw');
    renderContainer.append('div').attr('id', 'volumeContainer')
        .style('border-bottom', '2px solid white');
    renderContainer.append('div').attr('id', 'xSliceContainer')
        .attr('class', 'slice');
    renderContainer.append('div').attr('id', 'ySliceContainer')
        .attr('class', 'slice');
    renderContainer.append('div').attr('id', 'zSliceContainer')
        .attr('class', 'slice');
    renderer.renderBrain();
}