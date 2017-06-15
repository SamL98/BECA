/**
 * Created an instance of a SNP object.
 * 
 * @constructor
 * @this {SNP}
 * @param {string} name The name of the SNP.
 * @param {integer} loc The location of the SNP on its chromosome.
 * @param {Array<double>} ps The pvalues on the 116 ROIs of the brain.
 * @param {double} freq  @deprecated The frequency of the SNP in the population.
 */
function SNP(name, loc, ps, freq) {
    this.name = name;
    this.loc = loc;
    this.pvalues = ps;
    this.freq = freq;
};