'use strict'

var currSnp

var findMiddleSNP = function(snps, bounds) {
    if (query.substring(0, 2) === "rs") {
        for (var i = 0; i < snps.length; i++) {
            if (snps[i].name == query) {
                return snps[i]
            }
        }
    }

    let midPoint = (bounds.high + bounds.low)/2
    var minDist = 1000000000000
    var minSnp

    for (var i = 0; i < snps.length; i++) {
        if (Math.abs(snps[i].pos - midPoint) < minDist) {
            minDist = Math.abs(snps[i].pos - minDist)
            minSnp = snps[i]
        }
    }
    return minSnp
}

var generateRandomId = function(length) {
    var randomStr = ''
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVQXYZ1234567890'
    for (var i = 0; i < length; i++) {
        randomStr += chars[Math.floor(Math.random() * chars.length)]
    }
    return randomStr
}

var displayChart = function(snps, bounds) {
    d3.selectAll('.chart').remove()

    let currChr = snps[0].chr;

    let bodyRect = rectFor('body');

    let margins = {
        top: 10,
        bottom: 20,
        left: 30,
        right: 30
    }
    let width = bodyRect.width - margins.left - margins.right
    let height = 360 - margins.top - margins.bottom

    var chart = d3.select('#chart-container')
        .append('svg').attr('class', 'chart')
            .style('fill', 'white')
            .attr('width', (width + margins.left + margins.right))
            .attr('height', (height + margins.top + margins.bottom))
        .append('g')
            .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')')

    let rect = rectFor('#chart-container')

    let x = d3.scaleLinear()
        .range([0, width])
        .domain([bounds.low/1000000, bounds.high/1000000])

    let y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(snps, d => { return -Math.log10(d.pvalue); })])

    let xAxis = d3.axisBottom(x)
    let yAxis = d3.axisLeft(y)

    // Append the x axis to the chart.
    chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis).append('text')
            .attr('class', 'axisLabel')
            .attr('x', width / 2)
            .attr('dy', '-1em')
            .style('text-anchor', 'middle')
            .text('Position on Chr ' + currChr + ' (bp * 10^6)');

    // Append the y axis to the chart.
    chart.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(0,0)')
        .call(yAxis).append('text')
            .attr('class', 'axisLabel')
            .attr('transform', 'rotate(-90)')
            .attr('dy', '1em')
            .attr('x', -height / 2)
            .style('text-anchor', 'middle')
            .text('-log10(p)');

    chart.selectAll('.point').data(snps)
        .enter().append('circle')
        .style('cursor', 'pointer')
        .attr('class', 'point')
        .attr('id', s => { return generateRandomId(5) })
        .attr('p', s => { return s.pvalue })
        .attr('snp', s => { return s.name })
        .attr('bp', s => { return s.pos })
        .attr('r', 5)
        .attr('cx', (s) => { return x(s.pos/1000000) })
        .attr('cy', (s) => { 
            let logp = -Math.log10(s.pvalue)
            if (logp == NaN || logp == Infinity) {
                return rect.top + margins.top
            }
            return y(logp) 
        })
        .on('mouseover', () => {
            addAnnotationForSNP(d3.event.target.id)
            indicateSNPInspected(d3.event.target.id)
        })
        .on('mouseout', () => {
            removeAnnotationForSNP(d3.event.target.id)
            indicateSNPUninspected(d3.event.target.id)
        })
        .on('click', () => {
            let snp = d3.select('#' + d3.event.target.id).attr('snp')
            for (var i = 0; i < snps.length; i++) {
                if (snps[i].name === snp) {
                    currSnp = snps[i]
                }
            }
            changeSNPInfo(snps)
        })

    currSnp = findMiddleSNP(snps, bounds)
    addSNPInfo(snps)
}

var query = ''

var Controls = function() {
    this.Query = ''
    // Submits the given query information.
    this.Submit = function() {
        query = this.Query
        if (query && query != "") {
            // If the query and roi are present, fetch the SNP data.
            $.ajax({
                url: parseQuery(currentHost + '/gwas_query?', query),
                type: 'GET',
                dataType: 'json',
                success: data => {
                    let snps = data.snps
                    let bounds = data.bounds

                    if (snps === undefined || snps.length == 0 || bounds === undefined) {
                        alert("Sorry. Something went wrong querying for: " + query)
                        return
                    }
                    
                    displayChart(snps, bounds)
                },
                error: err => {
                    console.log('Error with AJAX gwas query: ' + JSON.stringify(err));
                }
            })
        } else if (this.Query != '') {
            // If the control panel has a query and roi, but the global variables are not set,
            // set the global variables and resubmit.
            query = this.Query
            this.Submit()
        }
    }
}

window.onload = function() {
    let panel = new Controls()
    var gui = new dat.GUI({ autoPlace: true })
    gui.remember(panel)
    gui.add(panel, 'Query')
    gui.add(panel, 'Submit')
}