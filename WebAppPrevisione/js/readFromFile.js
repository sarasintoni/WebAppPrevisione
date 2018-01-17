// legge file dati locale
/*function loadLocalFile() {
    var input, file, fr;

    if (typeof window.FileReader !== 'function') {
        alert("The file API isn't supported on this browser yet.");
        return;
    }

    input = "serie1STRING.txt";
    if (!input) {
        alert("Couldn't find the fileinput element.");
    }
    else if (!input.files) {
        alert("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
        alert("Please select a file before clicking 'Load'");
    }
    else {
        file = input.files[0];
        fr = new FileReader();
        fr.onload = receivedText;
        console.log("leggo da " + file);
        fr.readAsText(file);
    }
}

// elaborazione dei dati letti in locale
function receivedText(e) {
    /*istanza = e.target.result;
    jInstance = JSON.parse(istanza);
    setInstance(jInstance);*/
    /*alert("received text");
}

function setInstance(jInstance) {
    /*n = jInstance.numcustomers;   // num clienti
    m = jInstance.numfacilities;  // num server
    c = jInstance.cost;   // matrice dei costi
    req = jInstance.req;  // matrice delle richieste
    cap = jInstance.cap;  // vattore delle capacità*/
    /*alert("set instance ");
}*/

function saveFile(event) {
    var input = event.target;

    var reader = new FileReader();
    reader.onload = function(){
        var text = reader.result;
        var res = reader.result.substring(0, 200)
        console.log(reader.result.substring(0, 200));
        predict(res);
    };
    reader.readAsText(input.files[0]);
}