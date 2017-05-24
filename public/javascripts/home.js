window.onload = function() {
    parseGenomicData(function(data) {
        chromosomes = data;
        setUpControls();
    });
};