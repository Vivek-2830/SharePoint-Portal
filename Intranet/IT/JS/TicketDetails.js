var isAdminForTicket = false;
var isIT_TeamForTicket = false;
var globalStatus = '';
var globalItemId = 0;

$(document).ready(function(){
    getTicketTypeOptions().then(function(value){});
    getCurrentUserGroupForTicket().then(function(value) {
        if(isIT_TeamForTicket){
            $('#pendingTicketsLI').show();
            $('#allRequestLI').show();
        }
        getTickets().then(function(value) {});
    });
    $('#allRequestLI').click(function(e){
        e.preventDefault();
        getAllTickets().then(function(value) {});
    });
    $('#pendingTicketsLI').click(function(e){
        e.preventDefault();
        getPendingTickets().then(function(value) {});
    });
    $('#myTicketsLI').click(function(e){
        e.preventDefault();
        getTickets().then(function(value) {});
    });
    $('#btnSubmitTicket').click(function(e){
        e.preventDefault();
        if(validateTicketDetails() == true){
            SaveTicketDetails();
        }
    });
    $('#btnAssignTicket').click(function(e){
        e.preventDefault();
        if(validateAssignDetails() == true){
            SaveAssignDetails();
        }
    });
    $('#btnSubmitComments').click(function(e){
        e.preventDefault();
        SaveAndSendITTeamComments();
    });
    $('#btnSaveComments').click(function(e){
        e.preventDefault();
        SaveOnHoldComments();
    });
    $('#btnInProgressTicket').click(function(e){
        e.preventDefault();
        SaveInProgressComments();
    });
    $('#btnUserComments').click(function(e){
        e.preventDefault();
        SaveUserComments();
    });
    
    $('#modalContactForm').on('hidden.bs.modal', function (e) {
        clearTicketPopUp();
    });
    $('#modalAssignForm').on('hidden.bs.modal', function (e) {
        clearAssignPopUp();
    });
    $('#modalCommentsForm').on('hidden.bs.modal', function (e) {
        clearCommentsPopUp();
    });
    $('#modalUserCommentsForm').on('hidden.bs.modal', function (e) {
        clearUserCommentsPopUp();
    });
    $('#CommentsForm').on('hidden.bs.modal', function (e) {
        $('#allComments').html('');
    });
});

function SaveUserComments(){
    if($('#userComments').val() != ''){
        $('#CommentsByUser').last().append('<li class="allCommentsLI"><div>'+$('#userComments').val()+'</div><span class="commentBy">Commented on '+convertDateComments(new Date)+' by '+_spPageContextInfo.userDisplayName+'</span></li>');
    }

    var TicketListData = {  
        __metadata: {  
            'type': 'SP.Data.TicketDetailsListItem'  
        }
    };
    TicketListData.Status = 'Open';
    TicketListData.CommentsByITTeam = $('#CommentsByUser').html();

    $.ajax({  
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Ticket Details')/items("+globalItemId+")",  
        type: "POST",  
        headers: {  
            "accept": "application/json;odata=verbose",  
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),  
            "content-Type": "application/json;odata=verbose",  
            "IF-MATCH": "*",  
            "X-HTTP-Method": "MERGE"  
        },  
        data: JSON.stringify(TicketListData),
        success: function(data) {  
            $('#modalUserCommentsForm').modal('hide');
            swal({
                title: "Success",
                text: "Ticket has been sent to IT team",
                type: "success"
            }, function() {
                clearUserCommentsPopUp();
                getTickets().then(function(value) {});
                getStatusCounts();
            });
        },  
        error: function(error) {  
            alert(JSON.stringify(error));  
        }  
    }); 
}

function clearUserCommentsPopUp(){
    globalStatus = '';
    globalItemId = 0;
    $('#userComments').val('');
    $('#CommentsByUser').html('');
}

function SaveInProgressComments(){
    if($('#comments').val() != ''){
        $('#CommentsByITTeam').last().append('<li class="allCommentsLI"><div>'+$('#comments').val()+'</div><span class="commentBy">Commented on '+convertDateComments(new Date)+' by '+_spPageContextInfo.userDisplayName+'</span></li>');
    }
    var TicketListData = {  
        __metadata: {  
            'type': 'SP.Data.TicketDetailsListItem'  
        }
    };
    TicketListData.Status = 'In Progress';
    TicketListData.CommentsByITTeam = $('#CommentsByITTeam').html();
    TicketListData.ITTeamPersonId = _spPageContextInfo.userId;

    $.ajax({  
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Ticket Details')/items("+globalItemId+")",  
        type: "POST",  
        headers: {  
            "accept": "application/json;odata=verbose",  
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),  
            "content-Type": "application/json;odata=verbose",  
            "IF-MATCH": "*",  
            "X-HTTP-Method": "MERGE"  
        },  
        data: JSON.stringify(TicketListData),
        success: function(data) {  
            $('#modalCommentsForm').modal('hide');
            swal({
                title: "Success",
                text: "Ticket details has been updated.",
                type: "success"
            }, function() {
                clearCommentsPopUp();
                getPendingTickets().then(function(value) {});
                getStatusCounts();
            });
        },  
        error: function(error) {  
            alert(JSON.stringify(error));  
        }  
    }); 
}

function SaveOnHoldComments(){
    if($('#comments').val() != ''){
        $('#CommentsByITTeam').last().append('<li class="allCommentsLI"><div>'+$('#comments').val()+'</div><span class="commentBy">Commented on '+convertDateComments(new Date)+' by '+_spPageContextInfo.userDisplayName+'</span></li>');
    }
    var TicketListData = {  
        __metadata: {  
            'type': 'SP.Data.TicketDetailsListItem'  
        }
    };
    TicketListData.Status = 'On Hold';
    TicketListData.CommentsByITTeam = $('#CommentsByITTeam').html();
    TicketListData.ITTeamPersonId = _spPageContextInfo.userId;
    
    $.ajax({  
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Ticket Details')/items("+globalItemId+")",  
        type: "POST",  
        headers: {  
            "accept": "application/json;odata=verbose",  
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),  
            "content-Type": "application/json;odata=verbose",  
            "IF-MATCH": "*",  
            "X-HTTP-Method": "MERGE"  
        },  
        data: JSON.stringify(TicketListData),
        success: function(data) {  
            $('#modalCommentsForm').modal('hide');
            swal({
                title: "Success",
                text: "Ticket details has been updated.",
                type: "success"
            }, function() {
                clearCommentsPopUp();
                getPendingTickets().then(function(value) {});
                getStatusCounts();
            });
        },  
        error: function(error) {  
            alert(JSON.stringify(error));  
        }  
    }); 
}

function SaveAndSendITTeamComments(){
    if($('#comments').val() != ''){
        $('#CommentsByITTeam').last().append('<li class="allCommentsLI"><div>'+$('#comments').val()+'</div><span class="commentBy">Commented on '+convertDateComments(new Date)+' by '+_spPageContextInfo.userDisplayName+'</span></li>');
    }
    var TicketListData = {  
        __metadata: {  
            'type': 'SP.Data.TicketDetailsListItem'  
        }
    };
    TicketListData.Status = 'Completed';
    TicketListData.CommentsByITTeam = $('#CommentsByITTeam').html();
    TicketListData.ITTeamPersonId = _spPageContextInfo.userId;
    $.ajax({  
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Ticket Details')/items("+globalItemId+")",  
        type: "POST",  
        headers: {  
            "accept": "application/json;odata=verbose",  
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),  
            "content-Type": "application/json;odata=verbose",  
            "IF-MATCH": "*",  
            "X-HTTP-Method": "MERGE"  
        },  
        data: JSON.stringify(TicketListData),
        success: function(data) {  
            $('#modalCommentsForm').modal('hide');
            swal({
                title: "Success",
                text: "Ticket is successfully marked as completed.",
                type: "success"
            }, function() {
                clearCommentsPopUp();
                getPendingTickets().then(function(value) {});
                getStatusCounts();
            });
        },  
        error: function(error) {  
            alert(JSON.stringify(error));  
        }  
    }); 
}

function clearCommentsPopUp(){
    globalStatus = '';
    globalItemId = 0;
    $('#comments').val('');
    $('#CommentsByITTeam').html('');
}

function SaveAssignDetails(){
    var TicketListData = {  
        __metadata: {  
            'type': 'SP.Data.TicketDetailsListItem'  
        },
        AssignedToId: parseInt($('#assignedTo').val()),
        CommentsByAdmin:$('#adminComments').val() == '' ? null : $('#adminComments').val()
    };
    TicketListData.Status = 'In Progress';
    $.ajax({  
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Ticket Details')/items("+globalItemId+")",  
        type: "POST",  
        headers: {  
            "accept": "application/json;odata=verbose",  
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),  
            "content-Type": "application/json;odata=verbose",  
            "IF-MATCH": "*",  
            "X-HTTP-Method": "MERGE"  
        },  
        data: JSON.stringify(TicketListData),
        success: function(data) {  
            $('#modalAssignForm').modal('hide');
            swal({
                title: "Success",
                text: "Ticket has been assigned to IT Team.",
                type: "success"
            }, function() {
                clearAssignPopUp();
                getTickets().then(function(value) {});
                if(isIT_TeamForStatus){
                    getTicketsCount(_spPageContextInfo.webAbsoluteUrl+ "/_api/Web/Lists/getByTitle('Ticket Details')/items?$select=Status,Id&$top=5000");
                }else{
                    getTicketsCount(_spPageContextInfo.webAbsoluteUrl+ "/_api/Web/Lists/getByTitle('Ticket Details')/items?$select=Status,Id&$filter=AuthorId eq '"+_spPageContextInfo.userId+"'&$top=5000");
                }
            });
        },  
        error: function(error) {  
            alert(JSON.stringify(error));  
        }  
    }); 
}

function validateAssignDetails(){
    var isValidated = true;
    if($('#assignedTo').val() == ''){
        $('#assignedTo').addClass('required');
        isValidated = false;
    }else{
        $('#assignedTo').removeClass('required');
    }
    return isValidated;
}

function clearAssignPopUp(){
    globalStatus = '';
    globalItemId = 0;
    $('#assignedTo').val('');
    $('#adminComments').val('');
    $('#assignedToSpan').hide();
}

function clearTicketPopUp(){
    $('#title').val('');
    $('#description').val('');
    $('#priority').val('');
    $('#ticketType').val('');
    $('#titleSpan').hide();
    $('#prioritySpan').hide();
    $('#ticketTypeSpan').hide();
    $('#previousAttachments').html('');
    ClearFileControls('attachments');
    $('#previousAttachmentDiv').hide();
    globalItemId = 0;
}

function SaveTicketDetails(){
    var TicketListData = {  
        __metadata: {  
            'type': 'SP.Data.TicketDetailsListItem'  
        },
        Title:$('#title').val() == '' ? null : $('#title').val(),
        Description:$('#description').val() == '' ? null : $('#description').val(),
        Priority:$('#priority').val() == '' ? null : $('#priority').val(),
        TicketType:$('#ticketType').val(),
        Status:'Open'
    };
    if(globalItemId > 0){
        $.ajax({
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Ticket Details')/items(" + globalItemId + ")",
            type: "POST",
            headers: {
                'Accept': 'application/json;odata=verbose',
                "Content-Type": "application/json;odata=verbose",
                'X-RequestDigest': $('#__REQUESTDIGEST').val(),
                'X-HTTP-Method': 'MERGE',
                'If-Match': '*'
            },
            async: false,
            contentType: 'application/json;odata=verbose',
            data: JSON.stringify(TicketListData),
            success: function (data) {
                if($('#attachments')[0].files.length > 0) {
                    var TotalFiles = $('#attachments')[0].files.length;
                    for (i = 0; i < TotalFiles; i++) {
                        uploadFiles($('#attachments')[0].files[i], 'Ticket Details', globalItemId);
                    }
                    ClearFileControls('attachments');
                }
                $('#modalContactForm').modal('hide');
                swal({
                    title: "Success",
                    text: "Ticket details are saved successfully.",
                    type: "success"
                }, function() {
                    clearTicketPopUp();
                    getTickets().then(function(value) {}); 
                    getStatusCounts();
                });
            },
            error: function (error) {}
        });
    }else{
        $.ajax({  
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Ticket Details')/items",  
            type: "POST",  
            headers: {  
                "accept": "application/json;odata=verbose",  
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),  
                "content-Type": "application/json;odata=verbose"  
            },  
            data: JSON.stringify(TicketListData),
            success: function(data) {  
                if($('#attachments')[0].files.length > 0) {
                    var TotalFiles = $('#attachments')[0].files.length;
                    for (i = 0; i < TotalFiles; i++) {
                        uploadFiles($('#attachments')[0].files[i], 'Ticket Details', data.d.ID);
                    }
                    ClearFileControls('attachments');
                }
                $('#modalContactForm').modal('hide');
                swal({
                    title: "Success",
                    text: "Ticket has been created.",
                    type: "success"
                }, function() {
                    clearTicketPopUp();
                    getTickets().then(function(value) {}); 
                    getStatusCounts();
                });
            },  
            error: function(error) {  
                alert(JSON.stringify(error));  
            }  
        }); 
    }
}

function validateTicketDetails(){
    var isValidated = true;
    var msg = '';
    if($('#title').val() == ''){
        msg += 'Title \n';
        isValidated = false;
    }

    if($('#priority').val() == ''){
        msg += 'Priority \n';
        isValidated = false;
    }

    if($('#ticketType').val() == ''){
        msg += 'Ticket Type \n';
        isValidated = false;
    }
    if(!isValidated){
        swal("Required",msg,"error");
    }
    return isValidated;
}

function getAllTickets(){
    var deferred = $.Deferred();
    var url = '';
    
    if(isIT_TeamForTicket){
        url = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getByTitle('Ticket Details')/items?$select=*,Author/Title,ITTeamPerson/Title,AttachmentFiles&$expand=Author,ITTeamPerson,AttachmentFiles&$orderBy=Id desc&$top=5000";
    }
    getItems(url,function (data){
        deferred.resolve();
        if(data.d.results.length > 0){
            var results = data.d.results;
            var HTMLToAppend = '';
            for(i=0;i<results.length;i++){
                var documents = '<td>';
                if (results[i].AttachmentFiles.results.length > 0) {
                    documents += "<ul>";
                    for (var s = 0; s < results[i].AttachmentFiles.results.length; s++) {
                        documents += "<li><a class='filesList' href='" + results[i].AttachmentFiles.results[s].ServerRelativeUrl + "' target='_blank'>" + results[i].AttachmentFiles.results[s].FileName + "</a></li>";
                    }
                    documents += "</ul>";
                }
                documents += '</td>';
                HTMLToAppend += '<tr>'+
                    '<td>'+results[i].Id+'</td>'+
                    '<td>'+results[i].Title+'</td>'+
                    '<td>'+(results[i].Description == null ? '' : results[i].Description)+'</td>'+
                    '<td>'+results[i].Priority+'</td>'+
                    '<td>'+results[i].Status+'</td>'+
                    '<td>'+(results[i].TicketType == null ? '' : results[i].TicketType)+'</td>'+
                    '<td>'+results[i].Author.Title+'</td>'+
                    '<td>'+(results[i].ITTeamPersonId == null ? '' : results[i].ITTeamPerson.Title)+'</td>'+
                    '<td><a href="javascript:;" data-toggle="modal" data-target="#CommentsForm" class="open-popup-comments"><span></span>Comments</a></td>'+documents+'</tr>';
            }
            $('#AllTicketDiv').html('');
            
            $('#AllTicketDiv').append('<table id="AllTicketsTable" class="table table-striped table-bordered" style="width:100%">'+
                '<thead>'+
                    '<tr>'+
                        '<th>Id</th>'+
                        '<th>Title</th>'+
                        '<th>Description</th>'+
                        '<th>Priority</th>'+
                        '<th>Status</th>'+
                        '<th>Ticket Type</th>'+
                        '<th>Requestor</th>'+
                        '<th>Last updated by IT Person Name</th>'+
                        '<th>Comments</th>'+
                        '<th>Attachments</th>'+
                    '</tr>'+
                '</thead>'+
                '<tbody>'+
                '</tbody>'+
            '</table>');
            $('#AllTicketsTable tbody').append(HTMLToAppend);

            $('.open-popup-comments').click(function(){
                getAllComments(parseInt($(this).parent().parent().children()[0].innerText));
            });
            
            $('#AllTicketsTable').DataTable();
        }
        else{
            $('#AllTicketDiv').html('');
            $('#AllTicketDiv').append('<table id="AllTicketsTable" class="table table-striped table-bordered" style="width:100%">'+
                    '<thead>'+
                        '<tr>'+
                            '<th>Title</th>'+
                            '<th>Description</th>'+
                            '<th>Priority</th>'+
                            '<th>Status</th>'+
                            '<th>Ticket Type</th>'+
                            '<th>Requestor</th>'+
                            '<th>Last updated by IT Person Name</th>'+
                            '<th>Attachments</th>'+
                        '</tr>'+
                    '</thead>'+
                    '<tbody>'+
                    '</tbody>'+
                '</table>');
            $('#AllTicketsTable tbody').append('<tr><td colspan="8" style="text-align:center;">There are no tickets.</td></td>');
            $('#AllTicketsTable').DataTable();
        }
    },function(data){
        deferred.reject();
    });
    return deferred.promise();
}

function getTickets(){
    var deferred = $.Deferred();
    var url = '';
    
    url = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getByTitle('Ticket Details')/items?$select=*,ITTeamPerson/Title,AttachmentFiles&$expand=ITTeamPerson,AttachmentFiles&$filter=AuthorId eq '"+_spPageContextInfo.userId+"'&$top=5000";
    
    getItems(url,function (data){
        deferred.resolve();
        if(data.d.results.length > 0){
            var results = data.d.results;
            var HTMLToAppend = '';
            for(i=0;i<results.length;i++){
                var documents = '<td>';
                if (results[i].AttachmentFiles.results.length > 0) {
                    documents += "<ul>";
                    for (var s = 0; s < results[i].AttachmentFiles.results.length; s++) {
                        documents += "<li><a class='filesList' href='" + results[i].AttachmentFiles.results[s].ServerRelativeUrl + "' target='_blank'>" + results[i].AttachmentFiles.results[s].FileName + "</a></li>";
                    }
                    documents += "</ul>";
                }
                documents += '</td>';
                var buttonType = '<td></td>';
//                if(results[i].Status == 'Completed' && (!isIT_TeamForTicket)){
                if(results[i].Status == 'Completed'){
                    buttonType = '<td><a href="javascript:;" data-toggle="modal" data-target="#modalUserCommentsForm" class="btn btn-success open-popup-link"><span></span>Re-Open</a></td>';
                }
                if(results[i].Status == 'Open' && (!isIT_TeamForTicket)){
                    buttonType = '<td><a href="javascript:;" data-toggle="modal" data-target="#modalContactForm" class="btn btn-warning open-popup-linkForEdit"><span></span>Edit</a></td>';
                }
                HTMLToAppend += '<tr>'+
                    '<td>'+results[i].Id+'</td>'+
                    '<td>'+results[i].Title+'</td>'+
                    '<td>'+(results[i].Description == null ? '' : results[i].Description)+'</td>'+
                    '<td>'+results[i].Priority+'</td>'+
                    '<td>'+results[i].Status+'</td>'+
                    '<td>'+(results[i].TicketType == null ? '' : results[i].TicketType)+'</td><td>'+(results[i].ITTeamPersonId == null ? '' : results[i].ITTeamPerson.Title)+'</td>'+
                    '<td><a href="javascript:;" data-toggle="modal" data-target="#CommentsForm" class="open-popup-comments"><span></span>Comments</a></td>' +documents + buttonType + '</tr>';
            }
            $('#MyTicketDiv').html('');
           
            $('#MyTicketDiv').append('<table id="MyTicketsTable" class="table table-striped table-bordered" style="width:100%">'+
                '<thead>'+
                    '<tr>'+
                        '<th>Id</th>'+
                        '<th>Title</th>'+
                        '<th>Description</th>'+
                        '<th>Priority</th>'+
                        '<th>Status</th>'+
                        '<th>Ticket Type</th>'+
                        '<th>Last updated by IT Person Name</th>'+
                        '<th>Comments</th>'+
                        '<th>Attachments</th>'+
                        '<th>Action Item</th>'+
                    '</tr>'+
                '</thead>'+
                '<tbody>'+
                '</tbody>'+
            '</table>');
            $('#MyTicketsTable tbody').append(HTMLToAppend);

            $('.open-popup-link').click(function(){
                globalStatus = $(this).parent().parent().children()[4].innerText;
                globalItemId = parseInt($(this).parent().parent().children()[0].innerText);
                getUserComments(globalItemId);
            });

            $('.open-popup-linkForEdit').click(function(){
                globalItemId = parseInt($(this).parent().parent().children()[0].innerText);
                getTicketDetailsForEdit(globalItemId);
            });

            $('.open-popup-comments').click(function(){
                getAllComments(parseInt($(this).parent().parent().children()[0].innerText));
            });
            
            $('#MyTicketsTable').DataTable();
        }
        else{
            $('#MyTicketDiv').html('');
            $('#MyTicketDiv').append('<table id="MyTicketsTable" class="table table-striped table-bordered" style="width:100%">'+
                    '<thead>'+
                        '<tr>'+
                            '<th>Title</th>'+
                            '<th>Description</th>'+
                            '<th>Priority</th>'+
                            '<th>Status</th>'+
                            '<th>Ticket Type</th>'+
                        '</tr>'+
                    '</thead>'+
                    '<tbody>'+
                    '</tbody>'+
                '</table>');
            if(isIT_TeamForTicket){
                $('#MyTicketsTable tbody').append('<tr><td colspan="5" style="text-align:center;">There are no tickets pending as of now.</td></tr>');
            }else{
                $('#MyTicketsTable tbody').append('<tr><td colspan="5" style="text-align:center;">There are no tickets created by you.</td></tr>');
            }
            $('#MyTicketsTable').DataTable();
        }
    },function(data){
        deferred.reject();
    });
    return deferred.promise();
}

function getAllComments(itemId){
    var Editurl = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getByTitle('Ticket Details')/items?$select=*,ITTeamPerson/Title,AttachmentFiles&$expand=ITTeamPerson,AttachmentFiles&$filter=Id eq "+itemId;
    
    getItems(Editurl,function (data){
        var results = data.d.results[0];
        
        if (results.CommentsByITTeam != null) {
            $('#allComments').append(results.CommentsByITTeam);
        }else{
            $('#allComments').append('There are no comments for this ticket');
        }
        
    },function (data){});
}

function getUserComments(itemId){
    var Editurl = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getByTitle('Ticket Details')/items?$select=*,ITTeamPerson/Title,AttachmentFiles&$expand=ITTeamPerson,AttachmentFiles&$filter=Id eq "+itemId;
    
    getItems(Editurl,function (data){
        var results = data.d.results[0];
        
        if (results.CommentsByITTeam != null) {
            $('#CommentsByUser').append(results.CommentsByITTeam);
        }
        
    },function (data){});
}

function getTicketDetailsForEdit(itemId){
    var Editurl = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getByTitle('Ticket Details')/items?$select=*,ITTeamPerson/Title,AttachmentFiles&$expand=ITTeamPerson,AttachmentFiles&$filter=Id eq "+itemId;
    
    getItems(Editurl,function (data){
        var results = data.d.results[0];
        $('#title').val(results.Title == null ? '' : results.Title);
        $('#priority').val(results.Priority == null ? '' : results.Priority); 
        $('#description').val(results.Description == null ? '' : results.Description); 
        $('#ticketType').val(results.TicketType == null ? '' : results.TicketType); 
        var documents = '';
        if (results.AttachmentFiles.results.length > 0) {
            $('#previousAttachmentDiv').show();
            documents = "<ul>";
            for (var t = 0; t < results.AttachmentFiles.results.length; t++) {
                documents += "<li><a class='filesList' href='" + results.AttachmentFiles.results[t].ServerRelativeUrl + "' target='_blank'>" + results.AttachmentFiles.results[t].FileName + "</a><a style='padding-left:5px;' href='javascript:;' onclick='DeleteDocumentConfirmation(this,\"" + results.AttachmentFiles.results[t].ServerRelativeUrl + "\");'><i class='fa fa-trash' style='cursor:pointer;color:red;'></i></a></li>";
            }
            documents += "</ul>";
        }
        $('#previousAttachments').append(documents);
    },function (data){});
}

function getPendingTickets(){
    var deferred = $.Deferred();
    var url = '';
    if(isIT_TeamForTicket){
        url = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getByTitle('Ticket Details')/items?$select=*,Author/Title,ITTeamPerson/Title,AttachmentFiles&$expand=Author,ITTeamPerson,AttachmentFiles&$orderBy=Id desc&$filter=(Status eq 'Open' or Status eq 'In Progress' or Status eq 'On Hold')&$top=5000";
    }
    getItems(url,function (data){
        deferred.resolve();
        if(data.d.results.length > 0){
            var results = data.d.results;
            var HTMLToAppend = '';
            for(i=0;i<results.length;i++){
                var documents = '<td>';
                if (results[i].AttachmentFiles.results.length > 0) {
                    documents += "<ul>";
                    for (var s = 0; s < results[i].AttachmentFiles.results.length; s++) {
                        documents += "<li><a class='filesList' href='" + results[i].AttachmentFiles.results[s].ServerRelativeUrl + "' target='_blank'>" + results[i].AttachmentFiles.results[s].FileName + "</a></li>";
                    }
                    documents += "</ul>";
                }
                documents += '</td>';
                var buttonType = '<td></td>'; 
                if((results[i].Status == 'Open' || results[i].Status == 'In Progress' || results[i].Status == 'On Hold') && isIT_TeamForTicket){
                    buttonType = '<td><a href="javascript:;" data-toggle="modal" data-target="#modalCommentsForm" class="btn btn-warning open-popup-link"><span></span>Update</a></td>';
                }
                if(isIT_TeamForTicket){
                    HTMLToAppend += '<tr>'+
                        '<td>'+results[i].Id+'</td>'+
                        '<td>'+results[i].Title+'</td>'+
                        '<td>'+(results[i].Description == null ? '' : results[i].Description)+'</td>'+
                        '<td>'+results[i].Priority+'</td>'+
                        '<td>'+results[i].Status+'</td>'+
                        '<td>'+(results[i].TicketType == null ? '' : results[i].TicketType)+'</td>'+
                        '<td>'+results[i].Author.Title+'</td><td>'+(results[i].ITTeamPersonId == null ? '' : results[i].ITTeamPerson.Title)+'</td>'+
                        '<td><a href="javascript:;" data-toggle="modal" data-target="#CommentsForm" class="open-popup-comments"><span></span>Comments</a></td>'+ documents + buttonType +'</tr>';
                }
            }
            $('#PendingTicketDiv').html('');
            if(isIT_TeamForTicket){
                $('#PendingTicketDiv').append('<table id="TicketsTable" class="table table-striped table-bordered" style="width:100%">'+
                    '<thead>'+
                        '<tr>'+
                            '<th>Id</th>'+
                            '<th>Title</th>'+
                            '<th>Description</th>'+
                            '<th>Priority</th>'+
                            '<th>Status</th>'+
                            '<th>Ticket Type</th>'+
                            '<th>Requestor</th>'+
                            '<th>Last updated by IT Person Name</th>'+
                            '<th>Comments</th>'+
                            '<th>Attachments</th>'+
                            '<th>Action Item</th>'+
                        '</tr>'+
                    '</thead>'+
                    '<tbody>'+
                    '</tbody>'+
                '</table>');
                $('#TicketsTable tbody').append(HTMLToAppend);
                
                $('.open-popup-link').click(function(){
                    globalStatus = $(this).parent().parent().children()[4].innerText;
                    globalItemId = parseInt($(this).parent().parent().children()[0].innerText);
                    getITTeamComments(globalItemId);
                });

                $('.open-popup-comments').click(function(){
                    getAllComments(parseInt($(this).parent().parent().children()[0].innerText));
                });
            }
            
            $('#TicketsTable').DataTable();
        }
        else{
            $('#PendingTicketDiv').html('');
            $('#PendingTicketDiv').append('<table id="TicketsTable" class="table table-striped table-bordered" style="width:100%">'+
                    '<thead>'+
                        '<tr>'+
                            '<th>Title</th>'+
                            '<th>Description</th>'+
                            '<th>Priority</th>'+
                            '<th>Status</th>'+
                            '<th>Ticket Type</th>'+
                        '</tr>'+
                    '</thead>'+
                    '<tbody>'+
                    '</tbody>'+
                '</table>');
            if(isIT_TeamForTicket){
                $('#TicketsTable tbody').append('<tr><td colspan="5" style="text-align:center;">There are no tickets pending as of now.</td></tr>');
            }else{
                $('#TicketsTable tbody').append('<tr><td colspan="5" style="text-align:center;">There are no tickets created by you.</td></tr>');
            }
            $('#TicketsTable').DataTable();
        }
    },function(data){
        deferred.reject();
    });
    return deferred.promise();
}

function getITTeamComments(itemId){
    var Editurl = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getByTitle('Ticket Details')/items?$select=*,ITTeamPerson/Title,AttachmentFiles&$expand=ITTeamPerson,AttachmentFiles&$filter=Id eq "+itemId;
    
    getItems(Editurl,function (data){
        var results = data.d.results[0];
        
        if (results.CommentsByITTeam != null) {
            $('#CommentsByITTeam').append(results.CommentsByITTeam);
        }
        
    },function (data){});
}

function getTicketTypeOptions(){
    var deferred = $.Deferred();
    var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Ticket Details')/fields?$filter=EntityPropertyName eq 'TicketType'";
    $.ajax({
            url: requestUri,
            type: "GET",
            async:false,
            headers: { "ACCEPT": "application/json;odata=verbose" },
            success: function (data) {
                deferred.resolve();
                if(data.d.results[0].Choices.results.length > 0){
                    var optionsToAppend = '<option value="">Select Ticket Type*</option>';
                    for(i=0;i<data.d.results[0].Choices.results.length;i++){
                        optionsToAppend += '<option value="'+data.d.results[0].Choices.results[i]+'">'+data.d.results[0].Choices.results[i]+'</option>';
                    }
                    $('#ticketType').html(optionsToAppend);
                }else{
                    $('#ticketType').html('<option value="">Select Assigned To</option>');
                }                                 
            },    
    });
    return deferred.promise();
}

function getCurrentUserGroupForTicket(){
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
                            isIT_TeamForTicket = true;
                        }
                    }
                }                                 
        },    
    });
    return deferred.promise();
}

function getAssignToPersons(){
    var deferred = $.Deferred();
    var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/SiteGroups/GetByName('IT Team')/users";
    $.ajax({
            url: requestUri,
            type: "GET",
            async:false,
            headers: { "ACCEPT": "application/json;odata=verbose" },
            success: function (data) {
                deferred.resolve();
                if(data.d.results.length >0){
                    var optionsToAppend = '<option value="">Select Assigned To*</option>';
                    for(i=0;i<data.d.results.length;i++){
                        optionsToAppend += '<option value="'+data.d.results[i].Id+'">'+data.d.results[i].Title+'</option>';
                    }
                    $('#assignedTo').html(optionsToAppend);
                }else{
                    $('#assignedTo').html('<option value="">Select Assigned To*</option>');
                }                                 
        },    
    });
    return deferred.promise();
}

function getItems(uri,successCall,faliureCall){
    $.ajax({
        url: uri,
        type: "GET",
        async:true,
        headers: { "ACCEPT": "application/json;odata=verbose" },
        success: function (data) {
            successCall(data);                               
        },
        faliure:function(data){
        faliureCall(data);
        }    
    });
}

function convertDateSharePointFormat(dateToFormat){
    var d= new Date(dateToFormat);
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = ((''+month).length < 2 ? '0' : '') + month + '/' + ((''+day).length<2 ? '0' : '') + day + '/' + d.getFullYear();
    return output;
}

function convertDateComments(dateToFormat){
    var d= new Date(dateToFormat);
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = ((''+day).length<2 ? '0' : '') + day + '/' + ((''+month).length < 2 ? '0' : '') + month + '/' + d.getFullYear();
    return output;
}

function uploadFiles(file, listname, ID) {
    var getFileBuffer = function (file) {

        var deferred = $.Deferred();
        var reader = new FileReader();

        reader.onload = function (e) {
            deferred.resolve(e.target.result);
        }

        reader.onerror = function (e) {
            deferred.reject(e.target.error);
        }

        reader.readAsArrayBuffer(file);

        return deferred.promise();
    };

    getFileBuffer(file).then(function (buffer) {

        $.ajax({
            url: _spPageContextInfo.webAbsoluteUrl +
             "/_api/web/lists/getbytitle('" + listname + "')/items(" + ID + ")/AttachmentFiles/add(FileName='" + file.name + "')",
            method: 'POST',
            data: buffer,
            async: false,
            processData: false,
            headers: {
                "Accept": "application/json; odata=verbose",
                "content-type": "application/json; odata=verbose",
                "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
                "content-length": buffer.byteLength
            }
        });

    });
}

function ClearFileControls(id) {
    var oldInput = document.getElementById(id);

    var newInput = document.createElement("input");
    $(newInput).attr("multiple", "multiple");

    newInput.type = "file";
    newInput.id = oldInput.id;
    newInput.name = oldInput.name;
    newInput.className = oldInput.className;
    newInput.style.cssText = oldInput.style.cssText;
    // TODO: copy any other relevant attributes�

    oldInput.parentNode.replaceChild(newInput, oldInput);
}

function DeleteDocumentConfirmation(control, url) {
    var retVal = confirm("Are you sure want to delete permanently?");
    if (retVal == true) {
        deleteDocument(control, url);
        return true;
    }
}

function deleteDocument(control,url) {
    $.ajax(
                        {
                            url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/GetFileByServerRelativeUrl('" + url + "')",
                            method: "POST",
                            headers: {
                                Accept: "application/json;odata=verbose",
                                "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                                "X-HTTP-Method": "DELETE"

                            },
                            success: function (data) {
                                alert('Document Deleted Successfully!!!...');
                                $(control).parent().remove();
                            },
                            error: function (data) {
                                alert('Error while deleting the Document');
                            }
                        });
}