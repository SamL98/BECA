/**
 * Global variables used throughout multiple files grouped for convenience. 
 */

/** Variables regarding the genetic data being displayed. */

// Array of SNP objects on the current chromosome between the current lower and upper bounds.
var snps = [];
// Bounds of SNPs to fetch on the current chromosome;
var lowerBound, upperBound;
// Bounds of SNPs on the current chromosome. Set directly after database query. Used in order to reset after zooming.
var originalLower, originalUpper;
// The chromosome currently displaying SNPs for.
var currChr;
// The current roi queried for.
var roi;
// The current query entered by the user (see accepted formats in parser documentation).
var query;
// The default range between lower and upper bounds.
var chrRange = 600000;

/** Variables for displaying the chart and grid. */

// Margins for the SNP chart.
var chartMargins = {
    top: 25,
    bottom: 30,
    left: 50,
    right: 25
};

// Margins for the voxel grid.
var gridMargins = {
    left: 25,
    right: 25,
    top: 25,
    bottom: 25
};

/** Miscellaneous variables */

var colortable = null;
var orientation = null;

var displaySNPLabel = true;

// Flag for if the database has been queried yet.
var firstChart = true;

// Returns the bounding rect for the given JQuery/D3 selector.
var rectFor = function(selector) {
    return d3.select(selector).node().getBoundingClientRect();
};