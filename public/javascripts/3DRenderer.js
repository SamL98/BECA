function Renderer() {
    this.renderBrain = function() {
        this.r = new X.renderer3D();
        this.r.container = 'renderContainer';
        this.r.init();

        this.grayMatter = new X.volume();
        //this.grayMatter.file = 'http://localhost:8080/gray_matter.nii';
        this.grayMatter.opacity = 0.75;

        this.parcellation = new X.mesh();
        //this.parcellation.file = 'http://localhost:8080/parcellation.nii';
        this.parcellation.opacity = 0.75;

        this.fibers = new X.fibers();
        //this.fibers.file = 'http://localhost:8080/fibers.trk';
        this.fibers.opacity = 1.0;

        //this.r.add(this.grayMatter);
        //this.r.add(this.parcellation);
        //this.r.add(this.fibers);
        this.r.camera.position = [0, 0, 600];

        //this.r.render();

        var f = this.fibers;
        var gm = this.grayMatter;
        var renderer = this.r;

        // this.r.onShowtime = function() {
        //     var tracks_transform = new Float32Array([ -2, 0, 0, 0, 0, 0, -2, 0, 0, 2, 0, 0, 110, -71, 110, 1]);
        //     X.matrix.swapRows(tracks_transform, 1, 2);
        //     f.transform.matrix = tracks_transform;

        //     var brain_transform = new Float32Array([9.992089867591858e-01,-2.943054959177971e-02,-2.671264298260212e-02,0,
        //                                     2.652833424508572e-02,-6.642243359237909e-03,9.996254444122314e-01,0,
        //                                     2.959738858044147e-02,9.995449185371399e-01,5.856084171682596e-03,0,
        //                                     -1.404523849487305e+00,-9.628264427185059e+00,-2.631434440612793e+00,1]); 
        //     X.matrix.swapRows(brain_transform, 1, 2);
        //     gm.transform.matrix = brain_transform;

        //     renderer.resetBoundingBox();
        // }
    }
};