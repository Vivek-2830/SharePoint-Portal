var TechNewsListName = 'Tech News';
var TechNewsDivID = 'TechNews';
const TechmonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

$(document).ready(function(){
    getTechNews();
});

function getTechNews1(){
    var todaysDate = convertDateSharePointFormat(new Date());
    var techNewsURL = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getByTitle('"+TechNewsListName+"')/items?$select=*&$filter=Expires ge '"+todaysDate+"'&$top=3&$orderBy=Id desc";
    getItems(techNewsURL,function(data){
        var techNewsResults = data.d.results;
        $('#'+TechNewsDivID).html('');
        if(techNewsResults.length > 0){
            for(n=0;n<techNewsResults.length;n++){
                var techModifiedDate = new Date(convertDateSharePointFormat(techNewsResults[n].Modified));
                var techmonth = TechmonthNames[techModifiedDate.getMonth()].substr(0, 3);
                var techday = techModifiedDate.getDate();
                var techyear = techModifiedDate.getFullYear();

                var descriptionString = techNewsResults[n].Description;
                var maxLength = 200 // maximum number of characters to extract

                //trim the string to the maximum length
                var descriptionTrimmedString = '';
                if(techNewsResults[n].Description != null){
                    descriptionTrimmedString = descriptionString.substr(0, maxLength);
    
                    //re-trim if we are in the middle of a word
                    descriptionTrimmedString = descriptionTrimmedString.substr(0, Math.min(descriptionTrimmedString.length, descriptionTrimmedString.lastIndexOf(" ")));
                }

                var HTMLForTechNewsToAppend = '<li title="'+(techNewsResults[n].Description == null ? '' : descriptionTrimmedString)+'">'+
                                                '<p>'+techmonth+' '+techday.toString()+', '+techyear.toString()+'</p>'+
                                                '<div class="ds-feed-detail">'+
                                                    '<h3>'+techNewsResults[n].Title+'</h3>'+
                                                    '<p class="feed-details">'+(techNewsResults[n].Description == null ? '' : descriptionTrimmedString)+'</p>'+
                                                '</div>'+
                                            '</li>';
                $('#'+TechNewsDivID).last().append(HTMLForTechNewsToAppend);
            }
        }else{
            $('#'+TechNewsDivID).append('<p>No news to display as of now</p>');
        }
    },function(data){})
}

function getTechNews() {
    var url = "https://cors-anywhere.herokuapp.com/https://towardsdatascience.com/feed";
    var results = GetItemsForNews(url);
    
    $(results).find("item").each(function () {
    	var el = $(this);

		var Title = el.find("title").text();
		var Link = el.find("link").text();
		var Description = ""
		if(el.find("description").length > 0){
			var Description = el.find("description")[0].textContent;
		}
		var publishedDate = new Date(el.find("pubDate").text());
		
		
		//console.log('Title :- '+Title);
		//console.log('Link :- '+Link);
		//console.log('Description :- '+Description);
		//console.log('publishedDate :- '+publishedDate);
		
		var getDate = publishedDate.getDate();
        var month = TechmonthNames[publishedDate.getMonth()].substr(0, 3);
        var techyear = publishedDate.getFullYear();
        
        var HTMLToAppend = '';
        
        var HTMLForTechNewsToAppend = '<li><a href="'+ Link +'" target="_blank">'+
                                            '<p>'+ month +' '+getDate.toString()+', '+techyear.toString()+'</p>'+
                                            '<div class="ds-feed-detail">'+
                                                '<h3>'+ Title +'</h3>'+
                                                '<p class="feed-details">'+ Description +'</p>'+
                                            '</div>'+
                                        '</a></li>';
        $('#'+TechNewsDivID).last().append(HTMLForTechNewsToAppend);
    });
    /*if(results.length > 0){
        for(l=0;l<results.length;l++){
            var publishedDate = new Date(results[l].publishedAt);
            var getDate = publishedDate.getDate();
            var month = TechmonthNames[publishedDate.getMonth()].substr(0, 3);
            var techyear = publishedDate.getFullYear();
            HTMLToAppend = '';
            var HTMLForTechNewsToAppend = '<a href="'+results[l].url+'" target="_blank"><li title="'+(results[l].description == null ? '' : results[l].description)+'">'+
                                            '<p>'+month +' '+getDate.toString()+', '+techyear.toString()+'</p>'+
                                            '<div class="ds-feed-detail">'+
                                                '<h3>'+results[l].title+'</h3>'+
                                                '<p class="feed-details">'+(results[l].description == null ? '' : results[l].description)+'</p>'+
                                            '</div>'+
                                        '</li></a>';
            $('#'+TechNewsDivID).last().append(HTMLForTechNewsToAppend);
        }
    }else{
        $('#'+IndustrialNewsHTMLId).last().append('There are no news to show.');
    }*/
}


function GetItemsForNews(url) {
    var results = [];
    $.ajax({
        url: url,
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
        		//var jsonText = JSON.stringify(xmlToJson($(data)[0]));
                results = data;
        },
        error: function (data) {
            console.log(data);
            $('#'+TechNewsDivID).append('<p>No news to display as of now</p>');
        }
    });
    return results;
}

function xmlToJson(xml) {
    'use strict';
    // Create the return object
    var obj = {}, i, j, attribute, item, nodeName, old;

    if (xml.nodeType === 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (j = 0; j < xml.attributes.length; j = j + 1) {
                attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType === 3) { // text
        obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
        for (i = 0; i < xml.childNodes.length; i = i + 1) {
            item = xml.childNodes.item(i);
            nodeName = item.nodeName;
            if ((obj[nodeName]) === undefined) {
                obj[nodeName] = xmlToJson(item);
            } else {
                if ((obj[nodeName].push) === undefined) {
                    old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
}