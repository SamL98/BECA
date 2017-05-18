genomicData = [];
var parseGenomicData = function(callback) {
    var type = function(d) {
        d.CHR = +d.CHR;
        d.BP = +d.BP;
        d.START = +d.START;
        d.END = +d.END;
        d.FREQ = Math.random().toFixed(2);
        d.P = Math.random().toFixed(4);
        return d;
    }
    d3.tsv('gene-snp.tsv', type, function(error, data) {
        callback(data);
    });
}

var ControlPanel = function() {
    this.phenotype = '';
    this.gene = '';
};

window.onload = function() {
    parseGenomicData(function(data) {
        genomicData = data;
        genes = [];
        phenotypes = [];
        for (var i in genomicData) {
            if (data[i].GENE && genes.indexOf(data[i].GENE) == -1) {
                genes.push(data[i].GENE);
            }
        }

        var panel = new ControlPanel();
        var gui = new dat.GUI();
        gui.add(panel, 'phenotype');
        gui.add(panel, 'gene');

        displayChart('ASPM');
    })
};

var removeExistingCharts = function() {
    d3.selectAll('.chart').remove();
}

var displayChart = function(gene) {
    removeExistingCharts();

    var buffer = 0.005;
    var margins = {
        top: 10,
        bottom: 50,
        left: 50,
        right: 10
    };
    var width = (+d3.select('body').node().getBoundingClientRect().width) - margins.left - margins.right,
        height = 300 - margins.top - margins.bottom;

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
    var freqScale = d3.scalePow()
        .range([3, 8])
        .domain([d3.min(data, function(d) { return d.FREQ; }),
                d3.max(data, function(d) { return d.FREQ; })]);

    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);

    d3.select('body').append('svg').attr('class', 'chart');
    var chart = d3.select('.chart')
        .attr('x', 0).attr('y', 0)
        .attr('width', width + margins.left + margins.right)
        .attr('height', height + margins.top + margins.bottom)
        .append('g')
            .attr('id', 'offsetContainer')
            .style('fill', 'white')
            .attr('width', width).attr('height', height)
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
        .style('fill', 'steelblue')
        .style('stroke', 'black')
        .attr('class', 'point')
        .attr('snp', function(d) { return d.RS; })
        .attr('freq', function(d) { return d.FREQ; })
        .attr('p', function(d) { return d.P; })
        .attr('scaledFreq', function(d) { return freqScale(d.FREQ); })
        .attr('id', function(d, i) { return 'snp' + i; })
        .attr('cx', function(d) { return x(d.BP/1000000); })
        .attr('cy', function(d) { return y(-Math.log10(d.P)); })
        .attr('r', function(d) { return freqScale(d.FREQ); });
    
    addAnnotationHover();
}

var addAnnotationHover = function() {
    $('.point').mouseover(function(e) {
        addAnnotationForSNP(e.target.id);
        d3.select('#' + e.target.id)
            .transition().duration(100)
            .style('fill', 'indianred')
            .attr('r', 10);
    });

    $('.point').mouseout(function(e) {
        removeAnnotationForSNP(e.target.id);
        var point = d3.select('#' + e.target.id);
        point.transition().duration(100)
            .style('fill', 'steelblue')
            .attr('r', point.attr('scaledFreq'));
    });
}

var upPath = function(radius, width, height, sWidth, offset) {
    return 'M ' + radius + ' 0 L ' + (width - radius) + ' 0 '
    + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + width + ' ' + radius
    + ' L ' + width + ' ' + (height - radius)
    + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + (width - radius) + ' ' + height
    + ' L ' + (width/2 + sWidth/2)+ ' ' + height
    + ' L ' + width/2 + ' ' + (height + offset/2)
    + ' L ' + (width/2 - sWidth/2) + ' ' + height
    + ' L ' + radius + ' ' + height
    + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + 0 + ' ' + (height - radius)
    + ' L ' + 0 + ' ' + radius
    + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + radius + ' ' + 0;
}

var downPath = function(radius, width, height, sWidth, offset) {
    return 'M ' + radius + ' 0 L ' + (width/2 - sWidth/2) + ' ' + 0
    + ' L ' + (width/2) + ' ' + (-offset/2)
    + ' L ' + (width/2 + sWidth/2) + ' ' + 0
    + ' L ' + (width - radius) + ' ' + 0
    + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + width + ' ' + radius
    + ' L ' + width + ' ' + (height - radius)
    + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + (width - radius) + ' ' + height
    + ' L ' + radius + ' ' + height
    + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + 0 + ' ' + (height - radius)
    + ' L ' + 0 + ' ' + radius
    + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + radius + ' ' + 0;
}

var rightPath = function(radius, width, height, sHeight, offset) {
    return 'M ' + radius + ' 0 L ' + (width - radius) + ' 0 '
    + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + width + ' ' + radius
    + ' L ' + width + ' ' + (height - radius)
    + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + (width - radius) + ' ' + height
    + ' L ' + radius + ' ' + height
    + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + 0 + ' ' + (height - radius)
    + ' L ' + 0 + ' ' + (height/2 + sHeight/2)
    + ' L ' + (-offset/2) + ' ' + (height/2)
    + ' L ' + 0 + ' ' + (height/2 - sHeight/2)
    + ' L ' + 0 + ' ' + radius
    + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + radius + ' ' + 0;
}

var leftPath = function(radius, width, height, sHeight, offset) {
    return 'M ' + radius + ' 0 L ' + (width - radius) + ' 0 '
    + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + width + ' ' + radius
    + ' L ' + width + ' ' + (height/2 - sHeight/2)
    + ' L ' + (width + offset/2) + ' ' + (height/2)
    + ' L ' + width + ' ' + (height/2 + sHeight/2)
    + ' L ' + width + ' ' + (height - radius)
    + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + (width - radius) + ' ' + height
    + ' L ' + radius + ' ' + height
    + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + 0 + ' ' + (height - radius)
    + ' L ' + 0 + ' ' + radius
    + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + radius + ' ' + 0;
}

var addAnnotationForSNP = function(id) {
    var point = d3.select('#' + id);
    var annotationWidth = 150, annotationHeight = 100;
    var pointX = point.attr('cx'), pointY = point.attr('cy');

    var fontSize = 14,
        radius = 10, triangleWidth = 20, containerOffset = 20,
        textInset = 15, interlineSpacing = 5;
    var annotationX = pointX - annotationWidth/2, 
        annotationY = pointY - annotationHeight - containerOffset;

    var offsetContainer = d3.select('.chart').select('#offsetContainer');
    var path = '';
    if (annotationY >= 0) {
        if (annotationX >= 0) {
            if (annotationX > (+offsetContainer.attr('width'))) {
                annotationX = pointX - 2*containerOffset - annotationWidth;
                annotationY = pointY - annotationHeight/2;
                path = leftPath(radius, annotationWidth, annotationHeight,
                triangleWidth, containerOffset);
            } else {
                path = upPath(radius, annotationWidth, annotationHeight,
                triangleWidth, containerOffset);
            }
        } else {
            annotationX = pointX + 2*containerOffset;
            annotationY = pointY - annotationHeight/2;
            path = rightPath(radius, annotationWidth, annotationHeight,
            triangleWidth, containerOffset);
        }
    } else {
        annotationY = pointY + 2*containerOffset;
        if (annotationX >= 0) {
            if (annotationX > (+offsetContainer.attr('width'))) {
                annotationX = pointX + 2*containerOffset;
                annotationY = pointY - annotationHeight/2;
                path = rightPath(radius, annotationWidth, annotationHeight,
                triangleWidth, containerOffset);
            } else {
                path = downPath(radius, annotationWidth, annotationHeight,
                triangleWidth, containerOffset);
            }
        } else {
            annotationX = pointX - 2*containerOffset - annotationWidth;
            annotationY = pointY - annotationHeight/2;
            path = leftPath(radius, annotationWidth, annotationHeight,
            triangleWidth, containerOffset);
        }
    }

    var annotation = offsetContainer.append('g')
        .attr('id', 'annotation' + id)
        .attr('transform', 'translate(' + annotationX + ',' + annotationY + ')')
        .attr('width', annotationWidth).attr('height', annotationHeight);

    annotation.append('path')
        .style('stroke-linejoin', 'round')
        .style('stroke', 'steelblue')
        .style('stroke-width', '5')
        .style('fill', 'white')
        .attr('d', path);

    var rsText = annotation.append('text')
        .attr('class', 'label')
        .attr('x', textInset).attr('y', textInset)
        .attr('dy', 2)
        .style('font-weight', '600')
        .style('text-align', 'center')
        .text(point.attr('snp'));

    var freqText = annotation.append('text')
        .attr('class', 'label')
        .attr('x', textInset).attr('y', (+rsText.attr('dy')) + (+rsText.attr('y')) + fontSize + interlineSpacing)
        .attr('width', rsText.attr('width')).attr('height', rsText.attr('height'))
        .text('Frequency: ' + point.attr('freq'));

    var pText = annotation.append('text')
        .attr('class', 'label')
        .attr('x', textInset).attr('y', (+freqText.attr('y')) + fontSize + interlineSpacing)
        .attr('width', freqText.attr('width')).attr('height', freqText.attr('height'))
        .text('p: ' + point.attr('p'));

    var effText = annotation.append('text')
        .attr('class', 'label')
        .attr('x', textInset).attr('y', (+pText.attr('y')) + fontSize + interlineSpacing)
        .attr('width', pText.attr('width')).attr('height', pText.attr('height'))
        .text('Effect: ' + (-Math.log10((+point.attr('p'))).toFixed(3)));
}

var removeAnnotationForSNP = function(id) {
    var point = d3.select('#' + id);
    d3.select('.chart').select('#offsetContainer')
        .select('#annotation' + id).remove();
}