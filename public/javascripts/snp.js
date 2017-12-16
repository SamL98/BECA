'use strict'

let headers = ['Pubmed ID', 'Cohort', 'Trait', 'P-Value']

var getCurrSnps = function(snps) {
    return snps.filter(s => { return s.name === currSnp.name })
}

var addSNPInfo = function(snps) {
    var filtered = getCurrSnps(snps)
    let bodyRect = rectFor('body')
    let chartRect = rectFor('#chart-container')

    let div = d3.select('#assoc-container')
        .style('border', '2.5px solid black')
        .style('margin-top', '20px')

    div.append('h3')
        .attr('id', 'curr-snp-header')
        .style('width', '100%')
        .style('text-align', 'center')
        .style('font-family', 'arial')
        .text(currSnp.name)

    let table = div.append('table')
        .attr('id', 'traits-table')
        .style('width', '100%')

    let thead = table.append('thead')
    let tbody = table.append('tbody')

    thead.append('tr').selectAll('th')
        .data(headers).enter().append('th')
        .style('font-family', 'arial')
        .text(h => { return h })

    let rows = tbody.selectAll('tr')
        .data(filtered).enter().append('tr')
    displayTraits(rows, headers)
}

var changeSNPInfo = function(snps) {
    var filtered = getCurrSnps(snps)

    d3.select('#curr-snp-header').text(currSnp.name)
    
    let tbody = d3.select('#traits-table').select('tbody')
    tbody.selectAll('tr').remove()
    let rows = tbody.selectAll('tr')
        .data(filtered).enter().append('tr')
    displayTraits(rows, headers)
}

var displayTraits = function(rows, headers) {
    rows.selectAll('td')
        .data(snp => {
            let vals = [snp.pubmed, snp.cohort, snp.trait, snp.pvalue]
            return Array(4).fill().map((_, i) => {
                return {column: headers[i], value: vals[i]}
            })
        }).enter()
        .append('td')
            .style('font-family', 'arial')
            .text(d => { return d.value })
}