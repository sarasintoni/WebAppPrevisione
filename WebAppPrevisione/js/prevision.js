function pearson(values) {
    var max = 0;
    var stag;
    var totElem = values.length - 12;
    var originals = new Array(totElem);
    var sfas;
    for (i = 0; i < totElem; i++) {
        originals[i] = parseInt(values[i + 12]);
    }

    for (gap = 1; gap < 13; gap++) {
        sfas = new Array(totElem);
        for (i = 0; i < sfas.length; i++) {
            sfas[i] = values[i + 12 - gap];
        }

        var data = new Array(
                    originals, sfas
        );
        var r = pearsonCorrelation(data, 0, 1);
        //console.log(r);
        if (r > max) {
            max = r;
            stag = gap;
        }
    }
    return stag;
}

function predict(valString) {
    
    var values = getValue(valString);
    var stag = pearson(values);
    document.getElementById("stagres").value = stag;

    var ma = new Array();
    var cma = new Array();
    var sr = new Array();
    var dest = new Array();
    var avgVal = new Array();
    var window = new Array();
    var firstcma;
    var idx = -1;

    for (i = 0; i < values.length; i++) {
        window.push(values[i]);
        if (window.length == stag) {
            var sum = 0;
            for (v in window) {
                sum += window[v];
            }
            var avg = sum / stag;
            if (firstcma == undefined) {
                if(stag%2!=0) firstcma = i - parseInt(stag / 2);
                else firstcma = i - (stag / 2) + 1;
                idx = firstcma;
            }
            ma[idx++] = avg;
            window.shift();
        }
    }

    if (stag % 2 == 0) {
        var old = ma.shift();
        for (i in ma) {
            var avg = (old + ma[i]) / 2;
            old = ma[i];
            cma[i] = avg;
        }
    } else {
        cma = ma;
    }

    for (c in cma) {
        if (!(c == NaN)) {
            v = values[c] / cma[c];
            sr[c] = v;
        }
    }

    var avgs = new Array();
    var start = Math.ceil(stag / 2);
    for (i = 0; i < stag; i++) {
        var count = 0;
        var app = 0;
        for (v = start + firstcma; v < sr.length; v+=stag) {
            app += sr[v];
            count++;
        }
        avgs.push(app / count);
        start++;
        var news = start % stag;
        start = news;
    }

    for (v in values) {
        var idx = v % avgs.length;
        var res = Math.round((values[v] / avgs[idx]) * 100) / 100;
        dest.push(res);
    }

    var somma = 0;
    var count = 0;
    for (v in dest) {
        somma += dest[v];
        count++;
    }
    var yMedia = somma / count;
    console.log("y media = " + yMedia);

    var xMedia = (dest.length + 1) / 2;
    console.log("x media = " + xMedia);

    var sumCodev = 0.0;
    var sumDev = 0.0;
    for (v in dest) {
        sumCodev += (((parseInt(v) + 1) - xMedia) * (dest[v] - yMedia));
        sumDev += Math.pow(((parseInt(v) + 1) - xMedia), 2);
    }
    console.log("Codev = " + sumCodev);
    console.log("Dev = " + sumDev);

    var coereg = sumCodev / sumDev;
    console.log("Coe reg = " + coereg);

    var intercetta = yMedia - (coereg * xMedia);
    console.log("Intercetta = " + intercetta);

    var newIndex = dest.length + 1;
    document.getElementById("tres").value = newIndex;

    var trendNew = intercetta + (coereg * newIndex);
    var prev = trendNew * avgs[(newIndex - 1) % avgs.length];
    document.getElementById("valres").value = prev;
}

function getValue(valString) {
    var ret = new Array();
    try {
        var val = valString.split(";");
        if (val.length < 3) {
            val = valString.split("\n");
        }
        if (val.length < 2) {
            alert("Errore nel file:\n ci devono essere almeno 12 valori, uno per riga o separati da \";\"");
        }
        for (v in val) {
            ret[v] = parseInt(val[v]);
        }
        if (ret.length < 12) {
            throw new Error;
        }
    } catch (err) {
        alert("Per permettere il calcolo della stagionalità ci vogliono almeno 12 valori!");
    }
    return ret;
}