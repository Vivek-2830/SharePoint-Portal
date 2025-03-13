const lstEmployeeLeaveHistory =  "Employee%20Leave%20History";
const lstEmployeeInformation = "Employee%20Information";
const webAbsoluteUrl = _spPageContextInfo.webAbsoluteUrl;

$(document).ready(() => {
	getEmployeesOnLeave();
});

function getEmployeesOnLeave() {
    $.ajax({
        url: webAbsoluteUrl + `/_api/web/lists/getbyTitle('${lstEmployeeLeaveHistory}')/items?$select=*,EmpName/Title,AttachmentFiles/AttachmentFiles&$expand=EmpName,AttachmentFiles&$filter=(isRejected eq 0) and (isCancelled eq 0) and (((StartDate ge datetime'${new Date(new Date().toLocaleDateString('en-US')).toISOString()}') and (EndDate le datetime'${new Date(new Date().toLocaleDateString('en-US')).toISOString()}')) or ((StartDate le datetime'${new Date(new Date().toLocaleDateString('en-US')).toISOString()}') and (EndDate ge datetime'${new Date(new Date().toLocaleDateString('en-US')).toISOString()}')) or ((StartDate le datetime'${new Date(new Date().toLocaleDateString('en-US')).toISOString()}') and (EndDate gt datetime'${new Date(new Date().toLocaleDateString('en-US')).toISOString()}')))&$orderby=StartDate desc`,
        type: "GET",
        async: false,
        headers: {
            "accept": "application/json;odata=verbose"
        },
        success: (data) => {
            let FileUrl = "";
            const items = data.d.results;
            let htmlForDate = "";
            let htmlForDuration = "";
            if (items.length > 0) {
                const getDataWithHTML = async () => {
                    for (let i = 0; i < items.length; i++) {
                        FileUrl = await getImageOfUser(items[i].EmpNameId).then((filePath) => {
                            let employeeName = items[i].EmpName.Title;
                            let duration = items[i].Duration;
                            let startDateInterval = items[i].StartDateInterval;
                            let endDateInterval = items[i].EndDateInterval;
                            let startDate = new Date(items[i].StartDate).format('dd/MM/yyyy');
                            let endDate = new Date(items[i].EndDate).format('dd/MM/yyyy');

                            if(duration && duration.trim() != "") {
                                if (duration.trim().toLowerCase() == "full day") {
                                    htmlForDuration = "<p>Full Day</p>";
                                    htmlForDate = "<p>" + startDate + "</p>";
                                }
                                else if (duration.trim().toLowerCase() == "first half") {
                                    htmlForDuration = "<p>First Half</p>";
                                    htmlForDate = "<p>" + startDate + "</p>";
                                }
                                else if (duration.trim().toLowerCase() == "second half") {
                                    htmlForDuration = "<p>Second Half</p>";
                                    htmlForDate = "<p>" + startDate + "</p>";
                                }
                            }
                            else {
                                htmlForDuration = "";
                                if (startDateInterval && startDateInterval.trim() != "") {
                                    if (startDateInterval.trim().toLowerCase() == "first half") {
                                        htmlForDate = "<p>" + startDate + "  (FH)";
                                        if (endDateInterval.trim().toLowerCase() == "first half") {
                                            htmlForDate += " - " + endDate + "  (FH)";
                                        }
                                        else {
                                            htmlForDate += " - " + endDate + "  (SH)";
                                        }
                                    }
                                    else {
                                        htmlForDate = "<p>" + startDate + "  (SH)";
                                        if (endDateInterval.trim().toLowerCase() == "first half") {
                                            htmlForDate += " - " + endDate + "  (FH)";
                                        }
                                        else {
                                            htmlForDate += " - " + endDate + "  (SH)";
                                        }

                                    }

                                }
                            }
                            let record = `<li>
                                            <img src=${filePath} data-themekey='#'>
                                            <div class='ds-widget-inner'>
                                                <h3>${employeeName}</h3>
                                                ${htmlForDate}
                                                ${htmlForDuration}
                                            </div>
                                        </li>`;

                            $("#employeesOnLeave").append(record);
                        });
                    }
                }
                getDataWithHTML();
            }
            else {
                const emptyRecord = "<li><p class='text-center no-records pEmptyRecord'>No employee is on leave today...</p></li>";
                $("#employeesOnLeave").append(emptyRecord);
            }
        },
        error: () => {
            console.log(error);
        }
    })
}

async function getImageOfUser(employeeID) {
    let FileURL = "";
    $.ajax({
        url: webAbsoluteUrl + `/_api/web/lists/getbyTitle('${lstEmployeeInformation}')/items?$select=AttachmentFiles,Title,ID&$expand=AttachmentFiles&$filter=ID eq ${employeeID}`,
        type: "GET",
        async: false,
        headers: {
            "accept": "application/json ; odata=verbose"
        },
        success: (data) => {
            if (data && data.d.results.length > 0 && data.d.results[0].AttachmentFiles.results.length > 0) {
                FileURL = encodeURI(data.d.results[0].AttachmentFiles.results[0].ServerRelativeUrl.trim());
            }
            else {
                FileURL = webAbsoluteUrl + "/Style%20Library/Intranet/Images/Person.png";
            }
        },
        error: () => {
            console.log(error);
        }
    });
    return FileURL;
}



