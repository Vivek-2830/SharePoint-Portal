var EmployeeArray = [];
$(document).ready(function(){
	getKekaForLeavesAccessToken();
});
function getKekaForLeavesAccessToken(){
	$.ajax({
	    url: "https://cors-anywhere.herokuapp.com/https://app.keka.com/connect/token",
	    data: { grant_type:"kekaapi", client_id:"499afe21-bef1-437b-976c-4d17e2eeb273", client_secret:"dIPyxcolrrjbzBvzDLpK", scope:"kekaapi openid profile offline_access", apikey:"5ByZ4rTekpxcMvs6s4URqxTA9Swid+1AmO0x5FfaiN8=" },
	    type: "POST",
	    headers:{ "Content-Type": 'application/x-www-form-urlencoded'},
	    success: function(data) {
	    	getAllEmployees(data.access_token); 
	    }
	});
}
function getLeaves(accessToken){
	var date = new Date().toISOString();
	$.ajax({
		url: 'https://cors-anywhere.herokuapp.com/https://api.keka.com/v1/leaves?from='+date+'&to='+date,
		type: 'GET',
		headers: {
			"Content-Type": 'application/json', 
			"Authorization":"Bearer "+accessToken,
			"Accept":"*/*",
			"Cache-Control": 'no-cache',
		},
		success: function (response) {
			var leavesArray = response;
			if(leavesArray.length > 0){
				for(t=0;t<leavesArray.length-1;t++){
					var employeeNumber = leavesArray[t].employeeNumber;
					var result = EmployeeArray.filter(d => { return d.employeeNumber == employeeNumber; });
					var EmpLeaveImageurl = getEmpPictureUrl(_spPageContextInfo.webAbsoluteUrl,result[0].email,"L");
					$('#AbsenteesDiv').last().append('<div class="user-info">'+
											                '<div class="avatar">'+
											                    '<img src="'+EmpLeaveImageurl+'" class="img-fluid rounded-circle">'+
											                '</div>'+
											                '<div class="info">'+
											                    '<p class="username">'+result[0].displayName+'</p>'+
											                    '<span class="userdeatil">'+result[0].jobTitle.title+'</span>'+
											                '</div>'+
											            '</div>');
				}
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
			myException = thrownError;
			alert('Exeption:' + thrownError + " options : " + ajaxOptions + " xhr : " + xhr);
	
		}
	});
}
function getAllEmployees(accessToken){
	$.ajax({
		url: 'https://cors-anywhere.herokuapp.com/https://api.keka.com/v1/employees',
		type: 'GET',
		headers: {
			"Content-Type": 'application/json', 
			"Authorization":"Bearer "+accessToken,
			"Accept":"*/*",
			"Cache-Control": 'no-cache',
		},
		success: function (response) {
			EmployeeArray = response;
			getLeaves(accessToken);
		},
		error: function (xhr, ajaxOptions, thrownError) {
			myException = thrownError;
			alert('Exeption:' + thrownError + " options : " + ajaxOptions + " xhr : " + xhr);
	
		}
	});
}
function getEmpPictureUrl(webUrl,accountName,size){
    return webUrl + "/_layouts/15/userphoto.aspx?size=" + size + "&accountname=" + accountName;
}
