$('#query').submit(function() {
    var phen = $('#pIn').val();
    var gene = $('#gIn').val();
    displayChart()
    closeNav();
    return false;
});

var displayChart = function() {
    var margins = {
        top: 10,
        bottom: 40,
        left: 40,
        right: 10
    };

    var data = [[2, 10], [3, 5], [4, 2]];
    var width = 1000 - margins.left - margins.right, height = 650 - margins.top - margins.bottom;

    var x = d3.scaleLinear()
        .range([0, width])
        .domain([0, d3.max(data, function(d) { return d[0]; })]);
    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(data, function(d) { return d[1]; })]);

    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);

    var chart = d3.select('.chart')
        .attr('width', width + margins.left + margins.right)
        .attr('height', height + margins.top + margins.bottom)
        .append('g').attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');
    
    chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis).append('text')
            .attr('x', width / 2)
            .attr('dy', '3em')
            .style('text-anchor', 'middle')
            .text('Location (bp * 10^6)');

    chart.append('g')
        .attr('class', 'y axis')
        .call(yAxis).append('text')
            .attr('transform', 'rotate(-90)')
            .attr('dy', '-2em')
            .attr('x', -height / 2)
            .style('text-anchor', 'middle')
            .text('Effect (log10(p))');

    chart.selectAll('.point').data(data)
        .enter().append('circle')
        .attr('class', 'point')
        .attr('id', function(d, i) { return 'snp' + i; })
        .attr('cx', function(d) { return x(d[0]); })
        .attr('cy', function(d) { return y(d[1]); })
        .attr('r', 5);
}
displayChart();

$('.point').mouseover(function(e) {
    d3.select('#' + e.target.id)
        .transition().duration(200)
        .attr('r', '10');
});

$('.point').mouseout(function(e) {
    d3.select('#' + e.target.id)
        .transition().duration(200)
        .attr('r', '5');
});