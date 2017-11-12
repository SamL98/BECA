'use strict'

var addSNPInfo = function(snps) {
    var filtered = snps.filter(s => { return s.name === currSnp.name })

    let bodyRect = rectFor('body')
    let chartRect = rectFor('#chart-container')

    let div = d3.select('#assoc-container')
        .style('background-color', 'lightgray')

    div.append('p').text(currSnp.name)

    let table = div.append('table')
        .attr('id', 'traits-table')
    let thead = table.append('thead')
    let tbody = table.append('tbody')

    let headers = ['Pubmed ID', 'Cohort', 'Trait', 'P-Value']
    thead.append('tr').selectAll('th')
        .data(headers).enter().append('th')
        .text(h => { return h })

    let rows = tbody.selectAll('tr')
        .data(filtered).enter().append('tr')

    rows.selectAll('td')
        .data(snp => {
            let vals = [snp.pubmed, snp.cohort, snp.trait, snp.pvalue]
            return Array(4).fill().map((_, i) => {
                return {column: headers[i], value: vals[i]}
            })
        }).enter()
        .append('td').text(d => { return d.value })
}