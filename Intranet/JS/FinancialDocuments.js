var financialDocumentsListName = 'Financial Documents';
var HTMLFinancialDocumentsDivID = 'FinancialDocumentsDiv';

$(document).ready(function(){
    getFinancialDocuments();
});

function getFinancialDocuments(){
    var financialDocumentsURL = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getByTitle('"+financialDocumentsListName+"')/items?select=*,File&$expand=File&$filter=AssignedToId eq "+_spPageContextInfo.userId+"&$orderBy=Modified desc&$top=5000";
    getItems(financialDocumentsURL,function(data){
        var financialDocumentsResults = data.d.results;
        if(financialDocumentsResults.length > 0){
            for(n=0;n<financialDocumentsResults.length;n++){
                if(financialDocumentsResults[n].FileSystemObjectType == 0){
                    var FileName = financialDocumentsResults[n].File.Name;
                    var FileURL =  "https://200oksolutions.sharepoint.com"+ financialDocumentsResults[n].File.ServerRelativeUrl + "?web=1";
                    var FileType = FileName.substr(FileName.indexOf(".") + 1);
                    var className = '';
                    if (FileType == 'docx') {
                        className = 'fa-file-word-o';
                    } else if (FileType == 'pdf') {
                        className = 'fa-file-pdf-o';
                    } else if (FileType == 'xlsx' || FileType == 'xls') {
                        className = 'fa-file-excel-o';
                    }
                    var ModifiedDate = convertDateForDocuments(financialDocumentsResults[n].Modified);
                    $('#'+HTMLFinancialDocumentsDivID).last().append('<a href="'+FileURL+'" target="_blank"><li>'+
                                    '<h4><i class="fa '+className+'"></i></h4>'+
                                    '<div class="ds-lists-detail docDetails">'+
                                        '<h3>'+FileName+'</h3>'+
                                        '<p>'+ModifiedDate+'</p>'+
                                    '</div>'+
                                    '</li></a>');
                }
            }  
        }else{
            $('#'+HTMLFinancialDocumentsDivID).append('<div><p class="text-center no-records">There are no files to show as of now.</p></div>')
        }
    },function(data){})
}