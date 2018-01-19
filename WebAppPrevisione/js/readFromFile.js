function saveFile(event) {
    var input = event.target;

    var reader = new FileReader();
    reader.onload = function(){
        var text = reader.result;
        var res = reader.result.substring(0, 200);
        //console.log(reader.result.substring(0, 200));
        predict(res);
    };
    reader.readAsText(input.files[0]);
}