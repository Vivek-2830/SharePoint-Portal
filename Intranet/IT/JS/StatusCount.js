var isIT_TeamForStatus = false;

$(document).ready(function(){
    getStatusCounts();
});

function getStatusCounts(){
    getCurrentUserGroupForStatus().then(function(value) {
        if(isIT_TeamForStatus){
            $('#ITOpenCounterDiv').show();
            $('#ITInProgressCounterDiv').show();
            $('#ITOnHoldCounterDiv').show();
            $('#ITCompletedCounterDiv').show();
            getTicketsCountIT(_spPageContextInfo.webAbsoluteUrl+ "/_api/Web/Lists/getByTitle('Ticket Details')/items?$select=Status,Id&$top=5000");
        }
        getTicketsCount(_spPageContextInfo.webAbsoluteUrl+ "/_api/Web/Lists/getByTitle('Ticket Details')/items?$select=Status,Id&$filter=AuthorId eq '"+_spPageContextInfo.userId+"'&$top=5000");
    });
}

function getTicketsCount(requestUri){
    var deferred = $.Deferred();    
    $.ajax({
        url: requestUri,
        type: "GET",
        async:false,
        headers: { "ACCEPT": "application/json;odata=verbose" },
        success: function (data) {
            deferred.resolve();
            if(data.d.results.length > 0){
                var data = data.d.results;
                var CompletedResult = data.filter(function(item){
                    return item.Status == 'Completed';
                });
                var OpenResult = data.filter(function(item){
                    return item.Status == 'Open';
                });
                var InProgressResult = data.filter(function(item){
                    return item.Status == 'In Progress';
                });
                var OnHoldResult = data.filter(function(item){
                    return item.Status == 'On Hold';
                });
                $('#CompletedCounter').text(CompletedResult.length);
                $('#InProgressCounter').text(InProgressResult.length);
                $('#OpenCounter').text(OpenResult.length);
                $('#OnHoldCounter').text(OnHoldResult.length);
            }else{
                $('#CompletedCounter').text('0');
                $('#InProgressCounter').text('0');
                $('#OpenCounter').text('0');
                $('#OnHoldCounter').text('0');
            }                               
        }   
    });
    return deferred.promise();
}

function getTicketsCountIT(requestUri){
    var deferred = $.Deferred();    
    $.ajax({
        url: requestUri,
        type: "GET",
        async:false,
        headers: { "ACCEPT": "application/json;odata=verbose" },
        success: function (data) {
            deferred.resolve();
            if(data.d.results.length > 0){
                var data = data.d.results;
                var CompletedResult = data.filter(function(item){
                    return item.Status == 'Completed';
                });
                var OpenResult = data.filter(function(item){
                    return item.Status == 'Open';
                });
                var InProgressResult = data.filter(function(item){
                    return item.Status == 'In Progress';
                });
                var OnHoldResult = data.filter(function(item){
                    return item.Status == 'On Hold';
                });
                $('#CompletedCounterIT').text(CompletedResult.length);
                $('#InProgressCounterIT').text(InProgressResult.length);
                $('#OpenCounterIT').text(OpenResult.length);
                $('#OnHoldCounterIT').text(OnHoldResult.length);
            }else{
                $('#CompletedCounterIT').text('0');
                $('#InProgressCounterIT').text('0');
                $('#OpenCounterIT').text('0');
                $('#OnHoldCounterIT').text('0');
            }                               
        }   
    });
    return deferred.promise();
}

function getCurrentUserGroupForStatus(){
    var deferred = $.Deferred();
    var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/GetUserById(" + _spPageContextInfo.userId+ ")/Groups";
    $.ajax({
            url: requestUri,
            type: "GET",
            async:false,
            headers: { "ACCEPT": "application/json;odata=verbose" },
            success: function (data) {
                deferred.resolve();
                if(data.d.results.length >0){
                    for(i=0;i<data.d.results.length;i++){
                        if(data.d.results[i].Title == 'IT Team'){
                            isIT_TeamForStatus = true;
                        }
                    }
                }                                 
        },    
    });
    return deferred.promise();
}