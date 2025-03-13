var RemainingSL = 0;
var RemainingPL = 0;
var currentUnpaidLeaves = 0;
var balanceListId = 0;
var difference = 0;
var tempDifference = 0;
var LeaveData = null;
var EmployeeId = 0;
var isReportingManager = false;
var is_HRTeam = false;
var filterString = '';
var globalItemId = 0;
var approveType = '';
var tempTotalDays = 0;
var currentUserName = '';
var editLeaveType = '';
var editTotalDays = 0;

$(document).ready(function(){
    getCurrentUserDetails().then(function(){
        getEmployeeLeave().then(function(value){
            getCurrentUserGroup().then(function(){
                if(!is_HRTeam){
                    checkIsReportingManager().then(function(){
                        getCurrentEmployeesLeaves();
                        if(isReportingManager){
                            $('#pendingForApprovalLI').show();
                            getPendingLeaves();
                        }else{
                            $('#myPendingLeaves').trigger("click");
                        }
                    });
                }else{
                    getCurrentEmployeesLeaves();
                    $('#pendingForApprovalLI').show();
                    getPendingLeaves();
                }
            });
        });
    });
    $("#startDate").datepicker({
        autoclose: true,
        minDate:new Date()
    })
    .change(dateChanged);
    
    $("#endDate").datepicker({
        autoclose: true,
        minDate:new Date()
    })
    .change(dateChanged);

    $('#leaveType').change(function(e){
        var currentValue = $(this).val();
        if(currentValue != ""){
            if(globalItemId > 0){
                if(currentValue == editLeaveType){
                    if(currentValue == 'Sick Leave'){
                        if(difference != 0 && parseFloat(difference) > (RemainingSL + editTotalDays)){
                            alert('You do not have sufficient leaves left to apply for selected days. You have only '+RemainingSL+' leave remaining.');
                            $(this).val('');
                        }
                    }
                    else if(currentValue == 'Paid Leave'){
                        if(difference != 0 && parseFloat(difference) > (RemainingPL + editTotalDays)){
                            alert('You do not have sufficient leaves left to apply for selected days. You have only '+RemainingPL+' leave remaining.');
                            $(this).val('');
                        }
                    }
                }
                else{
                    if(currentValue == 'Sick Leave'){
                        if(difference != 0 && parseFloat(difference) > (RemainingSL)){
                            alert('You do not have sufficient leaves left to apply for selected days. You have only '+RemainingSL+' leave remaining.');
                            $(this).val('');
                        }
                    }
                    else if(currentValue == 'Paid Leave'){
                        if(difference != 0 && parseFloat(difference) > (RemainingPL)){
                            alert('You do not have sufficient leaves left to apply for selected days. You have only '+RemainingSL+' leave remaining.');
                            $(this).val('');
                        }
                    }
                }
            }
            else{
                if(currentValue == 'Sick Leave'){
                    if(difference != 0 && parseFloat(difference) > RemainingSL){
                        alert('You do not have sufficient leaves left to apply for selected days. You have only '+RemainingSL+' leave remaining.');
                        $(this).val('');
                    }
                }
                else if(currentValue == 'Paid Leave'){
                    if(difference != 0 && parseFloat(difference) > RemainingPL){
                        alert('You do not have sufficient leaves left to apply for selected days. You have only '+RemainingPL+' leave remaining.');
                        $(this).val('');
                    }
                }
            }
        }
    });

    $('#duration').change(function(){
        var currentValue = $(this).val();
        if(currentValue == 'Full Day'){
            difference = parseFloat(tempDifference);
        }
        else if(currentValue == 'First half' || currentValue == 'Second half'){
            difference = parseFloat(tempDifference) - parseFloat(0.5);
        }
        if($('#leaveType').val() != "" && $('#leaveType').val() == 'Sick Leave'){
            if(difference != 0 && parseFloat(difference) > RemainingSL){
                alert('You do not have sufficient leaves left to apply for selected days. You have only '+RemainingSL+' leave remaining.');
                $(this).val('');
            }
        }
    });

    $('input[type=radio][name=startDateRadio]').change(function() {
        if(difference != 0){
            var currentValue = $(this).val();
            var endDateShift = $("input[name='endDateRadio']:checked").val();
            if(currentValue == 'First half' && endDateShift == 'First half'){
                difference = parseFloat(tempDifference) - parseFloat(0.5); 
            }
            else if(currentValue == 'Second half' && endDateShift == 'First half'){
                difference = parseFloat(tempDifference) - parseFloat(1); 
            }
            else if(currentValue == 'Second half' && endDateShift == 'Second half'){
                difference = parseFloat(tempDifference) - parseFloat(0.5);
            }
            else if(currentValue == 'First half' && endDateShift == 'Second half'){
                difference = tempDifference;
            }
        }
    });

    $('input[type=radio][name=endDateRadio]').change(function() {
        if(difference != 0){
            var currentValue = $(this).val();
            var startDateShift = $("input[name='startDateRadio']:checked").val();
            if(currentValue == 'First half' && startDateShift == 'First half'){
                difference = parseFloat(tempDifference) - parseFloat(0.5); 
            }
            else if(currentValue == 'First half' && startDateShift == 'Second half'){
                difference = parseFloat(tempDifference) - parseFloat(1); 
            }
            else if(currentValue == 'Second half' && startDateShift == 'Second half'){
                difference = parseFloat(tempDifference) - parseFloat(0.5);
            }
            else if(currentValue == 'Second half' && startDateShift == 'First half'){
                difference = tempDifference;
            }
        }
    });

    $('#btnSubmitLeaves').click(function(e){
        e.preventDefault();
        if(validateLeaveApplication() == true){
            SaveLeaveDetails();
        }
    });

    $('#btnSubmitComments').click(function(e){
        e.preventDefault();
        //if(validateComments() == true){
            SaveComments();
        //}
    });

    $('.open-newLeaveApplication').magnificPopup({
        preloader: true,
        callbacks: {
            open: function() {
                                },
            close: function() {
                clearLeavePopUp();
            }
        }
    });

    $('#btnCancelNewLeaveForm').click(function(){
		$.magnificPopup.close();
		clearLeavePopUp();		
    });
    
    $('#btnCancelCommentsForm').click(function(){
		$.magnificPopup.close();
		clearCommentsPopUp();		
	});

    initializePeoplePicker('NotifyUsersDiv');
});

function SaveComments(){
    LeaveData = {  
        __metadata: {  
            'type': 'SP.Data.EmployeeLeaveHistoryListItem'  
        },
        ApproverComment: $('#comments').val() == "" ? null : $('#comments').val(),
        ApproverName: currentUserName
    };
    if(approveType == 'approve'){
        LeaveData.isApproved = true;
    }
    else{
        LeaveData.isRejected = true;
    }
    $.ajax({  
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Employee Leave History')/items("+globalItemId+")",  
        type: "POST",  
        headers: {  
            "accept": "application/json;odata=verbose",  
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),  
            "content-Type": "application/json;odata=verbose",  
            "IF-MATCH": "*",  
            "X-HTTP-Method": "MERGE"  
        },  
        data: JSON.stringify(LeaveData),
        success: function(data) {
            var successMessage = '';
            if(approveType == 'approve'){
                successMessage = 'Leave has been approved.';
                $.magnificPopup.close();
                swal({
                    title: "Success",
                    text: successMessage,
                    type: "success"
                }, function() {
                    getEmployeeLeave().then(function(value){
                        if(!is_HRTeam){
                            getCurrentEmployeesLeaves();
                            if(isReportingManager){
                                getPendingLeaves();
                            }
                        }else{
                            getCurrentEmployeesLeaves();
                            getPendingLeaves();
                        }
                    });
                    clearCommentsPopUp();
                });
            }else{
                updateLeaveBalanceForDelete(editLeaveType, tempTotalDays, 'Leave request has been rejected.');
                $.magnificPopup.close();
            }
        },  
        error: function(error) {  
            alert(JSON.stringify(error));  
        }  
    }); 
}

function getPendingLeaves(){
    var pendingLeavesURL = '';
    if(is_HRTeam){
        pendingLeavesURL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Employee Leave History')/items?$top=5000&$select=*,EmpName/Title&$expand=EmpName&$filter=isApproved eq 0 and isRejected eq 0 and isCancelled eq 0&$orderBy=Id desc";
    }else{
        pendingLeavesURL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Employee Leave History')/items?$top=5000&$select=*,EmpName/Title&$expand=EmpName&$filter="+filterString+") and isApproved eq 0 and isRejected eq 0 and isCancelled eq 0&$orderBy=Id desc";
    }
    getItems(pendingLeavesURL,function(data){
        if(data.d.results.length > 0){
            var results = data.d.results;
            var TableBody = '';
            for(m = 0;m < results.length; m++){
                TableBody += '<tr>'+
                                '<td style="display:none;">'+results[m].Id+'</td>'+
                                '<td style="display:none;">'+results[m].TotalDays+'</td>'+
                                '<td>'+results[m].EmpName.Title+'</td>'+
                                '<td>'+convertDateSharePointFormat(results[m].StartDate)+'</td>'+
                                '<td>'+convertDateSharePointFormat(results[m].EndDate)+'</td>'+
                                '<td>'+results[m].LeaveType+'</td>'+
                                '<td>'+(results[m].Description == null ? '' : results[m].Description)+'</td>'+
                                '<td><a href="#ticketForm" class="btn btn-primary open-popup-edit editButton" alt="'+results[m].Id+'">Edit</a><a href="javascript:;" class="btn btn-danger deleteRequest" alt="'+results[m].Id+'" style="margin-left:5px;">Cancel</a><a href="#commentsForm" class="btn btn-success open-popup approveButton" style="margin-left:5px;"><span></span>Approve</a><a href="#commentsForm" class="btn btn-danger open-popup rejectButton" style="margin-left:10px;"><span></span>Reject</a></td>'+
                            '</tr>';
            }
            $('#pendingForApprovalLeaves').html('');
            $('#pendingForApprovalLeaves').append('<table id="pendingForApprovalTable" class="table table-striped table-bordered" style="width:100%">'+
                '<thead>'+
                    '<tr>'+
                        '<th style="display:none;">Id</th>'+
                        '<th style="display:none;">Total Days</th>'+
                        '<th>Employee Name</th>'+
                        '<th>Start Date</th>'+
                        '<th>End Date</th>'+
                        '<th>Leave Type</th>'+
                        '<th>Description</th>'+
                        '<th>Action Item</th>'+
                    '</tr>'+
                '</thead>'+
                '<tbody>'+
                '</tbody>'+
            '</table>');
            $('#pendingForApprovalTable tbody').append(TableBody);
            $('.open-popup').magnificPopup({
                preloader: true,
                callbacks: {
                    open: function() {
                                        },
                    close: function() {
                        clearCommentsPopUp();
                    }
                }
            });
            $('.open-popup-edit').magnificPopup({
                preloader: true,
                callbacks: {
                    open: function() {},
                    close: function() {
                        clearLeavePopUp();
                    }
                }
            });
            $('.editButton').click(function(e){
                getDetailsForEdit(parseInt($(this).attr("alt")));
            });
            $('.deleteRequest').click(function(e){
                deleteLeaveDetails(parseInt($(this).attr("alt")));
            });
            $('.approveButton').click(function(){
                globalItemId = parseInt($(this).parent().parent().children()[0].innerText);
                tempTotalDays = parseInt($(this).parent().parent().children()[1].innerText);
                approveType = 'approve';
            });
            $('.rejectButton').click(function(){
                globalItemId = parseInt($(this).parent().parent().children()[0].innerText);
                //tempTotalDays = parseInt($(this).parent().parent().children()[1].innerText);
                approveType = 'reject';
                getDetailsForDelete(globalItemId);
            });
            $('#pendingForApprovalTable').DataTable();
        }else{
            $('#pendingForApprovalLeaves').html('');
            $('#pendingForApprovalLeaves').append('<table id="pendingForApprovalTable" class="table table-striped table-bordered" style="width:100%">'+
                '<thead>'+
                    '<tr>'+
                        '<th style="display:none;">Id</th>'+
                        '<th>Employee Name</th>'+
                        '<th>Start Date</th>'+
                        '<th>End Date</th>'+
                        '<th>Leave Type</th>'+
                        '<th>Description</th>'+
                        '<th>Action Item</th>'+
                    '</tr>'+
                '</thead>'+
                '<tbody>'+
                '</tbody>'+
            '</table>');
            $('#pendingForApprovalTable tbody').append('<tr><td colspan="7" style="text-align:center;">There are no leaves pending at your end.</td></tr>');
            $('#pendingForApprovalTable').DataTable();
        }
        
    },function(data){});
}

function clearCommentsPopUp(){
    globalItemId = 0;
    $('#comments').val('');
    approveType = '';
    tempTotalDays = 0;
    LeaveData = null;
    editLeaveType = '';
}

function checkIsReportingManager(){
    var deferred = $.Deferred();
    var EmployeeURL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Employee Information')/items?$top=5000&$select=*&$filter=ReportsToId eq "+EmployeeId+"&$orderBy=Id desc";
    getItems(EmployeeURL,function(data){
        deferred.resolve();
        if(data.d.results.length > 0){
            isReportingManager = true;
            for(k = 0;k < data.d.results.length; k++){
                if(k == 0){
                    filterString += '(EmpNameId eq '+data.d.results[k].Id;
                }
                else{
                    filterString += ' or EmpNameId eq '+data.d.results[k].Id;
                }
            }
        }
    },function(data){});
    return deferred.promise();
}

function SaveLeaveDetails(){
    LeaveData = {  
        __metadata: {  
            'type': 'SP.Data.EmployeeLeaveHistoryListItem'  
        },
        EmpNameId: EmployeeId,
        StartDate: convertDateSharePointFormat($("#startDate").val()),
        EndDate: convertDateSharePointFormat($("#endDate").val()),
        Description: $('#description').val(),
        LeaveType: $('#leaveType').val()
    };
    if(convertDateSharePointFormat($("#startDate").val()) == convertDateSharePointFormat($("#endDate").val())){
        if($('#duration').val() == 'Full day'){
            difference = 1;
            LeaveData.TotalDays = '1';
            LeaveData.Duration = 'Full day';
        }
        else if($('#duration').val() == 'First half' || $('#duration').val() == 'Second half'){
            difference = 0.5;
            LeaveData.TotalDays = '0.5';
            LeaveData.Duration = $('#duration').val();
        }
        LeaveData.StartDateInterval = null;
        LeaveData.EndDateInterval = null;
    }else{
        LeaveData.StartDateInterval = $('input[name="startDateRadio"]:checked').val();
        LeaveData.EndDateInterval = $('input[name="endDateRadio"]:checked').val();
        LeaveData.TotalDays = difference.toString();
        LeaveData.Duration = null;
    }
    getNotifyUsers();
}

function getNotifyUsers() {
    var owner = $(window)[0].SPClientPeoplePicker.SPClientPeoplePickerDict.NotifyUsersDiv_TopSpan;
    var notifyUsersId = owner.GetAllUserInfo();
    var notifyUsersDataSource = [];
    if (notifyUsersId.length > 0) {
        GetAllUserId(notifyUsersId[0].Key, notifyUsersDataSource, 0, notifyUsersId, function (data) {
            if (data.length > 0) {
                LeaveData.NotifyUsersId = { "results": data }
				SaveDataIntoHistoryList();
            }
        }, function (data) {
            failure(data);
        });
    } else {
		SaveDataIntoHistoryList();
    }
}

function SaveDataIntoHistoryList(){
    var uri = '';
    var header = '';
    if(globalItemId > 0){
        uri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Employee Leave History')/items("+globalItemId+")";
        header = {  
            "accept": "application/json;odata=verbose",  
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),  
            "content-Type": "application/json;odata=verbose",  
            "IF-MATCH": "*",  
            "X-HTTP-Method": "MERGE"  
        };
    }else{
        uri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Employee Leave History')/items";
        header = {  
            "accept": "application/json;odata=verbose",  
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),  
            "content-Type": "application/json;odata=verbose"  
        };
    }
    $.ajax({  
        url: uri,  
        type: "POST",  
        headers: header,  
        data: JSON.stringify(LeaveData),
        success: function(data) {  
            var BalanceData = {  
                __metadata: {  
                    'type': 'SP.Data.EmployeeLeavesBalanceListItem'  
                }
            };
            if(globalItemId > 0){
                if(editLeaveType != $('#leaveType').val()){
                    if(editLeaveType == 'Sick Leave'){
                        BalanceData.SL = (parseFloat(RemainingSL) + parseFloat(editTotalDays)).toString();
                    }
                    else if(editLeaveType == 'Paid Leave'){
                        BalanceData.PL = (parseFloat(RemainingPL) + parseFloat(editTotalDays)).toString();
                    }
                    else if(editLeaveType == 'Unpaid Leave'){
                        BalanceData.UnpaidLeave = (parseFloat(currentUnpaidLeaves) - parseFloat(totalLeaveDays)).toString();
                    }
                    if($('#leaveType').val() == 'Sick Leave'){
                        BalanceData.SL = (parseFloat(RemainingSL) - parseFloat(difference)).toString();
                    }
                    else if($('#leaveType').val() == 'Paid Leave'){
                        BalanceData.PL = (parseFloat(RemainingPL) - parseFloat(difference)).toString();
                    }
                    else if($('#leaveType').val() == 'Unpaid Leave'){
                        BalanceData.UnpaidLeave = (parseFloat(currentUnpaidLeaves) + parseFloat(difference)).toString();
                    }
                    updateLeaveBalance(BalanceData);
                }
                else{
                    if(editLeaveType == 'Sick Leave'){
                        RemainingSL = (parseFloat(RemainingSL) + parseFloat(editTotalDays));
                        BalanceData.SL = (parseFloat(RemainingSL) - parseFloat(difference)).toString();
                    }
                    else if(editLeaveType == 'Paid Leave'){
                        RemainingPL = (parseFloat(RemainingPL) + parseFloat(editTotalDays));
                        BalanceData.PL = (parseFloat(RemainingPL) - parseFloat(difference)).toString();
                    }
                    else if(editLeaveType == 'Unpaid Leave'){
                        currentUnpaidLeaves = (parseFloat(currentUnpaidLeaves) - parseFloat(editTotalDays));
                        BalanceData.UnpaidLeave = (parseFloat(currentUnpaidLeaves) + parseFloat(difference)).toString();
                    }
                    updateLeaveBalance(BalanceData);
                }
            }
            else{
                if($('#leaveType').val() == 'Sick Leave'){
                    BalanceData.SL = (parseFloat(RemainingSL) - parseFloat(difference)).toString();
                }
                else if($('#leaveType').val() == 'Paid Leave'){
                    BalanceData.PL = (parseFloat(RemainingPL) - parseFloat(difference)).toString();
                }
                else if($('#leaveType').val() == 'Unpaid Leave'){
                    BalanceData.UnpaidLeave = (parseFloat(currentUnpaidLeaves) + parseFloat(difference)).toString();
                }
                updateLeaveBalance(BalanceData);
            }
        },  
        error: function(error) {  
            alert(JSON.stringify(error));  
        }  
    }); 
}

function updateLeaveBalance(BalanceData){
    $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Employee Leave Balance')/items(" + balanceListId + ")",
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
        data: JSON.stringify(BalanceData),
        success: function (data) {
            var message = '';
            if(globalItemId > 0){
                message = 'Leave details are successfully updated.';
            }else{
                message = 'Request for leave has been submitted.';
            }
            $.magnificPopup.close();
            swal({
                title: "Success",
                text: message,
                type: "success"
            }, function() {
                getEmployeeLeave().then(function(value){
                    if(!is_HRTeam){
                        getCurrentEmployeesLeaves();
                        if(isReportingManager){
                            getPendingLeaves();
                        }
                    }else{
                        getCurrentEmployeesLeaves();
                        getPendingLeaves();
                    }
                });
                clearLeavePopUp();
            });
        },
        error: function (error) {
            console.log(error)
        }
    });
}

function validateComments(){
    var isValidated = true;
    var msg = '';
    if($('#comments').val() == ''){
        msg += 'Comments'
        isValidated = false;
    }
    if(!isValidated){
        swal("Required",msg,"error");
    }
    return isValidated;
}

function validateLeaveApplication(){
    var isValidated = true;
    var msg = '';
    if($('#startDate').val() == ""){
        isValidated = false;
        msg += 'Start date \n';
    }
    if($('#endDate').val() == ""){
        isValidated = false;
        msg += 'End date \n';
    }
    if($('#leaveType').val() == ""){
        isValidated = false;
        msg += 'Leave Type \n';
    }
    if($('#description').val() == ""){
        isValidated = false;
        msg += 'Description \n';
    }
    if($('#startDate').val() != "" && $('#endDate').val() != "" && $('#leaveType').val() != ""){
        if(globalItemId > 0){
            if($('#leaveType').val() == editLeaveType){    
                if($('#leaveType').val() == 'Sick Leave'){
                    if(difference != 0 && parseFloat(difference) > (RemainingSL + editTotalDays)){
                        isValidated = false;
                        msg += 'You do not have sufficient leaves left to apply for selected days \n';
                        $('#leaveType').val('');
                    }
                }
                else if($('#leaveType').val() == 'Paid Leave'){
                    if(difference != 0 && parseFloat(difference) > (RemainingPL + editTotalDays)){
                        isValidated = false;
                        msg += 'You do not have sufficient leaves left to apply for selected days \n';
                        $('#leaveType').val('');
                    }
                }
            }
            else{
                if($('#leaveType').val() == 'Sick Leave'){
                    if(difference != 0 && parseFloat(difference) > (RemainingSL)){
                        isValidated = false;
                        msg += 'You do not have sufficient leaves left to apply for selected days \n';
                        $('#leaveType').val('');
                    }
                }
                else if($('#leaveType').val() == 'Paid Leave'){
                    if(difference != 0 && parseFloat(difference) > (RemainingPL)){
                        isValidated = false;
                        msg += 'You do not have sufficient leaves left to apply for selected days \n';
                        $('#leaveType').val('');
                    }
                }
            }
        }
        else{
            if($('#leaveType').val() == 'Sick Leave'){
                if(difference != 0 && parseFloat(difference) > RemainingSL){
                    isValidated = false;
                    msg += 'You do not have sufficient leaves left to apply for selected days \n';
                    $('#leaveType').val('');
                }
            }
            else if($('#leaveType').val() == 'Paid Leave'){
                if(difference != 0 && parseFloat(difference) > RemainingPL){
                    isValidated = false;
                    msg += 'You do not have sufficient leaves left to apply for selected days \n';
                    $('#leaveType').val('');
                }
            }
        }
    }
    // var Participants = $(window)[0].SPClientPeoplePicker.SPClientPeoplePickerDict.NotifyUsersDiv_TopSpan;
    // ParticipantsId = Participants.GetAllUserInfo();
    // if (ParticipantsId.length <= 0) {
    //     msg += 'Notify users \n';
    //     isValidated = false;
    // }
    if(!isValidated){
        swal("Required",msg,"error");
    }
    return isValidated;
}

function dateChanged(ev) {
    if($("#startDate").val() != "" && $("#endDate").val() != ""){
        if(new Date($("#endDate").val()) < new Date($("#startDate").val())){
            alert('End Date should not be less than start date.');
        }else {
            const date1 = new Date($("#startDate").val());
            const date2 = new Date($("#endDate").val());
            const diffTime = Math.abs(date2 - date1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            if(convertDateSharePointFormat($("#startDate").val()) == convertDateSharePointFormat($("#endDate").val())){
                $('#duration').attr("disabled",false);
                $('.duration').show();
                $('.endRadio').hide();
                $('.startRadio').hide();
                $("input[name=startDateRadio][value='First half']").prop('checked', true);
                $("input[name=endDateRadio][value='Second half']").prop('checked', true);
                tempDifference = 1;
                difference = 1;
            }else{
                tempDifference = 0;
                difference = 0;
                $('.endRadio').show();
                $('.startRadio').show();
                $('.duration').hide();
                $("input[name=startDateRadio][value='First half']").prop('checked', true);
                $("input[name=endDateRadio][value='Second half']").prop('checked', true);
                var days = calcBusinessDays(date1, date2);
                tempDifference = days;
                difference = days;
                $('#duration').attr("disabled",true);
                $('#duration').val("Full day");
            }
        }
    }
}

function getEmployeeLeave(){
    var deferred = $.Deferred();
    var EmployeeURL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Employee Leave Balance')/items?$top=5000&$select=*,EmployeeName/Title,EmployeeName/EmailId&$expand=EmployeeName&$filter=EmployeeName/EmailId eq '"+_spPageContextInfo.userLoginName+"'&$orderBy=Id desc";
    getItems(EmployeeURL,function(data){
        deferred.resolve();
        if(data.d.results.length > 0){
            var results = data.d.results[0];
            RemainingSL = parseFloat(results.SL);
            RemainingPL = parseFloat(results.PL);
            currentUnpaidLeaves = parseFloat(results.UnpaidLeave == null ? 0 : results.UnpaidLeave);
            balanceListId = results.Id;
            EmployeeId = results.EmployeeNameId;
            $('#sickLeavesCounter').text(results.SL);
            $('#paidLeavesCounter').text(results.PL);
            $('#unpaidLeavesCounter').text(results.UnpaidLeave == null ? '0' : results.UnpaidLeave);
        }else{
            $('#sickLeavesCounter').text('0');
            $('#paidLeavesCounter').text('0');
            $('#unpaidLeavesCounter').text('0');
        }    
    },function(data){});
    return deferred.promise();
}

function getCurrentUserDetails(){
    var deferred = $.Deferred();
    var EmployeeURL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Employee Information')/items?$top=5000&$select=*&$filter=EmailId eq '"+_spPageContextInfo.userLoginName+"'";
    getItems(EmployeeURL,function(data){
        deferred.resolve();
        if(data.d.results.length > 0){
            var results = data.d.results[0];
            currentUserName = data.d.results[0].Title;
        }    
    },function(data){});
    return deferred.promise();
}

function getCurrentEmployeesLeaves(){
    var AllLeavesURL = '';
    if(is_HRTeam){
        AllLeavesURL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Employee Leave History')/items?$top=5000&$select=*,NotifyUsers/Title,EmpName/Title&$expand=NotifyUsers,EmpName&$orderBy=Id desc";
    }else{
        AllLeavesURL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Employee Leave History')/items?$top=5000&$select=*,NotifyUsers/Title,EmpName/Title&$expand=NotifyUsers,EmpName&$filter=EmpNameId eq '"+EmployeeId+"'&$orderBy=Id desc";
    }
    getItems(AllLeavesURL,function(data){
        if(data.d.results.length > 0){
            var results = data.d.results;
            if(is_HRTeam){
                var pendingLeaves = results.filter(item => item.isApproved == false && item.isRejected == false && item.isCancelled == false && item.EmpNameId == EmployeeId);
            }else{
                var pendingLeaves = results.filter(item => item.isApproved == false && item.isRejected == false && item.isCancelled == false);
            }
            if(pendingLeaves.length > 0){
                var HTMLToAppend = '';
                for(i = 0; i < pendingLeaves.length; i++){
                    HTMLToAppend += '<tr>'+
                                        '<td style="display:none;">'+pendingLeaves[i].Id+'</td>'+
                                        '<td>'+convertDateSharePointFormat(pendingLeaves[i].StartDate)+'</td>'+
                                        '<td>'+convertDateSharePointFormat(pendingLeaves[i].EndDate)+'</td>'+
                                        '<td>'+pendingLeaves[i].LeaveType+'</td>'+
                                        '<td>'+pendingLeaves[i].Description+'</td>'+
                                        '<td><a href="#ticketForm" class="btn btn-primary open-popup-edit editButton" alt="'+pendingLeaves[i].Id+'">Edit</a><a href="javascript:;" class="btn btn-danger deleteRequest" alt="'+pendingLeaves[i].Id+'" style="margin-left:5px;">Delete</a></td>'+
                                    '</tr>';
                    if(i == pendingLeaves.length -1){
                        $('#pendingLeaves').html('');
                        $('#pendingLeaves').append('<table id="pendingLeavesTable" class="table table-striped table-bordered" style="width:100%">'+
                                        '<thead>'+
                                            '<tr>'+
                                                '<td style="display:none;">Id</td>'+
                                                '<td>Start Date</td>'+
                                                '<td>End Date</td>'+
                                                '<td>Leave Type</td>'+
                                                '<td>Description</td>'+
                                                '<td>Action Item</td>'+
                                            '</tr>'+
                                        '</thead>'+
                                        '<tbody>'+HTMLToAppend+'</tbody>'+
                                        '</table>');
                        $('.open-popup-edit').magnificPopup({
                            preloader: true,
                            callbacks: {
                                open: function() {},
                                close: function() {
                                    clearLeavePopUp();
                                }
                            }
                        });
                        $('.editButton').click(function(e){
                            getDetailsForEdit(parseInt($(this).attr("alt")));
                        });
                        $('.deleteRequest').click(function(e){
                            deleteLeaveDetails(parseInt($(this).attr("alt")));
                        });
                        $('#pendingLeavesTable').DataTable();
                    }
                }
            }

            var HTMLForAllLeaves = '';
            for(j = 0; j < results.length; j++){
                var status = 'Pending';
                var className = 'pending';
                if(results[j].isApproved == true){
                    status = 'Approved';
                    className = 'approved';
                }else if(results[j].isRejected == true){
                    status = 'Rejected';
                    className = 'rejected';
                }
                else if(results[j].isCancelled == true){
                    status = 'Cancelled';
                    className = 'rejected';
                }
                var actionItems = '';
                if(is_HRTeam){
                    if(results[j].isCancelled != true){
                        actionItems = '<a href="#ticketForm" class="btn btn-primary open-popup-edit editButton" alt="'+results[j].Id+'">Edit</a><a href="javascript:;" class="btn btn-danger deleteRequest" alt="'+results[j].Id+'" style="margin-left:5px;">Cancel</a>';
                    }
                    HTMLForAllLeaves += '<tr>'+
                                    '<td style="display:none;">'+results[j].Id+'</td>'+
                                    '<td>'+results[j].EmpName.Title+'</td>'+
                                    '<td>'+convertDateSharePointFormat(results[j].StartDate)+'</td>'+
                                    '<td>'+convertDateSharePointFormat(results[j].EndDate)+'</td>'+
                                    '<td>'+results[j].LeaveType+'</td>'+
                                    '<td>'+results[j].Description+'</td>'+
                                    '<td>'+(results[j].ApproverName == null ? '' : results[j].ApproverName)+'</td>'+
                                    '<td><div class="status '+className+'">'+status+'</div></td>'+
                                    '<td>'+actionItems+'</td>'+
                                '</tr>';
                }else{
                    if(results[j].isCancelled != true){
                        actionItems = '<a href="javascript:;" class="btn btn-danger deleteRequest" alt="'+results[j].Id+'">Cancel</a>';
                    }
                    HTMLForAllLeaves += '<tr>'+
                                    '<td style="display:none;">'+results[j].Id+'</td>'+
                                    '<td>'+convertDateSharePointFormat(results[j].StartDate)+'</td>'+
                                    '<td>'+convertDateSharePointFormat(results[j].EndDate)+'</td>'+
                                    '<td>'+results[j].LeaveType+'</td>'+
                                    '<td>'+results[j].Description+'</td>'+
                                    '<td>'+(results[j].ApproverName == null ? '' : results[j].ApproverName)+'</td>'+
                                    '<td><div class="status '+className+'">'+status+'</div></td>'+
                                    '<td>'+actionItems+'</td>'+
                                '</tr>';
                }
                
                if(j == results.length - 1){
                    $('#ticketHistory').html('');
                    if(is_HRTeam){
                        $('#ticketHistory').append('<table id="allLeavesTable" class="table table-striped table-bordered" style="width:100%">'+
                                                '<thead>'+
                                                    '<tr>'+
                                                        '<td style="display:none;">Id</td>'+
                                                        '<td>Employee Name</td>'+
                                                        '<td>Start Date</td>'+
                                                        '<td>End Date</td>'+
                                                        '<td>Leave Type</td>'+
                                                        '<td>Description</td>'+
                                                        '<td>Approver</td>'+
                                                        '<td>Status</td>'+
                                                        '<td>Action Item</td>'+
                                                    '</tr>'+
                                                '</thead>'+
                                                '<tbody>'+HTMLForAllLeaves+'</tbody>'+
                                                '</table>');
                    }else{
                        $('#ticketHistory').append('<table id="allLeavesTable" class="table table-striped table-bordered" style="width:100%">'+
                                                '<thead>'+
                                                    '<tr>'+
                                                        '<td style="display:none;">Id</td>'+
                                                        '<td>Start Date</td>'+
                                                        '<td>End Date</td>'+
                                                        '<td>Leave Type</td>'+
                                                        '<td>Description</td>'+
                                                        '<td>Approver</td>'+
                                                        '<td>Status</td>'+
                                                        '<td>Action Item</td>'+
                                                    '</tr>'+
                                                '</thead>'+
                                                '<tbody>'+HTMLForAllLeaves+'</tbody>'+
                                                '</table>');
                    }
                    $('.open-popup-edit').magnificPopup({
                        preloader: true,
                        callbacks: {
                            open: function() {},
                            close: function() {
                                clearLeavePopUp();
                            }
                        }
                    });
                    $('.editButton').click(function(e){
                        getDetailsForEdit(parseInt($(this).attr("alt")));
                    });
                    $('.deleteRequest').click(function(e){
                        deleteLeaveDetails(parseInt($(this).attr("alt")));
                    });
                    $('#allLeavesTable').DataTable();
                }
            }
            if(pendingLeaves.length == 0){
                $('#pendingLeaves').html('');
                $('#pendingLeaves').append('<table id="pendingLeavesTable" class="table table-striped table-bordered" style="width:100%">'+
                                        '<thead>'+
                                            '<tr>'+
                                                '<td style="display:none;">Id</td>'+
                                                '<td>Start Date</td>'+
                                                '<td>End Date</td>'+
                                                '<td>Leave Type</td>'+
                                                '<td>Description</td>'+
                                            '</tr>'+
                                        '</thead>'+
                                        '<tbody>'+
                                            '<tr>'+
                                                '<td colspan="5" style="text-align:center;">There are no pending leaves as of now.</td>'+
                                            '</tr>'+
                                        '</tbody>'+
                                        '</table>');
                $('#pendingLeavesTable').DataTable();
            }
        }
        else{
            $('#pendingLeaves').html('');
            $('#pendingLeaves').append('<table id="pendingLeavesTable" class="table table-striped table-bordered" style="width:100%">'+
                                        '<thead>'+
                                            '<tr>'+
                                                '<td style="display:none;">Id</td>'+
                                                '<td>Start Date</td>'+
                                                '<td>End Date</td>'+
                                                '<td>Leave Type</td>'+
                                                '<td>Description</td>'+
                                            '</tr>'+
                                        '</thead>'+
                                        '<tbody>'+
                                            '<tr>'+
                                                '<td colspan="5" style="text-align:center;">There are no pending leaves as of now.</td>'+
                                            '</tr>'+
                                        '</tbody>'+
                                        '</table>');
            $('#ticketHistory').html('');
            $('#ticketHistory').append('<table id="allLeavesTable" class="table table-striped table-bordered" style="width:100%">'+
                                        '<thead>'+
                                            '<tr>'+
                                                '<td style="display:none;">Id</td>'+
                                                '<td>Start Date</td>'+
                                                '<td>End Date</td>'+
                                                '<td>Leave Type</td>'+
                                                '<td>Description</td>'+
                                                '<td>Approver</td>'+
                                                '<td>Status</td>'+
                                                '<td>Action Item</td>'+
                                            '</tr>'+
                                        '</thead>'+
                                        '<tbody>'+
                                            '<tr>'+
                                                '<td colspan="8" style="text-align:center;">There are no leaves as of now.</td>'+
                                            '</tr>'+
                                        '</tbody>'+
                                        '</table>');
            $('#pendingLeavesTable').DataTable();
            $('#allLeavesTable').DataTable();
        }
    },function(data){});
}

function getDetailsForDelete(itemId){
    var LeavesDataURL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Employee Leave History')/items?$top=5000&$select=*,NotifyUsers/Title&$expand=NotifyUsers&$filter=Id eq "+itemId;
    getItems(LeavesDataURL,function(data){
        if(data.d.results.length > 0){
            globalItemId = data.d.results[0].Id;
            tempTotalDays = parseFloat(data.d.results[0].TotalDays);
            editLeaveType = data.d.results[0].LeaveType;
        }
    },function(error){});
}

function getDetailsForEdit(itemId){
    var LeavesDataURL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Employee Leave History')/items?$top=5000&$select=*,NotifyUsers/Title&$expand=NotifyUsers&$filter=Id eq "+itemId;
    getItems(LeavesDataURL,function(data){
        if(data.d.results.length > 0){
            globalItemId = data.d.results[0].Id;
            difference = parseFloat(data.d.results[0].TotalDays);
            tempDifference = parseFloat(data.d.results[0].TotalDays);
            $('#startDate').val(convertDateSharePointFormat(data.d.results[0].StartDate));
            $('#endDate').val(convertDateSharePointFormat(data.d.results[0].EndDate));
            $('#leaveType').val(data.d.results[0].LeaveType);
            editLeaveType = data.d.results[0].LeaveType;
            editTotalDays = parseFloat(data.d.results[0].TotalDays);
            $('#description').val(data.d.results[0].Description);
            if(data.d.results[0].Duration != null){
                $('#duration').val(data.d.results[0].Duration == null ? '' : data.d.results[0].Duration);
                $('.duration').show();
                $('#duration').attr("disabled",false);
            }
            if (data.d.results[0].NotifyUsersId != null && data.d.results[0].NotifyUsersId != undefined && data.d.results[0].NotifyUsersId != '') {
                var peoplePicker = this.SPClientPeoplePicker.SPClientPeoplePickerDict.NotifyUsersDiv_TopSpan;
                var listNotificationMembers = data.d.results[0].NotifyUsers.results;
                $.each(listNotificationMembers, function (index, value) {
                    peoplePicker.AddUserKeys(value.Title);
                });
            }
            if(data.d.results[0].StartDateInterval != null && data.d.results[0].EndDateInterval != null){
                $("input[name='startDateRadio'][value='"+data.d.results[0].StartDateInterval+"']").prop('checked', true);
                $("input[name='endDateRadio'][value='"+data.d.results[0].EndDateInterval+"']").prop('checked', true);
                $('.endRadio').show();
                $('.startRadio').show();
            }
        }
    },function(error){});
}

function deleteLeaveDetails(itemId){
    if (confirm('Are you sure you want to delete the leave?')) {
        if(itemId > 0){
            getLeaveDays(itemId);
        }
    }
}

function getLeaveDays(itemId){
    var LeavesDataURL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Employee Leave History')/items?$top=5000&$select=*&$filter=Id eq "+itemId;
    getItems(LeavesDataURL,function(data){
        deleteDataFromList(itemId,parseFloat(data.d.results[0].TotalDays),data.d.results[0].LeaveType);
    },function(error){});
}

function deleteDataFromList(itemId,totalLeaveDays,LeaveType){
    var CancelLeaveData = {  
        __metadata: {  
            'type': 'SP.Data.EmployeeLeaveHistoryListItem'  
        },
        isCancelled: true,
        isApproved:false,
        isRejected:false
    };
    $.ajax({  
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Employee Leave History')/items(" + itemId + ")",  
        type: "POST",
        async: false,  
        contentType: "application/json;odata=verbose",  
        headers: {  
            'Accept': 'application/json;odata=verbose',
            "Content-Type": "application/json;odata=verbose",
            'X-RequestDigest': $('#__REQUESTDIGEST').val(),
            'X-HTTP-Method': 'MERGE',
            'If-Match': '*' 
        },   
        data: JSON.stringify(CancelLeaveData),
        success: function(data) {  
            updateLeaveBalanceForDelete(LeaveType,totalLeaveDays,'Leave has been deleted.');
        },  
        error: function(data) {  
            alert("failed");  
        }  
    });  
}

function updateLeaveBalanceForDelete(leaveType, totalDays,successMesage){
    var BalanceData = {  
        __metadata: {  
            'type': 'SP.Data.EmployeeLeavesBalanceListItem'  
        }
    };
    if(leaveType == 'Sick Leave'){
        BalanceData.SL = (parseFloat(RemainingSL) + parseFloat(totalDays)).toString();
    }
    else if(leaveType == 'Paid Leave'){
        BalanceData.PL = (parseFloat(RemainingPL) + parseFloat(totalDays)).toString();
    }
    else if(leaveType == 'Unpaid Leave'){
        BalanceData.UnpaidLeave = (parseFloat(currentUnpaidLeaves) - parseFloat(totalDays)).toString();
    }
    $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Employee Leave Balance')/items(" + balanceListId + ")",
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
        data: JSON.stringify(BalanceData),
        success: function (data) {
            swal({
                title: "Success",
                text: successMesage,
                type: "success"
            }, function() {
                getEmployeeLeave().then(function(value){
                    if(!is_HRTeam){
                        getCurrentEmployeesLeaves();
                        if(isReportingManager){
                            getPendingLeaves();
                        }
                    }else{
                        getCurrentEmployeesLeaves();
                        getPendingLeaves();
                    }
                });
            });
        },
        error: function (error) {
            console.log(error)
        }
    });
}

function clearLeavePopUp(){
    $('#startDate').val('');
    $('#endDate').val('');
    $('#leaveType').val('');
    $('#description').val('');
    $('#duration').val('');
    $('.duration').hide();
    $('.endRadio').hide();
    $('.startRadio').hide();
    $("input[name=startDateRadio][value='First half']").prop('checked', true);
    $("input[name=endDateRadio][value='Second half']").prop('checked', true);
    $('#duration').attr("disabled",false);
    var spclientPeoplePickerParticipants = SPClientPeoplePicker.SPClientPeoplePickerDict.NotifyUsersDiv_TopSpan;
    clearPeoplePickers(spclientPeoplePickerParticipants);
    difference = 0;
    tempDifference = 0;
    globalItemId = 0;
    LeaveData = null;
    editLeaveType = '';
    editTotalDays = 0;
}

function convertDateSharePointFormat(dateToFormat){
    var d= new Date(dateToFormat);
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = ((''+month).length < 2 ? '0' : '') + month + '/' + ((''+day).length<2 ? '0' : '') + day + '/' + d.getFullYear();
    return output;
}

//People Picker
function initializePeoplePicker(peoplePickerElementId) {

    // Create a schema to store picker properties, and set the properties.
    var schema = {};
    //schema['PrincipalAccountType'] = 'User,DL,SecGroup,SPGroup';
    schema['PrincipalAccountType'] = 'User';
    schema['SearchPrincipalSource'] = 15;
    schema['ResolvePrincipalSource'] = 15;
    schema['AllowMultipleValues'] = true;
    schema['MaximumEntitySuggestions'] = 50;
    schema['Width'] = '100%';

    // Render and initialize the picker. 
    // Pass the ID of the DOM element that contains the picker, an array of initial
    // PickerEntity objects to set the picker value, and a schema that defines
    // picker properties.
    this.SPClientPeoplePicker_InitStandaloneControlWrapper(peoplePickerElementId, null, schema);
}

function clearPeoplePickers(control) {
    //Get the Resolved Users list from Client People Picker
    if (control) {
        var ResolvedUsers = $(".sp-peoplepicker-userSpan");
        //Clear the Client People Picker
        $(ResolvedUsers).each(function (index) {
            control.DeleteProcessedUser(this);
        });
    }
}

//Multiple PeoplePicker
function GetAllUserId(accountName, dataSource, ArrayCount, AllUsersCount, success, failure) {
    var uri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/siteusers(@v)?@v='" + encodeURIComponent(accountName) + "'"
    getListItems(uri, function (dataItem) {
        if (dataItem.d) {
            ArrayCount++;
            dataSource.push(dataItem.d.Id);
        }
        if (AllUsersCount.length > dataSource.length) {
            GetAllUserId(AllUsersCount[ArrayCount].Key, dataSource, ArrayCount, AllUsersCount, success, failure);
        } else {
            success(dataSource);
        }
    }, function (data) {
        console.log("Error fetching GetUserId");
        failure(data);
    });
}

function getListItems(url, success, failure) {
    $.ajax({
        url: url,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            success(data);
        },
        error: function (data) {
            failure(data);
        }
    });
}

function getCurrentUserGroup(){
    var deferred = $.Deferred();
    var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/GetUserById(" + _spPageContextInfo.userId+ ")/Groups";
    $.ajax({
            url: requestUri,
            type: "GET",
            async:false,
            headers: { "ACCEPT": "application/json;odata=verbose" },
            success: function (data) {
                if(data.d.results.length >0){
                    for(i=0; i < data.d.results.length; i++){
                        if(data.d.results[i].Title == 'HR Team'){
                            is_HRTeam = true;
                        }
                    }
                }                     
                deferred.resolve();            
        },    
    });
    return deferred.promise();
}

function calcBusinessDays(dDate1, dDate2) { // input given as Date objects
    var iWeeks, iDateDiff, iAdjust = 0;
    if (dDate2 < dDate1) return -1; // error code if dates transposed
    var iWeekday1 = dDate1.getDay(); // day of week
    var iWeekday2 = dDate2.getDay();
    iWeekday1 = (iWeekday1 == 0) ? 7 : iWeekday1; // change Sunday from 0 to 7
    iWeekday2 = (iWeekday2 == 0) ? 7 : iWeekday2;
    if ((iWeekday1 > 5) && (iWeekday2 > 5)) iAdjust = 1; // adjustment if both days on weekend
    iWeekday1 = (iWeekday1 > 5) ? 5 : iWeekday1; // only count weekdays
    iWeekday2 = (iWeekday2 > 5) ? 5 : iWeekday2;
 
    // calculate differnece in weeks (1000mS * 60sec * 60min * 24hrs * 7 days = 604800000)
    iWeeks = Math.floor((dDate2.getTime() - dDate1.getTime()) / 604800000)
 
    if (iWeekday1 <= iWeekday2) {
      iDateDiff = (iWeeks * 5) + (iWeekday2 - iWeekday1)
    } else {
      iDateDiff = ((iWeeks + 1) * 5) - (iWeekday1 - iWeekday2)
    }
 
    iDateDiff -= iAdjust // take into account both days on weekend
 
    return (iDateDiff + 1); // add 1 because dates are inclusive
}