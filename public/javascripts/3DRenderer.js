function Renderer() {
    this.renderBrain = function() {
        var r = new X.renderer3D();
        r.container = 'volumeContainer';
        r.init();

        var volume = new X.volume();
        volume.file = 'http://localhost:8080/gray_matter.nii';
        volume.labelmap.file = 'http://localhost:8080/converted.nii';
        volume.labelmap.colortable.file = 'http://localhost:8080/colortable.txt';

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
            volume.minColor = [1, 0, 0];
            volume.maxColor = [0, 0, 1];

            sliceX.add(volume);
            sliceY.add(volume);
            sliceZ.add(volume);
            
            sliceX.render();
            sliceY.render();
            sliceZ.render();
        };
    }
};