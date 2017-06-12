const topPanel = '.top-panel';
const bottomPanel = '.bottom-panel';
const leftPanel = '.left-panel';
const rightPanel = '.right-panel';

var displayAll = function() {
    animatePanel(topPanel, null, '38%');
    animatePanel(bottomPanel, null, '60%');
    animatePanel(leftPanel, '38%', null)
    animatePanel(rightPanel, '60%', null);
    displayChart();
    displayGrid();
}

var displayChartAndGrid = function() {
    animatePanel(topPanel, null, '38%');
    animatePanel(bottomPanel, null, '60%');
    animatePanel(leftPanel, '0%', null);
    animatePanel(rightPanel, '98%', null);
    displayChart();
    displayGrid();
}

var displayGridAndBrain = function() {
    animatePanel(bottomPanel, null, '98%');
    animatePanel(topPanel, null, '0%');
    animatePanel(leftPanel, '38%', null)
    animatePanel(rightPanel, '62%', null);
    displayGrid();
}

var displaySNPChart = function() {
    animatePanel(topPanel, null, '98%');
    animatePanel(bottomPanel, null, '0%');
    displayChart();
}

var displaySNPGrid = function() {
    animatePanel(topPanel, null, '0%');
    animatePanel(bottomPanel, '98%', '98%');
    animatePanel(rightPanel, '98%', null);
    animatePanel(leftPanel, '0%', null);
    displayGrid();
}

var displayBrain = function() {
    animatePanel(topPanel, null, '0%');
    animatePanel(bottomPanel, '98%', '98%');
    animatePanel(leftPanel, '98%', null);
    animatePanel(rightPanel, '0%', null);
}

var animatePanel = function(panel, width, height) {
    if (width) {
        d3.select(panel).transition().duration(100)
            .style('width', width);
    }

    if (height) {
        d3.select(panel).transition().duration(100)
            .style('height', height);
    }
}