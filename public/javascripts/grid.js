var removePreviousGrids = function() {
    d3.selectAll('.grid').remove();
}

var prevSelected = null;

var displayGrid = function() {
    removePreviousGrids();
    const data = snps;
    const boxWidth = 7.5, boxHeight = 7.5;
    const gridWidth = data.length * boxWidth, gridHeight = 116 * boxHeight;

    d3.select('#grid-container')
        .style('width', gridWidth).style('height', gridHeight);
    var grid = d3.select('#grid-container').append('svg')
        .attr('class', 'grid').attr('width', gridWidth).attr('height', gridHeight);

    var rect = rectFor('.grid');
    var x = d3.scaleLinear().range([rect.left, rect.right]).domain([0, boxWidth * snps.length]);
    var y = d3.scaleLinear().range([rect.bottom, rect.top]).domain([0, boxHeight * 116]);

    grid.append('text')
        .attr('class', 'axisLabel')
        .attr('x', gridWidth / 2).attr('dy', '-2em')
        .style('text-anchor', 'middle')
        .text('SNPs on Chr ' + currChr + ' from ' + lowerBound + '-' + upperBound);

    grid.append('text')
        .attr('class', 'axisLabel')
        .attr('transform', 'rotate(-90)')
        .attr('x', -gridHeight / 2).attr('dx', '-1em')
        .style('text-anchor', 'middle')
        .text('ROIs');

    d3.select('.grid').selectAll('g').data(data)
        .enter().append('g')
            .attr('class', 'column').attr('id', function(s, i) { return 'col' + i; })
            .attr('snp', function(s) { return s.name; })
            .attr('transform', function(s, i) { return 'translate(' + (boxWidth * i) + ',0)'})
            .on('click', function(s, i) {
                if (prevSelected) {
                    d3.select('#col' + prevSelected).selectAll('rect').style('stroke', 'black');
                }
                d3.select('#col' + i).selectAll('rect').style('stroke', 'white');
                prevSelected = i;

                colortable = 'http://localhost:8080/colortable?chr=' + currChr + '&snp=' + s.name;
                slices.labelmap.colortable.file = colortable;
                r2.render();
            })
            .selectAll('rect').data(function(s) { return s.pvalues; }).enter().append('rect')
                .attr('x', 0).attr('y', function(p, j) { return boxHeight * j; })
                .attr('width', boxWidth).attr('height', boxHeight)
                .style('stroke', 'black')
                .style('fill', function(p) { 
                    return pToRGB(p); 
                });
}