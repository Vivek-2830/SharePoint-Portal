
var IndustrialNewsHTMLId = 'WorldNews';
const IndustrialmonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

$(document).ready(function(){
    getIndustrialNews();
});

function getIndustrialNews() {
    var url = "https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=42f6af84815845839d16f7e826612f50";
    var results = GetItemsForNews(url);
    var HTMLToAppend = '';
    if(results.length > 0){
        for(l=0;l<results.length;l++){
            var publishedDate = new Date(results[l].publishedAt);
            var getDate = publishedDate.getDate();
            var month = IndustrialmonthNames[publishedDate.getMonth()].substr(0, 3);
            HTMLToAppend = '';
            HTMLToAppend += '<li>'+
                                '<h4>'+month+' '+getDate+'</h4>'+
                                '<div class="ds-news-detail">'+
                                    '<h3>'+results[l].title+'</h3>'+
                                    '<p></p>'+
                                '</div>'+
                            '</li>';
            $('#'+IndustrialNewsHTMLId).last().append(HTMLToAppend);
        }
    }else{
        $('#'+IndustrialNewsHTMLId).last().append('There are no news to show.');
    }
}

function GetItemsForNews(url) {
    var results = [];
    $.ajax({
        url: url,
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
                results = data.articles;
        },
        error: function (data) {
            console.log(data);
            failure(data);
        }
    });
    return results;
}