function Renderer() {
    this.renderBrain = function() {
        var r1 = new X.renderer3D();
        r1.container = 'fullVolumeContainer';
        r1.init();

        var r2 = new X.renderer3D();
        r2.container = 'slicedVolumeContainer';
        r2.init();

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

        r1.add(volume);
        r1.render();

        this.fullRenderer = r1;
        this.slicedRenderer = r2;
        this.fullBrain = volume;
        this.slicedBrain = slices;

        this.displayingFull = true;
        this.displayingCombined = false;
        this.displayingSlices = true;

        r1.onShowtime = function() {
            volume.volumeRendering = true;
            volume.opacity = 0.75;
            volume.lowerThreshold = 0.001;
            volume.windowLower = 0.001;
            volume.windowHigh = 1;
            volume.minColor = [0, 0, 1];
            volume.maxColor = [0, 0, 0];

            r2.add(slices);
            r2.render();

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
    renderContainer.append('div').attr('id', 'fullVolumeContainer')
        .attr('class', 'volumeContainer')
        .style('border-right', '2px solid white');
    renderContainer.append('div').attr('id', 'slicedVolumeContainer')
        .attr('class', 'volumeContainer');
    renderContainer.append('div').attr('id', 'xSliceContainer')
        .attr('class', 'slice');
    renderContainer.append('div').attr('id', 'ySliceContainer')
        .attr('class', 'slice')
        .style('border-left', '2px solid white')
        .style('border-right', '2px solid white');
    renderContainer.append('div').attr('id', 'zSliceContainer')
        .attr('class', 'slice');
    renderer.renderBrain();
}

var setToCombinedVolume = function() {
    setToFullVolume(false);
    setToSlicedVolume(false);
}

var setToNoneVolume = function() {
    if (renderer.displayingFull) {
        removeFullVolume(true);
    }
    if (renderer.displayingCombined) {
        removeSlicedVolume(true);
    }
}

var setToFullVolume = function(only) {
    if (!renderer.displayingFull) {
        addFullVolume();
    }
    if (only) {
        removeSlicedVolume(false);
    }
}

var setToSlicedVolume = function(only) {
    if (!renderer.displayingCombined) {
        addSlicedVolume();
    }
    if (only) {
        removeFullVolume(false);
    }
}

var addSlicedVolume = function() {
    var renderContainer = d3.select('#renderContainer');
    var fullContainer = renderContainer.select('#fullVolumeContainer');
    var slicedContainer = renderContainer.select('#slicedVolumeContainer')
        .attr('class', 'volumeContainer')
        .attr('id', 'slicedVolumeContainer');
    fullContainer.transition().duration(250)
        .style('width', '48%')
        .style('border-right', '2px solid white');
    slicedContainer.transition().duration(250)
        .style('width', '48%');

    renderer.displayingCombined = true;
}

var addFullVolume = function() {
    var renderContainer = d3.select('#renderContainer');
    var slicedContainer = renderContainer.select('#slicedVolumeContainer');
    var fullContainer = renderContainer.select('#fullVolumeContainer')
        .attr('class', 'volumeContainer')
        .attr('id', 'fullVolumeContainer')
        .style('border-bottom', '2px solid white')
        .style('border-right', '2px solid white');
    fullContainer.transition().duration(250)
        .style('width', '48%');
    slicedContainer.transition().duration(250)
        .style('wdith', '48%');

    renderer.displayingFull = true;
}

var removeSlicedVolume = function(none) {
    var renderContainer = d3.select('#renderContainer');
    var fullContainer = renderContainer.select('#fullVolumeContainer');
    var slicedContainer = renderContainer.select('#slicedVolumeContainer');
    slicedContainer.transition().duration(250)
        .style('width', '0');
    fullContainer.transition().duration(250)
        .style('width', '98%');

    renderer.displayingCombined = false;
    if (none) {
        fullContainer.transition().duration(250)
            .style('width', 0);
        showFullSlicing();
    } else if (renderer.displayingSlices) {
        addSlicing();
    }
}

var removeFullVolume = function(none) {
    var renderContainer = d3.select('#renderContainer');
    var fullContainer = renderContainer.select('#fullVolumeContainer');
    var slicedContainer = renderContainer.select('#slicedVolumeContainer');
    slicedContainer.transition().duration(250)
        .style('width', '98%');
    fullContainer.transition().duration(250)
        .style('width', '0');

    renderer.displayingFull = false;
    if (none) {
        slicedContainer.transition().duration(250)
            .style('width', 0);
        showFullSlicing();
    } else if (renderer.displayingSlices) {
        addSlicing();
    }
}

var setToShowSlicing = function() {
    addSlicing();
}

var setToHideSlicing = function() {
    removeSlicing();
}

var addSlicing = function() {
    d3.selectAll('.slice').transition().duration(250)
        .style('height', '30%');
    renderer.displayingSlices = true;
}

var removeSlicing = function() {
    d3.selectAll('.slice').transition().duration(250)
        .style('height', '0');
    renderer.displayingSlices = false;
}

var showFullSlicing = function() {
    d3.selectAll('.slice').transition().duration(250)
        .style('height', '100%');
    renderer.displayingSlices = true;
}