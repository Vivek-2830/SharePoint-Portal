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
function convertDateForDocuments(dateToFormat){
    var d= new Date(dateToFormat);
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = ((''+day).length<2 ? '0' : '') + day+ '-' + ((''+month).length < 2 ? '0' : '') + month + '-' + d.getFullYear();
    return output;
}



var offsetTime = '';
var offsetTimeStart = '';
var offsetTimeEnd = '';
var positive = '';
var negative = '';
var BiasResult = '';
function getSharePointSiteTimeZone(startTimeBody){
 var results= null;
 $.ajax({
   type: "GET",
   url: _spPageContextInfo.webAbsoluteUrl + '/_api/Web/RegionalSettings/TimeZone',
   async: false,
   headers: {
     Accept: "application/json;odata=verbose"
   },
   success: function(data) {
     BiasResult = data.d.Information.Bias;
     if(BiasResult > 0)
     {
       positive = (BiasResult/60).toString();
       if(positive.indexOf('+') == -1){
         positive = '-'+positive;
       }
       offsetTimeStart = convertDateToLocalFormat(positive, startTimeBody);
     }
     else
     {
       negative = (BiasResult/60).toString();
       negative = negative.replace('-','+');
       offsetTimeStart = convertDateToLocalFormat(negative, startTimeBody);
     }
     //results = JSON.stringify(data); 
     results = offsetTimeStart;
   },
   error: function(data, errorThrown, status) {}
 });
 return results;
}



function convertDateToLocalFormat(timeZone, endDateToConvert){
 var date = endDateToConvert;
 var targetTime = new Date(date);
 var timeZoneFromDB = timeZone; //time zone value from database
 //get the timezone offset from local time in minutes
 var tzDifference = timeZoneFromDB * 60 + targetTime.getTimezoneOffset();
 //convert the offset to milliseconds, add to targetTime, and make a new Date
 offsetTime = new Date(targetTime.getTime() + tzDifference * 60 * 1000);
 return offsetTime;
}