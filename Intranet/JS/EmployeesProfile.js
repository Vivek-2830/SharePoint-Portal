var getName, getDesignation, getDepartment, getMobileNumber, getWorkEmail, getDOB, getDOJ, getLWD, getReportsTo, getReportsToId, getPermanentAddress, getCurrentAddress, getGender, getMaritalStatus, getBloodGroup, getPersonalEmail, getEmployeeNumber,getSkypeID = '';
var editDOB, editDOJ, editLWD = '';
var globalItemId  = 0;
var is_HRTeam = false;
$(document).ready(function(){
	var url_string = window.location.href;
	var url = new URL(url_string);
	globalItemId = url.searchParams.get("empid");
	getCurrentUserGroup().then(function(){
		getEmployeeInformation();
	});
	$('.editHRProfile').magnificPopup({
		preloader: true,
		callbacks: {
			open: function() {
								},
			close: function() {
				clearHRPopUp();
			}
		}
	});
	$('.editHRProfile').click(function(e){
		e.preventDefault();
		$('#txtNameHR').val(getName);
		$('#txtdesignationHR').val(getDesignation);
		$('#departmentHR').val(getDepartment);
		$('#txtWorkEmailHR').val(getWorkEmail);
		$('#txtSkypeIDHR').val(getSkypeID);
		$('#ReportsToHR').val(getReportsToId);
		$('#txtMobileNumberHR').val(getMobileNumber);
		
		$('#txtDOBHR').val(editDOB);
		$('#txtDOJHR').val(editDOJ);
		$('#txtLWDHR').val(editLWD);
		$('#txtPermanentAddressHR').val(getPermanentAddress);
		$('#txtCurrentAddressHR').val(getCurrentAddress);
		$('#genderListHR').val(getGender);
		$('#maritalStatusListHR').val(getMaritalStatus);
		$('#txtBloodGroupHR').val(getBloodGroup);
		$('#txtPersonalEmailHR').val(getPersonalEmail);
		$('#txtEmployeeNumberHR').val(getEmployeeNumber);
	});
	$('#btnHRCancelProfile').click(function(){
		$.magnificPopup.close();
		clearHRPopUp();
	});
	$('.documentsTab').click(function(){
		if(is_HRTeam || getWorkEmail == _spPageContextInfo.userEmail){
			getEmployeeDocs();
		}else{
			$('#documents').html('');
			if (window.confirm('You are not authorized to view the details'))
			{
				location.reload();
			}
			else
			{
				location.reload();
			}

		}
	});
	$('#submitPanCard').click(function(){
		var serverRelativeUrlToFolder = '/sites/Intranet/EmployeeDocuments/'+getName+'/Identity Docs/Pan Card';
		if($('#uploadedPanCard')[0].files.length > 0){
			uploadFile('uploadedPanCard',serverRelativeUrlToFolder);
		}
	});
	$('#submitPassport').click(function(){
		var serverRelativeUrlToFolder = '/sites/Intranet/EmployeeDocuments/'+getName+'/Identity Docs/Passport';
		if($('#uploadedPassport')[0].files.length > 0){
			uploadFile('uploadedPassport',serverRelativeUrlToFolder);
		}
	});
	$('#submitAadhaarCard').click(function(){
		var serverRelativeUrlToFolder = '/sites/Intranet/EmployeeDocuments/'+getName+'/Identity Docs/Aadhaar';
		if($('#uploadedAadhaarCard')[0].files.length > 0){
			uploadFile('uploadedAadhaarCard',serverRelativeUrlToFolder);
		}
	});
	$('#submitVoterId').click(function(){
		var serverRelativeUrlToFolder = '/sites/Intranet/EmployeeDocuments/'+getName+'/Identity Docs/Voter Id';
		if($('#uploadedVoterId')[0].files.length > 0){
			uploadFile('uploadedVoterId',serverRelativeUrlToFolder);
		}
	});
	$('#submitDriverLicense').click(function(){
		var serverRelativeUrlToFolder = '/sites/Intranet/EmployeeDocuments/'+getName+'/Identity Docs/Drivers License';
		if($('#uploadedDriverLicense')[0].files.length > 0){
			uploadFile('uploadedDriverLicense',serverRelativeUrlToFolder);
		}
	});
});

function getEmployeeDocs(){
	var PanCardDetails = getSharePointListItems( _spPageContextInfo.webAbsoluteUrl+"/_api/web/GetFolderByServerRelativeUrl('/sites/Intranet/EmployeeDocuments/"+getName+"/Identity%20Docs/Pan Card')/Files?$expand=ListItemAllFields");
	if(PanCardDetails.d.results.length > 0){
		displayDocuments(PanCardDetails.d.results,'PanCardList');
	}
	var PassportDetails = getSharePointListItems( _spPageContextInfo.webAbsoluteUrl+"/_api/web/GetFolderByServerRelativeUrl('/sites/Intranet/EmployeeDocuments/"+getName+"/Identity%20Docs/Passport')/Files?$expand=ListItemAllFields");
	if(PassportDetails.d.results.length > 0){
		displayDocuments(PassportDetails.d.results,'PassportList');
	}
	var AadhaarDetails = getSharePointListItems( _spPageContextInfo.webAbsoluteUrl+"/_api/web/GetFolderByServerRelativeUrl('/sites/Intranet/EmployeeDocuments/"+getName+"/Identity%20Docs/Aadhaar')/Files?$expand=ListItemAllFields");
	if(AadhaarDetails.d.results.length > 0){
		displayDocuments(AadhaarDetails.d.results,'AadharList');
	}
	var VoterIdDetails = getSharePointListItems( _spPageContextInfo.webAbsoluteUrl+"/_api/web/GetFolderByServerRelativeUrl('/sites/Intranet/EmployeeDocuments/"+getName+"/Identity%20Docs/Voter Id')/Files?$expand=ListItemAllFields");
	if(VoterIdDetails.d.results.length > 0){
		displayDocuments(VoterIdDetails.d.results,'VoterIdList');
	}
	var DrivingLicenseDetails = getSharePointListItems( _spPageContextInfo.webAbsoluteUrl+"/_api/web/GetFolderByServerRelativeUrl('/sites/Intranet/EmployeeDocuments/"+getName+"/Identity%20Docs/Drivers License')/Files?$expand=ListItemAllFields");
	if(DrivingLicenseDetails.d.results.length > 0){
		displayDocuments(DrivingLicenseDetails.d.results,'DrivingLicenseList');
	}
}

function displayDocuments(documentList,appendComponent){
	$('.'+appendComponent).html('');
	for(k = 0; k < documentList.length; k++){
		if(!is_HRTeam){
			if(documentList[k].ListItemAllFields.isApproved == true){
				//$('.'+appendComponent).last().append("<li><a href='"+documentList[k].ServerRelativeUrl+"' target='_blank'>"+documentList[k].Name+"</a><a href='javascript:;' class='remove' title='Delete' onclick='DeleteDocumentConfirmation(this,\"" + documentList[k].ServerRelativeUrl + "\");'><i class='fa fa-trash-o' aria-hidden='true'></i></a></li>");
				$('.'+appendComponent).last().append("<li><a href='"+documentList[k].ServerRelativeUrl+"' target='_blank'>"+documentList[k].Name+"</a></li>");
			}
		}else{
			if(documentList[k].ListItemAllFields.isApproved == false && documentList[k].ListItemAllFields.isRejected == false){
				$('.'+appendComponent).last().append("<li><a href='"+documentList[k].ServerRelativeUrl+"' target='_blank'>"+documentList[k].Name+"</a><a href='javascript:;' class='check' title='Approve' onclick='approveDocument(" + documentList[k].ListItemAllFields.Id + ");'><i class='fa fa-check' aria-hidden='true'></i></a><a href='javascript:;' class='remove' title='Reject' onclick='rejectDocument(" + documentList[k].ListItemAllFields.Id + ");'><i class='fa fa-times' aria-hidden='true'></i></a></li>");
			}
			else if(documentList[k].ListItemAllFields.isApproved == true){
				$('.'+appendComponent).last().append("<li><a href='"+documentList[k].ServerRelativeUrl+"' target='_blank'>"+documentList[k].Name+"</a><a href='javascript:;' class='remove' title='Delete' onclick='DeleteDocumentConfirmation(this,\"" + documentList[k].ServerRelativeUrl + "\");'><i class='fa fa-trash-o' aria-hidden='true'></i></a></li>");
			}
		}
	}
}

function approveDocument(itemId){
	var approveData = {"__metadata": {"type":"SP.Data.EmployeeDocumentsItem"},"isApproved":true};
	updateDocsProperties(approveData,itemId,'Document has been approved');
}

function rejectDocument(itemId){
	var rejectData = {"__metadata": {"type":"SP.Data.EmployeeDocumentsItem"},"isRejected":true};
	updateDocsProperties(rejectData,itemId,'Document has been rejected');
}

function updateDocsProperties(data,itemId,successMessage){
	$.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Employee Documents')/items(" + itemId + ")",
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
        data: JSON.stringify(data),
        success: function (data) {
            swal({
                title: "Success",
                text: successMessage,
                type: "success"
            }, function() {
				getEmployeeDocs();
            });
        },
        error: function (error) {
            console.log(error)
        }
    });
}

function getEmployeeInformation(){
	var listUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Employee Information')/items('"+globalItemId+"')?$select=*,ReportsTo/Title,AttachmentFiles&$expand=ReportsTo,AttachmentFiles";
	var itemResults = getSharePointListItems(listUrl);

	if(itemResults != null || itemResults != undefined){
		getName = itemResults.d.Title == null ? "" : itemResults.d.Title;
		getDesignation = itemResults.d.Designation == null ? "" : itemResults.d.Designation;
		getDepartment = itemResults.d.Team == null ? "" : itemResults.d.Team;
		getMobileNumber = itemResults.d.MobileNumber == null ? "" : itemResults.d.MobileNumber;
		getWorkEmail = itemResults.d.EmailId == null ? "" : itemResults.d.EmailId;
		getDOB = itemResults.d.DOB == null ? "" : convertDateSharePointFormat(itemResults.d.DOB);
		getDOJ = itemResults.d.DOJ == null ? "" : convertDateSharePointFormat(itemResults.d.DOJ);
		getLWD = itemResults.d.LWD == null ? "" : convertDateSharePointFormat(itemResults.d.LWD);
		getReportsTo = itemResults.d.ReportsToId == null ? "" : itemResults.d.ReportsTo.Title;
		getReportsToId = itemResults.d.ReportsToId == null ? "" : itemResults.d.ReportsToId;
		getPermanentAddress = itemResults.d.PermanentAddress == null ? "" : itemResults.d.PermanentAddress;
		getCurrentAddress = itemResults.d.CurrentAddress == null ? "" : itemResults.d.CurrentAddress;
		getGender = itemResults.d.Gender == null ? "" : itemResults.d.Gender;
		getMaritalStatus = itemResults.d.MaritalStatus == null ? "" : itemResults.d.MaritalStatus;
		getBloodGroup = itemResults.d.BloodGroup == "" ? "-": itemResults.d.BloodGroup;
		getPersonalEmail = itemResults.d.PersonalEmail == null ? "" : itemResults.d.PersonalEmail;
		getEmployeeNumber = itemResults.d.EmployeeNumber == null ? "" : itemResults.d.EmployeeNumber;
		getSkypeID = itemResults.d.SkypeID == null ? "" : itemResults.d.SkypeID;
		
		if(itemResults.d.DOB != null){	
			editDOB = new Date(itemResults.d.DOB);
			var bYear = editDOB.getFullYear();
			var bMonth = editDOB.getMonth()+1;
			bMonth = ((''+bMonth).length<2 ? '0' : '') + bMonth;
			var bDay = editDOB.getDate();
			bDay = ((''+bDay).length<2 ? '0' : '') + bDay;
			editDOB = bYear + '-' + bMonth + '-' + bDay;
		}

		if(itemResults.d.DOJ != null){
			editDOJ = new Date(itemResults.d.DOJ);
			var jYear = editDOJ.getFullYear();
			var jMonth = editDOJ.getMonth()+1;
			jMonth = ((''+jMonth).length<2 ? '0' : '') + jMonth;
			var jDay = editDOJ.getDate();
			jDay = ((''+jDay).length<2 ? '0' : '') + jDay;
			editDOJ = jYear + '-' + jMonth + '-' + jDay;
		}
		
		if(itemResults.d.LWD != null){
			editLWD = new Date(itemResults.d.LWD);
			var lYear = editLWD.getFullYear();
			var lMonth = editLWD.getMonth()+1;
			lMonth = ((''+lMonth).length<2 ? '0' : '') + lMonth;
			var jDay = editLWD.getDate();
			lDay = ((''+lDay).length<2 ? '0' : '') + lDay;
			editLWD= lYear + '-' + lMonth + '-' + lDay;
		}
		
		$('#headerName').text(getName);
		$('#headerEmail').text(getWorkEmail);
		$('#headerMobileNumber').text(getMobileNumber);
		
		$('#lblName').text(getName);
		$('#lblDesignation').text(getDesignation);
		$('#lblDepartment').text(getDepartment);
		$('#lblWorkEmail').text(getWorkEmail);
		$('#lblReportsTo').text(getReportsTo);
		$('#lblSkypeID').text(getSkypeID);

		if(is_HRTeam || _spPageContextInfo.userEmail == getWorkEmail || _spPageContextInfo.userId == itemResults.d.ReportsToId){
			$('.otherDetails').show();
			$('#lblMobileNumber').text(getMobileNumber);
			$('#lblDOB').text(getDOB);
			$('#lblDOJ').text(getDOJ);
			$('#lblLWD').text(getLWD);
			$('#lblCurrentAddress').text(getCurrentAddress);
			$('#lblPermanentAddress').text(getPermanentAddress);
			$('#lblGender').text(getGender);
			$('#lblMaritalStatus').text(getMaritalStatus);
			$('#lblBloodGroup').text(getBloodGroup);
			$('#lblPersonalEmail').text(getPersonalEmail);
			$('#lblEmployeeNumber').text(getEmployeeNumber);
		}
		
		if(itemResults.d.AttachmentFiles.results.length > 0){
			$('#imgProfile').attr("src",itemResults.d.AttachmentFiles.results[0].ServerRelativeUrl);
			tempImageSrc = $('#imgProfile').attr('src');
		}
		if(is_HRTeam){
			$('.editHRProfile').show();
			$('.documentsTab').show();	
			$('.EmployeeMobileNumber').css("visibility", "visible");			
		}
		else if(_spPageContextInfo.userEmail == getWorkEmail){
			$('.editProfile').show();
			$('.documentsTab').show();
		}
		else if(_spPageContextInfo.userEmail == "parimal@200oksolutions.com" || _spPageContextInfo.userEmail == "hitesh@200oksolutions.com" || _spPageContextInfo.userEmail == "jaydev@200oksolutions.com"){
	        $('.EmployeeMobileNumber').css("visibility", "visible");	
		}
		else{
			$('#btnChangePicture').remove();
		}		
	}
}

function convertDateSharePointFormat(dateToFormat){
	var d= new Date(dateToFormat);
	var month = d.getMonth() + 1;
	var day = d.getDate();
	var output = ((''+day).length<2 ? '0' : '') + day + '/' + ((''+month).length < 2 ? '0' : '') + month + '/' + d.getFullYear();
	return output;
}

function getSharePointListItems(listURL){
  var results= null;
  $.ajax({
    type: "GET",
    crossDomain: true,
    url: listURL,
    async: false,
    headers: {
      Accept: "application/json;odata=verbose"
    },
    success: function(data) {
      results = data;
    },
    error: function(data, errorThrown, status) {}
  });
  return results;
}


$(".editProfile").click(function(){
	$('#txtName').val(getName);
	$('#txtDesignation').val(getDesignation);
	$('#txtMobileNumber').val(getMobileNumber);
	$('#txtWorkEmail').val(getWorkEmail);
	$('#txtDOB').val(editDOB);
	$('#txtPermanentAddress').val(getPermanentAddress);
	$('#txtCurrentAddress').val(getCurrentAddress);
	$('#genderList').val(getGender);
	$('#maritalStatusList').val(getMaritalStatus);
	$('#txtBloodGroup').val(getBloodGroup);
	$('#txtPersonalEmail').val(getPersonalEmail);
	$('#txtEmployeeNumber').val(getEmployeeNumber);
});

var name, designation, department, mobileNumber, workEmail, dob, doj, lwd, reportsTo, permanentAddress, currentAddress, gender, maritalStatus, bloodGroup, personalEmail, employeeNumber = '';
var EmployeeData = [];

$("#btnSubmitEmployeeInformation").click(function(){
	if(_spPageContextInfo.userEmail == getWorkEmail){
		if(validateForm() == true){
			updateEmployeeInformation();
		}
	}else{
		swal("error","You are not authorized to edit other persons details","error");
	}
});

$("#btnHRSubmitEmployeeInformation").click(function(){
	if(is_HRTeam){
		if(validateHRForm() == true){
			updateEmployeeInformation();
		}
	}else{
		swal("error","You are not authorized to edit other persons details","error");
	}
});

function validateHRForm(){
	var isValidated = true;
	var msg = '';
	if($('#txtNameHR').val() == ''){
		msg += 'Name \n';
		isValidated	= false;
	}
	if($('#txtdesignationHR').val() == ''){
		msg += 'Designation \n';
		isValidated	= false;
	}
	if($('#departmentHR').val() == ''){
		msg += 'Department \n';
		isValidated	= false;
	}
	if($('#txtWorkEmailHR').val() == ""){
		msg += 'Work Email \n';
		isValidated	= false;
	}else{
		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		if(reg.test($('#txtWorkEmailHR').val()) == false){
			msg += 'Invalid Work Email \n';
			isValidated	= false;
		}
	}
	if($('#txtSkypeIDHR').val() == ''){
		msg += 'Skype ID \n';
		isValidated	= false;
	}
	if($('#ReportsToHR').val() == ''){
		msg += 'Reports To \n';
		isValidated	= false;
	}
	if($('#txtMobileNumberHR').val() == ""){
		msg += 'Mobile Number \n';
		isValidated	= false;
	}else{
		var pattern =/^\d{10}$/;
		if (pattern.test($('#txtMobileNumberHR').val()) == false) {
			msg += 'Invalid Mobile Number; Must be 10 digit \n';
			isValidated	= false;
		}
	}
	if($('#txtDOBHR').val() == ""){
		msg += 'Date of Birth \n';
		isValidated	= false;
	}else{
		var pattern =/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
		var d = $('#txtDOBHR').val().replace(/-/g, '/');
		split = d.split('/');
	    d = [split[1], split[2], split[0]].join('/');
		if(pattern.test(d) == false){
			msg += 'Invalid Date of Birth \n';
			isValidated	= false;
		}
	}
	if($('#txtDOJHR').val() == ""){
		msg += 'Date of Joining \n';
		isValidated	= false;
	}else{
		var pattern =/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
		var d = $('#txtDOJHR').val().replace(/-/g, '/');
		split = d.split('/');
	    d = [split[1], split[2], split[0]].join('/');
		if(pattern.test(d) == false){
			msg += 'Invalid Date of Joining \n';
			isValidated	= false;
		}
	}
	if($('#txtPermanentAddressHR').val() == ""){
		msg += 'Permanent Address \n';
		isValidated	= false;
	}
	if($('#txtCurrentAddressHR').val() == ""){
		msg += 'Current Address \n';
		isValidated	= false;
	}
	if($('#genderListHR').val() == ""){
		msg += 'Gender \n';
		isValidated	= false;
	}
	if($('#maritalStatusListHR').val() == ""){
		msg += 'Marital Status \n';
		isValidated	= false;
	}
	if($('#txtBloodGroupHR').val() == ""){
		msg += 'Blood Group \n';
		isValidated	= false;
	}
	if($('#txtPersonalEmailHR').val() == ""){
		msg += 'Personal Email \n';
		isValidated	= false;
	}else{
		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		if(reg.test($('#txtPersonalEmailHR').val()) == false){
			msg += 'Invalid Personal Email \n';
			isValidated	= false;
		}
	}
	if($('#txtEmployeeNumberHR').val() == ""){
		msg += 'Employee Number \n';
		isValidated	= false;
	}
	if(!isValidated){
		swal("Required",msg,"error");
	}
	return isValidated;
}

function validateForm(){
	var msg = '';
	var isValidated = true;
	if($('#txtName').val() == ''){
		msg += 'Name \n';
		isValidated	= false;
	}
	if($('#txtMobileNumber').val() == ""){
		msg += 'Mobile Number \n';
		isValidated	= false;
	}else{
		var pattern =/^\d{10}$/;
		if (pattern.test($('#txtMobileNumber').val()) == false) {
			msg += 'Invalid Mobile Number; Must be 10 digit \n';
			isValidated	= false;
		}
	}
	if($('#txtDOB').val() == ""){
		msg += 'Date of Birth \n';
		isValidated	= false;
	}else{
		var pattern =/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
		var d = $('#txtDOB').val().replace(/-/g, '/');
		split = d.split('/');
	    d = [split[1], split[2], split[0]].join('/');
		if(pattern.test(d) == false){
			msg += 'Invalid Date of Birth \n';
			isValidated	= false;
		}
	}
	if($('#txtPermanentAddress').val() == ""){
		msg += 'Permanent Address \n';
		isValidated	= false;
	}
	if($('#txtCurrentAddress').val() == ""){
		msg += 'Current Address \n';
		isValidated	= false;
	}
	if($('#genderList').val() == ""){
		msg += 'Gender \n';
		isValidated	= false;
	}
	if($('#maritalStatusList').val() == ""){
		msg += 'Marital Status \n';
		isValidated	= false;
	}
	if($('#txtBloodGroup').val() == ""){
		msg += 'Blood Group \n';
		isValidated	= false;
	}
	if($('#txtPersonalEmail').val() == ""){
		msg += 'Personal Email \n';
		isValidated	= false;
	}else{
		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		if(reg.test($('#txtPersonalEmail').val()) == false){
			msg += 'Invalid Personal Email \n';
			isValidated	= false;
		}
	}
	if(!isValidated){
		swal("Required",msg,"error");
	}
	return isValidated;
}

function updateEmployeeInformation(){
	if(is_HRTeam){
		EmployeeData = { 
			__metadata: { 
			'type': 'SP.Data.EmployeeInformationListItem' 
			},
			Title : $('#txtNameHR').val() == "" ? null : $('#txtNameHR').val(),
			Designation : $('#txtdesignationHR').val() == "" ? null : $('#txtdesignationHR').val(),
			Team : $('#departmentHR').val() == "" ? null : $('#departmentHR').val(),
			EmailId : $('#txtWorkEmailHR').val() == "" ? null : $('#txtWorkEmailHR').val(),
			SkypeID : $('#txtSkypeIDHR').val() == "" ? null : $('#txtSkypeIDHR').val(),
			ReportsToId : $('#ReportsToHR').val() == "" ? null : parseInt($('#ReportsToHR').val()),
			MobileNumber : $('#txtMobileNumberHR').val() == "" ? null : $('#txtMobileNumberHR').val(),
			DOB : $('#txtDOBHR').val() == "" ? null : convertDate($('#txtDOBHR').val()),
			DOJ : $('#txtDOJHR').val() == "" ? null : convertDate($('#txtDOJHR').val()),
			LWD : $('#txtLWDHR').val() == "" ? null : convertDate($('#txtLWDHR').val()),
			PermanentAddress : $('#txtPermanentAddressHR').val() == "" ? null : $('#txtPermanentAddressHR').val(),
			CurrentAddress : $('#txtCurrentAddressHR').val() == "" ? null : $('#txtCurrentAddressHR').val(),
			Gender : $('#genderListHR').val() == "" ? null : $('#genderListHR').val(),
			MaritalStatus : $('#maritalStatusListHR').val() == "" ? null : $('#maritalStatusListHR').val(),
			BloodGroup : $('#txtBloodGroupHR').val() == "-" ? "-" : $('#txtBloodGroupHR').val(),
			PersonalEmail : $('#txtPersonalEmailHR').val() == "" ? null : $('#txtPersonalEmailHR').val(),
			EmployeeNumber : $('#txtEmployeeNumberHR').val() == "" ? null : $('#txtEmployeeNumberHR').val()
		};
	}else{
		EmployeeData = { 
		  __metadata: { 
		  'type': 'SP.Data.EmployeeInformationListItem' 
		  },
		  Title : $('#txtName').val() == "" ? null : $('#txtName').val(),
		  MobileNumber : $('#txtMobileNumber').val() == "" ? null : $('#txtMobileNumber').val(),
		  DOB : $('#txtDOB').val() == "" ? null : convertDate($('#txtDOB').val()),
		  PermanentAddress : $('#txtPermanentAddress').val() == "" ? null : $('#txtPermanentAddress').val(),
		  CurrentAddress : $('#txtCurrentAddress').val() == "" ? null : $('#txtCurrentAddress').val(),
		  Gender : $('#genderList').val() == "" ? null : $('#genderList').val(),
		  MaritalStatus : $('#maritalStatusList').val() == "" ? null : $('#maritalStatusList').val(),
		  BloodGroup : $('#txtBloodGroup').val('-') == "" ? "-" : $('#txtBloodGroup').val(),
		  PersonalEmail : $('#txtPersonalEmail').val() == "" ? null : $('#txtPersonalEmail').val()
		};
	}

	var employeeListURL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Employee Information')/items('"+globalItemId+"')";
	$.ajax({  
		url: employeeListURL,  
		type: "POST",  
		async:false,
		headers: {  
			"accept": "application/json;odata=verbose",  
			"X-RequestDigest": $("#__REQUESTDIGEST").val(),  
			"content-Type": "application/json;odata=verbose",  
			"IF-MATCH": "*",  
			"X-HTTP-Method": "MERGE",
		},  
		data: JSON.stringify(EmployeeData),   
		success: function(data) { 
			$.magnificPopup.close();
			swal({
                title: "Success",
                text: "Details are successfully updated.",
                type: "success"
            }, function() {
				getEmployeeInformation();
				clearPopUp();
            });
		},  
		error: function(error) {  
			console.log("Error",error);
		}  
	});

}

function convertDate(dateObject){
	var d = dateObject.replace(/-/g, '/');
	split = d.split('/');
	return [split[1], split[2], split[0]].join('/');
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
                    for(i=0;i<data.d.results.length;i++){
                        if(data.d.results[i].Title == 'HR Team'){
							is_HRTeam = true;
							getReportsToData();
                        }
                    }
                }                     
                deferred.resolve();            
        },    
    });
    return deferred.promise();
}

function getReportsToData(){
	$.ajax({
		url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Employee Information')/items?$top=5000",
		type: "GET",
		async:false,
		headers: { "ACCEPT": "application/json;odata=verbose" },
		success: function (data) {
			if(data.d.results.length >0){
				var optionGroup = "<option value=''>Select Reports To</option>";
				for(j=0;j<data.d.results.length;j++){
					optionGroup += '<option value="'+data.d.results[j].Id+'">'+data.d.results[j].Title+'</option>';
					if(j == data.d.results.length - 1){
						$('#ReportsToHR').append(optionGroup);
					}
				}
			}                             
		},    
	});
}

function clearHRPopUp(){
	$('#txtNameHR').val('');
	$('#txtdesignationHR').val('');
	$('#departmentHR').val('');
	$('#txtWorkEmailHR').val('');
	$('#txtSkypeIDHR').val('');
	$('#txtMobileNumberHR').val('');
	$('#txtDOBHR').val('');
	$('#txtDOJHR').val('');
	$('#txtLWDHR').val('');
	$('#txtCurrentAddressHR').val('');
	$('#txtPermanentAddressHR').val('');
	$('#genderListHR').val('');
	$('#maritalStatusListHR').val('');
	$('#txtBloodGroupHR').val('');
	$('#txtPersonalEmailHR').val('');
	$('#txtEmployeeNumberHR').val('');

}

function uploadFile(inputID,serverRelativeUrlToFolder) {
	var docType = '';
	if(inputID == 'uploadedPanCard'){
		docType = 'Pan Card';
	}
	else if(inputID == 'uploadedPassport'){
		docType = 'Passport';
	}
	else if(inputID == 'uploadedAadhaarCard'){
		docType = 'Aadhaar Card';
	}
	else if(inputID == 'uploadedVoterId'){
		docType = 'Voter Id';
	}
	else if(inputID == 'uploadedDriverLicense'){
		docType = 'Driving License';
	}

	// Get test values from the file input and text input page controls.
	var fileInput = $('#'+inputID);
	var newName = fileInput[0].files[0].name;

	// Get the server URL.
	var serverUrl = _spPageContextInfo.webAbsoluteUrl;

	// Initiate method calls using $ promises.
	// Get the local file as an array buffer.
	var getFile = getFileBuffer();
	getFile.done(function (arrayBuffer) {

		// Add the file to the SharePoint folder.
		var addFile = addFileToFolder(arrayBuffer);
		addFile.done(function (file, status, xhr) {

			// Get the list item that corresponds to the uploaded file.
			var getItem = getListItem(file.d.ListItemAllFields.__deferred.uri);
			getItem.done(function (listItem, status, xhr) {

				// Change the display name and title of the list item.
				var changeItem = updateListItem(listItem.d.__metadata);
				changeItem.done(function (data, status, xhr) {
					console.log('file uploaded and updated');
					if(inputID == 'uploadedPanCard'){
						var PanCardDetails = getSharePointListItems( _spPageContextInfo.webAbsoluteUrl+"/_api/web/GetFolderByServerRelativeUrl('/sites/Intranet/EmployeeDocuments/"+getName+"/Identity%20Docs/Pan Card')/Files");
						if(PanCardDetails.d.results.length > 0){
							displayDocuments(PanCardDetails.d.results,'PanCardList');
						}
					}
					else if(inputID == 'uploadedPassport'){
						var PassportDetails = getSharePointListItems( _spPageContextInfo.webAbsoluteUrl+"/_api/web/GetFolderByServerRelativeUrl('/sites/Intranet/EmployeeDocuments/"+getName+"/Identity%20Docs/Passport')/Files");
						if(PassportDetails.d.results.length > 0){
							displayDocuments(PassportDetails.d.results,'PassportList');
						}
					}
					else if(inputID == 'uploadedAadhaarCard'){
						var AadhaarDetails = getSharePointListItems( _spPageContextInfo.webAbsoluteUrl+"/_api/web/GetFolderByServerRelativeUrl('/sites/Intranet/EmployeeDocuments/"+getName+"/Identity%20Docs/Aadhaar')/Files");
						if(AadhaarDetails.d.results.length > 0){
							displayDocuments(AadhaarDetails.d.results,'AadharList');
						}
					}
					else if(inputID == 'uploadedVoterId'){
						var VoterIdDetails = getSharePointListItems( _spPageContextInfo.webAbsoluteUrl+"/_api/web/GetFolderByServerRelativeUrl('/sites/Intranet/EmployeeDocuments/"+getName+"/Identity%20Docs/Voter Id')/Files");
						if(VoterIdDetails.d.results.length > 0){
							displayDocuments(VoterIdDetails.d.results,'VoterIdList');
						}
					}
					else if(inputID == 'uploadedDriverLicense'){
						var DrivingLicenseDetails = getSharePointListItems( _spPageContextInfo.webAbsoluteUrl+"/_api/web/GetFolderByServerRelativeUrl('/sites/Intranet/EmployeeDocuments/"+getName+"/Identity%20Docs/Drivers License')/Files");
						if(DrivingLicenseDetails.d.results.length > 0){
							displayDocuments(DrivingLicenseDetails.d.results,'DrivingLicenseList');
						}
					}
					ClearFileControls(inputID);
					alert('Document has been successfully uploaded and sent for verification to HR Team');
				});
				changeItem.fail(onError);
			});
			getItem.fail(onError);
		});
		addFile.fail(onError);
	});
	getFile.fail(onError);

	// Get the local file as an array buffer.
	function getFileBuffer() {
		var deferred = $.Deferred();
		var reader = new FileReader();
		reader.onloadend = function (e) {
			deferred.resolve(e.target.result);
		}
		reader.onerror = function (e) {
			deferred.reject(e.target.error);
		}
		reader.readAsArrayBuffer(fileInput[0].files[0]);
		return deferred.promise();
	}

	// Add the file to the file collection in the Shared Documents folder.
	function addFileToFolder(arrayBuffer) {

		// Get the file name from the file input control on the page.
		var parts = fileInput[0].value.split('\\');
		var fileName = parts[parts.length - 1];

		// Construct the endpoint.
		var fileCollectionEndpoint = String.format(
				"{0}/_api/web/getfolderbyserverrelativeurl('{1}')/files" +
				"/add(overwrite=true, url='{2}')",
				serverUrl, serverRelativeUrlToFolder, fileName);

		// Send the request and return the response.
		// This call returns the SharePoint file.
		return $.ajax({
			url: fileCollectionEndpoint,
			type: "POST",
			data: arrayBuffer,
			processData: false,
			headers: {
				"accept": "application/json;odata=verbose",
				"X-RequestDigest": $("#__REQUESTDIGEST").val(),
				"content-length": arrayBuffer.byteLength
			}
		});
	}

	// Get the list item that corresponds to the file by calling the file's ListItemAllFields property.
	function getListItem(fileListItemUri) {

		// Send the request and return the response.
		return $.ajax({
			url: fileListItemUri,
			type: "GET",
			headers: { "accept": "application/json;odata=verbose" }
		});
	}

	// Change the display name and title of the list item.
	function updateListItem(itemMetadata) {

		// Define the list item changes. Use the FileLeafRef property to change the display name.
		// For simplicity, also use the name as the title.
		// The example gets the list item type from the item's metadata, but you can also get it from the
		// ListItemEntityTypeFullName property of the list.
		var body = String.format("{{'__metadata':{{'type':'{0}'}},'FileLeafRef':'{1}','Title':'{2}','DocType':'{3}','EmployeeName':'{4}','EmployeeId':'{5}'}}",
			itemMetadata.type, newName, newName, docType, getName, globalItemId);

		// Send the request and return the promise.
		// This call does not return response content from the server.
		return $.ajax({
			url: itemMetadata.uri,
			type: "POST",
			data: body,
			headers: {
				"X-RequestDigest": $("#__REQUESTDIGEST").val(),
				"content-type": "application/json;odata=verbose",
				"content-length": body.length,
				"IF-MATCH": itemMetadata.etag,
				"X-HTTP-Method": "MERGE"
			}
		});
	}
}

// Display error messages.
function onError(error) {
	alert(error.responseText);
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
    // TODO: copy any other relevant attributes

    oldInput.parentNode.replaceChild(newInput, oldInput);
}

function DeleteDocumentConfirmation(control, url) {
    var retVal = confirm("Are you sure want to delete permanently?");
    if (retVal == true) {
        deleteDocument(control, url);
        return true;
    }
}

function deleteDocument(control, url) {
    $.ajax({
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

function deleteProfilePicture(control, url) {
    $.ajax({
		url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/GetFileByServerRelativeUrl('" + url + "')",
		method: "POST",
		headers: {
			Accept: "application/json;odata=verbose",
			"X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
			"X-HTTP-Method": "DELETE"

		},
		success: function (data) {
			$('#'+control).attr('src', '');
			$('#btnChangePicture').removeClass('changing');
			$('#btnChangePicture').attr('value', 'Change');
			uploadFiles($('#profilePicture')[0].files[0], 'Employee Information', globalItemId);
		},
		error: function (data) {
			alert('Error while deleting the Document');
		}
	});
}
function getAttachments(){
	var listUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Employee Information')/items('"+globalItemId+"')?$select=*,ReportsTo/Title,AttachmentFiles&$expand=ReportsTo,AttachmentFiles";
	var itemResults = getSharePointListItems(listUrl);
	if(itemResults.d.AttachmentFiles != null){
		$('#imgProfile').attr("src",itemResults.d.AttachmentFiles.results[0].ServerRelativeUrl);
		tempImageSrc = $('#imgProfile').attr('src');
	}
}