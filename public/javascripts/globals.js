var snps = [];
var lowerBound, upperBound;
var currChr;
var roi, query;
var chrRange = 600000;

var geneNo;
var margins = {
    top: 25,
    bottom: 30,
    left: 50,
    right: 25
};
var gridMargins = {
    left: 25,
    right: 25,
    top: 25,
    bottom: 25
};
var firstChart = true;
var rectFor = function(selector) {
    return d3.select(selector).node().getBoundingClientRect();
};
var originalHeight = 0;