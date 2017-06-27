// Initialize the controls and display the instructions once the window laods.
window.onload = function() {
    // Set the target for the back button.
    $('#back-button').on('click', function() {
        // Reset all resizing and undo any user initiated changes.
        firstChart = true;
        resetPanels();
        removeSNPLabel();
        destroyRenderers();
        removePreviousGrids();
        removeExistingCharts();
        presentInstructions();
    })

    // Present the instructions.
    presentInstructions();

    // Finish initialization.
    setUpControls();
    addResizeObservers();
};

/**
 * Presents the initial instructions on how to use IU BECA.
 */
var presentInstructions = function() {
    let instructions = ["Enter a number 1-116 representing the region of interest in the brain.", 
                        "Specify a chromosome and range to search on. This can be formatted one of three ways:",
                        "Click \"Submit\" to enter your query."];
    let formattingOptions = ["The name of a gene (e.g. ASPM or APOE)",
                            "The name of a SNP (e.g. rs10119)",
                            "The number of a chromosome, followed by a colon and the lower and upper bounds separated by a colon. Remember that queries for larger ranges will take longer to complete. (e.g. 19:4000000-41000000)"];

    let header = d3.select('body').insert('div', '.dg')
        .attr('id', 'intro-header');

    let topHeader = header.append('div')
        .attr('id', 'top-section').style('overflow', 'hidden');
    topHeader.append('h2').attr('class', 'header').text('Welcome to IU BECA');
    topHeader.append('p').attr('class', 'instruction-label').text('To submit a query, follow these steps:');
    topHeader.append('ol').attr('class', 'instr-list');

    header.select('ol').selectAll('li')
        .data(instructions).enter().append('li')
            .attr('id', function(d, i) { return 'instr' + i; })
            .attr('class', 'instruction')
            .text(function(d) { return d; });

    header.select('#instr1')
        .append('ul').attr('class', 'formatting-list')
        .selectAll('li')
        .data(formattingOptions).enter().append('li')
            .attr('class', 'formatting-instruction')
            .text(function(d) { return d; });

    header.append('hr').style('cursor', 'row-resize');

    header.append('div')
        .attr('class', 'info-block').attr('id', 'chart-info')
        .append('h2').attr('class', 'header').attr('id', 'chart-header')
            .text('SNP Chart');

    header.append('div')
        .attr('class', 'info-block').attr('id', 'grid-info')
        .append('h2').attr('class', 'header').text('Voxel Grid');

    header.append('div')
        .attr('class', 'info-block').attr('id', 'render-info')
        .append('h2').attr('class', 'header').text('Brain Renderer');

    let chartLines = [
        "The SNP Chart displays all of the SNPs on the given chromosome within the specified range.",
        "The x-axis represents the basepair location of the SNP on its associated chromosome while the y-axis represent the -log10 of the p-value of the SNP on the specified ROI.",
        "Hovering the cursor over a data point will display the annotation for that SNP, including its name, location, and p-value.",
        "The SNP Chart can be controlled using the controls in the Chart folder of the control panel.",
        "Selecting \"Previous\" will display the SNPs on the current chromosome directly before the currently displayed range.",
        "Similarly, \"Next\" will display the SNPs directly after the current range.",
        "Dragging horizontally on the SNP Chart will create a purple rectangle. When you are done dragging, you will be asked whether or not your would like to zoom in to that range.",
        "If you select \"OK\", then the bounds on the x-axis will change accordingly.",
        "If you wish to undo any zooms, you can always select \"ResetZoom\" and the original bounds will be displayed again."
    ];
    let gridLines = [
        "The Voxel Grid displays the p-values of every SNP currently displayed in the SNP Chart on all 116 ROI\'s.",
        "Each column represents a SNP on all ROI\'s while each row represents each ROI on all SNP\'s.",
        "Each cell is given a color to represent the SNP\'s p-value on the given ROI with red corresponding to 0 and blue corresponding to 1.",
        "Hovering over a cell will display an annotation cataloging the cell\'s SNP, ROI, and p-value.",
        "Selecting a column or cell will redisplay the Brain Renderer to show the association of the SNP on all ROI\'s of the brain."
    ];
    let renderLines = [
        "The Brain Renderer displays the gray matter of the brain, segmented by the 116 ROI\'s.",
        "The axial, coronal, and sagittal slices are displayed.",
        "When a column in the voxel grid is selected, the Brain Renderer is redisplayed using the p-values of the selected SNP.",
        "The color in the Voxel Grid of each SNP on one of the ROI\'s is displayed on the actual ROI in the brain.",
        "The Brain Renderer can be controlled using the \"Render\" folder in the control panel.",
        "The \"Reset\" button can be used to reset the cameras of the renderers after they have been changed."
    ];

    header.select('#chart-info')
        .selectAll('p').data(chartLines).enter().append('p')
            .attr('class', 'instruction info-instruction')
            .text(function(d) { return d; });

    header.select('#grid-info')
        .selectAll('p').data(gridLines).enter().append('p')
            .attr('class', 'instruction info-instruction')
            .text(function(d) { return d; });

    header.select('#render-info')
        .selectAll('p').data(renderLines).enter().append('p')
            .attr('class', 'instruction info-instruction')
            .text(function(d) { return d; });

    var initDrag = null;
    let contentHeight = rectFor('#intro-header').height;
    d3.select('hr').call(
        d3.drag()
            .on('start', function() {
                initDrag = d3.event.y;
            })
            .on('drag', function() {
                d3.selectAll('.info-block').style('height', (contentHeight - rectFor('#top-section').bottom) + 'px');
                d3.select('#top-section').style('height', (d3.event.y) + 'px');
            })
    )
}