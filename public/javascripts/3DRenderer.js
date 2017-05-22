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

        this.r.render();
    }
};