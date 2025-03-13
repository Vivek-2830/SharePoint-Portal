var EventListName = 'Events And Trainings';
const EventsmonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var meetingData = null;
$(document).ready(function(){
    getEvent();
});
function getDayOfWeek(date) {
    var dayOfWeek = new Date(date).getDay();    
    return isNaN(dayOfWeek) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
}

function getEvent(){
    var date = new Date();
    // var eventsURL = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getByTitle('"+EventListName+"')/items?$select=*&$filter=EventDate ge datetime'"+date.toISOString()+"' and ParticipantsPickerId eq "+_spPageContextInfo.userId+"&$top=5000";
    var eventsURL = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getByTitle('" + EventListName + "')/items?" +
    "$select=*&$filter=EventDate ge datetime'" + date.toISOString() + "' and " +
    "(ParticipantsPickerId eq " + _spPageContextInfo.userId + " or ParticipantsPickerId eq 14)" +
    "&$top=5000";
    getItems(eventsURL,function(data){
        if(data.d.results.length > 0){
            var futureEvents = data.d.results;
            for(p=0;p<futureEvents.length;p++){
                var iconType = '';
                if(futureEvents[p].Category == 'Event'){
                    iconType = 'fa fa-users';
                }
                else if(futureEvents[p].Category == 'Training'){
                    iconType = 'fa fa-calendar-o';
                }
                else{
                    iconType = 'fa fa-calendar-o';
                }
                var EventDate = new Date(futureEvents[p].EventDate);
                var Eventmonth = EventsmonthNames[EventDate.getMonth()].substr(0, 3);
                var Eventday = EventDate.getDate();
                if(futureEvents[p].Category == 'Event'){
                    var HTMLToAppend = '<li>'+
                                            '<h4><i class="'+iconType+'"></i></h4>'+
                                            '<div class="ds-lists-detail openEventsAndTrainingsPopup" data-toggle="modal" data-target="#modalEventTraining" data-id="'+futureEvents[p].Id+'">'+
                                                '<h3>'+futureEvents[p].Title+'</h3>'+
                                                '<p>'+(new Date(futureEvents[p].EventDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}))+' to '+(new Date(futureEvents[p].EndDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}))+'</p>'+
                                            '</div>'+
                                            '<div class="ds-date">'+
                                                '<p>'+getDayOfWeek(new Date(futureEvents[p].EventDate))+', '+Eventday.toString()+' '+Eventmonth.toString()+' '+EventDate.getFullYear()+'</p>'+
                                            '</div>'+
                                        '</li>';
                    $('#upcomingEventsData').last().append(HTMLToAppend);
                }
                else{
                    var HTMLToAppend = '<li>'+
                                        '<h4><i class="'+iconType+'"></i></h4>'+
                                        '<div class="ds-lists-detail openEventsAndTrainingsPopup" data-toggle="modal" data-target="#modalEventTraining" data-id="'+futureEvents[p].Id+'">'+
                                            '<h3>'+futureEvents[p].Title+'</h3>'+
                                            '<p>'+(new Date(futureEvents[p].EventDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}))+' to '+(new Date(futureEvents[p].EndDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}))+'</p>'+
                                        '</div>'+
                                        '<div class="ds-date">'+
                                            '<p>'+getDayOfWeek(new Date(futureEvents[p].EventDate))+', '+Eventday.toString()+' '+Eventmonth.toString()+' '+EventDate.getFullYear()+'</p>'+
                                        '</div>'+
                                    '</li>';
                    $('#upcomingTrainingsData').last().append(HTMLToAppend);
                }
                if(p == futureEvents.length - 1){
                    if($('#upcomingEventsData').html().length == 0){
                        $('#upcomingEventsData').last().append('<li><p class="text-center no-records">No upcoming events found...</p></li>');
                    }
                    if($('#upcomingTrainingsData').html().length == 0){
                        $('#upcomingTrainingsData').last().append('<li><p class="text-center no-records">No upcoming trainings found...</p></li>');
                    }
                }
            }
            $('.openEventsAndTrainingsPopup').click(function(){
                var currentId = parseInt($(this).attr('data-id'));
                if(currentId > 0){
                    getEventsDetails(currentId);
                }
            });
        }
        else{
            var HTMLToAppend = '<li><p class="text-center no-records">No upcoming events found...</p></li>';
            $('#upcomingEventsData').last().append(HTMLToAppend);

            var HTMLToAppend = '<li><p class="text-center no-records">No upcoming trainings found...</p></li>';
            $('#upcomingTrainingsData').last().append(HTMLToAppend);

        }
    },function(data){});
}
function getEvent1(){
    
    $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl+"/_api/web/lists/getbytitle('"+EventListName+"')/getitems",
        type: "POST",
        headers: {
            "accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "content-Type": "application/json;odata=verbose"
        },
        data: JSON.stringify({
            query: {
                __metadata: {
                    type: "SP.CamlQuery"
                },
                ViewXml: "<View><Query><Where><Geq><FieldRef Name='EventDate' /><Value Type='DateTime' IncludeTimeValue='FALSE'>" + date.toISOString() + "</Value></Geq></Where></Query><RowLimit>100</RowLimit></View>"
            }
        }),
        success: function (data) {
            if(data.d.results.length > 0){
                var futureEvents = data.d.results;
                for(p=0;p<futureEvents.length;p++){
                    var iconType = '';
                    if(futureEvents[p].Category == 'Event'){
                        iconType = 'fa fa-users';
                    }
                    else if(futureEvents[p].Category == 'Training'){
                        iconType = 'fa fa-calendar-o';
                    }
                    else{
                        iconType = 'fa fa-calendar-o';
                    }
                    var EventDate = new Date(futureEvents[p].EventDate);
                    var Eventmonth = EventsmonthNames[EventDate.getMonth()].substr(0, 3);
                    var Eventday = EventDate.getDate();
                    if(futureEvents[p].Category == 'Event'){
	                    var HTMLToAppend = '<li>'+
	                                            '<h4><i class="'+iconType+'"></i></h4>'+
	                                            '<div class="ds-lists-detail">'+
	                                                '<h3>'+futureEvents[p].Title+'</h3>'+
	                                                '<p>'+(new Date(futureEvents[p].EventDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}))+' to '+(new Date(futureEvents[p].EndDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}))+'</p>'+
	                                            '</div>'+
	                                            '<div class="ds-date">'+
	                                                '<p>'+getDayOfWeek(new Date(futureEvents[p].EventDate))+', '+Eventday.toString()+' '+Eventmonth.toString()+' '+EventDate.getFullYear()+'</p>'+
	                                            '</div>'+
	                                        '</li>';
	                    $('#upcomingEventsData').last().append(HTMLToAppend);
                    }
                    else{
                    	var HTMLToAppend = '<li>'+
                                            '<h4><i class="'+iconType+'"></i></h4>'+
                                            '<div class="ds-lists-detail">'+
                                                '<h3>'+futureEvents[p].Title+'</h3>'+
                                                '<p>'+(new Date(futureEvents[p].EventDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}))+' to '+(new Date(futureEvents[p].EndDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}))+'</p>'+
                                            '</div>'+
                                            '<div class="ds-date">'+
                                                '<p>'+getDayOfWeek(new Date(futureEvents[p].EventDate))+', '+Eventday.toString()+' '+Eventmonth.toString()+' '+EventDate.getFullYear()+'</p>'+
                                            '</div>'+
                                        '</li>';
	                    $('#upcomingTrainingsData').last().append(HTMLToAppend);
                    }
                    if(p == futureEvents.length - 1){
                        if($('#upcomingEventsData').html() == ''){
                            $('#upcomingEventsData').last().append('<li><p class="text-center no-records">No upcoming events found...</p></li>');
                        }
                        if($('#upcomingTrainingsData').html() == ''){
                            $('#upcomingTrainingsData').last().append('<li><p class="text-center no-records">No upcoming trainings found...</p></li>');
                        }
                    }
                }
            }
            else{
            	var HTMLToAppend = '<li><p class="text-center no-records">No upcoming events found...</p></li>';
                $('#upcomingEventsData').last().append(HTMLToAppend);

            	var HTMLToAppend = '<li><p class="text-center no-records">No upcoming trainings found...</p></li>';
                $('#upcomingTrainingsData').last().append(HTMLToAppend);

            }
        },
        error: function (error) {
            console.log(JSON.stringify(error));
        }
    });
}

function getEventsDetails(itemIdET){
    var ETURL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/Lists/GetByTitle('"+EventListName+"')/Items?select=*&$filter=Id eq '"+itemIdET+"'&$top=5000";
    getItems(ETURL,function(data){
        var ETResults = data.d.results;
        if(ETResults.length > 0){
            var EventDate = new Date(ETResults[0].EventDate);
            var Eventmonth = EventsmonthNames[EventDate.getMonth()].substr(0, 3);
            var Eventday = EventDate.getDate();

            var EndDate = new Date(ETResults[0].EndDate);
            var Endmonth = EventsmonthNames[EventDate.getMonth()].substr(0, 3);
            var Endday = EventDate.getDate();
            $('#EventsContentModal').append('<div class="row"><div class="col-md-2"><label><b>Title:- </b></label></div><div class="col-md-10">'+ETResults[0].Title+'</div></div>'+
                                            '<div class="row"><div class="col-md-2"><label><b>Location:- </b></label></div><div class="col-md-10">'+(ETResults[0].Location == null ? '' : ETResults[0].Location)+'</div></div>'+
                                            '<div class="row"><div class="col-md-2"><label><b>Description:- </b></label></div><div class="col-md-10">'+(ETResults[0].Description == null ? '' : ETResults[0].Description)+'</div></div>'+
                                            '<div class="row"><div class="col-md-2"><label><b>Start Time:- </b></label></div><div class="col-md-10">'+getDayOfWeek(new Date(ETResults[0].EventDate))+', '+Eventday.toString()+' '+Eventmonth.toString()+' '+EventDate.getFullYear()+' - '+(new Date(ETResults[0].EventDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}))+'</div></div>'+
                                            '<div class="row"><div class="col-md-2"><label><b>End Time:- </b></label></div><div class="col-md-10">'+getDayOfWeek(new Date(ETResults[0].EndDate))+', '+Endday.toString()+' '+Endmonth.toString()+' '+EndDate.getFullYear()+' - '+(new Date(ETResults[0].EndDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}))+'</div></div>'+
                                            '<div class="row"><div class="col-md-2"><label><b>Category:- </b></label></div><div class="col-md-10">'+ETResults[0].Category+'</div></div>');
        }else{
            $('#EventsContentModal').append('<p>Currently unavailable. Please refresh the page.</p>');
        }
    },function(data){})
}