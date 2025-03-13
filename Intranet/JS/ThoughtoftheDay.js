var ThoughtListName = 'Thought of the Day';
var HTMLThoughtDivID = 'ThoughtMessage';

$(document).ready(function(){
    //getThoughts();
    //GetItemsForThoughts("https://quotes.rest/qod.json");

    fetch("https://cors-anywhere.herokuapp.com/https://andruxnet-random-famous-quotes.p.rapidapi.com/?cat=famous&count=10", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "andruxnet-random-famous-quotes.p.rapidapi.com",
            "x-rapidapi-key": "20645b1702mshd175ccab60e760dp14cbbdjsn27e1d597247a"
        }
    })
    .then(response => {
        console.log(response);
    })
    .catch(err => {
        console.log(err);
    });
});

function getThoughts(){
    var todaysDate = convertDateSharePointFormat(new Date());
    var thoughtURL = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getByTitle('"+ThoughtListName+"')/items?$select=*&$filter=AppliesOn eq '"+todaysDate+"'";
    getItems(thoughtURL,function(data){
        var thoughtResults = data.d.results;
        if(thoughtResults.length > 0){
            $('#'+HTMLThoughtDivID).append('<span>Thought for the day :</span>"'+thoughtResults[0].Title+'"');
        }else{
            $('#'+HTMLThoughtDivID).append('<span>Thought for the day :</span>No thought for today');
        }
    },function(data){})
}

function GetItemsForThoughts(url) {
    var results = [];
    $.ajax({
        url: url,
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            $('#'+HTMLThoughtDivID).append('<span>Thought for the day :</span>"'+data.contents.quotes[0].quote+'"');
        },
        error: function (data) {
            console.log(data);
        }
    });
    return results;
}


