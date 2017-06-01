var parseGenomicData = function(gene, roi, callback) {
    var urlString = 'http://localhost:8080/snps?gene=' + gene + '&roi=' + roi;
    $.get(urlString, function(data) {
        formatData(callback);
    });
}

var adjacentGene = function(type, chr, loc, roi, callback) {
    var urlString = 'http://localhost:8080/';
    if (type == 'prev') {
        urlString += 'prev?chr=' + chr + '&roi=' + roi + '&end=' + start;
    } else {
        urlString += 'next?chr=' + chr + '&roi=' + roi + '&start=' + end;
    }
    $.get(urlString, function(data) {
        formatData(callback);
    });
}

var formatData = function(data, callback) {
    snps = [];
    snps = data;
    callback();
}