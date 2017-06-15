// Initialize the controls and renderers once the window loads.
window.onload = function() {
    setUpControls();
    addResizeObservers();
    r1 = new X.renderer3D();
    r2 = new X.renderer3D();
    volume = new X.volume();
    slices = new X.volume();
};