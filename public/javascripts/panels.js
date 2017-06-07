var displayAll = function() {
    d3.select('.top-panel').transition().duration(250);
    d3.select('.bottom-panel').transition().duration(250);
    d3.select('.right-panel').transition().duration(250);
    d3.select('.left-panel').transition().duration(250);
}

var displayChartAndGrid = function() {
    d3.select('.top-panel').transition().duration(250);
    d3.select('.bottom-panel').transition().duration(250);
    d3.select('.right-panel').transition().duration(250);
    d3.select('.left-panel').transition().duration(250);
}

var displayGridAndBrain = function() {
    d3.select('.top-panel').transition().duration(250);
    d3.select('.bottom-panel').transition().duration(250);
    d3.select('.right-panel').transition().duration(250);
    d3.select('.left-panel').transition().duration(250);
}

var displayChart = function() {
    d3.select('.top-panel').transition().duration(250);
    d3.select('.bottom-panel').transition().duration(250);
    d3.select('.right-panel').transition().duration(250);
    d3.select('.left-panel').transition().duration(250);
}

var displayGrid = function() {
    d3.select('.top-panel').transition().duration(250);
    d3.select('.bottom-panel').transition().duration(250);
    d3.select('.right-panel').transition().duration(250);
    d3.select('.left-panel').transition().duration(250);
}

var displayBrain = function() {
    d3.select('.top-panel').transition().duration(250)
        .style('height', 0);
    d3.select('.bottom-panel').transition().duration(250)
        .style('height', '100%');
    d3.select('.right-panel').transition().duration(250)
        .style('width', 0);
    d3.select('.left-panel').transition().duration(250)
        .style('width', '100%');
}