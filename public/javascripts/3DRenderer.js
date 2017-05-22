function Renderer() {
    this.renderBrain = function() {
        this.r = new X.renderer3D();
        this.r.container = 'renderContainer';
        this.r.init();

        this.mesh = new X.mesh();
        this.mesh.file = 'http://localhost:8080/obj/brain.obj';
        this.mesh.opacity = 0.75;

        this.r.add(this.mesh);
        this.r.camera.zoomIn(200);

        // var lh = new X.mesh();
        // lh.file = 'http://localhost:8080/obj/lh.obj';
        // lh.opacity = 0.75;
        
        // var rh = new X.mesh();
        // rh.file = 'http://localhost:8080/obj/rh.obj';
        // rh.opacity = 0.75;

        // r.add(lh);
        // r.add(rh);
        // r.camera.zoomOut(500);

        this.r.render();
    }
};