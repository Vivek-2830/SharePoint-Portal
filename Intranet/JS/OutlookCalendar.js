var HTMLOutlookCalendarDivID = 'outlookCalendarData';
var HTMLOutlookCalendarUpcomingDivID = 'outlookCalendarUpcomingData';
var token = "";
var AllEvents = [];
var AllUpcomingEvents = [];


$(document).ready(function(){
	$('#loadingIcon').css('display','inline-block');
	getAccessTokenOutlook();    
});


function getAccessTokenOutlook(){
	var grantType = "client_credentials";
	var clinetID = "3378427f-fd9a-49b6-aee5-5c547a226cc6@b18cd4c6-4845-498d-94ad-e87c568ba7ef"; // combination of clinet id and tenant id
	var clientSecret = "=]cYS2Q_4_gk3TuHXdtDaLK2WSENG5k_";
	var scope = "https://graph.microsoft.com/.default";
	var tenantId = "b18cd4c6-4845-498d-94ad-e87c568ba7ef";
	$.ajax({
    type: "POST",
    crossDomain: true,
    url:
      "https://cors-anywhere.herokuapp.com/https://login.microsoftonline.com/"+tenantId+"/oauth2/v2.0/token",
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    data: {
      grant_type: grantType,
      client_id: clinetID,
      client_secret: clientSecret,
      scope: scope
    },
    success: function(data) {
      token = data.access_token;
      getOutlookCalendarEvents(token);
      getOutlookCalendarUpcomingEvents(token);
    },
    error: function(data, errorThrown, status) {}
  });
}


function getOutlookCalendarEvents(token){
	
	var loggedInUser = _spPageContextInfo.userEmail;
	var today = new Date();
	var tomorrow = new Date(today.setDate(today.getDate() + 1));
	today = new Date().toLocaleDateString();
	tomorrow = new Date(tomorrow).toLocaleDateString();
	var OutlookCalendarURL = "https://graph.microsoft.com/v1.0/users/"+loggedInUser+"/events?&$orderby=start/DateTime&$filter=start/DateTime ge '"+today+"' and end/DateTime le '"+tomorrow+"'";
	
	$.ajax({
	    type: "GET",
	    crossDomain: true,
	    url:OutlookCalendarURL,
	    headers: {
	      "authorization": "Bearer " + token
	    },
	    success: function(data) {
		    $('#loadingIcon').css('display','none');
	    	var OutlookCalendarResults = data.value;
	    	AllEvents = OutlookCalendarResults;	        
	    	$('#'+HTMLOutlookCalendarDivID).html('');
	        if(OutlookCalendarResults.length > 0){
		        var locationHTML = '';
		        var locationHTMLModal = '';
	        	for(i=0;i<OutlookCalendarResults.length;i++){
	        		var startDate = convertUTCDateToLocalDate(OutlookCalendarResults[i].start.dateTime);
	        		var endDate = convertUTCDateToLocalDate(OutlookCalendarResults[i].end.dateTime);
	        		locationHTML = '';
	        		if(OutlookCalendarResults[i].location.displayName != ""){
	        			locationHTML = '<p><strong>Location: </strong>'+OutlookCalendarResults[i].location.displayName+'</p>';	        			
	        		}
		        	var HTMLToAppend = '<li><div class="ds-news-detail"><a href="javascript:;" data-toggle="modal" data-target="#modalOutlookCalendarData" data-id="'+OutlookCalendarResults[i].id+'" class="eventTitleFunction"><h3 style="width:100%;">'+OutlookCalendarResults[i].subject+'</h3></a>'+
		        					   locationHTML+
		                               '<div><p style="display:inline-block;vertical-align:top;width:auto;"><strong>Start Time: </strong>'+startDate+'</p>'+
		                               '<p style="display:inline-block;vertical-align:top;width:auto;margin-left:20px;"><strong>End Time: </strong>'+endDate+'</p></div></div></li>';
	            	$('#'+HTMLOutlookCalendarDivID).last().append(HTMLToAppend);	            		            	
	        	}
	        	$('.eventTitleFunction').click(function(e){
		        	$('#modalBodyContent').html('');
	        		var itemID = $(this).attr("data-id");
	        		var GetEvent = AllEvents.find(x => x.id === itemID);
	        		var startDateModal = convertUTCDateToLocalDate(GetEvent.start.dateTime);
	        		var endDateModal = convertUTCDateToLocalDate(GetEvent.end.dateTime);
	        		locationHTMLModal = '';
	        		if(GetEvent.location.displayName != ""){	        			
	        			locationHTMLModal = '<div class="row"><div class="col-md-2"><label class="col-form-label"><strong>Location: </strong></label></div><div class="col-md-10"><label class="col-form-label">'+GetEvent.location.displayName+'</label></div></div>';
	        		}
	        		var attendees = GetEvent.attendees;
	        		var attendeesName = [];
	        		$.each(attendees, function(index,value){
		                attendeesName.push(value.emailAddress.name);
		              });
	        		var ModalHTMLToAppend = '<div class="row"><div class="col-md-2"><label class="col-form-label"><strong>Subject: </strong></label></div><div class="col-md-10"><label class="col-form-label">'+GetEvent.subject+'</label></div></div>'+
	        								locationHTMLModal +
	        								'<div class="row"><div class="col-md-2"><label class="col-form-label"><strong>Start Time: </strong></label></div><div class="col-md-10"><label class="col-form-label">'+startDateModal+'</label></div></div>'+
	        								'<div class="row"><div class="col-md-2"><label class="col-form-label"><strong>End Time: </strong></label></div><div class="col-md-10"><label class="col-form-label">'+endDateModal+'</label></div></div>'+
	        								'<div class="row"><div class="col-md-2"><label class="col-form-label"><strong>Attendees: </strong></label></div><div class="col-md-10"><label class="col-form-label">'+attendeesName.toString()+'</label></div></div>'+
	        								'<div class="row"><div class="col-md-2"><label class="col-form-label"><strong>Body: </strong></label></div><div class="col-md-10"><label class="col-form-label" style="max-height: 250px;overflow: auto;">'+GetEvent.body.content+'</label></div></div>';
	        		$('#EventHeaderTitle').text(GetEvent.subject);
					$('#modalBodyContent').last().append(ModalHTMLToAppend);	        		
	        	});	        	
	        }else{
	            $('#'+HTMLOutlookCalendarDivID).append('<p>No outlook calendar events to display as of now</p>');
	        }
	    },
	    error: function(data, errorThrown, status) {}
	});	
}

function getOutlookCalendarUpcomingEvents(token){
	var today = new Date().toLocaleDateString();
	var loggedInUser = _spPageContextInfo.userEmail;
	var today = new Date();
	var tomorrow = new Date(today.setDate(today.getDate() + 1));
	tomorrow = new Date(tomorrow).toLocaleDateString();
	var OutlookCalendarURL = "https://graph.microsoft.com/v1.0/users/"+loggedInUser+"/events?&$orderby=start/DateTime&$filter=start/DateTime ge '"+tomorrow+"'";
	
	$.ajax({
	    type: "GET",
	    crossDomain: true,
	    url:OutlookCalendarURL,
	    headers: {
	      "authorization": "Bearer " + token
	    },
	    success: function(data) {
		    $('#loadingIcon').css('display','none');
	    	var OutlookCalendarResults = data.value;
	    	AllUpcomingEvents = OutlookCalendarResults;
	        $('#'+HTMLOutlookCalendarUpcomingDivID).html('');
	        if(OutlookCalendarResults.length > 0){
		        var locationHTML = '';
		        var locationHTMLModal = '';
	        	for(i=0;i<OutlookCalendarResults.length;i++){
	        		var startDate = convertUTCDateToLocalDate(OutlookCalendarResults[i].start.dateTime);
	        		var endDate = convertUTCDateToLocalDate(OutlookCalendarResults[i].end.dateTime);
	        		locationHTML = '';
	        		if(OutlookCalendarResults[i].location.displayName != ""){
	        			locationHTML = '<p><strong>Location: </strong>'+OutlookCalendarResults[i].location.displayName+'</p>';	        			
	        		}
		        	var HTMLToAppend = '<li><div class="ds-news-detail"><a href="javascript:;" data-toggle="modal" data-target="#modalOutlookCalendarData" data-id="'+OutlookCalendarResults[i].id+'" class="eventTitleUpcomingFunction"><h3 style="width:100%;">'+OutlookCalendarResults[i].subject+'</h3></a>'+
		        					   locationHTML+
		                               '<div><p style="display:inline-block;vertical-align:top;width:auto;"><strong>Start Time: </strong>'+startDate+'</p>'+
		                               '<p style="display:inline-block;vertical-align:top;width:auto;margin-left:20px;"><strong>End Time: </strong>'+endDate+'</p></div></div></li>';
	            	$('#'+HTMLOutlookCalendarUpcomingDivID).last().append(HTMLToAppend);	            		            	
	        	}
	        	$('.eventTitleUpcomingFunction').click(function(e){
		        	$('#modalBodyContent').html('');
	        		var itemID = $(this).attr("data-id");
	        		var GetEvent = AllUpcomingEvents.find(x => x.id === itemID);
	        		var startDateModal = convertUTCDateToLocalDate(GetEvent.start.dateTime);
	        		var endDateModal = convertUTCDateToLocalDate(GetEvent.end.dateTime);
	        		locationHTMLModal = '';
	        		if(GetEvent.location.displayName != ""){	        			
	        			locationHTMLModal = '<div class="row"><div class="col-md-2"><label class="col-form-label"><strong>Location: </strong></label></div><div class="col-md-10"><label class="col-form-label">'+GetEvent.location.displayName+'</label></div></div>';
	        		}
	        		var attendees = GetEvent.attendees;
	        		var attendeesName = [];
	        		$.each(attendees, function(index,value){
		                attendeesName.push(value.emailAddress.name);
		              });
	        		var ModalHTMLToAppend = '<div class="row"><div class="col-md-2"><label class="col-form-label"><strong>Subject: </strong></label></div><div class="col-md-10"><label class="col-form-label">'+GetEvent.subject+'</label></div></div>'+
	        								locationHTMLModal +
	        								'<div class="row"><div class="col-md-2"><label class="col-form-label"><strong>Start Time: </strong></label></div><div class="col-md-10"><label class="col-form-label">'+startDateModal+'</label></div></div>'+
	        								'<div class="row"><div class="col-md-2"><label class="col-form-label"><strong>End Time: </strong></label></div><div class="col-md-10"><label class="col-form-label">'+endDateModal+'</label></div></div>'+
	        								'<div class="row"><div class="col-md-2"><label class="col-form-label"><strong>Attendees: </strong></label></div><div class="col-md-10"><label class="col-form-label">'+attendeesName.toString()+'</label></div></div>'+
	        								'<div class="row"><div class="col-md-2"><label class="col-form-label"><strong>Body: </strong></label></div><div class="col-md-10"><label class="col-form-label" style="max-height: 250px;overflow: auto;">'+GetEvent.body.content+'</label></div></div>';
	        		$('#EventHeaderTitle').text(GetEvent.subject);
					$('#modalBodyContent').last().append(ModalHTMLToAppend);	        		
	        	});	        	
	        }else{
	            $('#'+HTMLOutlookCalendarUpcomingDivID).append('<p>No outlook calendar events to display as of now</p>');
	        }
	    },
	    error: function(data, errorThrown, status) {}
	});	
}


function convertUTCDateToLocalDate(date) {
    var date = moment.utc(date).format('YYYY-MM-DD HH:mm:ss');	
	var stillUtc = moment.utc(date).toDate();
	var local = moment(stillUtc).local().format('DD-MM-YYYY hh:mm A');
    return local;   
}

function convertDateSharePointFormat(dateToFormat){
    var d= new Date(dateToFormat);
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = ((''+month).length < 2 ? '0' : '') + month + '/' + ((''+day).length<2 ? '0' : '') + day + '/' + d.getFullYear();
    return output;
}

