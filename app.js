var express = require('express');
//var sassMiddleware = require('node-sass-middleware');
var path = require('path');
var dbmanager = require('./DBManager.js');
var exec = require('child_process').exec;

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + "/public/home.html"));
});

app.get('/query', (req, res) => {
    let roi = parseInt(req.query.roi);
    if (!roi) {
        console.log("ROI not provided");
        res.status(400).send("Error: You must provide an integer ROI between 1 and 116.");
        return;
    }

    let gene = req.query.gene;
    if (gene) {
        dbmanager.serveSnpsForGene(gene, roi, snps => {
            if (!snps) {
                console.log("No SNPS from query");
                res.status(500).send("null SNPs");
                return;
            }
            res.send(snps);
            return;
        });
    }

    let snp = req.query.snp;
    if (snp) {
        dbmanager.serveSnpsForSnp(snp, roi, snps => {
            if (!snps) {
                console.log("No SNPS from query");
                res.status(500).send("null SNPs");
                return;
            }
            res.send(snps);
            return;
        });
    }

    let chr = req.query.chr;
    let min = parseInt(req.query.min);
    let max = parseInt(req.query.max);
    if (chr && min && max) {
        dbmanager.serveSnpsForRange(chr, min, max, roi, snps => {
            if (!snps) {
                console.log("No SNPS from query");
                res.status(500).send("null SNPs");
                return;
            }
            res.send(snps);
            return;
        });
    }
});

app.get('/nifti/:filename', (req, res) => {
    let filename = req.params.filename;
    res.sendFile(path.join(__dirname + "/public/NiftiFiles/" + filename));
});

app.get('/colortable', (req, res) => {
    let chr = req.query.chr;
    let name = req.query.snp;
    if (!chr || !name) {
        console.log("Either chr or snp query param missing for colortable request");
        res.status(400).send("ERROR: Missing params.");
        return;
    }

    dbmanager.snpGivenChr(chr, name, snp => {
        if (!snp) {
            console.log("Snp from query is nil");
            res.status(500).send("ERROR: Missing snp");
            return;
        }

        let snpStr = JSON.stringify(snp);
        let commandStr = "python colortable.py \'" + snpStr + "\'";
        exec(commandStr, (error, stdout, stderr) => {
            if (stdout.trim() !== "") {
                console.log(stdout);
            }
            if (stderr.trim() !== "") {
                console.log(stderr);
            }
            if (error) {
                console.log("Error executing colortable subprocess.");
                res.status(500).send("ERROR: Subprocess execution.");
                return;
            }
            res.send("Success!");
        });
    });
});

app.get('/center', (req, res) => {
    let roi = req.query.roi;
    if (!roi) {
        console.log("ROI missing from center query");
        res.status(400).send("ERROR: Missing params.");
        return;
    }

    let commandStr = "python roi_locator.py " + roi;
    console.log(process.env.PYTHONPATH);
    exec(commandStr, (error, stdout, stderr) => {
        if (error) {
            console.log("Error executing roi locator subprocess: " + error);
            res.status(500).send("ERROR: Subprocess execution.");
            return;
        }

        if (stderr.trim() !== "") {
            console.log(stderr);
        }

        let coords = stdout.trim();
        if (coords === "") {
            console.log("No coordinates return by roi locator subprocess.");
            res.status(500).send("ERROR: Subprocess execution.");
            return;
        }

        if (coords.length < 6) {
            console.log("Coordinate string is too short from roi locator subprocess.");
            res.status(500).send("ERROR: Subprocess execution.");
            return;
        }

        let arrStr = coords.substring(1, coords.length - 1);
        let center = arrStr.split(',');
        if (center.length < 3) {
            console.log("Coordinate array is too short from roi locator subprocess.");
            res.status(500).send("ERROR: Subprocess execution.");
            return;
        }

        res.status(200).send(center.map(parseInt));
    })
})

app.listen(8081, function() {
    console.log('listening on 8081');
});
