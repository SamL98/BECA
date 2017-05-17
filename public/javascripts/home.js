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
    console.log(gene);
    displayChart(gene);
    closeNav();
    return false;
});

var displayChart = function(gene) {
    var buffer = 5000;
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
        .domain([d3.min(data, function(d) { return d.BP }) - buffer, d3.max(data, function(d) { return d.BP; }) + buffer]);
    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 1]);

    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);

    var chart = d3.select('.chart')
        .attr('width', width + margins.left + margins.right)
        .attr('height', height + margins.top + margins.bottom)
        .append('g').attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');
    chart.selectAll('.axis').exit().remove();
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
        .attr('id', function(d, i) { return 'snp' + i; })
        .attr('cx', function(d) { return x(d.BP); })
        .attr('cy', function(d) { return y(Math.random()); })
        .attr('r', 5);
}

$('.point').mouseover(function(e) {
    console.log(e.target.id);
    d3.select('#' + e.target.id)
        .transition().duration(200)
        .attr('r', '10');
});

$('.point').mouseout(function(e) {
    d3.select('#' + e.target.id)
        .transition().duration(200)
        .attr('r', '5');
});