var AccessTokenListName = 'JIRA Access Token';
var JiraTaskDivID = 'JIRATasksList';
const JIRAmonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

$(document).ready(function(){
    getAccessToken();
    //getJiraTasks('cNWSOJwk8DkLjXARGh5LDABC');
});

function getAccessToken(){
    var accessTokenURL = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getByTitle('"+AccessTokenListName+"')/items?$select=*&$filter=EmployeeNameId eq "+_spPageContextInfo.userId;
    getItems(accessTokenURL,function(data){
        if(data.d.results.length > 0){
            getJiraTasks(data.d.results[0].AccessToken,data.d.results[0].UserName);
        }else{
	        getJiraTasks('MhXH9GfuvPZwkwtNmVwa65DF','spsupport@dsmartsys.in');
            //$('#JiraTaskDivID').append('<li>There are no tasks been assigned to you.</li>');
        }
    },function(data){})
}

function getJiraTasks(accessToken,userName){
    var base64 = btoa(userName+":"+accessToken);
    $.ajax({
        url: 'https://cors-anywhere.herokuapp.com/https://dsmartsystems.atlassian.net/rest/api/2/search?jql=assignee=currentuser()&maxResults=20',
        type: 'GET',
        headers: {
            "Content-Type": 'application/json', 
            "Authorization":"Basic "+base64,
            "Accept":"*/*",
            "Cache-Control": 'no-cache',
        },
        success: function (response) {
			if(response.issues.length > 0){
				for(q=0;q<response.issues.length;q++){
					var ProjectName = response.issues[q].fields.project.name;
					var taskName = response.issues[q].fields.summary;
					var taskDate = new Date(convertDateSharePointFormat(response.issues[q].fields.created));
	                var taskmonth = JIRAmonthNames[taskDate.getMonth()].substr(0, 3);
	                var taskday = taskDate.getDate();

	                var HTMLToAppend = '<li>'+
						                    '<h4>'+taskday.toString()+' '+taskmonth.toString()+'</h4>'+
						                    '<a href="'+response.issues[q].self+'" target="_blank"><div class="ds-news-detail">'+
						                        '<h3 title="'+taskName+'">'+taskName+'</h3>'+
						                        '<p title="'+ProjectName+'">'+ProjectName+'</p>'+
						                    '</div></a>'+
						                '</li>';
					$('#JIRATasksList').last().append(HTMLToAppend);
				}
			}else{
					$('#JIRATasksList').last().append('<li>There are no tasks assigned to you.</li>');			
			}
        },
        error: function (xhr, ajaxOptions, thrownError) {
            myException = thrownError;
            alert('Exeption:' + thrownError + " options : " + ajaxOptions + " xhr : " + xhr);

        }
    });}