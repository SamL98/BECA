'use strict'

var addSNPInfo = function(snps) {
    var filtered = snps.filter(s => { return s.name === currSnp.name })

    let bodyRect = rectFor('body')
    let chartRect = rectFor('#chart-container')

    let div = d3.select('#assoc-container')
        .style('border', '2.5px solid black')
        .style('margin-top', '20px')

    div.append('h3')
        .style('width', '100%')
        .style('text-align', 'center')
        .style('font-family', 'arial')
        .text(currSnp.name)

    let table = div.append('table')
        .attr('id', 'traits-table')
        .style('width', '100%')

    let thead = table.append('thead')
    let tbody = table.append('tbody')

    let headers = ['Pubmed ID', 'Cohort', 'Trait', 'P-Value']
    thead.append('tr').selectAll('th')
        .data(headers).enter().append('th')
        .style('font-family', 'arial')
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
        .append('td')
            .style('font-family', 'arial')
            .text(d => { return d.value })
}