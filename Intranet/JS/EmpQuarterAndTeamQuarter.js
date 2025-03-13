var AllEmployees = [];

$(document).ready(function(){
    getAllEmployees();
});

function getAllEmployees(){
    date = new Date();
    var AllEmployeeURL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Employee Information')/items?$top=5000&$select=*,AttachmentFiles,Title&$expand=AttachmentFiles&$filter=LWD eq null&$orderBy=Id desc";
    getItems(AllEmployeeURL,function(data){
        AllEmployees = data.d.results;
        getEmpOfQuarter();
        getTeamofQuarter();
    },function(data){});
}

function getEmpOfQuarter(){
    var AllEmployeeURL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Employee of Quarter')/items?$top=10&$select=*&$filter=isActive eq 1&$orderBy=Id desc";
    getItems(AllEmployeeURL,function(data){
        results = data.d.results;
        if(results.length > 0){
            for(z=0;z<results.length;z++){
                //var filterEmp = AllEmployees.filter(item => {return item.Id == results[z].EmployeeId});
                var filterEmp = AllEmployees.filter(function (item) {
				  return item.Id == results[z].EmployeeId;
				});
                $('#empOfQuarterDataDiv').last().append('<div class="user-info">'+
											                '<div class="avatar">'+
											                    '<img src="'+filterEmp[0].AttachmentFiles.results[0].ServerRelativeUrl+'" class="img-fluid rounded-circle">'+
											                '</div>'+
											                '<div class="info">'+
											                    '<p class="username">'+filterEmp[0].Title+'</p>'+
											                    '<span class="userdeatil">'+filterEmp[0].Designation+'</span>'+
											                '</div>'+
											            '</div>');
            }
        }else{
            $('#empOfQuarterDataDiv').last().append('<div><p class="text-center no-records">There is no data as of now.</p></div>');
        }
    },function(data){});
}

function getTeamofQuarter(){
    var AllEmployeeURL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Team of Quarter')/items?$top=10&$select=*&$filter=isActive eq 1&$orderBy=Id desc";
    getItems(AllEmployeeURL,function(data){
        results = data.d.results;
        if(results.length > 0){
            for(y=0;y<results.length;y++){
                //var filterEmp = AllEmployees.filter(item => {return item.Id == results[y].EmployeeId});
                var filterEmp = AllEmployees.filter(function (item) {
				  return item.Id == results[y].EmployeeId;
				});
                $('#teamOfQuarterDataDiv').last().append('<div class="user-info">'+
											                '<div class="avatar">'+
											                    '<img src="'+filterEmp[0].AttachmentFiles.results[0].ServerRelativeUrl+'" class="img-fluid rounded-circle">'+
											                '</div>'+
											                '<div class="info">'+
											                    '<p class="username">'+filterEmp[0].Title+'</p>'+
											                    '<span class="userdeatil">'+filterEmp[0].Designation+'</span>'+
											                '</div>'+
											            '</div>');
            }
        }else{
            $('#teamOfQuarterDataDiv').last().append('<div><p class="text-center no-records">There is no data as of now.</p></div>')
        }
    },function(data){});
}