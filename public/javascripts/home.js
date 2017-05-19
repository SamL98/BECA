chromosomes = [];
var margins = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50
};

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
        formatData(data, callback);
    });
}

var formatData = function(data, callback) {
    var formatted = [];

    var initChr = 0;
    var initGene = '';

    var i = 0;
    while (i < data.length) {
        if (data[i].CHR != initChr) {
            initChr = data[i].CHR;
            formatted.push(new Chromosome(initChr));
        }

        var chr = formatted[formatted.length - 1];
        if (data[i].GENE != initGene) {
            initGene = data[i].GENE;
            chr.genes.push(new Gene(initGene, data[i].START, data[i].END));
        }

        var gene = chr.genes[chr.genes.length - 1];
        gene.snps.push(new SNP(data[i].RS, data[i].BP, data[i].P, data[i].FREQ));
        i++;
    }
    callback(formatted);
}

var ControlPanel = function() {
    this.phenotype = '';
    this.gene = '';
    this.previous = function() {

    };
    this.next = function() {

    };
};

window.onload = function() {
    parseGenomicData(function(data) {
        chromosomes = data;

        var panel = new ControlPanel();
        var gui = new dat.GUI();
        gui.remember(panel);
        gui.add(panel, 'phenotype');

        var gController = gui.add(panel, 'gene');
        gController.onFinishChange(function(value) {
            displayChart(value);
        });

        gui.add(panel, 'previous');
        gui.add(panel, 'next');
    });
};

var removeExistingCharts = function() {
    d3.selectAll('.chart').remove();
}

var displayChart = function(gene) {
    removeExistingCharts();

    var buffer = 0.005;
    var width = (+d3.select('body').node().getBoundingClientRect().width) - margins.left - margins.right,
        height = 400 - margins.top - margins.bottom;

    var upperBound = 0, lowerBound = 0;
    var chrNum = 0;
    var data = [];

    var foundGene = false;
    for (var i = 0; (i < chromosomes.length && !foundGene); i++) {
        var chr = chromosomes[i];
        for (var j = 0; (j < chr.genes.length && !foundGene); j++) {
            var tmp = chr.genes[j];
            if (tmp.name === gene) {
                foundGene = true;
                chrNum = i;
                upperBound = tmp.end;
                lowerBound = tmp.start;
                for (var k = 0; k < tmp.snps.length; k++) {
                    var snp = tmp.snps[k];
                    if (snp.loc < lowerBound) { 
                        lowerBound = snp.loc; 
                    }
                    else if (snp.loc > upperBound) { 
                        upperBound = snp.loc; 
                    }
                    console.log(snp.name);
                    data.push(snp);
                }
            }
        }
    }

    var x = d3.scaleLinear()
        .range([0, width])
        .domain([d3.min(data, function(d) { return d.loc/1000000; }) - buffer, d3.max(data, function(d) { return d.loc/1000000; }) + buffer]);
    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 1]);
    var freqScale = d3.scalePow()
        .range([3, 8])
        .domain([d3.min(data, function(d) { return d.freq; }),
                d3.max(data, function(d) { return d.freq; })]);

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

    chart.append('text')
        .style('fill', 'black')
        .style('text-anchor', 'middle')
        .attr('x', width/2).attr('y', -margins.top/2)
        .style('font-weight', 'bold').style('font-size', '20px').style('font-family', 'Arial')
        .text(gene);

    chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis).append('text')
            .attr('class', 'axisLabel')
            .attr('x', width / 2)
            .attr('dy', '3em')
            .style('text-anchor', 'middle')
            .text('Position on Chr ' + chrNum + ' (bp * 10^6)');

    chart.append('g')
        .attr('class', 'y axis')
        .call(yAxis).append('text')
            .attr('class', 'axisLabel')
            .attr('transform', 'rotate(-90)')
            .attr('dy', '-3em')
            .attr('x', -height / 2)
            .style('text-anchor', 'middle')
            .text('-log10(p)');

    chart.selectAll('.point').data(data)
        .enter().append('circle')
        .attr('class', 'point')
        .attr('bp', function(d) { return d.loc; })
        .attr('snp', function(d) { return d.name; })
        .attr('freq', function(d) { return d.freq; })
        .attr('p', function(d) { return d.p; })
        .attr('scaledFreq', function(d) { return freqScale(d.freq); })
        .attr('id', function(d, i) { return 'snp' + i; })
        .attr('cx', function(d) { return x(d.loc/1000000); })
        .attr('cy', function(d) { return y(Math.random()); })
        .attr('r', function(d) { return freqScale(d.freq); });
    
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

var annotationPath1 = function(radius, width, height, sWidth, offset) {
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

var annotationPath2 = function(radius, width, height, sWidth, offset) {
    return 'M ' + radius + ' ' + offset + ' L ' + (width/2 - sWidth/2) + ' ' + offset
    + ' L ' + (width/2) + ' ' + (offset/2)
    + ' L ' + (width/2 + sWidth/2) + ' ' + offset
    + ' L ' + (width - radius) + ' ' + offset
    + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + width + ' ' + (radius+offset)
    + ' L ' + width + ' ' + (height - radius + offset)
    + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + (width - radius) + ' ' + (height + offset)
    + ' L ' + radius + ' ' + (height + offset)
    + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + 0 + ' ' + (height - radius + offset)
    + ' L ' + 0 + ' ' + (radius + offset)
    + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + radius + ' ' + offset;
}

var addAnnotationForSNP = function(id) {
    var point = d3.select('#' + id);
    var annotationWidth = 150, annotationHeight = 100;
    var pointX = (+point.attr('cx')), pointY = (+point.attr('cy'));

    var fontSize = 14,
        radius = 10, triangleWidth = 20, offset = 20,
        textInset = { x: 15, y: 15 }, interlineSpacing = 5;
    var annotationX = pointX - annotationWidth/2 + margins.left, 
        annotationY = pointY - annotationHeight - offset + margins.top;

    var path = '';
    if (annotationY < 0) {
        textInset.y += offset;
        annotationY = pointY + margins.top;
        path = annotationPath2(radius, annotationWidth, annotationHeight,
            triangleWidth, offset);
        offset /= 2;
    } else {
        path = annotationPath1(radius, annotationWidth, annotationHeight,
            triangleWidth, offset);
    }

    var annotation = d3.select('.chart').append('g')
        .attr('class', 'annotation')
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
        .attr('x', annotationWidth/2).attr('y', textInset.y)
        .attr('dy', 2)
        .style('font-weight', '600')
        .text(point.attr('snp'));   

    var freqText = annotation.append('text')
        .attr('class', 'label')
        .attr('x', annotationWidth/2).attr('y', (+rsText.attr('dy')) + (+rsText.attr('y')) + fontSize + interlineSpacing)
        .text('Frequency: ' + point.attr('freq'));

    var pText = annotation.append('text')
        .attr('class', 'label')
        .attr('x', annotationWidth/2).attr('y', (+freqText.attr('y')) + fontSize + interlineSpacing)
        .text('p: ' + point.attr('p'));

    var bpText = annotation.append('text')
        .attr('class', 'label')
        .attr('x', annotationWidth/2).attr('y', (+pText.attr('y')) + fontSize + interlineSpacing)
        .text('Location: ' + point.attr('bp'));
}

var removeAnnotationForSNP = function(id) {
    var point = d3.select('#' + id);
    d3.select('.chart').select('#annotation' + id).remove();
}