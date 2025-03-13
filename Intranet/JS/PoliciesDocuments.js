var PoliciesListName = 'Policies';
var HTMLPoliciesDivID = 'PoliciesDiv';

$(document).ready(function(){
    getPoliciesDocuments();
});

function getPoliciesDocuments(){
    var policiesDocumentsURL = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getByTitle('"+PoliciesListName+"')/items?select=*,File&$expand=File&$orderBy=Modified desc&$top=5000";
    getItems(policiesDocumentsURL,function(data){
        var policyDocumentsResults = data.d.results;
        if(policyDocumentsResults.length > 0){
            for(p=0;p<policyDocumentsResults.length;p++){
                if(policyDocumentsResults[p].FileSystemObjectType == 0){
                    var FileName = policyDocumentsResults[p].File.Name;
                    var FileURL =  "https://200oksolutions.sharepoint.com" + policyDocumentsResults[p].File.ServerRelativeUrl + "?web=1";
                    var FileType = FileName.substr(FileName.indexOf(".") + 1);
                    var className = '';
                    if (FileType == 'docx') {
                        className = 'fa-file-word-o';
                    } else if (FileType == 'pdf') {
                        className = 'fa-file-pdf-o';
                    } else if (FileType == 'xlsx' || FileType == 'xls') {
                        className = 'fa-file-excel-o';
                    }
                    var ModifiedDate = convertDateForDocuments(policyDocumentsResults[p].Modified);
                    $('#'+HTMLPoliciesDivID).last().append('<a href="'+FileURL+'" target="_blank"><li>'+
                                    '<h4><i class="fa '+className+'"></i></h4>'+
                                    '<div class="ds-lists-detail docDetails">'+
                                        '<h3>'+FileName+'</h3>'+
                                        '<p>'+ModifiedDate+'</p>'+
                                    '</div>'+
                                    '</li></a>');
                }
            }  
        }else{
            $('#'+HTMLPoliciesDivID).append('<div><p class="text-center no-records">There are no files to show as of now.</p></div>')
        }
    },function(data){})
}