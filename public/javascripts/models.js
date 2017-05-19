function SNP(name, loc, p, freq) {
    this.name = name;
    this.loc = loc;
    this.p = p;
    this.freq = freq;
};

function Gene(name, start, end) {
    this.name = name;
    this.start = start;
    this.end = end;
    this.snps = [];
};

function Chromosome(number) {
    this.number = number;
    this.genes = [];
    this.addGene = function(gene) {
        var i = 0;
        while (gene.end < this.genes[i].start) {
            i++;
        }
        this.genes.splice(i, 0, gene);
    };
};