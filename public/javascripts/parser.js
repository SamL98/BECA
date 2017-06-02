var parseGenomicData = function(query, roi, callback) {
    var urlString = 'http://localhost:8080/query-database?roi' + roi;
    if (/(rs)\d+/.test(query)) {
        // Assume query for SNP
        urlString += '&snp=' + query;
    } else if (/\d{1,2}\:\d+\-\d+/.test(query)) {
        // Assume query for range
        colonIndex = query.indexOf(':');
        dashIndex = query.indexOf('-');

        currChr = parseInt(query.substring(0, colonIndex));
        lowerBound = parseInt(query.substring(colonIndex + 1, dashIndex));
        upperBound = parseInt(query.substring(dashIndex + 1, query.length));

        urlString += '&chr=' + currChr + '&min=' + lowerBound + '&max=' + upperBound;
    } else {
        // Assume query for Gene
        urlString += '&gene=' + query;
    }
    $.get(urlString, function(data) {
        formatData(callback);
    });
}

var adjacentRange = function(type, chr, roi, callback) {
    var start, end;
    if (type == 'prev') {
        end = lowerBound;
        start = end - chrRange;
    } else {
        start = upperBound;
        end = start + chrRange;
    }
    var urlString = 'http://localhost:8080/query-database?chr=' + currChr + '&min=' + start + '&max=' + end;
    $.get(urlString, function(data) {
        formatData(callback);
    });
}

var formatData = function(data, callback) {
    snps = [];
    snps = data.snps;

    currChr = parseInt(snps[0].chr);
    lowerBound, upperBound = parseInt(data.metadata.start), parseInt(data.metadata.end);
    chrRange = upperBound - lowerBound

    callback();
}