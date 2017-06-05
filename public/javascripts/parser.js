var parseGenomicData = function(query, roi, callback) {
    var urlString = 'http://localhost:8080/query-database?roi=' + roi;
    if (/(rs)\d+/.test(query)) {
        // Assume query for SNP
        urlString += '&snp=' + query;
    } else if (/\d{1,2}\:\d+\-\d+/.test(query)) {
        // Assume query for range
        colonIndex = query.indexOf(':');
        dashIndex = query.indexOf('-');

        // Parse query for chromosome, min, and max
        currChr = parseInt(query.substring(0, colonIndex));
        lowerBound = parseInt(query.substring(colonIndex + 1, dashIndex));
        upperBound = parseInt(query.substring(dashIndex + 1, query.length));

        urlString += '&chr=' + currChr + '&min=' + lowerBound + '&max=' + upperBound;
    } else {
        // Assume query for Gene
        urlString += '&gene=' + query;
    }
    $.get(urlString, function(data) {
        formatData(data['results'], callback);
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
        formatData(data['results'], callback);
    });
}

var formatData = function(data, callback) {
    console.log(data)
    snps = [];
    for (var i = 1; i < data.length; i++) {
        snps.push(new SNP(data[i][0], data[i][1], data[i][2], Math.random()))
    }

    currChr = parseInt(data[0].chr);
    lowerBound = parseInt(data[0].start);
    upperBound = parseInt(data[0].end);
    console.log(currChr, lowerBound, upperBound)
    chrRange = upperBound - lowerBound

    callback();
}