
var ForumListName = 'Discussions List';
var ForumHTMLId = 'InternalForums';
const ForummonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

$(document).ready(function(){
    getForumns();
});

function getForumns(){
    date = new Date();
    var Forumsurl = _spPageContextInfo.webAbsoluteUrl + "/Forums/_api/web/lists/GetByTitle('"+ForumListName+"')/items?$select=*,Author/Title&$expand=Author&$filter=IsQuestion eq 1";
    getItems(Forumsurl,function(data){
        var ForumResults = data.d.results;
        if(ForumResults.length > 0){
            for(m=0;m<ForumResults.length;m++){
                var createdDate = new Date(convertDateSharePointFormat(ForumResults[m].Created));
                var month = ForummonthNames[createdDate.getMonth()].substr(0, 3);
                var day = createdDate.getDate();
                var year = createdDate.getFullYear();
                var HTMLToAppendForForums = '<li>'+
                        '<div class="ds-widget-inner">'+
                            '<a href="'+_spPageContextInfo.webAbsoluteUrl+'/Forums/SitePages/Topic.aspx?RootFolder=/sites/DSmart/Forums/Lists/Community%20Discussion/'+ForumResults[m].Title+'" target="_blank"><h3>'+ForumResults[m].Title+'</h3></a>'+
                            '<p>'+month+' '+day.toString()+', '+year.toString()+' by <span>'+ForumResults[m].Author.Title+'</span> </p>'+
                        '</div>'+
                    '</li>';
                
                $('#'+ForumHTMLId).last().append(HTMLToAppendForForums);
            }
        }else{
            $('#'+ForumHTMLId).append('<li>'+
            '<div class="ds-widget-inner">'+
                '<h3>There are no forums to show.</h3>'+
                '<p><span></span> </p>'+
            '</div>'+
        '</li>');
        }
    },function(data){})
}