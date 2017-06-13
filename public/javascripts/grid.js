var removePreviousGrids = function() {
    d3.selectAll('.grid').remove();
}

var prevCol = null;
var prevCell = null;

var displayGrid = function() {
    removePreviousGrids();
    
    var data = [];
    for (var i = 0; i < snps.length; i++) {
        var snp = snps[i];
        if (snp.loc >= lowerBound || snp.loc <= upperBound) {
            data.push(snp);
        }
    }

    const boxWidth = 7.5, boxHeight = 7.5;
    const gridWidth = data.length * boxWidth, gridHeight = 116 * boxHeight;

    d3.select('#grid-container')
        .style('width', gridWidth).style('height', gridHeight);

    var grid = d3.select('#grid-container').append('svg')
        .attr('class', 'grid').attr('width', gridWidth).attr('height', gridHeight);

    var rect = rectFor('.grid');
    var x = d3.scaleLinear().range([rect.left, rect.right]).domain([0, boxWidth * snps.length]);
    var y = d3.scaleLinear().range([rect.bottom, rect.top]).domain([0, boxHeight * 116]);

    grid.append('g').attr('transform', 'translate(' + 300.0 + ',' + gridMargins.top + ')')
        .append('text')
            .attr('class', 'gridLabel')
            .style('text-anchor', 'middle').style('font-weight', 400)
            .text('SNPs on chr ' + currChr + ' from ' + lowerBound + '-' + upperBound);

    grid.append('g').attr('transform', 'rotate(-90) translate(' + (-225.0) + ',0)') 
        .append('text')
            .attr('dy', '2em')
            .attr('class', 'gridLabel')
            .style('text-anchor', 'middle').style('font-weight', 400)
            .text('ROIs');

    d3.select('.grid').selectAll('g').data(data)
        .enter().append('g')
            .attr('class', 'column').attr('id', function(s, i) { return 'col' + i; })
            .attr('snp', function(s) { return s.name; })
            .attr('transform', function(s, i) { return 'translate(' + (boxWidth * i + gridMargins.left) + ',' + 1.5 * gridMargins.top + ')'})
            .on('click', function(s, i) {
                if (prevCol) {
                    d3.select('#col' + prevCol).selectAll('rect').style('stroke', 'black');
                }
                d3.select('#col' + i).selectAll('rect').style('stroke', 'white');
                prevCol = i;
                renderOverlay(s.name);
            })
            .selectAll('rect').data(function(s) { return s.pvalues; }).enter().append('rect')
                .attr('id', function(p, j) { return 'p-' + (parseInt(Math.random() * 10000)) + '-' + j; })
                .attr('snp', s.name).attr('p', function(p) { return p; })
                .attr('roi', function(p, j) { return j; })
                .attr('x', 0).attr('y', function(p, j) { return boxHeight * j; })
                .attr('width', boxWidth).attr('height', boxHeight)
                .style('stroke', 'black')
                .style('fill', function(p) { 
                    return pToRGB(p); 
                })
                .on('mouseover', function() {
                    const id = d3.event.target.id;
                    d3.select('#' + id)
                        .style('stroke', 'white');
                    prevCell = id;
                    const snp = this.parentNode.getAttribute('snp');
                    addAnnotationForPValue(id, snp);
                })
                .on('mouseout', function() {
                    const id = d3.event.target.id;
                    if (prevCell) {
                        d3.select('#' + id)
                            .attr('transform', 'scale(1)')
                            .style('stroke', 'black');
                        removeAnnotationForPValue(id);
                    }
                });
}