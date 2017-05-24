var parseGenomicData = function(callback) {
    var type = function(d) {
        d.CHR = +d.CHR;
        d.BP = +d.BP;
        d.START = +d.START;
        d.END = +d.END;
        d.FREQ = +Math.random().toFixed(2);
        d.P = +Math.random().toFixed(4);
        return d;
    }
    d3.tsv('gene-snp.tsv', type, function(error, data) {
        formatData(data, callback);
    });
}

var formatData = function(data, callback) {
    var formatted = [];

    var initChr = 0;
    var initGene = '';

    var i = 0;
    while (i < data.length) {
        if (data[i].CHR != initChr) {
            initChr = data[i].CHR;
            formatted.push(new Chromosome(initChr));
        }

        var chr = formatted[formatted.length - 1];
        if (data[i].GENE != initGene) {
            initGene = data[i].GENE;
            geneNo = chr.addGene(new Gene(initGene, data[i].START, data[i].END));
        }

        var gene = chr.genes[geneNo];
        gene.snps.push(new SNP(data[i].RS, data[i].BP, data[i].P, data[i].FREQ));
        i++;
    }
    callback(formatted);
}