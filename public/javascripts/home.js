genomicData = [];
var parseGenomicData = function(callback) {
    var type = function(d) {
        d.CHR = +d.CHR;
        d.BP = +d.BP;
        d.START = +d.START;
        d.END = +d.END;
        return d;
    }
    d3.tsv('gene-snp.tsv', type, function(error, data) {
        callback(data);
    });
}

parseGenomicData(function(data) {
    genomicData = data;
    genes = [];
    phenotypes = [];
    for (var i in genomicData) {
        if (data[i].GENE && genes.indexOf(data[i].GENE) == -1) {
            genes.push(data[i].GENE);
        }
    }

    $('#pIn').autocomplete({
        source: phenotypes
    });

    $('#gIn').autocomplete({
        source: genes
    });
})

$('#query').submit(function() {
    var phen = $('#pIn').val();
    var gene = $('#gIn').val();
    displayChart(gene);
    closeNav();
    return false;
});

var displayChart = function(gene) {
    var buffer = 0.005;
    var margins = {
        top: 10,
        bottom: 50,
        left: 50,
        right: 10
    };
    var width = 1000 - margins.left - margins.right, height = 650 - margins.top - margins.bottom;

    var upperBound = 0, lowerBound = 0;
    var data = [];

    for (var i in genomicData) {
        if (String(genomicData[i].GENE) === gene) {
            upperBound = genomicData[i].END;
            lowerBound = genomicData[i].START;
            break;
        }
    }

    for (var i in genomicData) {
        var snp = genomicData[i];
        if (snp.GENE === gene) {
            if (snp.BP < lowerBound) { lowerBound = snp.BP; }
            else if (snp.BP > upperBound) { upperBound = snp.BP; }
        }
        if (snp.BP >= lowerBound && snp.BP <= upperBound) {
            data.push(snp);
        }
    }

    var x = d3.scaleLinear()
        .range([0, width])
        .domain([d3.min(data, function(d) { return d.BP/1000000; }) - buffer, d3.max(data, function(d) { return d.BP/1000000; }) + buffer]);
    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 1]);

    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);

    var chart = d3.select('.chart')
        .attr('width', width + margins.left + margins.right)
        .attr('height', height + margins.top + margins.bottom)
        .append('g')
            .attr('id', 'offsetContainer')
            .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');
    chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis).append('text')
            .attr('x', width / 2)
            .attr('dy', '4em')
            .style('text-anchor', 'middle')
            .text('Position (bp * 10^6)');

    chart.append('g')
        .attr('class', 'y axis')
        .call(yAxis).append('text')
            .attr('transform', 'rotate(-90)')
            .attr('dy', '-3em')
            .attr('x', -height / 2)
            .style('text-anchor', 'middle')
            .text('-log10(p)');

    chart.selectAll('.point').data(data)
        .enter().append('circle')
        .attr('class', 'point')
        .attr('snp', function(d) { return d.RS; })
        .attr('id', function(d, i) { return 'snp' + i; })
        .attr('cx', function(d) { return x(d.BP/1000000); })
        .attr('cy', function(d) { return y(Math.random()); })
        .attr('r', 5);
    
    addAnnotationHover();
}

var addAnnotationHover = function() {
    $('.point').mouseover(function(e) {
        addAnnotationForSNP(e.target.id);
        d3.select('#' + e.target.id)
            .transition().duration(100)
            .style('fill', 'indianred')
            .attr('r', '10');
    });

    $('.point').mouseout(function(e) {
        removeAnnotationForSNP(e.target.id);
        d3.select('#' + e.target.id)
            .transition().duration(100)
            .style('fill', 'steelblue')
            .attr('r', '5');
    });
}

var addAnnotationForSNP = function(id) {
    var point = d3.select('#' + id);
    var annotationWidth = 100, annotationHeight = 75;
    var pointX = point.attr('cx'), pointY = point.attr('cy');

    var radius = 10;
    var triangleWidth = 20;
    var containerOffset = 20;
    var textInset = 15;
    var annotationX = pointX - annotationWidth/2, 
        annotationY = pointY - annotationHeight - containerOffset;

    var offsetContainer = d3.select('.chart').select('#offsetContainer');
    var annotation = offsetContainer.append('g')
        .attr('id', 'annotation' + id)
        .attr('transform', 'translate(' + annotationX + ',' + annotationY + ')')
        .attr('width', annotationWidth).attr('height', annotationHeight);


    annotation.append('path')
        .style('stroke-linejoin', 'round')
        .style('stroke', 'steelblue')
        .style('stroke-width', '5')
        .style('fill', 'white')
        .attr('d', 'M 10 0 L ' + (annotationWidth - 10) + ' 0 '
            + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + annotationWidth + ' ' + radius
            + ' L ' + annotationWidth + ' ' + (annotationHeight - radius)
            + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + (annotationWidth - radius) + ' ' + annotationHeight
            + ' L ' + (annotationWidth/2 + triangleWidth/2)+ ' ' + annotationHeight
            + ' L ' + annotationWidth/2 + ' ' + (annotationHeight + containerOffset/2)
            + ' L ' + (annotationWidth/2 - triangleWidth/2) + ' ' + annotationHeight
            + ' L ' + radius + ' ' + annotationHeight
            + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + 0 + ' ' + (annotationHeight - radius)
            + ' L ' + 0 + ' ' + radius
            + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + radius + ' ' + 0);
    annotation.append('text')
        .attr('x', textInset).attr('y', textInset)
        .attr('width', annotationWidth - textInset * 2).attr('height', annotationHeight - textInset * 2)
        .style('color', 'black')
        .style('font', '14px sans-serif')
        .style('text-align', 'center')
        .text(point.attr('snp'));
}

var removeAnnotationForSNP = function(id) {
    var point = d3.select('#' + id);
    d3.select('.chart').select('#offsetContainer')
        .select('#annotation' + id).remove();
}