var CEOMessageListName = 'Our Values';
var HTMLCEOMessageDivID = 'CEOMessageContent';
var HTMLCEOMessageDivIDModal = 'CEOMessageContentModal';

$(document).ready(function(){
    getCEOMessage();
});

function getCEOMessage(){
    var todaysDate = convertDateSharePointFormat(new Date());
    var CEOMessageURL = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getByTitle('"+CEOMessageListName+"')/items?$select=*&$top=1&$orderBy=Id desc";
    getItems(CEOMessageURL,function(data){
        var MessageResults = data.d.results;
        $('#'+HTMLCEOMessageDivID).html('');
        if(MessageResults.length > 0){
            var yourString = MessageResults[0].Description;
            var maxLength = 2500 // maximum number of characters to extract

            //trim the string to the maximum length
            var trimmedString = yourString.substr(0, maxLength);

            //re-trim if we are in the middle of a word
            trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" "))) + "...";
            //$('#'+HTMLCEOMessageDivID).append('<p class="ceoname">'+MessageResults[0].CEO.Title+'</p><span class="ceoprofile">CEO</span><p class="ds-ceo-detail">'+trimmedString+' <a href="https://200oksolutions.sharepoint.com/sites/DSmart/Lists/CEOMessage/DispForm.aspx?ID='+MessageResults[0].Id+'">Read More</a></p>');
            $('#'+HTMLCEOMessageDivID).append('<p class="ds-ceo-detail">'+trimmedString+' <a href="javascript:;" data-toggle="modal" data-target="#modalCEOMessage" class="">Read More</a></p>');
            $('#'+HTMLCEOMessageDivIDModal).append('<p class="ds-ceo-detail">'+yourString+'</p>');
			 
        }else{
            $('#'+HTMLCEOMessageDivID).append('<p>No message to display as of now</p>');
        }
    },function(data){})
}