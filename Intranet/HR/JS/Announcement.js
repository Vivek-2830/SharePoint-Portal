
var AnnouncementsListName = 'Announcements';
var AnnouncementHTMLId = 'AnnouncementsHRDiv';
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

$(document).ready(function(){
    getAnnouncement();
});

function getAnnouncement(){
    date = new Date();
    var Announcementsurl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('"+AnnouncementsListName+"')/items?$top=10&$select=*,AttachmentFiles,Title&$expand=AttachmentFiles&$filter=Expires ge '"+convertDateSharePointFormat(date)+"' and isGlobal eq 0&$orderBy=Id desc";
    getItems(Announcementsurl,function(data){
        var AnnouncementResults = data.d.results;
        if(AnnouncementResults.length > 0){
            for(j=0;j<AnnouncementResults.length;j++){
                var Image = '';
            	if(AnnouncementResults[j].AttachmentFiles.results.length > 0){
            		Image = AnnouncementResults[j].AttachmentFiles.results[0].ServerRelativeUrl;
            	}else{
                Image = _spPageContextInfo.siteAbsoluteUrl+'/Style%20Library/Intranet/Images/Announcement.png';
                }
                var modifiedDate = new Date(convertDateSharePointFormat(AnnouncementResults[j].Modified));
                var month = monthNames[modifiedDate.getMonth()].substr(0, 3);
                var day = modifiedDate.getDate();
                var year = modifiedDate.getFullYear();

                var HTMLToAppendForAnnouncement = '<li title="'+AnnouncementResults[j].Title+'">'+
                                    '<img src="'+Image+'">'+
                                    '<div class="ds-widget-inner ds-widget-hr">'+
                                        '<h3>'+AnnouncementResults[j].Title+'</h3>'+
                                        '<p>'+month+' '+day.toString()+', '+year.toString()+'</p> '+
                                    '</div>'+
                                    '</li>';
                
                $('#'+AnnouncementHTMLId).last().append(HTMLToAppendForAnnouncement);
            }
        }else{
            $('#'+AnnouncementHTMLId).append('<li>There are no announcements as of now.</li>');
        }
    },function(data){})
}