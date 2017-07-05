var mysql = require('mysql');
var connected = false;
var connection = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT
});
connection.connect(err => {
    if (err) {
        console.log("Error connecting to MySQL: " + err.stack);
        return;
    }
    connected = true;
    console.log("Connection to MySQL as id: " + connection.threadId);
});

function snpGivenChr(chr, name, callback) {
    let dbname = connection.escapeId("chr" + chr);
    connection.query("use " + dbname);
    connection.query("select * from SNPs where name=?", [name], (error, result, fields) => {
        if (error) {
            console.log("Error querying for snp given chromosome: " + error.stack);
            callback(null);
            return;
        }

        if (result.length > 1) {
            console.log("ERROR: Multiple SNPs found on chr when only one should be.");
            callback(null);
            return;
        }

        result = result[0];
        callback(result);
    });
}

function snpFor(name, callback) {
    connection.query("use snp_map");
    connection.query("select chr, loc from SNPs where name=?", [name], (error, result, fields) => {
        if (error) {
            console.log("Error querying snp_map: " + error.stack);
            callback(null);
            return;
        }
        callback(result);
    });
}

function geneFor(name, callback) {
    connection.query("use gene_map");
    connection.query("select chr, start, end from Genes where name=?", [name], (error, result, fields) => {
        if (error) {
            console.log("Error querying gene_map: " + error.stack);
            callback(null);
            return;
        }
        callback(result);
    });
}

function snpsFor(chr, start, end, roi, callback) {
    let dbname = connection.escapeId("chr" + chr);
    connection.query("use " + dbname, (error, result, fields) => {
        if (error) {
            console.log("Error while switching databases: " + error.stack);
            callback(null);
            return;
        }

        connection.query("select * from SNPs where loc>=? and loc<=?", [start, end], (error, result, fields) => {
            if (error) {
                console.log("Error querying chr" + chr + ": " + error.stack);
                callback(null);
                return;
            }
            result.splice(0, 0, {"chr": chr, "start": start, "end": end});
            callback(result);
        });
    });
}

function serveSnpsForGene(name, roi, callback) {
    geneFor(name, (gene) => {
        if (!gene) {
            console.log("Gene " + name + " is nil from query");
            callback(null);
            return;
        }

        if (gene.length >  1) {
            console.log("ERROR: Multiple genes return for " + name + " when only one should be");
            callback(null);
            return;
        }

        gene = gene[0];
        let lowerBound = parseInt(gene.start) - 200000;
        let upperBound = parseInt(gene.end) + 200000;
        snpsFor(gene.chr, lowerBound, upperBound, roi, snps => {
            callback(snps);
        })
    })
}

function serveSnpsForSnp(name, roi, callback) {
    snpFor(name, snp => {
        if (!snp) {
            console.log("SNP " + name + " is nil from query");
            callback(null);
            return;
        }

        if (snp.length > 1) {
            console.log("ERROR: Multiple SNPs incorrectly returned for name " + name);
            callback(null);
            return;
        }

        snp = snp[0];
        let lowerBound = parseInt(snp.loc) - 300000;
        let upperBound=  parseInt(snp.loc) + 300000;
        snpsFor(snp.chr, lowerBound, upperBound, roi, snps => {
            callback(snps);
        });
    });
}

function serveSnpsForRange(chr, lower, upper, roi, callback) {
    snpsFor(chr, lower, upper, roi, snps => {
        callback(snps);
    });
}

module.exports = {
    serveSnpsForGene,
    serveSnpsForSnp,
    serveSnpsForRange,
    snpGivenChr
}

